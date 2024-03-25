import React, { ChangeEvent, useCallback, useEffect, useMemo, useRef, useState } from "react";
import './MediaController.css'
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
import { togglePlayBack } from "../../slices/MediaSclice";
import { useAppDispatch } from "../../hooks";
import VideoPlayback from "./VideoPlayback";
import Controllers from "./Controllers";

const windowObj = window as typeof window & {
    electronAPI: { 
        getFileMetaData: (url: string) => IMetaData
    }
};

export interface IMediaController{
    
}
MediaController.displayName = 'MediaController';
export default function MediaController(props: IMediaController){
    const dispatch = useAppDispatch();
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    const isPlaying =  useAppSelector(state => state.media.currentlyOnTrack.isPlaying);

    const [fileType, setFileType] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
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
        const mediaRef = audioRef.current ? audioRef.current : videoRef.current
        if(mediaRef  && isPlaying){
            mediaRef.play()
            //mediaRef.requestFullscreen()
        }else if(mediaRef && !isPlaying){
            mediaRef.pause()
        }
    }, [audioRef.current, isPlaying, videoRef.current]);

    const onMediaLoad = useCallback(() => {
        const mediaRef = audioRef.current ? audioRef.current : videoRef.current
        if(mediaRef){
            const duration: number = mediaRef.duration;
            setTotalDuration(duration);
            if(isPlaying) mediaRef.play()
        }
    }, [audioRef.current, videoRef.current, isPlaying])

    const handleMediaTimeUpdate = (event: React.SyntheticEvent<HTMLMediaElement, Event>) => {
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
    
    const updateCurrentTime = useCallback ((event: ChangeEvent<HTMLInputElement>) => {
        const newTime = Number(event.target.value);
        const mediaRef = audioRef.current ? audioRef.current : videoRef.current;
        if (mediaRef) {
            setCurrentTime(newTime);
            mediaRef.currentTime = newTime;
        }
    }, [audioRef.current, videoRef.current]); 

    const handleOnEnded = () => {
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

    const toggleVideoPlayBack = () => {
        dispatch(togglePlayBack())
    }
    return (
        <div className='border-t border-slate-300 h-89'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2">{getFirsEndPoint}</div>
                <input 
                    className="brogress-bar" 
                    type="range" 
                    value={currentTime || 0}
                    min={0}
                    step={0.1}
                    max={totalDuration || 0}
                    onChange={updateCurrentTime}
                />
                <div className="ml-2 mr-2">{getLastEndPoint}</div>
            </div>
            <div className="flex justify-center">
                <div className="min-w-[120px] w-full ml-2 flex items-center cursor-pointer">   
                    {fileType === 'audio' && file?.name && <>
                        <audio 
                            ref={audioRef} 
                            src={file?.path} 
                            onTimeUpdate={handleMediaTimeUpdate} onLoadedData ={onMediaLoad} 
                            onEnded={handleOnEnded}>
                        </audio>
                        <img
                        onClick={toggleVideoPlayBack}
                        alt={file?.name}
                        src={metaData?.picture?.base64Image}
                        className={'h-48 w-full object-cover rounded track-media-title-size'}
                    />
                    </> 
                    }
                    {fileType === 'video' && file?.path && 
                    <VideoPlayback 
                        path={file.path}
                        videoRef={videoRef}
                        handleMediaTimeUpdate={handleMediaTimeUpdate}
                        onMediaLoad={onMediaLoad}
                        handleOnEnded={handleOnEnded} 
                        getFirsEndPoint={getFirsEndPoint} 
                        currentTime={currentTime} 
                        totalDuration={totalDuration} 
                        updateCurrentTime={updateCurrentTime} 
                        metaData={metaData} 
                        playMedia={playMedia} 
                        pauseMedia={pauseMedia} 
                        getLastEndPoint={getLastEndPoint}                       
                    />
                    }
                    <div 
                        onClick={toggleVideoPlayBack}
                        className="max-w-[420px] ml-2 mr-2 overflow-hidden text-ellipsis whitespace-nowrap media-title-width" 
                        title={metaData?.title ? metaData?.title : file?.name}>{metaData?.title ? file?.name : file?.name}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Controllers />
                </div>
                <div className="w-full">   
                    
                </div>
            </div>
        </div>
    )
}