import { useDispatch, useSelector, shallowEqual } from 'react-redux';
import { useCallback } from 'react';
import * as selectors from './selectors';
import { slice } from './slice';
import type { Guid, Space, Group, Channel, Asset, Thread, Message, MessagesByGuid, ThreadsByGuid } from './types';

interface Channelz {
  name: string;
  description: string;
}

interface Groupz {
  name: string;
  description: string;
  channels: Channelz[];
}

interface Suggested {
  groups: Groupz[];
}

// Spaces
export const useSpaces_activeSpaceStats = () => useSelector(selectors.select_activeSpaceStats);
export const useSpaces_activeSpace = () => useSelector(selectors.select_activeSpace);
export const useSpaces_spaceGuids = () => useSelector(selectors.select_spaceGuids);
export const useSpaces_spacesByGuid = () => useSelector(selectors.select_spacesByGuid);
export const useSpaces_activeSpaceIndex = () => useSelector(selectors.select_activeSpaceIndex);
export const useSpaces_activeSpaceGuid = () => useSelector(selectors.select_activeSpaceGuid);
export const useSpaces_spacesInfo = () => useSelector(selectors.select_spacesInfo);
export const useSpaces_activeThreadName = () => useSelector(selectors.select_activeThreadName);
export const useSpaces_addSpaceIncludingGroups = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { space: Space; guid: Guid; suggested: Suggested }) => {
    dispatch(slice.actions.addSpaceIncludingGroups(payload));
  }, [dispatch]);
};
export const useSpaces_setActiveSpaceGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveSpaceGuid(payload));
  }, [dispatch]);
};
export const useSpaces_setActiveSpaceIndex = () => {
  const dispatch = useDispatch()
  return useCallback((index: number) => {
    dispatch(slice.actions.setActiveSpaceIndex(index))
  }, [dispatch])
}
export const useSpaces_addSpace = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; space: Space }) => {
    dispatch(slice.actions.addSpace(payload));
  }, [dispatch]);
};
export const useSpaces_removeSpace = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeSpace(payload));
  }, [dispatch]);
};
export const useSpaces_updateSpace = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; space: Space }) => {
    dispatch(slice.actions.updateSpace(payload));
  }, [dispatch]);
};

// Groups
export const useSpaces_activeGroup = () => useSelector(selectors.select_activeGroup);
export const useSpaces_activeGroupGuid = () => useSelector(selectors.select_activeGroupGuid);
export const useSpaces_groupsByGuid = () => useSelector(selectors.select_groupsByGuid);
export const useSpaces_setActiveGroupGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveGroupGuid(payload));
  }, [dispatch]);
};
export const useSpaces_addGroup = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; group: Group }) => {
    dispatch(slice.actions.addGroup(payload));
  }, [dispatch]);
};
export const useSpaces_removeGroup = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeGroup(payload));
  }, [dispatch]);
};
export const useSpaces_updateGroup = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; group: Group }) => {
    dispatch(slice.actions.updateGroup(payload));
  }, [dispatch]);
};
export const useSpaces_addGroupToSpace = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
    dispatch(slice.actions.addGroupToSpace(payload));
  }, [dispatch]);
};
export const useSpaces_removeGroupFromSpace = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
    dispatch(slice.actions.removeGroupFromSpace(payload));
  }, [dispatch]);
};

// Channels
export const useSpaces_activeChannel = () => useSelector(selectors.select_activeChannel);
export const useSpaces_activeChannelGuid = () => useSelector(selectors.select_activeChannelGuid);
export const useSpaces_channelsByGuid = () => useSelector(selectors.select_channelsByGuid);
export const useSpaces_setActiveChannelGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveChannelGuid(payload));
  }, [dispatch]);
};
export const useSpaces_addChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; channel: Channel }) => {
    dispatch(slice.actions.addChannel(payload));
  }, [dispatch]);
};
export const useSpaces_updateChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; channel: Channel }) => {
    dispatch(slice.actions.updateChannel(payload));
  }, [dispatch]);
};
export const useSpaces_removeChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeChannel(payload));
  }, [dispatch]);
};
export const useSpaces_addChannelToGroup = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
    dispatch(slice.actions.addChannelToGroup(payload));
  }, [dispatch]);
};
export const useSpaces_removeChannelFromGroup = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
    dispatch(slice.actions.removeChannelFromGroup(payload));
  }, [dispatch]);
};

