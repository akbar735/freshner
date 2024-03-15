import React, { MouseEventHandler, RefObject, useCallback, useEffect, useId, useRef, useState } from "react";
import { IconType } from "react-icons";

export enum Orientation {
  LEFT = 0,
  RIGHT = 1,
}

export interface IDescriptiveButton {
  label: string;
  onFilesSlected:(arg0: FileList | null) => void;
  icon?: IconType;
  desc: string;
  accpet: string;
  onlyFolder?: boolean
}

export interface IButton {
  label: string;
  onClick: VoidFunction;
  icon?: IconType;
  iconOrientation?: Orientation;
  dropdownButtons?: IDescriptiveButton[];
}

export default function Button(props: IButton) {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const popOver = useRef<HTMLDivElement>(null);
  const mainBtn = useRef<HTMLButtonElement>(null);
  const fileInputId = useId();
  const handleClickAway = (event: MouseEvent) => {
    if (mainBtn.current && !mainBtn.current.contains(event.target as Node)) {
      if (popOver.current && !popOver.current.contains(event.target as Node)) {
        // Clicked outside the component, trigger onClose
        setIsPopoverOpen(false);
      }
    }
  };

  useEffect(() => {
    // Attach the event listener when the component mounts
    document.addEventListener('mousedown', handleClickAway);

    // Clean up the event listener when the component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickAway);
    };
  }, []);

  const handleOnBtnClick: MouseEventHandler<HTMLButtonElement> = useCallback(() => {
    setIsPopoverOpen(!isPopoverOpen);
    props.onClick();
  }, [isPopoverOpen]);

  const handleFileChange =  (files: FileList | null, onFilesSlected: (arg0: FileList | null) => void) => {
    setIsPopoverOpen(false);
    onFilesSlected(files)
  };

  return (
    <button ref={mainBtn} className="border border-slate-300 p-1 text-sm rounded flex align-middle relative" onClick={handleOnBtnClick}>
      {props.iconOrientation === Orientation.LEFT && props.icon && <props.icon className="text-lg" />}
      {props.label}
      {props.iconOrientation === Orientation.RIGHT && props.icon && <props.icon className="text-lg" />}
      {(
        <div ref={popOver} className={`z-50 absolute shadow-lg bg-slate-100 dark:bg-gray-950 shadow-slate-500/50 dark:text-white top-9 right-0 w-max ${!isPopoverOpen ? 'hidden': ''}`}>
          {props.dropdownButtons?.map((btn, index) => (
            <>
              <label htmlFor={`fileInpit-${index}-${fileInputId}`} key={btn.label} className="p-2 flex items-center hover:bg-slate-200 dark:hover:bg-slate-800 cursor-pointer">
                    {btn.icon && <btn.icon className="text-lg" />}
                    <div className="text-sm rounded text-left ml-3">
                        <div>{btn.label}</div>
                        <p className="text-xsm text-slate-700 dark:text-slate-400">{btn.desc}</p>
                    </div>
                </label>
                {btn.onlyFolder ? <input 
                  id={`fileInpit-${index}-${fileInputId}`}  
                  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
                  // @ts-ignore
                  webkitdirectory = {"true"}
                  type="file" 
                  multiple
                  accept={btn.accpet} className="hidden"  
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files, btn.onFilesSlected)} 
                 />: 
                 <input 
                  id={`fileInpit-${index}-${fileInputId}`}  
                  type="file" 
                  multiple
                  accept={btn.accpet} className="hidden"  
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => handleFileChange(e.target.files, btn.onFilesSlected)} 
                 />}
            </>
            
          ))}
        </div>
      )}
    </button>
  );
}
