import React, { useCallback, useEffect } from "react";
import { MdFolderOpen } from "react-icons/md";
import { v4 as uuidv4 } from 'uuid';
import { IFileDetail, IFileType, MediaLocation, MediaMime, MediaType, PathKey } from "../../../../types";
import { useAppDispatch, useAppSelector } from "../../../../hooks";
import { getFileType, getLoadedFile, getLocalStorageValue, getSerializableFileDetail, updateLocalStorage } from "../../../../helper";
import { addItemsToPlayList, initMediaState } from "../../../../slices/MediaSclice";
import FilePickerButton from "../../../../widgets/button/FolderPickerButton";
import AudioWrapper from "../AudioWrapper/AudioWrapper";
import UnsupportedWrapper from "../UnsupportedWrapper/UnsupportedWrapper";
import VideoWrapper from "../VideoWrapper/VideoWrapper";
import { windowObj } from "../../../../electrone-api";



export interface IMediaGallery{
    pathKey: PathKey;
    mediaMime: MediaMime;
    mediaLocation: MediaLocation;
    mediaType: MediaType;
}
MediaGallery.displayName = 'MediaGallery';
export default function MediaGallery(props: IMediaGallery){
    const dispatch = useAppDispatch();
    const loadedFiles = useAppSelector(state => state.media[props.mediaLocation].playLists)
    
    const loadMediaFiles = useCallback(async () => {
        const paths= getLocalStorageValue(props.pathKey)
        const files = await windowObj.electronAPI.getFiles(paths, props.mediaType)
        let fileDetailArr = files.map((file) => {
            return {
                id: file.path,
                file: getSerializableFileDetail(file)
            }
        })
        if(loadedFiles.length === 0){
            dispatch(initMediaState({
                location: props.mediaLocation,
                data: {
                    playListLoop: true,
                    playLists: fileDetailArr
                }
            }))
        }else{
            const unloadedMedia = fileDetailArr.filter(fileD => {
                if(fileD.file.path === getLoadedFile(fileD.file as unknown as File & {path?: string}, loadedFiles)?.file.path){
                    return false
                }
                return true
            })
            dispatch(addItemsToPlayList({
                media: unloadedMedia,
                location: props.mediaLocation,
            }))
        }
        
    }, [loadedFiles])

    const onFolderSlected = useCallback((foldePath: string) => {
        if(foldePath) {
            updateLocalStorage(props.pathKey, foldePath)
            loadMediaFiles()
        }
    }, []);

    useEffect(() => {
        loadMediaFiles()
    },[])

    return (
        <div className="app-content-height overflow-auto w-full p-2">
            <div className="flex justify-end mb-2"> 
                <FilePickerButton 
                    label="Add Folder" 
                    onFolderSlected={onFolderSlected} 
                    icon = {MdFolderOpen}          
                />
            </div>
            <div className="media-container-height overflow-auto">
                <div className="grid media-wrppaer-width gap-4">
                  {loadedFiles.map((fileDetail: IFileDetail) => {
                        if(getFileType(fileDetail.file.type) === 'audio'){
                            return <AudioWrapper galaryView fileDetail = {fileDetail} location = {props.mediaLocation} />
                        }else if(getFileType(fileDetail.file.type) === 'video'){
                            return <VideoWrapper galaryView fileDetail = {fileDetail} location = {props.mediaLocation} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}