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
import { IFileDetail, IFileType, IMetaData } from "../../types";
import { setCurrenlyPlaying, setIsPlaying } from "../../slices/MediaSclice";
import { togglePlayBack } from "../../slices/MediaSclice";
import { useAppDispatch } from "../../hooks";
import VideoPlayback from "./VideoPlayback";
import Controllers from "./Controllers";
import AudioPlayback from "./AudioPlayback";
import { windowObj } from "../../electrone-api";

export interface IMediaController{
    
}
MediaController.displayName = 'MediaController';
export default function MediaController(props: IMediaController){
    const dispatch = useAppDispatch();
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    const isPlaying =  useAppSelector(state => state.media.currentlyOnTrack.isPlaying);
    const loop =  useAppSelector(state => state.media.currentlyOnTrack.loop);
    const location = useAppSelector(state => state.media.currentlyOnTrack.location);

    const playListLoop = useAppSelector(state => state.media[location].playListLoop)
    const playLists = useAppSelector<IFileDetail[]>(state => state.media[location].playLists)

    const [fileType, setFileType] = useState('');
    const audioRef = useRef<HTMLAudioElement>(null);
    const videoRef = useRef<HTMLVideoElement>(null);
    const [metaData, setMetaData] =  useState<IMetaData>()
    const [totalDuration, setTotalDuration] = useState<number|null>(null);
    const [currentTime, setCurrentTime] = useState<number|null>(null);
    const [cpbWidth, setCpbWidth] = useState(0);
    const [onePixelRateInSec, setOnePixelRateInSec] = useState(0);
    const [pbWidth, setPbWidth] = useState(0)
    const pbRef = useRef(null);
    const getFileMetaData = async (file: IFileType) => {
        if(file.path){
            const metaData = await windowObj.electronAPI.getFileMetaData(file.path)
            setMetaData(metaData)
        }else{
            console.error('file path not found:')
        }
    }

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

    const handleOnEnded = useCallback(() => {
        setCurrentTime(0);
        if(loop){
            const mediaRef = audioRef.current ? audioRef.current : videoRef.current
            if(mediaRef) mediaRef.play()
        }else if(playListLoop){
            const currentPlayingIndex = playLists.findIndex(item => item.file.path === file?.path)
            const nextPlayingIndex = currentPlayingIndex+1 === playLists.length ? 0 : currentPlayingIndex + 1
            const nextMedia = playLists[nextPlayingIndex];
            dispatch(setCurrenlyPlaying({
                media: nextMedia,
                location: location,
                isPlaying: true
            }))

        }else{
            dispatch(setIsPlaying({
                isPlaying: false
            }))
        }

    }, [audioRef.current, videoRef.current, playLists, playListLoop, file])
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
   

    const toggleVideoPlayBack = () => {
        dispatch(togglePlayBack())
    }

    
    const updatePbWidth = useCallback(() =>{
        const ele = pbRef.current
        if(ele){
            const widthInPx: string = window.getComputedStyle(ele).getPropertyValue('width');
            const width = Number(widthInPx.substring(0, widthInPx.length-2))
            setPbWidth(width);
        }

    }, [pbRef, setPbWidth])

    useEffect(() => {
        const mediaRef = audioRef.current ? audioRef.current : videoRef.current
        if(mediaRef  && isPlaying){
            mediaRef.play()
            //mediaRef.requestFullscreen()
        }else if(mediaRef && !isPlaying){
            mediaRef.pause()
        }
    }, [audioRef.current, isPlaying, videoRef.current]);

    useEffect(() => {
        if(file){
            const fileType = getFileType(file.type);
            setFileType(fileType)
            getFileMetaData(file)
        }
    }, [file])

    useEffect(() => {
        if(currentTime) {
            setCpbWidth(onePixelRateInSec * currentTime)
        }else{
            setCpbWidth(0)
        }
    }, [currentTime, onePixelRateInSec])
    

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

    useEffect(() => {
        if(totalDuration && pbWidth){
            setOnePixelRateInSec(pbWidth / totalDuration);
        }
    },[pbWidth, totalDuration])

    return (
        <div className='border-t border-slate-300 h-89'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2">{getFirsEndPoint}</div>
                <div className="w-full relative h-[3px] mt-[11px] bg-slate-800/50">
                    <div className="absolute h-[3px] bg-[rgb(126,34,206)] dark:bg-white" style={{width: cpbWidth}}></div>
                    <input 
                        ref={pbRef}
                        className="brogress-bar absolute" 
                        type="range" 
                        value={currentTime || 0}
                        min={0}
                        step={0.1}
                        max={totalDuration || 0}
                        onChange={updateCurrentTime}
                    />
                </div>
                <div className="ml-2 mr-2">{getLastEndPoint}</div>
            </div>
            <div className="flex justify-center">
                <div className="min-w-[120px] w-full ml-2 flex items-center cursor-pointer">   
                    {fileType === 'audio' && file?.name && 
                        <AudioPlayback 
                            file={file}
                            path={file.path}
                            audioRef={audioRef}
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
                        className="max-w-[420px] ml-2 mr-2 overflow-hidden text-ellipsis whitespace-nowrap h-full leading-[320%] px-1 hover:bg-slate-200 dark:hover:bg-slate-900 rounded-md" 
                        title={metaData?.title ? metaData?.title : file?.name}>{metaData?.title ? metaData?.title : file?.name}
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