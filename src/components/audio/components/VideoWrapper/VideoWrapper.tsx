import React from "react";
import { IFileDetail } from "../../../../types";

export interface IVideoWrapper{
    fileDetail: IFileDetail
}

VideoWrapper.displayName = 'VideoWrapper';
export default function VideoWrapper(props: IVideoWrapper){
    return <div>VideoWrapper</div>
}