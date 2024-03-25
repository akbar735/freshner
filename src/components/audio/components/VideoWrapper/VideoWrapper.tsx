import React, { useCallback, useState } from "react";
import { IFileDetail, IFileType, IMetaData } from "../../../../types";
import { MdDelete, MdMoreHoriz, MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md";
import { setCurrenlyPlaying, setIsPlaying } from "../../../../slices/MediaSclice";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

export interface IVideoWrapper{
    fileDetail: IFileDetail,
    location: string;
}

VideoWrapper.displayName = 'VideoWrapper';
export default function VideoWrapper(props: IVideoWrapper){

    const dispatch = useAppDispatch()
    const onTrackMedia = useAppSelector(state => state.media.currentlyOnTrack)
    const [metaData, setMetaData] =  useState<IMetaData>()
   

    const startPlaying = useCallback(() => {
        if(onTrackMedia.media?.id === props.fileDetail.id){
            dispatch(setIsPlaying({
                isPlaying: true
            }))
        }else{
            dispatch(setCurrenlyPlaying({
                media: props.fileDetail,
                location: props.location,
                isPlaying: true
            }))
        }
       
    }, [props.fileDetail, props.location, onTrackMedia])

    const pasePlaying = () => {
        dispatch(setIsPlaying({
            isPlaying: false
        }))
    }
    const isPlaying = useCallback(() => {
        if(onTrackMedia.media?.id === props.fileDetail.id){
            return onTrackMedia.isPlaying
        }
        return false
        
    }, [onTrackMedia, props.fileDetail])
    
    return (
        <div className="h-48 w-full rounded relative">
        <video
            src={props.fileDetail.file.path}
            className={'h-48 w-full object-cover rounded'}
        />
        <div className="h-48 w-full rounded absolute bg-transparent z-1 top-0">
            <div className="media-tranparency rounded-t-md text-ellipsis text-center text-sm">
                <div 
                    className="ml-auto mr-auto text-center overflow-hidden text-ellipsis whitespace-nowrap media-title-width text-white" 
                    title={metaData?.title ? metaData?.title : props.fileDetail.file.name}
                >
                    <div style={isPlaying() ? {animation: 'marquee 10s linear infinite'}: {}}>
                        {metaData?.title ? metaData?.title : props.fileDetail.file.name}
                    </div>
                </div>
            </div>
            <div className="rounded-b-md media-controls-height w-full relative flex justify-center items-center text-transparent hover:media-tranparency hover:text-white">
                {!isPlaying() ? <MdPlayCircleOutline onClick={startPlaying} className="size-7 cursor-pointer" />:
                <MdPauseCircleOutline onClick={pasePlaying} className="size-7 cursor-pointer" />}
                <MdDelete className="size-5 cursor-pointer block absolute bottom-2 left-2" />
                <MdMoreHoriz className="size-5 cursor-pointer block absolute bottom-2 right-2" />
            </div>
        </div>
    </div>
    )
}