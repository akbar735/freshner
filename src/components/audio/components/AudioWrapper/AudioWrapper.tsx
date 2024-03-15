import React, { useEffect, useState } from "react";
import { IMetaData } from "../../../../types";
import { MdPlayCircleOutline } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { MdMoreHoriz } from "react-icons/md";
const windowObj = window as typeof window & {
    electronAPI: { 
        getFileMetaData: (url: string) => IMetaData
    }
};


export interface IAudioWrapper{
    file: File & {path?: string}
}

AudioWrapper.displayName = 'AudioWrapper';
export default function AudioWrapper(props: IAudioWrapper){
    const [metaData, setMetaData] =  useState<IMetaData>()
    const getFileMetaData = async (file: File & {path?: string}) => {
        if(file.path){
            const metaData = await windowObj.electronAPI.getFileMetaData(file.path)
            setMetaData(metaData)
        }else{
            console.error('file path not found:')
        }
      
    }
    useEffect(() => {
        getFileMetaData(props.file)
    }, [props.file])

    console.log("metaData::", metaData)
    return (
        <div className="h-48 w-full rounded relative">
            <img
                alt={props.file.name}
                src={metaData?.picture?.base64Image}
                className={'h-48 w-full object-cover rounded'}
            />
            <div className="h-48 w-full rounded absolute bg-transparent z-1 top-0">
                <div className="media-tranparency text-ellipsis text-center text-sm">
                    <div className="ml-auto mr-auto text-center overflow-hidden text-ellipsis whitespace-nowrap media-title-width text-white" title={metaData?.title ? metaData?.title : props.file.name}>{metaData?.title ? metaData?.title : props.file.name}</div>
                </div>
                <div className="rounded media-controls-height w-full relative flex justify-center items-center text-transparent  hover:media-tranparency hover:text-white">
                    <MdPlayCircleOutline className="size-7 cursor-pointer" />
                    <MdDelete className="size-5 cursor-pointer block absolute bottom-2 left-2" />
                    <MdMoreHoriz className="size-5 cursor-pointer block absolute bottom-2 right-2" />
                </div>
            </div>
         </div>
    )
}