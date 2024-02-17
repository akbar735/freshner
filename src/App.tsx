import React, { useEffect, useState } from 'react';
import MediaPlayList, { type IAudioFile } from './pages/media_play_list/MediaPlayList';
import './App.css';

const windowObj = window as typeof window & {electronAPI: { getAudioFilesPath: Function}};
export default function App(){
    const [audioFilesPath, setAudioFilesPath] = useState<IAudioFile[]>([])
   
    useEffect(() => {
       getAudioFilesPath()
    },[])

    const getAudioFilesPath = async () => {
        let fileDetails = await windowObj.electronAPI.getAudioFilesPath()
        setAudioFilesPath(fileDetails)
    }
   
    
    return (
        <div className='container'>
           <MediaPlayList audioFiles= {audioFilesPath}/>
        </div>
    )
}