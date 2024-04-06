import React, { ChangeEvent, useCallback, useEffect, useRef, useState } from "react";
import { IOption } from "../../types";


export interface ISelect{
    name: string;
    options: IOption[];
    selectedValue: string;
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
        <div ref={containerRef} className="relative w-[200px] cursor-pointer">
            <div className={`className="cursor-pointer w-full" p-1 ${selectedValue ? ' dark:bg-slate-700 bg-slate-200': ''} text-slate-700 border ${itemsOpen ? ' dark:border-purple-100 border-purple-700' : 'border-slate-300'} dark:text-slate-200`} 
                onClick={toggleSelect}>{selectedValue ? selectedValue : 'Select'}
            </div>
            {itemsOpen  && <div className="absolute">
                <div className="hover:bg-slate-200 dark:hover:bg-slate-700 cursor-pointer w-[200px] h-[30px] border-x border-b border-purple-700 dark:border-purple-100" onClick={() => selectItem({label: '', value: ''})}></div>
                {options.map((option) => 
                <div 
                    onClick={() => selectItem(option)}
                    className={`
                      cursor-pointer w-[200px] p-1
                    hover:bg-slate-200 dark:hover:bg-slate-700
                    text-slate-700 border-x border-b
                    border-purple-700 dark:border-purple-100
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