import { createSlice } from '@reduxjs/toolkit'
import { ConversationsByGuid, Message, MessagesByGuid, Guid } from './types'

export const slice = createSlice({
  name: 'lexi',
  initialState: <{
    query: string,
    searchQuery: string,
    conversationsByGuid: ConversationsByGuid,
    conversationGuids: string[],
    activeConversationGuid: Guid | null,
    messagesByGuid: MessagesByGuid,
    messageGuids: string[],
    isListening: boolean,
    isSpeaking: boolean,
    currentlySpeaking: string | null,
    currentlySpeakingMessageGuid: Guid | null,
    userInitialedListening: boolean,
    readyToSendTranscriptionMessage: boolean
    disableTranscriptionTimer: boolean,
    urlToFetch: string | null
  }>{
    query: '',
    searchQuery: '',
    conversationsByGuid: {

    },
    conversationGuids: [],
    activeConversationGuid: null,
    messagesByGuid: {

    },
    messageGuids: [],
    isListening: false,
    isSpeaking: false,
    currentlySpeaking: null,
    currentlySpeakingMessageGuid: null,
    userInitialedListening: false,
    readyToSendTranscriptionMessage: false,
    disableTranscriptionTimer: false,
    urlToFetch: null
  },
  reducers: {
    sendMessage: (state, action: { payload: Message }) => {
      const { guid, query, queryTime } = action.payload
      state.messageGuids.push(guid)
      state.messagesByGuid = {
        ...state.messagesByGuid,
        [guid]: {
          ...state.messagesByGuid[guid],
          query,
          queryTime,
        }
      }

      state.query = ''
    },
    onPartialResponse: (state, action: { payload: Message }) => {
      const { guid, response, responseTime } = action.payload
      state.messagesByGuid = {
        ...state.messagesByGuid,
        [guid]: {
          ...state.messagesByGuid[guid],
          response,
          responseTime,
          loading: true
        }
      }
    },
    onResponse: (state, action: { payload: Message }) => {
      const { guid, response, responseTime } = action.payload
      state.messagesByGuid = {
        ...state.messagesByGuid,
        [guid]: {
          ...state.messagesByGuid[guid],
          response,
          responseTime,
          loading: false
        }
      }
    },
    set_query: (state, action: { payload: string }) => {
      state.query = action.payload
    },
    set_searchQuery: (state, action: { payload: string }) => {
      state.searchQuery = action.payload
    },
    set_conversationsByGuid: (state, action: { payload: ConversationsByGuid }) => {
      state.conversationsByGuid = action.payload
    },
    set_conversationGuids: (state, action: { payload: Guid[] }) => {
      state.conversationGuids = action.payload
    },
    set_activeConversationGuid: (state, action: { payload: Guid | null }) => {
      state.activeConversationGuid = action.payload
    },
    set_messagesByGuid: (state, action: { payload: MessagesByGuid }) => {
      state.messagesByGuid = action.payload
    },
    set_messageGuids: (state, action: { payload: Guid[] }) => {
      state.messageGuids = action.payload
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
    },
    set_userInitialedListening: (state, action: { payload: boolean }) => {
      state.userInitialedListening = action.payload
    },
    set_readyToSendTranscriptionMessage: (state, action: { payload: boolean }) => {
      state.readyToSendTranscriptionMessage = action.payload
    },
    set_disableTranscriptionTimer: (state, action: { payload: boolean }) => {
      state.disableTranscriptionTimer = action.payload
    },
    set_urlToFetch: (state, action: { payload: string | null }) => {
      state.urlToFetch = action.payload
    }
  
  },
  
})