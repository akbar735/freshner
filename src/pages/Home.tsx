import React, { useCallback, useMemo, useState } from "react";
import FileOpenerPopOverBtn, { Orientation } from "../widgets/button/FileOpenerPopOverBtn";
import { MdArrowDropDown, MdFolder, MdFileOpen } from "react-icons/md";
import { getFileType, getSerializableFileDetail } from "../helper";
import AudioWrapper from "../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
import { addItemsToPlayList } from "../slices/MediaSclice";
import { v4 as uuidv4 } from 'uuid';
import { useAppDispatch, useAppSelector } from "../hooks";
import { IFileDetail } from "../types";


Home.displayName = 'Home';
export default function Home(){
    const dispatch = useAppDispatch();
    //const [files, setFiles] = useState<File[]>([]);
    const files = useAppSelector(state => state.media.home.playLists)
    const handleOnClick = () => {
        console.log('button clicked')
    }

    const updateLocalFileList = useCallback((selectedFiles: FileList) => {
        let fileArr = Array.from(selectedFiles)
        let fileDetailArr = fileArr.map((file) => {
            return {
                id: uuidv4(),
                file: getSerializableFileDetail(file)
            }
        })
        const filesTemp = [...fileDetailArr];

        dispatch(addItemsToPlayList({
            location: 'home',
            media: filesTemp
        }))
    }, []);

    const handleOpenFolder = useCallback((selectedFiles: FileList | null) => {
        if(selectedFiles) updateLocalFileList(selectedFiles)
    }, [updateLocalFileList]);

    const handleOpenFile = useCallback((selectedFiles: FileList | null) => {
        if(selectedFiles) updateLocalFileList(selectedFiles)
    }, [updateLocalFileList])

    const allFileOpenOption = useMemo(() => [
        {
            label: 'Open Folder',
            onFilesSlected: handleOpenFolder,
            icon: MdFolder,
            desc: "Open a folder containing Audio or Video Files",
            accpet: "audio/*,video/*",
            onlyFolder: true
        },
        {
            label: 'Open File',
            onFilesSlected: handleOpenFile,
            icon: MdFileOpen,
            desc: "Open an Audio or Video File",
            accpet: "audio/*,video/*",
            onlyFolder: false
        }
    ],[handleOpenFile, handleOpenFolder])

    console.log("files:::", files)
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
                            return <AudioWrapper fileDetail = {fileDetail} location = {'home'} />
                        }else if(getFileType(fileDetail.file.type) === 'video'){
                            return <VideoWrapper fileDetail = {fileDetail} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}