import React, { useCallback, useMemo, useState } from "react";
import FileOpenerPopOverBtn, { Orientation } from "../widgets/button/FileOpenerPopOverBtn";
import { MdArrowDropDown, MdFolder, MdFileOpen } from "react-icons/md";
import { getFileType, getLoadedFile, getSerializableFileDetail } from "../helper";
import AudioWrapper from "../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
import { addItemsToPlayList, setCurrenlyPlaying } from "../slices/MediaSclice";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "../hooks";
import { IFileDetail, MediaLocation } from "../types";


Home.displayName = 'Home';
export default function Home(){
    const dispatch = useAppDispatch();
    //const [files, setFiles] = useState<File[]>([]);
    const files = useAppSelector(state => state.media.home.playLists)
    const handleOnClick = () => {
        console.log('button clicked')
    }

    const updateLocalFileList = useCallback((fileArr: File[]) => {
       
        let fileDetailArr = fileArr.map((file) => {
            return {
                id: uuidv4(),
                file: getSerializableFileDetail(file)
            }
        })
        const filesTemp = [...fileDetailArr];

        dispatch(addItemsToPlayList({
            location: MediaLocation.HOME,
            media: filesTemp
        }))
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

    // const handleOpenFile = useCallback((selectedFiles: FileList | null) => {
    //     if(selectedFiles) updateLocalFileList(selectedFiles)
    // }, [updateLocalFileList])

    const allFileOpenOption = useMemo(() => [
        {
            label: 'Open Folder',
            onFilesSlected: handleFileSelection,
            icon: MdFolder,
            desc: "Open a folder containing Audio or Video Files",
            accpet: "audio/*,video/*",
            onlyFolder: true
        },
        {
            label: 'Open File',
            onFilesSlected: handleFileSelection,
            icon: MdFileOpen,
            desc: "Open an Audio or Video File",
            accpet: "audio/*,video/*",
            onlyFolder: false
        }
    ],[handleFileSelection])

    return (
        <div className="app-content-height overflow-auto w-full p-2">
            <div className="flex justify-end mb-2"> 
                <FileOpenerPopOverBtn 
                    label="OPEN MEDIA" 
                    onClick={handleOnClick}
                    icon={MdArrowDropDown}
                    iconOrientation={Orientation.RIGHT}
                    dropdownButtons={allFileOpenOption}
                />
            </div>
            <div className="media-container-height overflow-auto">
                <div className="grid media-wrppaer-width gap-4 ">
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