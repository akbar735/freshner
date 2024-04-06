import React, { useCallback, useEffect } from "react";
import { MdOutlineFileOpen } from "react-icons/md";
import { getFileType, getLoadedFile, getRecentlyPlayed, getSerializableFileDetail } from "../helper";
import AudioWrapper from "../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
import { addItemsToPlayList, initMediaState, setCurrenlyPlaying } from "../slices/MediaSclice";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "../hooks";
import { IFileDetail, IFileType, MediaLocation } from "../types";
import FilePickerButton from "../widgets/button/FilePickerButton";


Home.displayName = 'Home';
export default function Home(){
    const dispatch = useAppDispatch();
    const files = useAppSelector(state => state.media.home.playLists)
 
    const updateLocalFileList = useCallback((fileArr: File[]) => {
       
        let fileDetailArr = fileArr.map((file:  File & {path?: string, lastModifiedDate?: string}) => {
            return {
                id: file.path,
                file: getSerializableFileDetail(file as unknown as IFileType)
            }
        })
        const filesTemp = [...fileDetailArr];

        if(filesTemp.length === 1){
            dispatch(setCurrenlyPlaying({
                media: filesTemp[0],
                location: MediaLocation.HOME,
                isPlaying: true,
                isPlaybackOpen:true
            }))
        }
    }, []);

    const handleFileSelection = useCallback((selectedFiles: FileList | null) => {
        if(selectedFiles) {
            let fileArr = Array.from(selectedFiles)
            if(fileArr.length === 1){
                const loadedFile = getLoadedFile(fileArr[0], files)
                if(loadedFile){
                    dispatch(setCurrenlyPlaying({
                        media: loadedFile,
                        location: MediaLocation.HOME,
                        isPlaying: true,
                        isPlaybackOpen:true
                    }))
                }else{
                    updateLocalFileList(fileArr)
                }
            }else{
                updateLocalFileList(fileArr)
            }
           
        }
    }, [updateLocalFileList, files]);

    useEffect(() => {
        const recentlyPlayed = getRecentlyPlayed()
            if(recentlyPlayed){
                dispatch(initMediaState({
                    location: MediaLocation.HOME,
                    data: {
                        autoPlay: false,
                        playListLoop: false,
                        playLists: recentlyPlayed
                    }
                }))
            }
    },[])
    return (
        <div className="app-content-height overflow-auto w-full p-2">
            <div className="flex justify-end mb-2"> 
                <FilePickerButton 
                    label="Open Media" 
                    onFilesSlected={handleFileSelection} 
                    icon = {MdOutlineFileOpen}        
                />
            </div>
            
            <div className="media-container-height overflow-auto">
                <div className="text-slate-600 dark:text-slate-300 ml-2 text-sm">Recently Played</div>
                <div className="flex flex-wrap">
                    {files.map((fileDetail: IFileDetail) => {
                        if(getFileType(fileDetail.file.type) === 'audio'){
                            return <AudioWrapper fileDetail = {fileDetail} location = {MediaLocation.HOME} />
                        }else if(getFileType(fileDetail.file.type) === 'video'){
                            return <VideoWrapper fileDetail = {fileDetail} location = {MediaLocation.HOME} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}