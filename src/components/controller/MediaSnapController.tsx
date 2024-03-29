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
import { useAppDispatch, useAppSelector } from "../../hooks";
import { IMetaData } from "../../types";
import { setIsPlaying } from "../../slices/MediaSclice";
import Controllers from "./Controllers";


export interface IMediaSnapController{
    getFirsEndPoint: string;
    currentTime:  number | null;
    totalDuration:  number | null;
    updateCurrentTime:  (event: ChangeEvent<HTMLInputElement>) => void;
    metaData: IMetaData | undefined;
    getLastEndPoint: string;
    toggleVideoPlayBack: VoidFunction;
    isVideoInFullScreen: () => boolean
}
MediaSnapController.displayName = 'MediaSnapController';
export default function MediaSnapController(props: IMediaSnapController){
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    
    return (
        <div className='h-89 media-tranparency'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2 text-white">{props.getFirsEndPoint}</div>
                <input 
                    className="brogress-bar brogress-bar-snap" 
                    type="range" 
                    value={props.currentTime || 0}
                    min={0}
                    step={0.1}
                    max={props.totalDuration || 0}
                    onChange={props.updateCurrentTime}
                />
                <div className="ml-2 mr-2 text-white">{props.getLastEndPoint}</div>
            </div>
            <div className="flex justify-center">
                <div className={`min-w-[120px] w-full ml-2 flex items-center ${!props.isVideoInFullScreen() ? 'cursor-pointer': 'cursor-default'}`}>   
                    <div 
                        onClick={props.toggleVideoPlayBack}
                        className="text-white max-w-[420px] ml-2 mr-2 overflow-hidden text-ellipsis whitespace-nowrap media-title-width" 
                        title={props.metaData?.title ? props.metaData?.title : file?.name}>{props.metaData?.title ? props.metaData?.title : file?.name}
                    </div>
                </div>
                <div className="flex justify-center">
                    <Controllers buttonVariant="snap" />
                </div>
                <div className="w-full">   
                    
                </div>
            </div>
        </div>
    )
}