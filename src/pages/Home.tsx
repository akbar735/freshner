import React, { useCallback, useMemo, useState } from "react";
import FileOpenerPopOverBtn, { Orientation } from "../widgets/button/FileOpenerPopOverBtn";
import { MdArrowDropDown } from "react-icons/md";
import { MdFolder } from "react-icons/md";
import { MdFileOpen } from "react-icons/md";
import { getFileType } from "../helper";
import AudioWrapper from "../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
Home.displayName = 'Home';
export default function Home(){
    const [files, setFiles] = useState<File[]>([]);
    const handleOnClick = () => {
        console.log('button clicked')
    }

    const updateLocalFileList = useCallback((selectedFiles: FileList) => {
        const fileArr = Array.from(selectedFiles)
        const filesTemp = [...files, ...fileArr];
        setFiles(filesTemp);
    }, [files, setFiles]);

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
                    {files.map((file: File) => {
                        if(getFileType(file.type) === 'audio'){
                            return <AudioWrapper file = {file}/>
                        }else if(getFileType(file.type) === 'video'){
                            return <VideoWrapper file = {file} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
            
        </div>
    )
}