import React from "react";

export interface IVideoWrapper{
    file: File
}

VideoWrapper.displayName = 'VideoWrapper';
export default function VideoWrapper(props: IVideoWrapper){
    return <div>VideoWrapper</div>
}