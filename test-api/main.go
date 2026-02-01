package main

import (
	"encoding/json"
	"errors"
	"fmt"
	"net/http"
	"os"
	"sync"

	"github.com/gin-gonic/gin"
)

var products []Prod
var mutex sync.Mutex // Prevents multiple requests from writing to the file at the same time

type Prod struct {
	Id      string `json:"id"`
	Product string `json:"product"`
	Company string `json:"company"`
	Qty     int    `json:"qty"`
}

func getProdById(id string) (*Prod, error) {
	for i, p := range products {
		if p.Id == id {
			return &products[i], nil
		}
	}

	return nil, errors.New("product not found")
}

func readFile(s string) {
	// Parse the JSON bytes into the 'products' slice
	bytes, err := os.ReadFile(s)
	if err != nil {
		fmt.Println(err)
		return
	}
	err = json.Unmarshal(bytes, &products)

	if err != nil {
		fmt.Println("Error:", err)
		return
	}
}

func SaveToFile() error {
	data, err := json.MarshalIndent(products, "", "	")
	if err != nil {
		return err
	}

	return os.WriteFile("product.json", data, 0644)
}

// method -> GET - to get all prods
func getProd(c *gin.Context) {
	c.IndentedJSON(http.StatusOK, products)
}

// method -> GET by id
func ProdbyId(c *gin.Context) {
	id := c.Param("id")
	prod, err := getProdById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "Not found"})
		return
	}
	c.IndentedJSON(http.StatusOK, prod)
}

// method -> POST - create a new prod
func createProd(c *gin.Context) {
	var newProd Prod

	if err := c.BindJSON(&newProd); err != nil {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "Invalid request"})
		return
	}

	products = append(products, newProd)
	c.IndentedJSON(http.StatusCreated, newProd)

	SaveToFile()
}

// method -> PATCH - buy a product
func buyProd(c *gin.Context) {
	// GetQuery retrieves the query string parameter "id" from the HTTP request URL.
	// It returns the parameter value and a boolean indicating whether the parameter exists.
	// GetQuery is used instead of GetParam because GetParam retrieves path parameters (from the URL route path),
	// while GetQuery retrieves query string parameters (from the URL query string like ?id=123).
	id, ok := c.GetQuery("id")

	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "product not available"})
		return
	}

	prod, err := getProdById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "not found"})
		return
	}

	if prod.Qty <= 0 {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "product not available"})
		return
	}

	prod.Qty -= 1
	c.IndentedJSON(http.StatusOK, prod)

	SaveToFile()
}

// method PATCH - returun defect product
func returnProd(c *gin.Context) {
	id, ok := c.GetQuery("id")

	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "missing id query param"})
		return
	}

	prod, err := getProdById(id)

	if err != nil {
		c.IndentedJSON(http.StatusNotFound, gin.H{"message": "not found"})
		return
	}

	prod.Qty += 1
	c.IndentedJSON(http.StatusOK, prod)

	SaveToFile()

}

// method -> DELETE
func deleteProd(c *gin.Context) {
	id, ok := c.GetQuery("id")
	if !ok {
		c.IndentedJSON(http.StatusBadRequest, gin.H{"message": "missing id query param"})
		return
	}

	for i, p := range products {
		if p.Id == id {
			// remove the book from slice
			products = append(products[:i], products[i+1:]...)
			c.IndentedJSON(http.StatusOK, gin.H{"message": "Prod deleted successfully"})
			return
		}
	}

	c.IndentedJSON(http.StatusNotFound, gin.H{"message": "prod not found"})
}

func main() {
	readFile("product.json")

	router := gin.Default()

	router.GET("/api/products", getProd)
	router.GET("/api/products/:id", ProdbyId)
	router.POST("/api/addprods", createProd)
	router.PATCH("/api/buyprod", buyProd)
	router.PATCH("/api/returnprod", returnProd)
	router.DELETE("/api/deleteprod", deleteProd)

	router.Run("localhost:8080")
}
