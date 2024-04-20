import React from "react";
import IconButton from "../IconButton/IconButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MdMaximize, MdMinimize } from "react-icons/md";
import { useNavigate } from "react-router-dom";
import { windowObj } from "../../electrone-api";

Header.displayName = 'Header';
export interface IHeader{
    variant?: string;
    onBackClickHandler?: VoidFunction;
}
export default function Header(props: IHeader){
    const navigate = useNavigate();
    const miniMizeWindow = () => {
        windowObj.electronAPI.minimizeWindow();
    }

    const maxiMizeWindow = () => {
        windowObj.electronAPI.maximizeWindow()
    }

    const closeWindow = () => {
        windowObj.electronAPI.closeWindow()
    }  
    const className = `${props.variant === 'snap' ? 'flex justify-between media-tranparency p-1.5' :
        'bg-slate-200 p-1.5 dark:bg-black flex justify-between border-b border-slate-300'}`
    //console.log("navigate", navigate('../')); 

    return (
        <div className={className}>
            <div className="flex items-center" >
                <IconButton onCLick={props.onBackClickHandler ? props.onBackClickHandler : () =>  navigate("..", { relative: "path" })} variant={props.variant}>
                    <ArrowLeftIcon className="h-5 w-5"/>
                </IconButton>
            </div>
            <div id="app-header" className="size-full h-auto"></div>
            <div className="flex items-center">
                <IconButton onCLick={miniMizeWindow} variant={props.variant}>
                    <MdMinimize className="h-5 w-5"/>
                </IconButton>  
                <IconButton onCLick={maxiMizeWindow} variant={props.variant}>
                    <MdMaximize className="h-5 w-5"/>
                </IconButton>  
                <IconButton onCLick={closeWindow} variant={props.variant ? props.variant : 'close'}>
                    <XMarkIcon className="h-5 w-5"/>
                </IconButton>  
            </div>
        </div>
    )
}