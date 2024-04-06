import React, { useId, useRef } from "react";
import { IconType } from "react-icons";
import { windowObj } from "../../electrone-api";

export interface IFolderPickerButtonPopup{
    label: string;
    onFolderSlected:(arg0: string) => void;
    icon?: IconType;
}

export default function FolderPickerButton(props: IFolderPickerButtonPopup){
    const triggerFolderOpener = async () => {
        const path = await windowObj.electronAPI.getFolderPath()
        props.onFolderSlected(path)
    }

    return <div>
              <label className="p-1 px-2 flex items-center hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer border-[1px] rounded-md border-slate-300">
                    {props.icon && <props.icon className="text-lg" />}
                    <button onClick={triggerFolderOpener} className="text-sm rounded text-left ml-3">
                        <div>{props.label}</div>
                    </button>
                </label>
            </div>
       
}