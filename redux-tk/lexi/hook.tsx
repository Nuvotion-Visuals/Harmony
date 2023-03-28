import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isEqual } from 'lodash';
import type { RootState } from 'redux-tk/store';
import * as selectors from './selectors';
import { slice } from './slice';
import { Message } from './types';

export const useLexi_activeSwipeIndex = () => {
  return useSelector(selectors.select_activeSwipeIndex, isEqual);
};

export const useLexi_query = () => {
  return useSelector(selectors.select_query, isEqual);
};

export const useLexi_searchQuery = () => {
  return useSelector(selectors.select_searchQuery, isEqual);
};

export const useLexi_conversationsByGuid = () => {
  return useSelector(selectors.select_conversationsByGuid, isEqual);
};

export const useLexi_conversationGuids = () => {
  return useSelector(selectors.select_conversationGuids, isEqual);
};

export const useLexi_activeConversationGuid = () => {
  return useSelector(selectors.select_activeConversationGuid, isEqual);
};

export const useLexi_messagesByGuid = () => {
  return useSelector(selectors.select_messagesByGuid, isEqual);
};

export const useLexi_messageGuids = () => {
  return useSelector(selectors.select_messageGuids, isEqual);
};

export const useLexi_isListening = () => {
  return useSelector(selectors.select_isListening, isEqual);
};

export const useLexi_isSpeaking = () => {
  return useSelector(selectors.select_isSpeaking, isEqual);
};

export const useLexi_currentlySpeaking = () => {
  return useSelector(selectors.select_currentlySpeaking, isEqual);
};

export const useLexi_currentlySpeakingMessageGuid = () => {
  return useSelector(selectors.select_currentlySpeakingMessageGuid, isEqual);
};

export const useLexi_userInitialedListening = () => {
  return useSelector(selectors.select_userInitialedListening, isEqual);
};

export const useLexi_readyToSendTranscriptionMessage = () => {
  return useSelector(selectors.select_readyToSendTranscriptionMessage, isEqual);
};

export const useLexi_disableTranscriptionTimer = () => {
  return useSelector(selectors.select_disableTranscriptionTimer, isEqual);
};

export const useLexi_urlToFetch = () => {
  return useSelector(selectors.select_urlToFetch, isEqual);
};

export const useLexi_onResponse = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Message) => {
    dispatch(slice.actions.onResponse(payload));
  }, [dispatch]);
};

export const useLexi_onPartialResponse = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Message) => {
    dispatch(slice.actions.onPartialResponse(payload));
  }, [dispatch]);
};

export const useLexi_sendMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Message) => {
    dispatch(slice.actions.sendMessage(payload));
  }, [dispatch]);
};

export const useLexi_updateMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Message) => {
    dispatch(slice.actions.updateMessage(payload));
  }, [dispatch]);
};

export const useLexi_setQuery = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['query']) => {
    dispatch(slice.actions.set_query(payload));
  }, [dispatch]);
};

export const useLexi_setSearchQuery = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['searchQuery']) => {
    dispatch(slice.actions.set_searchQuery(payload));
  }, [dispatch]);
};

export const useLexi_setConversationsByGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['conversationsByGuid']) => {
  dispatch(slice.actions.set_conversationsByGuid(payload));
  }, [dispatch]);
};
  
  export const useLexi_setConversationGuids = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['conversationGuids']) => {
  dispatch(slice.actions.set_conversationGuids(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setActiveConversationGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['activeConversationGuid']) => {
  dispatch(slice.actions.set_activeConversationGuid(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setMessagesByGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['messagesByGuid']) => {
  dispatch(slice.actions.set_messagesByGuid(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setMessageGuids = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['messageGuids']) => {
  dispatch(slice.actions.set_messageGuids(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setIsListening = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['isListening']) => {
  dispatch(slice.actions.set_isListening(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setIsSpeaking = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['isSpeaking']) => {
  dispatch(slice.actions.set_isSpeaking(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setCurrentlySpeaking = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['currentlySpeaking']) => {
  dispatch(slice.actions.set_currentlySpeaking(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setCurrentlySpeakingMessageGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['currentlySpeakingMessageGuid']) => {
  dispatch(slice.actions.set_currentlySpeakingMessageGuid(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setUserInitialedListening = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['userInitialedListening']) => {
  dispatch(slice.actions.set_userInitialedListening(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setReadyToSendTranscriptionMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['readyToSendTranscriptionMessage']) => {
  dispatch(slice.actions.set_readyToSendTranscriptionMessage(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setDisableTranscriptionTimer = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['disableTranscriptionTimer']) => {
  dispatch(slice.actions.set_disableTranscriptionTimer(payload));
  }, [dispatch]);
  };
  
  export const useLexi_setUrlToFetch = () => {
  const dispatch = useDispatch();
  return useCallback((payload: RootState['lexi']['urlToFetch']) => {
  dispatch(slice.actions.set_urlToFetch(payload));
  }, [dispatch]);
  };
