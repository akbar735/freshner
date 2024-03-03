import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
import { IListItems } from '../widgets/drawer/AppDrawer'
// Define a type for the slice state
interface AudioState {
    autoPlay: boolean,
    playListLoop: boolean,
    playLists: IListItems[]
}

// Define the initial state using that type
const initialState: AudioState = {
  autoPlay: false,
  playListLoop: false,
  playLists: []
}

export const audiSlice = createSlice({
  name: 'audio',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    autoPlayToggled: (state) => {
      if(!state.playListLoop) state.autoPlay = !state.autoPlay
    },
    loopPlayListToggled: (state) => {
      state.playListLoop = !state.playListLoop
      if(state.playListLoop){
        state.autoPlay = true
      }
    },
    setPlayLists: (state, action) => {
      console.log("state, action::", state, action)
      state.playLists = action.payload
    }
  },
})

export const { autoPlayToggled, setPlayLists, loopPlayListToggled } = audiSlice.actions
export const selectAudio = (state: RootState) => state.audio
export default audiSlice.reducer