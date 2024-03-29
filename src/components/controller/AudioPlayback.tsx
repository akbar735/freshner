import React, { CSSProperties, ChangeEvent, MouseEventHandler, RefObject, useCallback, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Header from "../Header/Header";
import { togglePlayBack } from "../../slices/MediaSclice";
import MediaController from "./MediaController";
import MediaSnapController from "./MediaSnapController";
import { IFileType, IMetaData } from "../../types";
export interface IVideoPlayback{
    path: string;
    file: IFileType;
    audioRef: RefObject<HTMLAudioElement>;
    handleMediaTimeUpdate:  (event: React.SyntheticEvent<HTMLMediaElement, Event>) => void;
    onMediaLoad: VoidFunction;
    handleOnEnded: VoidFunction;
    getFirsEndPoint: string;
    currentTime: number | null;
    totalDuration:  number | null;
    updateCurrentTime:  (event: ChangeEvent<HTMLInputElement>) => void;
    metaData: IMetaData | undefined;
    playMedia: VoidFunction;
    pauseMedia: VoidFunction;
    getLastEndPoint: string;

}
export default function VideoPlayback(props: IVideoPlayback){
    const isPlayBackOpen = useAppSelector(state => state.media.currentlyOnTrack.isPlaybackOpen)
    const videoContainerRef = useRef<HTMLElement>(null);
    const dispatch = useAppDispatch();
    const [showAudioController, setShowAudioController] = useState(true);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const playBackContainerStyle: CSSProperties = useMemo(
        () => {
            if(isPlayBackOpen){
                return {
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    margin: '0 -8px'
                }
            }
            return {}
        }, 
        [isPlayBackOpen]
    )

    const playBackAudioClass: CSSProperties = useMemo(
        () => {
            if(isPlayBackOpen){
                return {
                    height: '100vh',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: '#3e3c3c',
                    borderRadius: 0
                }
            }
            return {}
        }, 
        [isPlayBackOpen]
    )
    
    const isAudioInFullScreen = useCallback(() =>{
        return (
          document.fullscreenElement === videoContainerRef.current
        );
    },[videoContainerRef.current])

      
    const toggleFullScreen = useCallback(() => {
        if(isPlayBackOpen){
            if(isAudioInFullScreen()){
                document.exitFullscreen();
                videoContainerRef.current?.setAttribute('data-fullscreen', 'false')
            }else{
                videoContainerRef.current?.requestFullscreen()
                videoContainerRef.current?.setAttribute('data-fullscreen', 'true')
            }
        }
    }, [videoContainerRef.current, isAudioInFullScreen, isPlayBackOpen])

    const toggleAudioPlayBack = useCallback(() => {
        if(!isAudioInFullScreen()){
            dispatch(togglePlayBack())
        }
    }, [isPlayBackOpen, isAudioInFullScreen])

    const handleVideoController = () => {
        setShowAudioController(true);
        if(timeout.current){
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(()=>{
            setShowAudioController(false);
        }, 5000);
    }
    const handleOnMouseMove: MouseEventHandler<HTMLElement> = () =>{
        handleVideoController()
    }
   
    return (
        <div style={playBackContainerStyle}>
            <div className="relative cursor-default" onClick={(e) => e.stopPropagation()}>
                <div className="absolute w-full z-[100]">{isPlayBackOpen && showAudioController && <Header variant="snap" onBackClickHandler = {toggleAudioPlayBack}/>}</div>
                <figure ref={videoContainerRef} onMouseMoveCapture={handleOnMouseMove} data-fullscreen="false" onDoubleClick={toggleFullScreen} >
                        <audio 
                            ref={props.audioRef} 
                            src={props.file?.path} 
                            onTimeUpdate={props.handleMediaTimeUpdate} onLoadedData ={props.onMediaLoad} 
                            onEnded={props.handleOnEnded}>
                        </audio>
                        <img
                            style={playBackAudioClass}
                            onClick={!isPlayBackOpen ?  toggleAudioPlayBack: undefined}
                            alt={props.file?.name}
                            src={props.metaData?.picture?.base64Image}
                            className={'h-48 w-full object-cover rounded track-media-title-size'}
                        />
                    {isPlayBackOpen && showAudioController && <div id="video-controls" className="controls absolute w-full bottom-0" data-state="hidden">
                        <MediaSnapController 
                            getFirsEndPoint={props.getFirsEndPoint} 
                            currentTime={props.currentTime} 
                            totalDuration={props.totalDuration} 
                            updateCurrentTime={props.updateCurrentTime} 
                            metaData={props.metaData} 
                            getLastEndPoint={props.getLastEndPoint} 
                            toggleVideoPlayBack = {toggleAudioPlayBack}
                            isVideoInFullScreen = {isAudioInFullScreen}
                        />
		            </div>}
                </figure>
            </div>
        </div>
    )
}