import React, { useEffect, useState } from 'react';
import MediaPlayList, { type IAudioFile } from './pages/media_play_list/MediaPlayList';
import './App.css';

export interface IActiveBarTrack{
   [key: number]: boolean 
}
const windowObj = window as typeof window & {electronAPI: { getAudioFilesPath: Function}};
export default function App(){
    const [audioFilesPath, setAudioFilesPath] = useState<IAudioFile[]>([])
   
    useEffect(() => {
       getAudioFilesPath()
    },[])

    const getAudioFilesPath = async () => {
        let path = await windowObj.electronAPI.getAudioFilesPath()
        path = path.map((url: string) => ({src: url}))
        setAudioFilesPath(path)
    }
   
    
    return (
        <div className='container'>
           <MediaPlayList audioFiles= {audioFilesPath}/>
        </div>
    )
}