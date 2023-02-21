import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { isEqual } from 'lodash'
import type { RootState } from 'redux-tk/store'

import * as selectors from './selectors'

import { slice } from './slice'
import { Message } from './types'

export const useLexi = () => {
  const dispatch = useDispatch()

  return {
    // selectors
    activeSwipeIndex: useSelector(selectors.select_activeSwipeIndex, isEqual),
    query: useSelector(selectors.select_query, isEqual),
    searchQuery: useSelector(selectors.select_searchQuery, isEqual),
    conversationsByGuid: useSelector(selectors.select_conversationsByGuid, isEqual),
    conversationGuids: useSelector(selectors.select_conversationGuids, isEqual),
    activeConversationGuid: useSelector(selectors.select_activeConversationGuid, isEqual),
    messagesByGuid: useSelector(selectors.select_messagesByGuid, isEqual),
    messageGuids: useSelector(selectors.select_messageGuids, isEqual),
    isListening: useSelector(selectors.select_isListening, isEqual),
    isSpeaking: useSelector(selectors.select_isSpeaking, isEqual),
    currentlySpeaking: useSelector(selectors.select_currentlySpeaking, isEqual),
    currentlySpeakingMessageGuid: useSelector(selectors.select_currentlySpeakingMessageGuid, isEqual),
    userInitialedListening: useSelector(selectors.select_userInitialedListening, isEqual),
    readyToSendTranscriptionMessage: useSelector(selectors.select_readyToSendTranscriptionMessage, isEqual),
    disableTranscriptionTimer: useSelector(selectors.select_disableTranscriptionTimer, isEqual),
    urlToFetch: useSelector(selectors.select_urlToFetch, isEqual),

    // actions

    onResponse: useCallback((payload: Message) => {
      dispatch(slice.actions.onResponse(payload))
    }, [dispatch]),

    onPartialResponse: useCallback((payload: Message) => {
      dispatch(slice.actions.onPartialResponse(payload))
    }, [dispatch]),

    sendMessage: useCallback((payload: Message) => {
      dispatch(slice.actions.sendMessage(payload))
    }, [dispatch]),

    updateMessage: useCallback((payload: Message) => {
      dispatch(slice.actions.updateMessage(payload))
    }, [dispatch]),

    set_query: useCallback((payload: RootState['lexi']['query']) => {
      dispatch(slice.actions.set_query(payload))
    }, [dispatch]),
  
    set_searchQuery: useCallback((payload: RootState['lexi']['searchQuery']) => {
      dispatch(slice.actions.set_searchQuery(payload))
    }, [dispatch]),
  
    set_conversationsByGuid: useCallback((payload: RootState['lexi']['conversationsByGuid']) => {
      dispatch(slice.actions.set_conversationsByGuid(payload))
    }, [dispatch]),
  
    set_conversationGuids: useCallback((payload: RootState['lexi']['conversationGuids']) => {
      dispatch(slice.actions.set_conversationGuids(payload))
    }, [dispatch]),
  
    set_activeConversationGuid: useCallback((payload: RootState['lexi']['activeConversationGuid']) => {
      dispatch(slice.actions.set_activeConversationGuid(payload))
    }, [dispatch]),
  
    set_messagesByGuid: useCallback((payload: RootState['lexi']['messagesByGuid']) => {
      dispatch(slice.actions.set_messagesByGuid(payload))
    }, [dispatch]),
  
    set_messageGuids: useCallback((payload: RootState['lexi']['messageGuids']) => {
      dispatch(slice.actions.set_messageGuids(payload))
    }, [dispatch]),
  
    set_isListening: useCallback((payload: RootState['lexi']['isListening']) => {
      dispatch(slice.actions.set_isListening(payload))
    }, [dispatch]),
  
    set_isSpeaking: useCallback((payload: RootState['lexi']['isSpeaking']) => {
      dispatch(slice.actions.set_isSpeaking(payload))
    }, [dispatch]),
  
    set_currentlySpeaking: useCallback((payload: RootState['lexi']['currentlySpeaking']) => {
      dispatch(slice.actions.set_currentlySpeaking(payload))
    }, [dispatch]),
  
    set_currentlySpeakingMessageGuid: useCallback((payload: RootState['lexi']['currentlySpeakingMessageGuid']) => {
      dispatch(slice.actions.set_currentlySpeakingMessageGuid(payload))
    }, [dispatch]),
  
    set_userInitialedListening: useCallback((payload: RootState['lexi']['userInitialedListening']) => {
      dispatch(slice.actions.set_userInitialedListening(payload))
    }, [dispatch]),
  
    set_readyToSendTranscriptionMessage: useCallback((payload: RootState['lexi']['readyToSendTranscriptionMessage']) => {
      dispatch(slice.actions.set_readyToSendTranscriptionMessage(payload))
    }, [dispatch]),
  
    set_disableTranscriptionTimer: useCallback((payload: RootState['lexi']['disableTranscriptionTimer']) => {
      dispatch(slice.actions.set_disableTranscriptionTimer(payload))
    }, [dispatch]),
  
    set_urlToFetch: useCallback((payload: RootState['lexi']['urlToFetch']) => {
      dispatch(slice.actions.set_urlToFetch(payload))
    }, [dispatch])
  }
}