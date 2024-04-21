import React, { useCallback, useEffect, useRef, useState } from "react";
import { IOption } from "../../types";


export interface ISelect{
    name: string;
    options: IOption[];
    selectedValue: string;
    label?: string;
    onChange: (arg: IOption) => void;
}
export default function Select({name,options, selectedValue, onChange, ...props}: ISelect){
    const [itemsOpen, setItemsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    const toggleSelect = useCallback(() => {
        setItemsOpen(!itemsOpen);
    }, [itemsOpen])

    const selectItem = (option: IOption) => {
        onChange(option);
        setItemsOpen(false);
    }

    const handleClickAway = (event: MouseEvent) => {
        if(containerRef.current && !containerRef.current.contains(event.target as Node)){
            setItemsOpen(false);
        }
        
    }
    
    useEffect(() => {
        // Attach the event listener when the component mounts
        document.addEventListener('mousedown', handleClickAway);
    
        // Clean up the event listener when the component unmounts
        return () => {
          document.removeEventListener('mousedown', handleClickAway);
        };
      }, []);

    return (
        <div ref={containerRef} className="relative w-[200px] cursor-pointer text-[14px]">
            <div className={`className= hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer w-full rounded-md  px-2 py-[3px] border ${itemsOpen ? ' dark:border-purple-100 border-slate-300' : 'border-slate-300'}`} 
                onClick={toggleSelect}>{selectedValue ? selectedValue : props.label ? props.label: 'Select'}
            </div>
            {itemsOpen  && <div className=" bg-slate-100 dark:bg-slate-900 absolute shadow-lg shadow-slate-500/50 z-50">
                <div className="hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer w-[200px] h-[30px] border-b border-slate-300 dark:border-purple-100" onClick={() => selectItem({label: '', value: ''})}></div>
                {options.map((option) => 
                <div 
                    onClick={() => selectItem(option)}
                    className={`
                      cursor-pointer w-[200px] px-2 py-[3px]
                    hover:bg-slate-200 dark:hover:bg-slate-700
                    text-slate-700 border-b
                    border-slate-300 dark:border-purple-100
                    ${selectedValue === option.label ? ' dark:bg-slate-700 bg-slate-200': ''}
                    dark:text-slate-200 dark:bg-black`}
                    >
                    {option.label}
                </div>
                )
            }
            </div>}
            
        </div>
    );
}