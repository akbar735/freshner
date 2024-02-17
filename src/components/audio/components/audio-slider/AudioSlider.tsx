import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import './AudioSlider.css';
interface IAudioSlider{
    totalDuration: number|null;
    currentTime: number|null;
}

function getOptimizedEndpoint(rormattedTime: string){
    let [hr, min, sec] = rormattedTime.split(':').map(str => str.trim())
    hr = (hr === '00') ? '': hr+':'
    min = (min === '00') ? '': min+':'
    return hr+min+sec
}

export default function AudioSlider(props: IAudioSlider){
    const pbRef = useRef(null)
    const [pbWidth, setPbWidth] = useState(0)
    const [onePixelRateInSec, setOnePixelRateInSec] = useState(0);
    const [cpbWidth, setCpbWidth] = useState(0);


    useEffect(() => {
        if(props.totalDuration && pbWidth){
            setOnePixelRateInSec(pbWidth / props.totalDuration);
        }
    },[pbWidth, props.totalDuration, setOnePixelRateInSec])

    useEffect(() => {
        if(props.currentTime) {
            if(props.currentTime !== props.totalDuration){
                if(props.currentTime < 0 ) setCpbWidth(0);
                setCpbWidth(onePixelRateInSec * props.currentTime);
            }else{
                setCpbWidth(0);
            }
            
        }else{
            setCpbWidth(0);
        }
    }, [props.currentTime, props.totalDuration, onePixelRateInSec, setCpbWidth])

    const updatePbWidth = useCallback(() =>{
        const ele = pbRef.current
        if(ele){
            const widthInPx: string = window.getComputedStyle(ele).getPropertyValue('width');
            const width = Number(widthInPx.substring(0, widthInPx.length-2))
            setPbWidth(width);
        }
        
    }, [pbRef.current, setPbWidth])

    useEffect(() => {
        if(pbRef.current){
            updatePbWidth()
        }
    }, [pbRef, updatePbWidth])

    useEffect(() => {
        window.addEventListener('resize', updatePbWidth);
        return () => {
            window.removeEventListener('resize', updatePbWidth);
        }
    }, [pbRef])
    
    const getFirsEndPoint = useMemo(() => {
       
        let timeInSec = props.currentTime ? Math.round(props.currentTime) : 0
        if(props.totalDuration === props.currentTime){
            timeInSec = 0
        }
        const hr = Math.floor(timeInSec / (60 * 60))
        timeInSec = timeInSec % (60 * 60)
        const min = Math.floor(timeInSec / 60)
        timeInSec = timeInSec % 60;
        const formattedTime =
            `${(hr.toString()).length > 1 ? hr: `0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeInSec.toString()).length > 1 ? timeInSec: `0${timeInSec}`}`   
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
        
    }, [props.currentTime, props.totalDuration]);

    const getLastEndPoint = useMemo(() => {
        let timeLetInSec = Math.round((props.totalDuration ?? 0) - (props.currentTime ?? 0));
        if(props.totalDuration === props.currentTime){
            timeLetInSec = Math.round(props.totalDuration ?? 0);
        }
        
        const hr = Math.floor(timeLetInSec / (60 * 60))
        timeLetInSec = timeLetInSec % (60 * 60)
        const min = Math.floor(timeLetInSec / 60)
        timeLetInSec = timeLetInSec % 60;
        
        const formattedTime = `${(hr.toString()).length > 1 ? hr: `0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeLetInSec.toString()).length > 1 ? timeLetInSec: `0${timeLetInSec}`}` 
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
    }, [props.totalDuration, props.currentTime])

    return (
        <div ref = {pbRef} className="progress-bar">
            <div className="current-progress-bar" style={{width: `${cpbWidth}px`}}></div>
            <div className="silder-ball" style={{marginLeft: `${cpbWidth}px`}}></div>
            <div className="endpoint-container">
                <div className="time-endpoint">{getFirsEndPoint}</div>
                <div className="time-endpoint">{getLastEndPoint}</div>
            </div>
        </div>
    ) 
}