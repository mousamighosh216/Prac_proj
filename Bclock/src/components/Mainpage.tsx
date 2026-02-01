import React, { useState, useRef } from 'react';
import Timecalc from './Timecalc.tsx'

const Mainpage = () => {
    const initialDuration = 1 * 1000; 
    const initialDurationRef = useRef<number>(initialDuration);


    const [target, setTarget] = useState<number>(() => Date.now() + initialDurationRef.current);
    const [show, setshow] = useState(false);
    const [title, settitle] = useState('');
    const [targetInput, setTargetInput] = useState(''); 

    const onSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (targetInput) {
            const parsed = new Date(targetInput).getTime();
            if (!isNaN(parsed)) {
                setTarget(parsed);
                initialDurationRef.current = parsed - Date.now();
            }
        }
    }

    const handleRestart = () => {
        setTarget(Date.now() + Math.max(0, initialDurationRef.current));
    }

    const handleReset = () => {
        setTarget(Date.now());
        setTargetInput('');
        settitle('');
    }

    return (
    <div className='flex flex-col items-center justify-center h-200 w-100% bg-black overflow-hidden'>
        <h1 className='text-amber-50 uppercase font-bold flex flex-col items-center justify-center'>bclock <br /> <span className='lowercase text-gray-50'>~a clock which doesnt makes any sense</span></h1>
        <div className='rounded-3xl bg-gray-200 h-100 w-200 p-10 flex flex-col gap-5'> 
            <div className='bg-gray-300 p-2 h-15 w-100% font-bold uppercase flex rounded-2xl items-center flex-col'>  
                {title}
            </div>
            <div className='relative'>
                
                <Timecalc num={target}/>

                <button 
                onClick={() => setshow(!show)}
                type="button">Edit</button>

                <button onClick={handleRestart} type="button">Restart</button>
                <button onClick={handleReset} type="button">Reset</button>

                {show && (
                    <div className='flex flex-col justify-between top-4 p-5 absolute bg-gray-700 h-100 w-100 rounded-2xl'>
                        <div className='cursor-pointer top-0 left-0 text-white'
                        onClick={()=> {
                            setshow(false);
                            settitle('');
                            }}>x</div>

                        <div className='w-100% flex flex-col'>
                            <h3 className='text-white font-bold mt-5'>Enter Title:</h3>
                            <input 
                            type="text" 
                            value={title}
                            onChange={(e)=>{
                                settitle(e.target.value);
                            }}
                            className='rounded-2xl mt-2 w-100%  bg-gray-50 p-3'/>
                        </div>
                        <div className='w-100% flex flex-col'>
                            <h3 className='text-white font-bold mt-5'>Enter Target:</h3>
                            <input 
                            type="datetime-local" 
                            value={targetInput}
                            onChange={(e)=> setTargetInput(e.target.value)}
                            className='rounded-2xl mt-2 w-100%  bg-gray-50 p-3'/>
                        </div>
                        <div className='flex items-center justify-between flex-col'>
                            <button className='w-fit' 
                            onClick={(e=>{
                                onSubmit(e);
                                setshow(false);
                            })}>
                            Save
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    </div>
  );
}

export default Mainpage;