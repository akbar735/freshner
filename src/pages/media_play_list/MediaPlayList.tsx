import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import AudioBar from '../../components/audio/Audio';
import { useAppSelector } from '../../hooks';
import { useAppDispatch } from '../../hooks';
import SwitchLabels from '../../widgets/switch/Switch';
import { autoPlayToggled } from '../../slices/AudioSlice';
import './MediaPlayList.css';

export interface IAudioFile{
    src: string;
}
export interface IMediaPlayList{
    audioFiles: IAudioFile[]
}
export interface IActiveBarTrack{
   currentlyPlaying: number 
}

MediaPlayList.displayName = 'MediaPlayList'
export default function MediaPlayList(props: IMediaPlayList){
    const [currentActiveBar, setCurrentActiveBar] = useState<IActiveBarTrack>({currentlyPlaying: -1})
    const autoPlay = useAppSelector(state => state.audio.autoPlay)
    const dispatch = useAppDispatch()
    const audioRefs = useRef<(HTMLAudioElement | null)[]>(props.audioFiles.map(() => null));
   
    const pauseOtherBars = (excludBarNo: number) => {
        
        if(audioRefs.current.length > 0){
            audioRefs.current.forEach((audio, index) => {
                if(index !== excludBarNo){
                    audio?.pause();
                }
            })
        }
    }
    const startPlaying = useCallback((barNo: number) => {
        pauseOtherBars(barNo)
        audioRefs.current[barNo]?.play()
        const currentActiveBarTemp = {...currentActiveBar}
        currentActiveBarTemp.currentlyPlaying = barNo
        setCurrentActiveBar(currentActiveBarTemp)
    },[audioRefs.current, setCurrentActiveBar, currentActiveBar])

    const pausePlayin = useCallback((barNo: number) => {
        audioRefs.current[barNo]?.pause()
        const currentActiveBarTemp = {...currentActiveBar}
        currentActiveBarTemp.currentlyPlaying = -1
        setCurrentActiveBar(currentActiveBarTemp)
    }, [audioRefs.current, setCurrentActiveBar, currentActiveBar])

    const isAudioPlaying = useCallback((barNo: number): boolean => {
        return !!(audioRefs.current[barNo] && !audioRefs.current[barNo]?.paused && !audioRefs.current[barNo]?.ended);
    }, [audioRefs.current])
    
    const toggelAutoPlay = (event: ChangeEvent) => {
        dispatch(autoPlayToggled())
    }
    
    const handleOnEnded = useCallback((barNo: number) => {
        if(autoPlay){
            const nextBar = barNo + 1;
            if(audioRefs.current[nextBar]){
                audioRefs.current[nextBar]?.play();
            }
        }   
    }, [autoPlay, audioRefs.current])

    return (
        <div>
             <div className='right-align'><SwitchLabels label='Auto Play' checked={autoPlay} handleOnSwitchChange={toggelAutoPlay}/></div>
            {props.audioFiles.map((IAudioFile, index) =>
                <AudioBar 
                    startPlaying = {startPlaying}
                    pausePlayin = {pausePlayin}
                    isAudioPlaying = {isAudioPlaying}
                    handleOnEnded = {handleOnEnded}
                    ref={(el: HTMLAudioElement | null) => (audioRefs.current[index] = el)}
                    ownRef ={audioRefs.current[index]}
                    src={IAudioFile.src}  
                    key={`${IAudioFile.src}-${index}`} 
                    index = {index} 
                />
             )
            }
        </div>
    )
}