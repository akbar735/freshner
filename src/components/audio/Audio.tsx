import React, { ChangeEvent, forwardRef, useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import PlayCircleOutlineIcon from '@mui/icons-material/PlayCircleOutline';
import FastForwardIcon from '@mui/icons-material/FastForward';
import AudioSlider from "./components/audio-slider/AudioSlider";
import FastRewindIcon from '@mui/icons-material/FastRewind';
import PauseCircleOutlineIcon from '@mui/icons-material/PauseCircleOutline';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';
import NavigateBeforeIcon from '@mui/icons-material/NavigateBefore';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOneIcon from '@mui/icons-material/RepeatOne';
import './Audio.css'
import { IActiveBarTrack } from "../../pages/media_play_list/MediaPlayList";

interface IAudioBar{
    src: string;
    index: number;
    totalBars: number;
    currentActiveBar: IActiveBarTrack
    startPlaying: (arg0: number) => void;
    pausePlayin:  (arg0: number) => void;
    handleOnEnded: (arg0: number) => void;
    rewindPlaying: (arg0: number) => void;
    forwardPlaying: (arg0: number) => void;
    playPrevious: (arg0: number) => void;
    playNext: (arg0: number) => void;
    isAudioPlaying: (arg0: number) => boolean;
    ownRef: HTMLAudioElement | null;
    allFileDetail: {
          name: string;
          src: string;
    }
}
const AudioBar =  forwardRef<HTMLAudioElement, IAudioBar>(function (props: IAudioBar, ref){
   const [totalDuration, setTotalDuration] = useState<number|null>(null);
   const [currentTime, setCurrentTime] = useState<number|null>(null);
   const audioRef = useRef<HTMLAudioElement>(null);
   const [loop, setLoop] =  useState(audioRef.current?.loop)
   
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
   console.log("allFileDetail:::", props.allFileDetail)
   useEffect(() => {
        audioRef.current?.addEventListener('timeupdate',handleAudioTimeUpdate);
        audioRef.current?.addEventListener('loadedmetadata',handleLoadedMetaData);
        return () => {
            audioRef.current?.removeEventListener('timeupdate',handleAudioTimeUpdate);
        }
   }, [audioRef])

   const desableLoop = useCallback(() => {
          const audio = audioRef.current as HTMLAudioElement
          audio.loop = false
          setLoop(false)
   }, [audioRef.current])

   const enableLoop = useCallback(() => {
          const audio = audioRef.current as HTMLAudioElement
          audio.loop = true
          setLoop(true)
   }, [audioRef.current])

   const updateCurrentTime = (event: ChangeEvent<HTMLInputElement>) => {
     const audio = audioRef.current;
     const newTime = parseFloat(event.target.value);
 
     if (audio) {
       audio.currentTime = newTime;
       setCurrentTime(newTime);
     }
   }
    return (
     <div> 
          <div className="audi-bar">
               {/* <div>{props.allFileDetail.name}</div> */}
               <AudioSlider totalDuration= {totalDuration} updateCurrentTime = {updateCurrentTime}  currentTime= {currentTime}/>
               <div className="play-controls">
                    {props.index === 0 || !props.isAudioPlaying(props.index) ?  <NavigateBeforeIcon style={{color: 'grey'}} /> 
                    :  <NavigateBeforeIcon style={{cursor: 'pointer'}}  onClick={() => props.playPrevious(props.index)} />}
                   
                    <FastRewindIcon style={{cursor: 'pointer'}} onClick={() => props.rewindPlaying(props.index)}/>
                    {props.isAudioPlaying(props.index) ? 
                    <PauseCircleOutlineIcon onClick={() => props.pausePlayin(props.index)} style={{cursor: 'pointer'}}  />
                    : <PlayCircleOutlineIcon onClick={() => props.startPlaying(props.index)} style={{cursor: 'pointer'}} />}
                    <FastForwardIcon style={{cursor: 'pointer'}} onClick={() => props.forwardPlaying(props.index)} />
                    {props.index === props.totalBars - 1 || !props.isAudioPlaying(props.index) ?  <NavigateNextIcon style={{color: 'grey'}} /> 
                    :  <NavigateNextIcon style={{cursor: 'pointer'}} onClick={() => props.playNext(props.index)} />}
               </div>
               <div className="loop-container">
                    {loop ? <RepeatOneIcon onClick = {desableLoop}  style={{cursor: 'pointer', fontSize: 15}} /> 
                    : <RepeatIcon onClick = {enableLoop} style={{cursor: 'pointer', fontSize: 15}} />}
               </div>
               <div className="file-name-container" title={props.allFileDetail.name}>
                    <div className={props.isAudioPlaying(props.index) ? "marquee-content": ''}>
                         {props.allFileDetail.name}
                    </div>
                    
               </div>
               
          </div>
          <audio ref={audioRef} src={props.src} onEnded={() => props.handleOnEnded(props.index)}></audio>
     </div>
    ) 
})

export default AudioBar;