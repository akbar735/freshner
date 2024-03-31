import React, { useId, useRef } from "react";
import { IconType } from "react-icons";

export interface IFilePickerButtonPopup{
    label: string;
    onFolderSlected:(arg0: string) => void;
    icon?: IconType;
    desc: string;
    accpet: string;
    onlyFolder?: boolean
}
const windowObj = window as typeof window & {
    electronAPI: { 
        getFolderPath: () => string
    }
};

export default function FilePickerButton(props: IFilePickerButtonPopup){
   
    const triggerFolderOpener = async () => {
        const path = await windowObj.electronAPI.getFolderPath()
        props.onFolderSlected(path)
    }

    return <div>
              <label className="p-1 px-2 flex items-center hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer border-[1px] rounded-md border-slate-300">
                    {props.icon && <props.icon className="text-lg" />}
                    <button onClick={triggerFolderOpener} className="text-sm rounded text-left ml-3">
                        <div>{props.label}</div>
                        <p className="text-xsm text-slate-700 dark:text-slate-400">{props.desc}</p>
                    </button>
                </label>
            </div>
       
}