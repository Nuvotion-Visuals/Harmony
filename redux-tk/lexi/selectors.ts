import { RootState } from 'redux-tk/store';
import { createSelector } from 'reselect';

export const select_query = createSelector(
  (state: RootState) => state.lexi.query,
  (query) => query
);

export const select_searchQuery = createSelector(
  (state: RootState) => state.lexi.searchQuery,
  (searchQuery) => searchQuery
);

export const select_conversationsByGuid = createSelector(
  (state: RootState) => state.lexi.conversationsByGuid,
  (conversationsByGuid) => conversationsByGuid
);

export const select_conversationGuids = createSelector(
  (state: RootState) => state.lexi.conversationGuids,
  (conversationGuids) => conversationGuids
);

export const select_activeConversationGuid = createSelector(
  (state: RootState) => state.lexi.activeConversationGuid,
  (activeConversationGuid) => activeConversationGuid
);

export const select_messagesByGuid = createSelector(
  (state: RootState) => state.lexi.messagesByGuid,
  (messagesByGuid) => messagesByGuid
);

export const select_messageGuids = createSelector(
  (state: RootState) => state.lexi.messageGuids,
  (messageGuids) => messageGuids
);

export const select_isListening = createSelector(
  (state: RootState) => state.lexi.isListening,
  (isListening) => isListening
);

export const select_isSpeaking = createSelector(
  (state: RootState) => state.lexi.isSpeaking,
  (isSpeaking) => isSpeaking
);

export const select_currentlySpeaking = createSelector(
  (state: RootState) => state.lexi.currentlySpeaking,
  (currentlySpeaking) => currentlySpeaking
);

export const select_currentlySpeakingMessageGuid = createSelector(
  (state: RootState) => state.lexi.currentlySpeakingMessageGuid,
  (currentlySpeakingMessageGuid) => currentlySpeakingMessageGuid
);

export const select_userInitialedListening = createSelector(
  (state: RootState) => state.lexi.userInitialedListening,
  (userInitialedListening) => userInitialedListening
);

export const select_readyToSendTranscriptionMessage = createSelector(
  (state: RootState) => state.lexi.readyToSendTranscriptionMessage,
  (readyToSendTranscriptionMessage) => readyToSendTranscriptionMessage
);

export const select_disableTranscriptionTimer = createSelector(
  (state: RootState) => state.lexi.disableTranscriptionTimer,
  (disableTranscriptionTimer) => disableTranscriptionTimer
);

export const select_urlToFetch = createSelector(
  (state: RootState) => state.lexi.urlToFetch,
  (urlToFetch) => urlToFetch
);

export const select_activeSwipeIndex = createSelector(
  (state: RootState) => state.layout.activeSwipeIndex,
  (activeSwipeIndex) => activeSwipeIndex
);
