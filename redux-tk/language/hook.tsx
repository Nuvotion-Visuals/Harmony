import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isEqual } from 'lodash';
import type { RootState } from 'redux-tk/store';
import * as selectors from './selectors';
import { slice } from './slice';

export const useLanguage_query = () => {
  return useSelector(selectors.select_query, isEqual);
};

export const useLanguage_isListening = () => {
  return useSelector(selectors.select_isListening, isEqual);
};

export const useLanguage_isSpeaking = () => {
  return useSelector(selectors.select_isSpeaking, isEqual);
};

export const useLanguage_currentlySpeaking = () => {
  return useSelector(selectors.select_currentlySpeaking, isEqual);
};

export const useLanguage_currentlySpeakingMessageGuid = () => {
  return useSelector(selectors.select_currentlySpeakingMessageGuid, isEqual);
};

export const useLanguage_setQuery = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['language']['query']) => {
    dispatch(slice.actions.set_query(payload));
  }, [dispatch]);
};
  export const useLanguage_setIsListening = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['language']['isListening']) => {
  dispatch(slice.actions.set_isListening(payload));
  }, [dispatch]);
  };
  
  export const useLanguage_setIsSpeaking = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['language']['isSpeaking']) => {
  dispatch(slice.actions.set_isSpeaking(payload));
  }, [dispatch]);
  };
  
  export const useLanguage_setCurrentlySpeaking = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['language']['currentlySpeaking']) => {
  dispatch(slice.actions.set_currentlySpeaking(payload));
  }, [dispatch]);
  };
  
  export const useLanguage_setCurrentlySpeakingMessageGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['language']['currentlySpeakingMessageGuid']) => {
  dispatch(slice.actions.set_currentlySpeakingMessageGuid(payload));
  }, [dispatch]);
  };
  