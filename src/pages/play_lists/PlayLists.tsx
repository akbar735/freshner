import React, { ChangeEvent, useEffect, useState } from "react";
import { windowObj } from "../../electrone-api";
import Select from "../../widgets/select/Select";
import { IOption, IPlayListDetail } from "../../types";

PlayLists.displayName = 'PlayLists';
export default function PlayLists(){
    const [playList, setPlaists] = useState<IOption[]>([]);
    const [selectedPlayList, setSelectedPlaylist] = useState('top-ten');
    const onPlayListChange = (option: IOption) => {
        setSelectedPlaylist(option.label);
    }
    const loadPlayList = async () => {
        const playLists = await windowObj.electronAPI.getAllPlayList()
        console.log('playLists:', playLists)
        setPlaists(playLists.map((item => ({
            value: item.name,
            label: item.name
        }))))
    }
    useEffect(() => {
        loadPlayList()
    }, [])
    return (
        <div className="app-content-height overflow-auto w-full p-2">
            <div className="flex justify-end mb-2"> 
                <Select name={"playlistOptions"} 
                    options={playList} 
                    selectedValue={selectedPlayList} 
                    onChange={onPlayListChange} 
                />
            </div>
            <div className="media-container-height overflow-auto">
                <div className="grid media-wrppaer-width gap-4">
                  
                </div>
            </div>
        </div>
    )
}