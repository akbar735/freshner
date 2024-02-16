import React, { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import PlayIcon from '../../../assets/svgs/play.svg';
import PauseIcon from '../../../assets/svgs/pause.svg';
import './Audio.css'
import type { IActiveBarTrack } from "../../App";
import AudioSlider from "./components/audio-slider/AudioSlider";
interface IAudioBar{
    src: string;
    index: number;
    startPlaying: (arg0: number) => void;
    pausePlayin:  (arg0: number) => void;
    handleOnEnded: (arg0: number) => void;
    isAudioPlaying: (arg0: number) => boolean;
    ownRef: HTMLAudioElement | null;
}
const AudioBar =  forwardRef<HTMLAudioElement, IAudioBar>(function (props: IAudioBar, ref){
   const [totalDuration, setTotalDuration] = useState<number|null>(null);
   const [currentTime, setCurrentTime] = useState<number|null>(null);
   const audioRef = useRef<HTMLAudioElement>(null);
   
   useImperativeHandle(ref, () => {
        return audioRef.current as HTMLAudioElement
   }, []) 

   const handleAudioTimeUpdate = (event: Event) => {
        const currentTime: number = (event.target as HTMLMediaElement).currentTime;
        setCurrentTime(currentTime)
   }

   const handleLoadedMetaData = (event: Event) => {
        const duration: number = (event.target as HTMLMediaElement).duration;
        setTotalDuration(duration);
   }
   useEffect(() => {
        audioRef.current?.addEventListener('timeupdate',handleAudioTimeUpdate);
        audioRef.current?.addEventListener('loadedmetadata',handleLoadedMetaData);
        return () => {
            audioRef.current?.removeEventListener('timeupdate',handleAudioTimeUpdate);
        }
   }, [audioRef])

    return (
     <div> 
          <div className="audi-bar">
               {props.isAudioPlaying(props.index) ? 
               <img onClick={() => props.pausePlayin(props.index)} className="center-vertical m-l-20 play-pause" src={PauseIcon} alt="" />
               : <img onClick={() => props.startPlaying(props.index)} className="center-vertical m-l-20 play-pause" src={PlayIcon} alt="" />}
               <AudioSlider totalDuration= {totalDuration}  currentTime= {currentTime}/>
          </div>
          <audio ref={audioRef} src={props.src} onEnded={() => props.handleOnEnded(props.index)}></audio>
     </div>
    ) 
})

export default AudioBar;