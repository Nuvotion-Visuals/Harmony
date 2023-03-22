import type { RootState } from 'redux-tk/store'
export const select_query = (state: RootState) : typeof state.lexi.query => state.lexi.query
export const select_searchQuery = (state: RootState ): typeof state.lexi.searchQuery => state.lexi.searchQuery
export const select_conversationsByGuid = (state: RootState) : typeof state.lexi.conversationsByGuid => state.lexi.conversationsByGuid
export const select_conversationGuids = (state: RootState) : typeof state.lexi.conversationGuids => state.lexi.conversationGuids
export const select_activeConversationGuid = (state: RootState ) : typeof state.lexi.activeConversationGuid => state.lexi.activeConversationGuid
export const select_messagesByGuid = (state: RootState) : typeof state.lexi.messagesByGuid => state.lexi.messagesByGuid
export const select_messageGuids = (state: RootState) : typeof state.lexi.messageGuids => state.lexi.messageGuids
export const select_isListening = (state: RootState) : typeof state.lexi.isListening => state.lexi.isListening
export const select_isSpeaking = (state: RootState) : typeof state.lexi.isSpeaking => state.lexi.isSpeaking
export const select_currentlySpeaking = (state: RootState) : typeof state.lexi.currentlySpeaking => state.lexi.currentlySpeaking
export const select_currentlySpeakingMessageGuid = (state: RootState) : typeof state.lexi.currentlySpeakingMessageGuid => state.lexi.currentlySpeakingMessageGuid
export const select_userInitialedListening = (state: RootState) : typeof state.lexi.userInitialedListening => state.lexi.userInitialedListening
export const select_readyToSendTranscriptionMessage = (state: RootState) : typeof state.lexi.readyToSendTranscriptionMessage => state.lexi.readyToSendTranscriptionMessage
export const select_disableTranscriptionTimer = (state: RootState) : typeof state.lexi.disableTranscriptionTimer => state.lexi.disableTranscriptionTimer
export const select_urlToFetch = (state: RootState) : typeof state.lexi.urlToFetch => state.lexi.urlToFetch
export const select_activeSwipeIndex = (state: RootState) => state.layout.activeSwipeIndex