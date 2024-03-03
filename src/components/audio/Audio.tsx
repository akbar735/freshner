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
import { IActiveBarTrack, IMetaData } from "../../pages/media_play_list/MediaPlayList";
import AudioPlayer from "../../widgets/audio/AudioPlayer";

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
    allFileDetail: {
          name: string;
          src: string;
          metadata?: IMetaData;
    }
}
const AudioBar =  forwardRef<HTMLAudioElement, IAudioBar>(function (props: IAudioBar, ref){
   const [totalDuration, setTotalDuration] = useState<number|null>(null);
   const [currentTime, setCurrentTime] = useState<number|null>(null);
   const audioRef = useRef<HTMLAudioElement>(null);
   const [loop, setLoop] =  useState(audioRef.current?.loop || false)
   
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

   const updateCurrentTime = (value: number) => {
     const audio = audioRef.current;
     const newTime = value
 
     if (audio) {
       audio.currentTime = newTime;
       setCurrentTime(newTime);
     }
   } 
   
   console.log("props.allFileDetail:::",props.allFileDetail)
    return (
     <div className="audio-widget"> 
          <div style={{marginBottom: 10}}>
               <AudioPlayer  
                    totalDuration= {totalDuration} 
                    updateCurrentTime = {updateCurrentTime}  
                    currentTime= {currentTime}
                    paused = {!props.isAudioPlaying(props.index)}
                    startPlaying = {props.startPlaying}
                    pausePlaying = {props.pausePlayin}
                    rewindPlaying = {props.rewindPlaying}
                    forwardPlaying = {props.forwardPlaying}
                    playPrevious = {props.playPrevious}
                    playNext = {props.playNext}
                    index = {props.index}
                    allFileDetail = {props.allFileDetail}
                    enableLoop = {enableLoop}
                    desableLoop = {desableLoop}
                    loop = {loop}
               />
          </div>
          
          <audio ref={audioRef} src={props.src} onEnded={() => props.handleOnEnded(props.index)}></audio>
     </div>
    ) 
})

export default AudioBar;