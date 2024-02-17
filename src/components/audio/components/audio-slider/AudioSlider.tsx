import React, { ChangeEventHandler, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './AudioSlider.css';
interface IAudioSlider{
    totalDuration: number|null;
    currentTime: number|null;
    updateCurrentTime: ChangeEventHandler<HTMLInputElement>
}

function getOptimizedEndpoint(rormattedTime: string){
    let [hr, min, sec] = rormattedTime.split(':').map(str => str.trim())
    hr = (hr === '00') ? '': hr+':'
    min = (min === '00') ? '': min+':'
    return hr+min+sec
}

export default function AudioSlider(props: IAudioSlider){
    const pbRef = useRef(null)
 
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
        <div ref = {pbRef} >
            <input
                type="range"
                className="progress-bar"
                value={props.currentTime as number || 0}
                max={props.totalDuration as number || 100}
                onChange={props.updateCurrentTime}
            />
            <div className="endpoint-container">
                <div className="time-endpoint">{getFirsEndPoint}</div>
                <div className="time-endpoint">{getLastEndPoint}</div>
            </div>
        </div>
    ) 
}