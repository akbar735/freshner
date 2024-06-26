import React, { CSSProperties, ChangeEvent, MouseEventHandler, RefObject, useCallback, useMemo, useRef, useState } from "react";
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
    const [showVideoController, setShowVideoController] = useState(true);
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

    const playBackVideoClass: CSSProperties = useMemo(
        () => {
            if(isPlayBackOpen){
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
        [isPlayBackOpen]
    )
    
    const isVideoInFullScreen = useCallback(() =>{
        return (
          document.fullscreenElement === videoContainerRef.current
        );
    },[videoContainerRef.current])

      
    const toggleFullScreen = useCallback(() => {
        if(isPlayBackOpen){
            if(isVideoInFullScreen()){
                document.exitFullscreen();
                videoContainerRef.current?.setAttribute('data-fullscreen', 'false')
            }else{
                videoContainerRef.current?.requestFullscreen()
                videoContainerRef.current?.setAttribute('data-fullscreen', 'true')
            }
        }
    }, [videoContainerRef.current, isVideoInFullScreen, isPlayBackOpen])

    const toggleVideoPlayBack = useCallback(() => {
        if(!isVideoInFullScreen()){
            dispatch(togglePlayBack())
        }
    }, [isPlayBackOpen, isVideoInFullScreen])

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
   
    return (
        <div style={playBackContainerStyle}>
            <div className="relative cursor-default min-w-[80px]" onClick={(e) => e.stopPropagation()}>
                <div className="absolute w-full z-[100]">{isPlayBackOpen && showVideoController && <Header variant="snap"  onBackClickHandler = {toggleVideoPlayBack}/>}</div>
                <figure ref={videoContainerRef} onMouseMoveCapture={handleOnMouseMove} data-fullscreen="false" onDoubleClick={toggleFullScreen} >
                    <video 
                        style={playBackVideoClass}
                        controls={false}
                        onClick={!isPlayBackOpen ?  toggleVideoPlayBack: undefined}
                        className={"h-48 w-full object-cover rounded track-media-title-size"}
                        src={props.path} 
                        ref={props.videoRef}
                        preload="metadata"
                        onTimeUpdate={props.handleMediaTimeUpdate} onLoadedData ={props.onMediaLoad} 
                        onEnded={props.handleOnEnded}
                    />
                    {isPlayBackOpen && showVideoController && <div id="video-controls" className="controls absolute w-full bottom-0" data-state="hidden">
                        <MediaSnapController 
                            getFirsEndPoint={props.getFirsEndPoint} 
                            currentTime={props.currentTime} 
                            totalDuration={props.totalDuration} 
                            updateCurrentTime={props.updateCurrentTime} 
                            metaData={props.metaData} 
                            getLastEndPoint={props.getLastEndPoint} 
                            toggleVideoPlayBack = {toggleVideoPlayBack}
                            isVideoInFullScreen = {isVideoInFullScreen}
                        />
		            </div>}
                </figure>
            </div>
        </div>
    )
}