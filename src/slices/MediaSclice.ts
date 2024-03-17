import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IListItems } from '../widgets/drawer/AppDrawer'
import { IFileDetail } from '../types';
// Define a type for the slice state
interface MediaState {
    home: {
        autoPlay: boolean;
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    audioGallery: {
        autoPlay: boolean;
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    videoGallery: {
        autoPlay: boolean;
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    currentlyOnTrack: {
        location: string;
        media: IFileDetail | null;
        isPlaying: boolean;
    },
    [index: string]: any;
}

// Define the initial state using that type
const initialState: MediaState = {
    home: {
        autoPlay: false,
        playListLoop: false,
        playLists: []
    },
    audioGallery: {
        autoPlay: false,
        playListLoop: false,
        playLists: []
    },
    videoGallery: {
        autoPlay: false,
        playListLoop: false,
        playLists: []
    },
    currentlyOnTrack: {
        location: '',
        media: null,
        isPlaying: false
    }
}

export const mediaSlice = createSlice({
  name: 'media',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    initMediaState: (state, action) => {
      state[action.payload.location] = action.payload.data
    },
    tiggleAutoPlay: (state, action) => {
        state[action.payload.location].autoPlay = !state[action.payload.location].autoPlay
    },
    tigglePlayListLoop: (state, action) => {
        state[action.payload.location].playListLoop = !state[action.payload.location].playListLoop
    },
    addItemToPlayList : (state, action) => {
        const playList = [...state[action.payload.location].playLists]
        playList.push(action.payload.mediaPath)
        state[action.payload.location].playLists = playList
    },
    addItemsToPlayList : (state, action) => {
        let playList = [...state[action.payload.location].playLists]
        playList = [...playList, ...action.payload.media]
        const uniqPaths = Array.from(new Set([...playList.map(el => el?.file?.path), ...action.payload.media.map((el: IFileDetail) => el?.file?.path)]))
        const uniqePlayList = uniqPaths.map((path: string) => {
            return playList.find(el => el?.file?.path === path)
        })
        state[action.payload.location].playLists = uniqePlayList
    },
    removeItemFromPlayList : (state, action) => {
        const playList = [...state[action.payload.location].playLists]
        playList.splice(action.payload.itemIndex, 1);
        state[action.payload.location].playLists = playList
    },
    setCurrenlyPlaying: (state, action) => {
        state.currentlyOnTrack.media = action.payload.media
        state.currentlyOnTrack.location = action.payload.location,
        state.currentlyOnTrack.isPlaying = !!action.payload.isPlaying
    },
    setIsPlaying: (state, action) => {
        state.currentlyOnTrack.isPlaying = action.payload.isPlaying
    }
  },
})

export const { 
    initMediaState, 
    tiggleAutoPlay, 
    tigglePlayListLoop,
    addItemToPlayList,
    addItemsToPlayList,
    removeItemFromPlayList,
    setCurrenlyPlaying,
    setIsPlaying
} = mediaSlice.actions
export const selectAudio = (state: RootState) => state.audio
export default mediaSlice.reducer