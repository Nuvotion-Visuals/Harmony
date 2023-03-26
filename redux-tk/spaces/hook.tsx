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

export const useSpaces = () => {
  const dispatch = useDispatch();

  return {
    activeSpaceStats: useSelector(selectors.select_activeSpaceStats, shallowEqual),

    // spaces
    activeSpace: useSelector(selectors.select_activeSpace, shallowEqual),
    spacesByGuid: useSelector(selectors.select_spacesByGuid, shallowEqual),
    activeSpaceGuid: useSelector(selectors.select_activeSpaceGuid, shallowEqual),
    spacesInfo: useSelector(selectors.select_spacesInfo, shallowEqual),
    spaceGuids: useSelector(selectors.select_spaceGuids, shallowEqual),
    addSpaceIncludingGroups: useCallback((payload: { space: Space; guid: Guid; suggested: Suggested }) => {
      dispatch(slice.actions.addSpaceIncludingGroups(payload));
    }, [dispatch]),
    setActiveSpaceGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveSpaceGuid(payload));
    }, [dispatch]),
    addSpace: useCallback((payload: { guid: Guid; space: Space }) => {
    dispatch(slice.actions.addSpace(payload));
    }, [dispatch]),
    removeSpace: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeSpace(payload));
    }, [dispatch]),
    updateSpace: useCallback((payload: { guid: Guid; space: Space }) => {
    dispatch(slice.actions.updateSpace(payload));
    }, [dispatch]),
    
    // groups
    groupsByGuid: useSelector(selectors.select_groupsByGuid, shallowEqual),
    activeGroup: useSelector(selectors.select_activeGroup, shallowEqual),
    setActiveGroupGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveGroupGuid(payload));
    }, [dispatch]),
    addGroup: useCallback((payload: { guid: Guid; group: Group }) => {
    dispatch(slice.actions.addGroup(payload));
    }, [dispatch]),
    removeGroup: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeGroup(payload));
    }, [dispatch]),
    updateGroup: useCallback((payload: { guid: Guid; group: Group }) => {
    dispatch(slice.actions.updateGroup(payload));
    }, [dispatch]),
    addGroupToSpace: useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
    dispatch(slice.actions.addGroupToSpace(payload));
    }, [dispatch]),
    removeGroupFromSpace: useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
    dispatch(slice.actions.removeGroupFromSpace(payload));
    }, [dispatch]),
    
    // channels
    activeChannel: useSelector(selectors.select_activeChannel, shallowEqual),
    channelsByGuid: useSelector(selectors.select_channelsByGuid, shallowEqual),
    setActiveChannelGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveChannelGuid(payload));
    }, [dispatch]),
    addChannel: useCallback((payload: { guid: Guid; channel: Channel }) => {
    dispatch(slice.actions.addChannel(payload));
    }, [dispatch]),
    updateChannel: useCallback((payload: { guid: Guid; channel: Channel }) => {
    dispatch(slice.actions.updateChannel(payload));
    }, [dispatch]),
    removeChannel: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeChannel(payload));
    }, [dispatch]),
    // TODO: add updateChannel
    addChannelToGroup: useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
    dispatch(slice.actions.addChannelToGroup(payload));
    }, [dispatch]),
    removeChannelFromGroup: useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
    dispatch(slice.actions.removeChannelFromGroup(payload));
    }, [dispatch]),
    
    // assets
    assetsByGuid: useSelector(selectors.select_assetsByGuid, shallowEqual),
    activeAsset: useSelector(selectors.select_activeAsset, shallowEqual),
    setActiveAssetGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveAssetGuid(payload));
    }, [dispatch]),
    addAsset: useCallback((payload: { guid: Guid; asset: Asset }) => {
    dispatch(slice.actions.addAsset(payload));
    }, [dispatch]),
    removeAsset: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeAsset(payload));
    }, [dispatch]),
    updateAsset: useCallback((payload: { guid: Guid; asset: Asset }) => {
      dispatch(slice.actions.updateAsset(payload));
    }, [dispatch]),
    addAssetToChannel: useCallback((payload: { channelGuid: Guid; assetGuid: Guid }) => {
    dispatch(slice.actions.addAssetToChannel(payload));
    }, [dispatch]),
    removeAssetFromChannel: useCallback((payload: { channelGuid: Guid; assetGuid: Guid }) => {
      dispatch(slice.actions.removeAssetFromChannel(payload));
    }, [dispatch]),
    
    // threads
    activeThreadGuid: useSelector(selectors.select_activeThreadGuid, shallowEqual),
    activeThread: useSelector(selectors.select_activeThread, shallowEqual),
    threadsByGuid: useSelector(selectors.select_threadsByGuid, shallowEqual),
    setActiveThreadGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveThreadGuid(payload));
    }, [dispatch]),
    setThreads: useCallback((payload: ThreadsByGuid) => {
    dispatch(slice.actions.setThreads(payload));
    }, [dispatch]),
    addThread: useCallback((payload: { guid: Guid; thread: Thread }) => {
    dispatch(slice.actions.addThread(payload));
    }, [dispatch]),
    removeThread: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeThread(payload));
    }, [dispatch]),
    updateThread: useCallback((payload: { guid: Guid; thread: Thread }) => {
    dispatch(slice.actions.updateThread(payload));
    }, [dispatch]),
    addThreadToChannel: useCallback((payload: { channelGuid: Guid; threadGuid: Guid }) => {
    dispatch(slice.actions.addThreadToChannel(payload));
    }, [dispatch]),
    removeThreadFromChannel: useCallback((payload: { channelGuid: Guid; threadGuid: Guid }) => {
    dispatch(slice.actions.removeThreadFromChannel(payload));
    }, [dispatch]),
    
    // messages
    activeMessageGuid: useSelector(selectors.select_activeMessageGuid, shallowEqual),
    messagesByGuid: useSelector(selectors.select_messagesByGuid, shallowEqual),
    messageGuids: useSelector(selectors.select_messageGuids, shallowEqual),
    setMessages: useCallback((payload: MessagesByGuid) => {
    dispatch(slice.actions.setMessages(payload));
    }, [dispatch]),
    addMessage: useCallback((payload: { guid: Guid; message: Message }) => {
      dispatch(slice.actions.addMessage(payload));
      }, [dispatch]),
    setActiveMessageGuid: useCallback((payload: Guid | null) => {
    dispatch(slice.actions.setActiveMessageGuid(payload));
    }, [dispatch]),
    setMessageGuids: useCallback((payload: Guid[]) => {
    dispatch(slice.actions.setMessageGuids(payload));
    }, [dispatch]),
    setMessagesByGuid: useCallback((payload: Record<Guid, Message>) => {
    dispatch(slice.actions.setMessagesByGuid(payload));
    }, [dispatch]),
    removeMessage: useCallback((payload: Guid) => {
    dispatch(slice.actions.removeMessage(payload));
    }, [dispatch]),
    updateMessage: useCallback((payload: { guid: Guid; message: Message }) => {
    dispatch(slice.actions.updateMessage(payload));
    }, [dispatch]),
    addMessageToThread: useCallback((payload: { threadGuid: Guid; messageGuid: Guid }) => {
    dispatch(slice.actions.addMessageToThread(payload));
    }, [dispatch]),
    removeMessageFromThread: useCallback((payload: { threadGuid: Guid; messageGuid: Guid }) => {
    dispatch(slice.actions.removeMessageFromThread(payload));
    }, [dispatch]),
  };
};
