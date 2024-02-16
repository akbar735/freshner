import { createSlice } from '@reduxjs/toolkit'
import type { RootState } from '../store'
// Define a type for the slice state
interface CounterState {
    autoPlay: boolean
}

// Define the initial state using that type
const initialState: CounterState = {
  autoPlay: false,
}

export const audiSlice = createSlice({
  name: 'audio',
  // `createSlice` will infer the state type from the `initialState` argument
  initialState,
  reducers: {
    autoPlayToggled: (state) => {
      state.autoPlay = !state.autoPlay
    },
  },
})

export const { autoPlayToggled } = audiSlice.actions
export const selectAudio = (state: RootState) => state.audio
export default audiSlice.reducer