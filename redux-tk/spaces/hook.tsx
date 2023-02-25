import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isEqual } from 'lodash';
import type { RootState } from '../store';
import * as selectors from './selectors';
import { slice } from './slice';
import type { Guid, Space, Group, Channel, Asset } from './types';

export const useSpaces = () => {
  const dispatch = useDispatch();

  return {
    // selectors
    activeSpace: useSelector(selectors.select_activeSpace, isEqual),
    activeGroup: useSelector(selectors.select_activeGroup, isEqual),
    activeChannel: useSelector(selectors.select_activeChannel, isEqual),
    activeAsset: useSelector(selectors.select_activeAsset, isEqual),
    groupsByGuid: useSelector(selectors.select_groupsByGuid, isEqual),
    channelsByGuid: useSelector(selectors.select_channelsByGuid, isEqual),
    assetsByGuid: useSelector(selectors.select_assetsByGuid, isEqual),
    spacesInfo: useSelector(selectors.select_spacesInfo, isEqual),
    spaceGuids: useSelector(selectors.select_spaceGuids, isEqual),
    activeSpaceGuid: useSelector(selectors.select_activeSpaceGuid, isEqual),

    // reducers
    addSpace: useCallback((payload: { guid: Guid; space: Space }) => {
      dispatch(slice.actions.addSpace(payload));
    }, [dispatch]),
    removeSpace: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeSpace(payload));
    }, [dispatch]),
    addGroupToSpace: useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
      dispatch(slice.actions.addGroupToSpace(payload));
    }, [dispatch]),
    removeGroupFromSpace: useCallback((payload: { spaceGuid: Guid; groupGuid: Guid }) => {
      dispatch(slice.actions.removeGroupFromSpace(payload));
    }, [dispatch]),
    addChannelToGroup: useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
      dispatch(slice.actions.addChannelToGroup(payload));
    }, [dispatch]),
    removeChannelFromGroup: useCallback((payload: { groupGuid: Guid; channelGuid: Guid }) => {
      dispatch(slice.actions.removeChannelFromGroup(payload));
    }, [dispatch]),
    addAssetToChannel: useCallback((payload: { channelGuid: Guid; assetGuid: Guid }) => {
      dispatch(slice.actions.addAssetToChannel(payload));
    }, [dispatch]),
    addGroup: useCallback((payload: { guid: Guid; group: Group }) => {
      dispatch(slice.actions.addGroup(payload));
    }, [dispatch]),
    removeGroup: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeGroup(payload));
    }, [dispatch]),
    addChannel: useCallback((payload: { guid: Guid; channel: Channel }) => {
      dispatch(slice.actions.addChannel(payload));
    }, [dispatch]),
    removeChannel: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeChannel(payload));
    }, [dispatch]),
    addAsset: useCallback((payload: { guid: Guid; asset: Asset }) => {
      dispatch(slice.actions.addAsset(payload));
    }, [dispatch]),
    removeAsset: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeAsset(payload));
    }, [dispatch]),
    setActiveSpaceGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveSpaceGuid(payload));
    }, [dispatch]),
    setActiveGroupGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveGroupGuid(payload));
    }, [dispatch]),
    setActiveChannelGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveChannelGuid(payload));
    }, [dispatch]),
    setActiveAssetGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveAssetGuid(payload));
    }, [dispatch]),
  };
};
