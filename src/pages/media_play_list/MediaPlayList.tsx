import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from 'react';
import AudioBar from '../../components/audio/Audio';
import { useAppSelector } from '../../hooks';
import { useAppDispatch } from '../../hooks';
import SwitchLabels from '../../widgets/switch/Switch';
import { autoPlayToggled } from '../../slices/AudioSlice';
import './MediaPlayList.css';
import { Button, IconButton } from '@mui/material';
import AlbumInputDialog from '../../widgets/dialog/AlbumInputDialog';
import AudioPlayer from '../../widgets/audio/AudioPlayer';
import RepeatIcon from '@mui/icons-material/Repeat';
import RepeatOnIcon from '@mui/icons-material/RepeatOn';
import { useTheme } from '@mui/material/styles';
import { loopPlayListToggled } from '../../slices/AudioSlice';

export interface IMetaData{
    album: string;
    title: string;
    artist: string;
    picture: {
        format: string;
        type: string;
        description: string;
        base64Image: string;
    }
};

export interface IAudioFile{
    src: string;
    name: string;
    metadata?: IMetaData;
}
export interface IMediaPlayList{
    audioFiles: IAudioFile[];
    playListName: string;
}
export interface IActiveBarTrack{
   currentlyPlaying: number; 
}
const windowObj = window as typeof window & {
    electronAPI: { 
        handleCreateAlbum: (arg0: string, arg1: IAudioFile[]) => void,
    }
};
MediaPlayList.displayName = 'MediaPlayList'
export default function MediaPlayList(props: IMediaPlayList){
    const [currentActiveBar, setCurrentActiveBar] = useState<IActiveBarTrack>({currentlyPlaying: -1})
    const autoPlay = useAppSelector(state => state.audio.autoPlay)
    const playListLoop = useAppSelector(state => state.audio.playListLoop)
    const dispatch = useAppDispatch()
    const audioRefs = useRef<(HTMLAudioElement | null)[]>(props.audioFiles.map(() => null));
    const [isAlbumPopupOpen, setIsAlbumPopupOpen] = useState(false);
    const theme = useTheme();
    const mainIconColor = theme.palette.mode === 'dark' ? '#fff' : '#000';
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
            if(playListLoop){
                if(props.audioFiles.length -1 === barNo){
                    audioRefs.current[0]?.play();
                }
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
        setIsAlbumPopupOpen(true)
    }

    const handleOnClose = () => {
        setIsAlbumPopupOpen(false)
    }
    const handleOnSave = useCallback(async (name: string) => {
        setIsAlbumPopupOpen(false)
        console.log("name::", name)
       
        const msg = await windowObj.electronAPI.handleCreateAlbum(name, props.audioFiles)
        console.log("msg:::", msg)
    }, [props.audioFiles]) 

    const togglePlayListLoop = () => {
        dispatch(loopPlayListToggled())
    }

    return (
        <div>
             <div className='right-align'>
                <IconButton sx={{marginRight: '20px'}} aria-label="next song" onClick={togglePlayListLoop}>
                    {!playListLoop && <RepeatIcon htmlColor={mainIconColor} />}
                    {playListLoop && <RepeatOnIcon htmlColor={mainIconColor} />}
                </IconButton>
                <SwitchLabels label='Auto Play' checked={autoPlay} handleOnSwitchChange={toggelAutoPlay}/>
            </div>
             <div className='play-list'>
                {props.audioFiles.map((audioFile: IAudioFile, index) =>
                    // <AudioPlayer />
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
                {!props.playListName && <Button onClick={createAlbum} variant='contained' size='small'>Create Album</Button>}
                {!!props.playListName && <Button  variant='contained' size='small'>Add Song</Button>}
            </div>
            <AlbumInputDialog
                open = {isAlbumPopupOpen}
                onClose={handleOnClose}
                onSave={handleOnSave}
            />
        </div>
    )
}