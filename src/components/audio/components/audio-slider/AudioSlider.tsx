import React, { useCallback, useEffect, useRef, useState } from "react";
import './AudioSlider.css';
interface IAudioSlider{
    totalDuration: number|null;
    currentTime: number|null;
}
export default function AudioSlider(props: IAudioSlider){
    const pbRef = useRef(null)
    const [pbWidth, setPbWidth] = useState(0)
    const [onePixelRateInSec, setOnePixelRateInSec] = useState(0);
    const [cpbWidth, setCpbWidth] = useState(0);

    useEffect(() => {
        if(props.currentTime === props.totalDuration){
            setPbWidth(0);
            setOnePixelRateInSec(0);
            setCpbWidth(0);
        }
    }, [props.currentTime, props.totalDuration]);

    useEffect(() => {
        if(props.totalDuration && pbWidth){
            setOnePixelRateInSec(pbWidth / props.totalDuration);
        }
    },[pbWidth, props.totalDuration])

    useEffect(() => {
        if(props.currentTime) setCpbWidth(onePixelRateInSec * props.currentTime);
    }, [props.currentTime, onePixelRateInSec])

    const updatePbWidth = useCallback(() =>{
        const ele = pbRef.current
        if(ele){
            const widthInPx: string = window.getComputedStyle(ele).getPropertyValue('width');
            const width = Number(widthInPx.substring(0, widthInPx.length-2))
            setPbWidth(width);
        }
        
    }, [pbRef, setPbWidth])
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
    return (
        <div ref = {pbRef} className="progress-bar">
            <div className="current-progress-bar" style={{width: `${cpbWidth}px`}}></div>
            <div className="silder-ball" style={{marginLeft: `${cpbWidth}px`}}></div>
        </div>
    ) 
}