// Assets
export const useSpaces_activeAsset = () => useSelector(selectors.select_activeAsset);
export const useSpaces_activeAssetGuid = () => useSelector(selectors.select_activeAssetGuid);
export const useSpaces_assetsByGuid = () => useSelector(selectors.select_assetsByGuid);
export const useSpaces_setActiveAssetGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveAssetGuid(payload));
  }, [dispatch]);
};
export const useSpaces_addAsset = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; asset: Asset }) => {
    dispatch(slice.actions.addAsset(payload));
  }, [dispatch]);
};
export const useSpaces_removeAsset = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeAsset(payload));
  }, [dispatch]);
};
export const useSpaces_updateAsset = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; asset: Asset }) => {
    dispatch(slice.actions.updateAsset(payload));
  }, [dispatch]);
};
export const useSpaces_addAssetToChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { channelGuid: Guid; assetGuid: Guid }) => {
    dispatch(slice.actions.addAssetToChannel(payload));
  }, [dispatch]);
};
export const useSpaces_removeAssetFromChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { channelGuid: Guid; assetGuid: Guid }) => {
    dispatch(slice.actions.removeAssetFromChannel(payload));
  }, [dispatch]);
};

// Threads
export const useSpaces_activeThread = () => useSelector(selectors.select_activeThread);
export const useSpaces_activeThreadGuid = () => useSelector(selectors.select_activeThreadGuid);
export const useSpaces_threadsByGuid = () => useSelector(selectors.select_threadsByGuid);
export const useSpaces_setActiveThreadGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveThreadGuid(payload));
  }, [dispatch]);
};
export const useSpaces_setThreads = () => {
  const dispatch = useDispatch();
  return useCallback((payload: ThreadsByGuid) => {
    dispatch(slice.actions.setThreads(payload));
  }, [dispatch]);
};
export const useSpaces_addThread = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; thread: Thread }) => {
    dispatch(slice.actions.addThread(payload));
  }, [dispatch]);
};
export const useSpaces_removeThread = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeThread(payload));
  }, [dispatch]);
};
export const useSpaces_updateThread = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; thread: Thread }) => {
    dispatch(slice.actions.updateThread(payload));
  }, [dispatch]);
};
export const useSpaces_addThreadToChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { channelGuid: Guid; threadGuid: Guid }) => {
    dispatch(slice.actions.addThreadToChannel(payload));
  }, [dispatch]);
};
export const useSpaces_removeThreadFromChannel = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { channelGuid: Guid; threadGuid: Guid }) => {
    dispatch(slice.actions.removeThreadFromChannel(payload));
  }, [dispatch]);
};

// Messages
export const useSpaces_activeMessage = () => useSelector(selectors.select_activeMessage);
export const useSpaces_messageGuids = () => useSelector(selectors.select_messageGuids);
export const useSpaces_activeMessageGuid = () => useSelector(selectors.select_activeMessageGuid);
export const useSpaces_messagesByGuid = () => useSelector(selectors.select_messagesByGuid);
export const useSpaces_setActiveMessageGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveMessageGuid(payload));
  }, [dispatch]);
};
export const useSpaces_setMessages = () => {
  const dispatch = useDispatch();
  return useCallback((payload: MessagesByGuid) => {
    dispatch(slice.actions.setMessages(payload));
  }, [dispatch]);
};
export const useSpaces_addMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; message: Message }) => {
    dispatch(slice.actions.addMessage(payload));
  }, [dispatch]);
};
export const useSpaces_removeMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid) => {
    dispatch(slice.actions.removeMessage(payload));
  }, [dispatch]);
};
export const useSpaces_updateMessage = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { guid: Guid; message: Message }) => {
    dispatch(slice.actions.updateMessage(payload));
  }, [dispatch]);
};
export const useSpaces_setMessageGuids = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Guid[]) => {
    dispatch(slice.actions.setMessageGuids(payload));
  }, [dispatch]);
};
export const useSpaces_setMessagesByGuid = () => {
  const dispatch = useDispatch();
  return useCallback((payload: Record<Guid, Message>) => {
    dispatch(slice.actions.setMessagesByGuid(payload));
  }, [dispatch]);
};
export const useSpaces_addMessageToThread = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { threadGuid: Guid; messageGuid: Guid }) => {
    dispatch(slice.actions.addMessageToThread(payload));
  }, [dispatch]);
};
export const useSpaces_removeMessageFromThread = () => {
  const dispatch = useDispatch();
  return useCallback((payload: { threadGuid: Guid; messageGuid: Guid }) => {
    dispatch(slice.actions.removeMessageFromThread(payload));
  }, [dispatch]);
};
