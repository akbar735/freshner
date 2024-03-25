import React from "react";
import IconButton from "../IconButton/IconButton";
import { MdForward5, MdNavigateBefore, MdNavigateNext, MdPauseCircleOutline, MdPlayCircleOutline, MdReplay5 } from "react-icons/md";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { setIsPlaying } from "../../slices/MediaSclice";

export interface IControllers{
    buttonVariant?: string
}
export default function Controllers(props: IControllers){

    const isPlaying =  useAppSelector(state => state.media.currentlyOnTrack.isPlaying);
    const file =  useAppSelector(state => state.media.currentlyOnTrack.media?.file);
    const dispatch = useAppDispatch();
    
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
    
    return <div className="flex">
        <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant} >
            <MdReplay5 className="h-6 w-6" />
        </IconButton>
        <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant}>
            <MdNavigateBefore className="h-6 w-6" />
        </IconButton>
            <IconButton variant={props.buttonVariant}>
                {!isPlaying ? <MdPlayCircleOutline onClick={playMedia} className="h-11 w-11 block" />:
                    <MdPauseCircleOutline onClick={pauseMedia} className="h-11 w-11 block" />}
            </IconButton>
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant}>
                <MdNavigateNext className="h-6 w-6" />
            </IconButton>
            <IconButton style = {{alignSelf: 'center'}} variant={props.buttonVariant}>
                <MdForward5 className="h-6 w-6" />
            </IconButton>
    </div>
}