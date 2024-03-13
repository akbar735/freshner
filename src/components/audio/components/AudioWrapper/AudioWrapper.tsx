import React, { useEffect, useState } from "react";
import { IMetaData } from "../../../../types";


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
            console.log("metaData:::", metaData)
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
        <div>
            <img
                alt={props.file.name}
                src={metaData?.picture?.base64Image}
                className={'w-48 h-40 object-cover'}
            />
        </div>
    )
}