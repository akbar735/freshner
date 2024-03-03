import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import MediaPlayList, { type IAudioFile } from './pages/media_play_list/MediaPlayList';
import './App.css';
import AppDrawer from './widgets/drawer/AppDrawer';
import { Button, styled } from '@mui/material';
import { setPlayLists } from './slices/AudioSlice';
import { useAppDispatch, useAppSelector } from './hooks';

const VisuallyHiddenInput = styled('input')({
    clip: 'rect(0 0 0 0)',
    clipPath: 'inset(50%)',
    height: 1,
    overflow: 'hidden',
    position: 'absolute',
    bottom: 0,
    left: 0,
    whiteSpace: 'nowrap',
    width: 1,
});

const windowObj = window as typeof window & {
    electronAPI: { 
        getAllPlayList: () => string[],
        getAudioFilesPath: (arg0: string) => IAudioFile[]
    }
};

export default function App(){
    const [audioFilesPath, setAudioFilesPath] = useState<IAudioFile[]>([])
    const [selectedMedia, setSelectedMedia] = useState<FileList|null>(null)
    const dispatch = useAppDispatch();
    const playLists = useAppSelector(state => state.audio.playLists);
    const [playListName, setPlayListName] = useState<string>('');

    useEffect(() => {
        console.log('playLists:::', playLists)
    }, [playLists])
    const getAllPlayLists = async () => {
        const allPlayLists =  await windowObj.electronAPI.getAllPlayList();
        dispatch(setPlayLists(allPlayLists))
    }
    useEffect(() => {
        getAllPlayLists();
    }, [])

    useEffect(() => {
        if(selectedMedia){
            const formatted = Array.from(selectedMedia).map((file: any) => {
                return {
                    name: file.name,
                    src: file.path,
                }
            })
            setAudioFilesPath(formatted)
        }
    },[selectedMedia])
  
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        console.log("files:::", files)
        setSelectedMedia(files)
    }
    
    const getPlayList = async (playListPath: string|undefined, playListName: string) => {
        if(playListPath){
            const filePaths = await windowObj.electronAPI.getAudioFilesPath(playListPath);
            if(Array.isArray(filePaths) && filePaths.length){
                setPlayListName(playListName)
            }
            setAudioFilesPath(filePaths)
        }
    }
    return (
        <div className='container'>
           <AppDrawer listItems={playLists} onClickListItem={getPlayList}/>
           {audioFilesPath.length ===0 && <div className='open-area'>
                <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    style={{alignSelf: 'center'}}
                    size='small'
                    tabIndex={-1}
                >
                    Open Media
                    <VisuallyHiddenInput 
                        multiple 
                        type="file" 
                        accept="audio/*,video/*" 
                        onChange={handleFileChange}
                    />
                </Button>
           </div>}
            {audioFilesPath.length > 0 && 
                <MediaPlayList playListName = {playListName} audioFiles= {audioFilesPath} /> 
            }
        </div>
    )
}