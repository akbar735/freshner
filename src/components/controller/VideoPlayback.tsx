import React, { CSSProperties, ChangeEvent, MouseEventHandler, RefObject, useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks";
import Header from "../Header/Header";
import { togglePlayBack } from "../../slices/MediaSclice";
import MediaController from "./MediaController";
import MediaSnapController from "./MediaSnapController";
import { IMetaData } from "../../types";
export interface IVideoPlayback{
    path: string;
    videoRef: RefObject<HTMLVideoElement>;
    handleMediaTimeUpdate:  (event: React.SyntheticEvent<HTMLMediaElement, Event>) => void;
    onMediaLoad: VoidFunction;
    handleOnEnded: VoidFunction;
    rewindFiveSeconds: VoidFunction;
    forwardFiveSeconds: VoidFunction;
    getFirsEndPoint: string;
    currentTime: number | null;
    totalDuration:  number | null;
    volume: number|null;
    toggleVolume: VoidFunction;
    updateMediaVolume: (event: ChangeEvent<HTMLInputElement>) => void;
    updateCurrentTime:  (event: ChangeEvent<HTMLInputElement>) => void;
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
    const [showVideoController, setShowVideoController] = useState(true);
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

    const playBackVideoClass: CSSProperties = useMemo(
        () => {
            if(isPlaybackOpen){
                return {
                    height: '100vh',
                    width: '100%',
                    objectFit: 'contain',
                    backgroundColor: 'black',
                    borderRadius: 0
                }
            }
            return {}
        }, 
        [isPlaybackOpen]
    )
    
    const isVideoInFullScreen = useCallback(() =>{
        return (
          document.fullscreenElement === videoContainerRef.current
        );
    },[videoContainerRef.current])

      
    const toggleFullScreen: MouseEventHandler = useCallback((event) => {
        if(isPlaybackOpen && (event.target as HTMLElement).tagName === 'VIDEO'){
            if(isVideoInFullScreen()){
                document.exitFullscreen();
                videoContainerRef.current?.setAttribute('data-fullscreen', 'false')
            }else{
                videoContainerRef.current?.requestFullscreen()
                videoContainerRef.current?.setAttribute('data-fullscreen', 'true')
            }
        }
    }, [videoContainerRef.current, isVideoInFullScreen, isPlaybackOpen])

    const toggleVideoPlayBack = useCallback(() => {
        if(!isVideoInFullScreen()){
            dispatch(togglePlayBack())
        }
    }, [isPlaybackOpen, isVideoInFullScreen])

    const handleVideoController = () => {
        setShowVideoController(true);
        if(timeout.current){
            clearTimeout(timeout.current);
        }
        timeout.current = setTimeout(()=>{
            setShowVideoController(false);
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
                <div className="absolute w-full z-[100]">{isPlaybackOpen && showVideoController && <Header variant="snap"  onBackClickHandler = {toggleVideoPlayBack}/>}</div>
                <figure ref={videoContainerRef} onClick={handleMouseClick} onMouseMoveCapture={handleOnMouseMove} data-fullscreen="false" onDoubleClick={toggleFullScreen} >
                    <video 
                        style={playBackVideoClass}
                        controls={false}
                        onClick={!isPlaybackOpen ?  toggleVideoPlayBack: undefined}
                        className={"h-48 w-full object-cover rounded track-media-title-size"}
                        src={props.path} 
                        ref={props.videoRef}
                        preload="metadata"
                        onTimeUpdate={props.handleMediaTimeUpdate} onLoadedData ={props.onMediaLoad} 
                        onEnded={() => {
                            if(isVideoInFullScreen()){
                                dispatch(togglePlayBack())
                            }
                            props.handleOnEnded()
                        }}
                    />
                    {isPlaybackOpen && showVideoController && <div id="video-controls" className="controls absolute w-full bottom-0" data-state="hidden">
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
                            toggleVideoPlayBack={toggleVideoPlayBack}
                            isVideoInFullScreen={isVideoInFullScreen}
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