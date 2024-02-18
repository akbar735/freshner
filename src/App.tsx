import React, { ChangeEvent, useEffect, useRef, useState } from 'react';
import MediaPlayList, { type IAudioFile } from './pages/media_play_list/MediaPlayList';
import './App.css';
import AppDrawer from './widgets/drawer/AppDrawer';
import { Button, styled } from '@mui/material';

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

const windowObj = window as typeof window & {electronAPI: { getAudioFilesPath: Function}};
export default function App(){
    const [audioFilesPath, setAudioFilesPath] = useState<IAudioFile[]>([])
    const [selectedMedia, setSelectedMedia] = useState<FileList|null>(null)

    // useEffect(() => {
    //    getAudioFilesPath()
    // },[])

    useEffect(() => {
        if(selectedMedia){
            const formatted = Array.from(selectedMedia).map((file: File) => {
                return {
                    name: file.name,
                    src: URL.createObjectURL(file)
                }
            })
            setAudioFilesPath(formatted)
        }
      
    },[selectedMedia])
    const getAudioFilesPath = async () => {
        let fileDetails = await windowObj.electronAPI.getAudioFilesPath()
        setAudioFilesPath(fileDetails)
    }
    const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files
        console.log("files:::", files)
        setSelectedMedia(files)
    }
   
    return (
        <div className='container'>
           <AppDrawer />
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
                <MediaPlayList audioFiles= {audioFilesPath} selectedMedia={selectedMedia}/> 
            }
        </div>
    )
}