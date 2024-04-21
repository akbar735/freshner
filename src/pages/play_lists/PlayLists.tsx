import React, { ChangeEvent, useEffect, useState } from "react";
import { windowObj } from "../../electrone-api";
import Select from "../../widgets/select/Select";
import { IFileDetail, IOption, IPlayListDetail, MediaLocation } from "../../types";
import FilePickerButton from "../../widgets/button/FilePickerButton";
import { MdAddCircleOutline } from "react-icons/md";
import AudioWrapper from "../../components/audio/components/AudioWrapper/AudioWrapper";
import VideoWrapper from "../../components/audio/components/VideoWrapper/VideoWrapper";
import UnsupportedWrapper from "../../components/audio/components/UnsupportedWrapper/UnsupportedWrapper";
import { getFileType, getSerializableFileDetail } from "../../helper";
import { useAppDispatch, useAppSelector } from "../../hooks";
import { addItemsToPlayList, initMediaState } from "../../slices/MediaSclice";

PlayLists.displayName = 'PlayLists';
export default function PlayLists(){
    const loadedFiles = useAppSelector(state => state.media[MediaLocation.PLAYLIST].playLists)
    const [playList, setPlaists] = useState<IOption[]>([]);
    const [selectedPlayList, setSelectedPlaylist] = useState('');
    const dispatch = useAppDispatch();
    const onPlayListChange = (option: IOption) => {
        setSelectedPlaylist(option.label);
    }
    const loadPlayList = async () => {
        const playLists = await windowObj.electronAPI.getAllPlayList()
        setPlaists(playLists.map((item => ({
            value: item.name,
            label: item.name
        }))))
        setSelectedPlaylist(playLists[0].name)
    }
    const handleFileSelection = (selectedFiles: FileList | null) => {
        console.log('selectedFiles::', selectedFiles);
    }   
    const getAllAlbums = async (selectedPlayList: string) => {
        const files = await windowObj.electronAPI.getAllFiles(selectedPlayList)
        console.log('files:', files)
        let fileDetailArr = files.map((file) => {
            return {
                id: file.path,
                file: getSerializableFileDetail(file)
            }
        })
        
        dispatch(initMediaState({
            location: MediaLocation.PLAYLIST,
            data: {
                playListLoop: false,
                playLists: fileDetailArr
            }
        }))
    }
    useEffect(() => {
        if(selectedPlayList){
            getAllAlbums(selectedPlayList)
        }else{
            dispatch(initMediaState({
                location: MediaLocation.PLAYLIST,
                data: {
                    playListLoop: false,
                    playLists: []
                }
            }))
        }
    }, [selectedPlayList])
    useEffect(() => {
        loadPlayList()
    }, [])
    return (
        <div className="app-content-height overflow-auto w-full p-1">
            <div className="flex justify-end mb-2"> 
                {selectedPlayList && <FilePickerButton 
                    label="Open Media" 
                    onFilesSlected={handleFileSelection} 
                    multiple
                    icon = {MdAddCircleOutline}        
                />}
                <div className="ml-3">
                    <Select name={"playlistOptions"} 
                        options={playList} 
                        selectedValue={selectedPlayList} 
                        onChange={onPlayListChange} 
                        label="Select Album"
                    />
                </div>
                
            </div>
            <div className="media-container-height overflow-auto">
                <div className="">
                    {loadedFiles.map((fileDetail: IFileDetail) => {
                        if(getFileType(fileDetail.file.type) === 'audio'){
                            return <AudioWrapper  fileDetail = {fileDetail} location = {MediaLocation.PLAYLIST} />
                        }else if(getFileType(fileDetail.file.type) === 'video'){
                            return <VideoWrapper  fileDetail = {fileDetail} location = {MediaLocation.PLAYLIST} />
                        }else{
                            return <UnsupportedWrapper />
                        }
                    })}
                </div>
            </div>
        </div>
    )
}