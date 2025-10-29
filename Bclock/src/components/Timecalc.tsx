import  { useState, useEffect } from 'react'

interface Countdown {
    num: number;
}

interface TimeLeft {
    s:number;
    m:number;
    h:number;
    d:number;
}

const Timecalc : React.FC<Countdown> = ({num})=>{
    const [timeLeft, setTimeLeft] = useState<TimeLeft>({
    d: 0,
    h: 0,
    m: 0,
    s: 0,
  });

  useEffect(()=>{
    const interval = window.setInterval(()=>{
        const now=new Date().getTime();
        const distance = num-now;

        if(distance<0) {
            window.clearInterval(interval);
            setTimeLeft({ d: 0, h: 0, m: 0, s: 0 });
            return;
        }
        
        const d = Math.floor(distance / (1000 * 60 * 60 * 24));
        const h = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((distance % (1000 * 60)) / 1000);

        setTimeLeft({ d, h, m, s });
    },1000)

    return ()=> window.clearInterval(interval);
  },[num])

  return (
    <div className='overflow-hidden bg-gray-400 h-50 w-100% font-bold text-gray-50 text-7xl flex items-center justify-center'>
        {timeLeft.d.toString().padStart(2, "0")}:{timeLeft.h.toString().padStart(2, "0")}:{timeLeft.m.toString().padStart(2, "0")}:{timeLeft.s.toString().padStart(2, "0")}
    </div>
  )
} 


export default Timecalc