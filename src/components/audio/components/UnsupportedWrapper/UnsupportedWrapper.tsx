import React from "react";

export interface IUnsupportedWrapper{

}

UnsupportedWrapper.displayName = 'UnsupportedWrapper';
export default function UnsupportedWrapper(props: IUnsupportedWrapper){
    return <div>Unsupported File</div>
}