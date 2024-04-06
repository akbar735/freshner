import React, { useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import SideBar from "./components/SideBar/SideBar";
import { useAppSelector, useAppDispatch } from "./hooks";
import { ICurrentlyPlaying, MediaLocation, PathKey } from "./types";
import { getLocalStorageValue, getRecentlyPlayed, updateRecentlyPlayed } from "./helper";
import { addItemsToPlayList, initMediaState } from "./slices/MediaSclice";

export default function Layout(){
    const currentlyOnTrack = useAppSelector(state => state.media.currentlyOnTrack)
    const dispatch = useAppDispatch();
    
    useEffect(() => {
        if(currentlyOnTrack.isPlaying){
            updateRecentlyPlayed(PathKey.RECENTLY_PLAYED, {
                time: new Date().getTime(),
                fileDetail: currentlyOnTrack
            })
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
        }
    }, [currentlyOnTrack.media?.id])
    return (
        <div>
            <Header />
            <div className='flex'>
                <SideBar />
                <Outlet />
            </div>
            <Footer />
        </div>
    )
}