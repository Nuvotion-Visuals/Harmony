import { createSlice } from '@reduxjs/toolkit'

export const slice = createSlice({
  name: 'layout',
  initialState: <{
    activeSwipeIndex: number
  }>{
    activeSwipeIndex: 0
  },
  reducers: {
    setActiveSwipeIndex: (state, action: { payload: number }) => {
      state.activeSwipeIndex = action.payload
    },
    incrementActiveSwipeIndex: (state) => {
      state.activeSwipeIndex = state.activeSwipeIndex + 1
    },
    deccrementActiveSwipeIndex: (state) => {
      state.activeSwipeIndex = state.activeSwipeIndex - 1
    }
  }
})