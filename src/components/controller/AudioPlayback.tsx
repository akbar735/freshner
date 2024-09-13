import React, { CSSProperties, ChangeEvent, MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
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
    rewindFiveSeconds: VoidFunction;
    forwardFiveSeconds: VoidFunction;
    getFirsEndPoint: string;
    currentTime: number | null;
    toggleVolume: VoidFunction;
    totalDuration:  number | null;
    updateCurrentTime:  (event: ChangeEvent<HTMLInputElement>) => void;
    volume: number|null;
    updateMediaVolume: (event: ChangeEvent<HTMLInputElement>) => void;
    metaData: IMetaData | undefined;
    playMedia: VoidFunction;
    pauseMedia: VoidFunction;
    getLastEndPoint: string;
    playPrevious: VoidFunction;
    playNext: VoidFunction;
}
export default function VideoPlayback(props: IVideoPlayback){
    const isPlaybackOpen = useAppSelector(state => state.media.currentlyOnTrack.isPlaybackOpen)
    const videoContainerRef = useRef<HTMLElement>(null);
    const dispatch = useAppDispatch();
    const [showAudioController, setShowAudioController] = useState(true);
    const timeout = useRef<NodeJS.Timeout | null>(null);
    const playBackContainerStyle: CSSProperties = useMemo(
        () => {
            if(isPlaybackOpen){
                return {
                    position: 'absolute',
                    top: 0,
                    width: '100%',
                    margin: '0 -8px'
                }
            }
            return {}
        }, 
        [isPlaybackOpen]
    )

    const playBackAudioClass: CSSProperties = useMemo(
        () => {
            if(isPlaybackOpen){
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
        [isPlaybackOpen]
    )
    
    const isAudioInFullScreen = useCallback(() =>{
        return (
          document.fullscreenElement === videoContainerRef.current
        );
    },[videoContainerRef.current])

      
    const toggleFullScreen: MouseEventHandler = useCallback((event) => {
        if(isPlaybackOpen && (event.target as HTMLElement).tagName === 'IMG'){
            if(isAudioInFullScreen()){
                document.exitFullscreen();
                videoContainerRef.current?.setAttribute('data-fullscreen', 'false')
            }else{
                videoContainerRef.current?.requestFullscreen()
                videoContainerRef.current?.setAttribute('data-fullscreen', 'true')
            }
        }
    }, [videoContainerRef.current, isAudioInFullScreen, isPlaybackOpen])

    const toggleAudioPlayBack = useCallback(() => {
        if(!isAudioInFullScreen()){
            dispatch(togglePlayBack())
        }
    }, [isPlaybackOpen, isAudioInFullScreen])

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
    const handleMouseClick = () => {
        handleVideoController()
    }
    
    const HandleOnKeyDown = () => {
        handleVideoController()
    }
    useEffect(() => {
        window.addEventListener('keydown', HandleOnKeyDown)
        return () => {
            window.removeEventListener('keydown', HandleOnKeyDown)
        }
    }, [HandleOnKeyDown]);
    
    return (
        <div style={playBackContainerStyle}>
            <div className="relative cursor-default min-w-[80px]" onClick={(e) => e.stopPropagation()}>
                <div className="absolute w-full z-[100]">{isPlaybackOpen && showAudioController && <Header variant="snap" onBackClickHandler = {toggleAudioPlayBack}/>}</div>
                <figure ref={videoContainerRef}  onClick={handleMouseClick} onMouseMoveCapture={handleOnMouseMove} data-fullscreen="false" onDoubleClick={toggleFullScreen} >
                        <audio 
                            ref={props.audioRef} 
                            src={props.file?.path} 
                            onTimeUpdate={props.handleMediaTimeUpdate} onLoadedData ={props.onMediaLoad} 
                            onEnded={() => {
                                props.handleOnEnded()
                                if(isAudioInFullScreen()){
                                    dispatch(togglePlayBack())
                                }
                            }}>
                        </audio>
                        <img
                            style={playBackAudioClass}
                            onClick={!isPlaybackOpen ?  toggleAudioPlayBack: undefined}
                            alt={props.file?.name}
                            src={props.metaData?.picture?.base64Image}
                            className={'h-48 w-full object-cover rounded track-media-title-size'}
                        />
                    {isPlaybackOpen && showAudioController && <div id="video-controls" className="controls absolute w-full bottom-0" data-state="hidden">
                        <MediaSnapController 
                            getFirsEndPoint={props.getFirsEndPoint}
                            currentTime={props.currentTime}
                            totalDuration={props.totalDuration}
                            updateCurrentTime={props.updateCurrentTime}
                            volume={props.volume}
                            toggleVolume={props.toggleVolume}
                            updateMediaVolume={props.updateMediaVolume}
                            metaData={props.metaData}
                            getLastEndPoint={props.getLastEndPoint}
                            toggleVideoPlayBack={toggleAudioPlayBack}
                            isVideoInFullScreen={isAudioInFullScreen}
                            rewindFiveSeconds={props.rewindFiveSeconds}
                            forwardFiveSeconds={props.forwardFiveSeconds} 
                            playPrevious={props.playPrevious} 
                            playNext={props.playNext}                       
                         />
		            </div>}
                </figure>
            </div>
        </div>
    )
}