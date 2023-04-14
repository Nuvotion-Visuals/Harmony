import { RootState } from 'redux-tk/store';
import { createSelector } from 'reselect';

export const select_query = createSelector(
  (state: RootState) => state.language.query,
  (query) => query
);

export const select_isListening = createSelector(
  (state: RootState) => state.language.isListening,
  (isListening) => isListening
);

export const select_isSpeaking = createSelector(
  (state: RootState) => state.language.isSpeaking,
  (isSpeaking) => isSpeaking
);

export const select_currentlySpeaking = createSelector(
  (state: RootState) => state.language.currentlySpeaking,
  (currentlySpeaking) => currentlySpeaking
);

export const select_currentlySpeakingMessageGuid = createSelector(
  (state: RootState) => state.language.currentlySpeakingMessageGuid,
  (currentlySpeakingMessageGuid) => currentlySpeakingMessageGuid
);