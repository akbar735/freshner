import React, { useCallback, useState } from "react";
import { IFileDetail, IFileType, IMetaData } from "../../../../types";
import { MdDelete, MdMoreHoriz, MdPauseCircleOutline, MdPlayCircleOutline } from "react-icons/md";
import { setCurrenlyPlaying, setIsPlaying } from "../../../../slices/MediaSclice";
import { useAppDispatch, useAppSelector } from "../../../../hooks";

export interface IVideoWrapper{
    fileDetail: IFileDetail,
    location: string;
    galaryView?: boolean;
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
        <>
            {!props.galaryView ? 
            <div className="bg-slate-300 dark:bg-slate-800 w-36 h-44 m-2 rounded relative">
                 <video
                    src={props.fileDetail.file.path}
                    className={'h-36 w-full object-cover'}
                />
                <div className="flex flex-col justify-center h-8 mx-1">
                    <div 
                        className="overflow-hidden text-ellipsis whitespace-nowrap text-xs text-slate-700 dark:text-slate-100" 
                        title={metaData?.title ? metaData?.title : props.fileDetail.file.name}>
                        <div 
                            style={isPlaying() ? {animation: 'marquee 10s linear infinite'}: {}}
                        > 
                            {metaData?.title ? metaData?.title : props.fileDetail.file.name}
                        </div>
                    </div>
                </div>
                <div className="absolute bottom-[28px] flex w-full justify-between text-white mr-1 media-tranparency my-1">
                    {!isPlaying() ? <MdPlayCircleOutline onClick={startPlaying} className="size-5 cursor-pointer mr-1 my-1" />:
                        <MdPauseCircleOutline onClick={pasePlaying} className="size-5 cursor-pointer mr-1 my-1" />}
                        <MdMoreHoriz className="size-5 cursor-pointer mr-1" />
                </div>
            </div>
            : <div className="h-48 w-full rounded relative">
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
        </div>}
    </>)
}