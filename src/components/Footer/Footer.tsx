import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './Footer.css'
import IconButton from "../IconButton/IconButton";
import { 
    MdPlayCircleOutline, 
    MdPauseCircleOutline,
    MdNavigateNext, 
    MdNavigateBefore, 
    MdForward5, 
    MdReplay5 } from "react-icons/md";
import { useAppSelector } from "../../hooks";
import { getFileType, getOptimizedEndpoint } from "../../helper";
import { IFileType, IMetaData } from "../../types";
import { setIsPlaying } from "../../slices/MediaSclice";
import { useAppDispatch } from "../../hooks";

const windowObj = window as typeof window & {
    electronAPI: { 
        getFileMetaData: (url: string) => IMetaData
    }
};

Footer.displayName = 'Footer';
export default function Footer(){
    const dispatch = useAppDispatch();
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    const isPlaying =  useAppSelector(state => state.media.currentlyOnTrack.isPlaying);

    const [fileType, setFileType] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const [metaData, setMetaData] =  useState<IMetaData>()
    const [totalDuration, setTotalDuration] = useState<number|null>(null);
    const [currentTime, setCurrentTime] = useState<number|null>(null);

    const getFileMetaData = async (file: IFileType) => {
        if(file.path){
            const metaData = await windowObj.electronAPI.getFileMetaData(file.path)
            setMetaData(metaData)
        }else{
            console.error('file path not found:')
        }
    }

    useEffect(() => {
        if(audioRef.current  && isPlaying){
            audioRef.current.play()
        }else if(audioRef.current && !isPlaying){
            audioRef.current.pause()
        }
    }, [audioRef.current, isPlaying]);

    const onMediaLoad = useCallback(() => {
        if(audioRef.current){
            const duration: number = audioRef.current.duration;
            setTotalDuration(duration);
            if(isPlaying) audioRef.current.play()
        }
    }, [audioRef.current, isPlaying])

    const handleAudioTimeUpdate = (event: React.SyntheticEvent<HTMLMediaElement, Event>) => {
        const currentTime: number = (event.target as HTMLMediaElement).currentTime;
        setCurrentTime(currentTime)
    }

    const getFirsEndPoint = useMemo(() => {
       
        let timeInSec = currentTime ? Math.round(currentTime) : 0
        if(totalDuration === currentTime){
            timeInSec = 0
        }
        const hr = Math.floor(timeInSec / (60 * 60))
        timeInSec = timeInSec % (60 * 60)
        const min = Math.floor(timeInSec / 60)
        timeInSec = timeInSec % 60;
        const formattedTime =
            `${(hr.toString()).length > 1 ? hr:`0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeInSec.toString()).length > 1 ? timeInSec:`0${timeInSec}`}`   
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
        
    }, [currentTime, totalDuration]);

    const getLastEndPoint = useMemo(() => {
        let timeLetInSec = Math.round((totalDuration ?? 0) - (currentTime ?? 0));
        if(totalDuration === currentTime){
            timeLetInSec = Math.round(totalDuration ?? 0);
        }
        
        const hr = Math.floor(timeLetInSec / (60 * 60))
        timeLetInSec = timeLetInSec % (60 * 60)
        const min = Math.floor(timeLetInSec / 60)
        timeLetInSec = timeLetInSec % 60;
        
        const formattedTime = `${(hr.toString()).length > 1 ? hr:`0${hr}`}:
             ${(min.toString()).length > 1 ? min: `0${min}`}:
             ${(timeLetInSec.toString()).length > 1 ? timeLetInSec:`0${timeLetInSec}`}` 
        
        const endpoint = getOptimizedEndpoint(formattedTime)
        return endpoint
    }, [totalDuration, currentTime])
    
    const updateCurrentTime = useCallback((event: ChangeEvent<HTMLInputElement> ) => {
        const newTime = Number(event.target.value)
        if (audioRef.current) {
           audioRef.current.currentTime = newTime;
        }
    },[audioRef.current])

    const handleOnEnded = () => {
        setTotalDuration(0);
        setCurrentTime(0);
        dispatch(setIsPlaying({
            isPlaying: false
        }))
    }
    const playMedia = () => {
        dispatch(setIsPlaying({
            isPlaying: true
        }))
    }
    const pauseMedia = () => {
        dispatch(setIsPlaying({
            isPlaying: false
        }))
    }
    useEffect(() => {
        if(file){
            const fileType = getFileType(file.type);
            setFileType(fileType)
            getFileMetaData(file)
        }
    }, [file])

    return (
        <div className='border-t border-slate-300 h-89'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2">{getFirsEndPoint}</div>
                <input 
                    className="brogress-bar" 
                    type="range" 
                    value={currentTime || 0}
                    min={0}
                    step={1}
                    max={totalDuration || 0}
                    onChange={updateCurrentTime}
                />
                <div className="ml-2 mr-2">{getLastEndPoint}</div>
            </div>
            <div className="flex justify-center">
                <div style={{width: '100%'}} className="ml-2 flex items-center">   
                    {file?.name && <img
                        alt={file?.name}
                        src={metaData?.picture?.base64Image}
                        className={'h-48 w-full object-cover rounded track-media-title-size'}
                    />}
                    <div className="ml-2 mr-2 overflow-hidden text-ellipsis whitespace-nowrap media-title-width" title={metaData?.title ? metaData?.title : file?.name}>{metaData?.title ? metaData?.title : file?.name}</div>
                </div>
                <div className="flex justify-center">
                    <div className="flex">
                        <IconButton style = {{alignSelf: 'center'}} >
                            <MdReplay5 className="h-6 w-6" />
                        </IconButton>
                        <IconButton style = {{alignSelf: 'center'}}>
                            <MdNavigateBefore className="h-6 w-6" />
                        </IconButton>
                        <IconButton>
                            {!isPlaying ? <MdPlayCircleOutline onClick={playMedia} className="h-11 w-11 block" />:
                            <MdPauseCircleOutline onClick={pauseMedia} className="h-11 w-11 block" />}
                        </IconButton>
                        <IconButton style = {{alignSelf: 'center'}}>
                            <MdNavigateNext className="h-6 w-6" />
                        </IconButton>
                        <IconButton style = {{alignSelf: 'center'}}>
                            <MdForward5 className="h-6 w-6" />
                        </IconButton>
                    </div>
                </div>
                <div style={{width: '100%'}}>   
                    
                </div>
            </div>
            
            {fileType === 'audio' && 
            <audio 
                ref={audioRef} 
                src={file?.path} 
                onTimeUpdate={handleAudioTimeUpdate} onLoadedData ={onMediaLoad} 
                onEnded={handleOnEnded}></audio>
            }
        </div>
    )
}