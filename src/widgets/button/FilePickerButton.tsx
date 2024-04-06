import React, { useId, useRef } from "react";
import { IconType } from "react-icons";

export interface IFilePickerButtonPopup{
    label: string;
    onFilesSlected:(files: FileList | null) => void;
    icon?: IconType;
    multiple?: boolean;
}

export default function FilePickerButton(props: IFilePickerButtonPopup){
    const fileInputId = useId();
    const inputRef = useRef<HTMLInputElement>(null);
   
    const handleFileChange =  (files: FileList | null) => {
        props.onFilesSlected(files);
        if(inputRef.current){
          inputRef.current.value = '';
        }
    };

    return <div>
              <label htmlFor={`fileInpit-${fileInputId}`} className="p-1 px-2 flex items-center hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer border-[1px] rounded-md border-slate-300">
                    {props.icon && <props.icon className="text-lg" />}
                    <div  className="text-sm rounded text-left ml-3">
                        <div>{props.label}</div>
                    </div>
                    
                </label>
                <input 
                    id={`fileInpit-${fileInputId}`}  
                    type="file" 
                    ref={inputRef}
                    multiple={props.multiple}
                    accept={'audio/*,video/*'} className="hidden"  
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files)} 
                />
            </div>
       
}