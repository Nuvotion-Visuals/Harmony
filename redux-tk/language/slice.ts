import { createSlice } from '@reduxjs/toolkit'
type Guid = string

export const slice = createSlice({
  name: 'language',
  initialState: <{
    query: string,
    isListening: boolean,
    isSpeaking: boolean,
    currentlySpeaking: string | null,
    currentlySpeakingMessageGuid: Guid | null,
  }>{
    query: '',
    isListening: false,
    isSpeaking: false,
    currentlySpeaking: null,
    currentlySpeakingMessageGuid: null,
  },
  reducers: {
    set_query: (state, action: { payload: string }) => {
      state.query = action.payload
    },
    set_isListening: (state, action: { payload: boolean }) => {
      state.isListening = action.payload
    },
    set_isSpeaking: (state, action: { payload: boolean }) => {
      state.isSpeaking = action.payload
    },
    set_currentlySpeaking: (state, action: { payload: string | null }) => {
      state.currentlySpeaking = action.payload
    },
    set_currentlySpeakingMessageGuid: (state, action: { payload: Guid | null }) => {
      state.currentlySpeakingMessageGuid = action.payload
    }
  },
  
})