import React from "react";
import { IFileDetail } from "../../../../types";

export interface IUnsupportedWrapper{
   
}

UnsupportedWrapper.displayName = 'UnsupportedWrapper';
export default function UnsupportedWrapper(props: IUnsupportedWrapper){
    return <div>Unsupported File</div>
}