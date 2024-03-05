import React from "react";
import './Footer.css'
import IconButton from "../IconButton/IconButton";
import { MdPlayCircleOutline, MdNavigateNext, MdNavigateBefore, MdForward5, MdReplay5 } from "react-icons/md";
Footer.displayName = 'Footer';
export default function Footer(){
    return (
        <div className='border-t border-slate-300 h-89'>
            <div className="flex mt-3" >
                <div className="ml-2 mr-2">00:00:00</div>
                <input className="brogress-bar" type="range" />
                <div className="ml-2 mr-2">00:00:00</div>
            </div>
            <div className="flex justify-between">
                <div>
               
                </div>
                <div className="flex">
                    <IconButton style = {{alignSelf: 'center'}} >
                        <MdReplay5 className="h-6 w-6" />
                    </IconButton>
                    <IconButton style = {{alignSelf: 'center'}}>
                        <MdNavigateBefore className="h-6 w-6" />
                    </IconButton>
                    <IconButton>
                        <MdPlayCircleOutline className="h-11 w-11 block" />
                    </IconButton>
                    <IconButton style = {{alignSelf: 'center'}}>
                        <MdNavigateNext className="h-6 w-6" />
                    </IconButton>
                    <IconButton style = {{alignSelf: 'center'}}>
                        <MdForward5 className="h-6 w-6" />
                    </IconButton>
                </div>
                <div>
                
                </div>
            </div>
        </div>
    )
}