import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IFileDetail, MediaLocation } from '../types';
// Define a type for the slice state
interface MediaState {
    home: {
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    audioGallery: {
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    videoGallery: {
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    playList: {
        playListLoop: boolean;
        playLists: IFileDetail[];
    },
    currentlyOnTrack: {
        location: MediaLocation;
        media: IFileDetail | null;
        isPlaying: boolean;
        isPlaybackOpen: boolean;
        loop: boolean;
    },
    [index: string]: any;
}

// Define the initial state using that type
const initialState: MediaState = {
    home: {
        playListLoop: false,
        playLists: []
    },
    audioGallery: {
        playListLoop: false,
        playLists: []
    },
    videoGallery: {
        playListLoop: false,
        playLists: []
    },
    playList: {
        playListLoop: false,
        playLists: []
    },
    currentlyOnTrack: {
        location: MediaLocation.HOME,
        media: null,
        isPlaying: false,
        isPlaybackOpen: false,
        loop: false,
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
    togglePlayListLoop: (state, action) => {
        state[action.payload.location].playListLoop = !state[action.payload.location].playListLoop
    },
    toggleLoop : (state) => {
        state.currentlyOnTrack.loop = !state.currentlyOnTrack.loop
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
        state.currentlyOnTrack.location = action.payload.location
        state.currentlyOnTrack.isPlaying = !!action.payload.isPlaying
        state.currentlyOnTrack.isPlaybackOpen = !!action.payload.isPlaybackOpen
    },
    setIsPlaying: (state, action) => {
        state.currentlyOnTrack.isPlaying = action.payload.isPlaying
    },
    togglePlayBack: (state) => {
        state.currentlyOnTrack.isPlaybackOpen = !state.currentlyOnTrack.isPlaybackOpen
    }
  },
})

export const { 
    initMediaState, 
    togglePlayListLoop,
    toggleLoop,
    addItemToPlayList,
    addItemsToPlayList,
    removeItemFromPlayList,
    setCurrenlyPlaying,
    setIsPlaying,
    togglePlayBack
} = mediaSlice.actions
export const selectMeida = (state: RootState) => state.media
export default mediaSlice.reducer