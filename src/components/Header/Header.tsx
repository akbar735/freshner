import React from "react";
import IconButton from "../IconButton/IconButton";
import { ArrowLeftIcon } from "@heroicons/react/24/outline"
import { XMarkIcon } from "@heroicons/react/24/outline";
import { MdMaximize, MdMinimize } from "react-icons/md";

const windowObj = window as typeof window & {
    electronAPI: { 
        closeWindow: VoidFunction,
        minimizeWindow: VoidFunction,
        maximizeWindow: VoidFunction,
    }
};

Header.displayName = 'Header';
export default function Header(){

    const miniMizeWindow = () => {
        windowObj.electronAPI.minimizeWindow();
    }

    const maxiMizeWindow = () => {
        windowObj.electronAPI.maximizeWindow()
    }

    const closeWindow = () => {
        windowObj.electronAPI.closeWindow()
    }

    return (
        <div className="bg-slate-200 p-1.5 dark:bg-black flex justify-between">
            <div className="flex items-center">
                <IconButton>
                    <ArrowLeftIcon className="h-5 w-5"/>
                </IconButton>
            </div>
            <div id="app-header" className="size-full h-auto"> fdgdfgs</div>
            <div className="flex items-center">
                <IconButton onCLick={miniMizeWindow}>
                    <MdMinimize className="h-5 w-5"/>
                </IconButton>  
                <IconButton onCLick={maxiMizeWindow}>
                    <MdMaximize className="h-5 w-5"/>
                </IconButton>  
                <IconButton onCLick={closeWindow} variant="close">
                    <XMarkIcon className="h-5 w-5"/>
                </IconButton>  
            </div>
        </div>
    )
}