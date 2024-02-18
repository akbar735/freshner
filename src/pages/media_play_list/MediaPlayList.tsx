import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import AudioBar from '../../components/audio/Audio';
import { useAppSelector } from '../../hooks';
import { useAppDispatch } from '../../hooks';
import SwitchLabels from '../../widgets/switch/Switch';
import { autoPlayToggled } from '../../slices/AudioSlice';
import './MediaPlayList.css';
import { Button } from '@mui/material';

export interface IAudioFile{
    src: string;
    name: string;
}
export interface IMediaPlayList{
    audioFiles: IAudioFile[],
    selectedMedia: FileList|null
}
export interface IActiveBarTrack{
   currentlyPlaying: number; 
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

        if(audioRefs.current[barNo]?.ended){
            const audio = audioRefs.current[barNo] as HTMLAudioElement
            audio.currentTime = 0
        }
        return !!(audioRefs.current[barNo] && !audioRefs.current[barNo]?.paused && !audioRefs.current[barNo]?.ended);
    }, [audioRefs.current])
    
    const toggelAutoPlay = (event: ChangeEvent) => {
        dispatch(autoPlayToggled())
    }
    
    const handleOnEnded = useCallback((barNo: number) => {
        if(audioRefs.current[barNo]?.loop){
            audioRefs.current[barNo]?.play();
            return 
        }
        if(autoPlay){
            const nextBar = barNo + 1;
            if(audioRefs.current[nextBar]){
                audioRefs.current[nextBar]?.play();
            }
        }   
    }, [autoPlay, audioRefs.current])

    const rewindPlaying = useCallback((barNo: number) =>{
        if(audioRefs.current && audioRefs.current[barNo]){
            const audioElem = audioRefs.current[barNo] as HTMLAudioElement;
            audioElem.currentTime = (audioElem.currentTime ?? 0) - 5;
        }
    }, [audioRefs.current]);

    const forwardPlaying = useCallback((barNo: number) =>{
        if(audioRefs.current && audioRefs.current[barNo]){
            const audioElem = audioRefs.current[barNo] as HTMLAudioElement;
            audioElem.currentTime = (audioElem.currentTime ?? 0) + 5;
        }
    }, [audioRefs.current]);
    
    const playNext = useCallback((barNo: number) => {
        if(audioRefs.current){
            pauseOtherBars(barNo + 1);
            audioRefs.current[barNo + 1]?.play()

            const currentActiveBarTemp = {...currentActiveBar}
            currentActiveBarTemp.currentlyPlaying = barNo - 1
        }
    }, [currentActiveBar, audioRefs.current, pauseOtherBars])

    const playPrevious = useCallback((barNo: number) => {
        if(audioRefs.current){
            pauseOtherBars(barNo - 1);
            audioRefs.current[barNo - 1]?.play()
            const currentActiveBarTemp = {...currentActiveBar}
            currentActiveBarTemp.currentlyPlaying = barNo - 1
        }
    },[currentActiveBar, audioRefs.current, pauseOtherBars])

    const createAlbum = () => {
            console.log("props.selectedMedia", props.selectedMedia)
    }

    return (
        <div>
             <div className='right-align'><SwitchLabels label='Auto Play' checked={autoPlay} handleOnSwitchChange={toggelAutoPlay}/></div>
             <div className='play-list'>
                {props.audioFiles.map((audioFile: IAudioFile, index) =>
                    <AudioBar 
                        startPlaying = {startPlaying}
                        pausePlayin = {pausePlayin}
                        isAudioPlaying = {isAudioPlaying}
                        handleOnEnded = {handleOnEnded}
                        rewindPlaying ={rewindPlaying}
                        forwardPlaying = {forwardPlaying}
                        playPrevious = {playPrevious}
                        playNext = {playNext}
                        ref={(el: HTMLAudioElement | null) => (audioRefs.current[index] = el)}
                        ownRef ={audioRefs.current[index]}
                        src={audioFile.src}  
                        key={`${audioFile.src}-${index}`} 
                        index = {index}
                        currentActiveBar = {currentActiveBar}
                        totalBars = {props.audioFiles.length}
                        allFileDetail= {audioFile} 
                    />
                    )
                }
            </div>
            <div style={{display: 'flex', justifyContent: 'flex-end', marginRight: 10}}>
                <Button onClick={createAlbum} variant='contained' size='small'>Create Album</Button>
            </div>
           
            
        </div>
    )
}