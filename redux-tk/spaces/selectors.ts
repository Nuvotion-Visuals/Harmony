import { RootState } from '../store';
import { Guid, Space, Group, Channel, Asset } from './types';

export const select_activeSpace = (state: RootState): Space | null => {
  const { activeSpaceGuid, spacesByGuid } = state.spaces;
  return activeSpaceGuid ? spacesByGuid[activeSpaceGuid] || null : null;
};

export const select_activeGroup = (state: RootState): Group | null => {
  const { activeGroupGuid, groupsByGuid } = state.spaces;
  return activeGroupGuid ? groupsByGuid[activeGroupGuid] || null : null;
};

export const select_activeChannel = (state: RootState): Channel | null => {
  const { activeChannelGuid, channelsByGuid } = state.spaces;
  return activeChannelGuid ? channelsByGuid[activeChannelGuid] || null : null;
};

export const select_activeAsset = (state: RootState): Asset | null => {
  const { activeAssetGuid, assetsByGuid } = state.spaces;
  return activeAssetGuid ? assetsByGuid[activeAssetGuid] || null : null;
};

export const select_spaceGuids = (state: RootState): Guid[] => {
  return state.spaces.spaceGuids;
};

export const select_activeSpaceGuid = (state: RootState): Guid | null => {
  return state.spaces.activeSpaceGuid;
};

export const select_groupsByGuid = (state: RootState): { [key: string]: Group } => {
  return state.spaces.groupsByGuid;
};

export const select_channelsByGuid = (state: RootState): { [key: string]: Channel } => {
  return state.spaces.channelsByGuid;
};

export const select_assetsByGuid = (state: RootState): { [key: string]: Asset } => {
  return state.spaces.assetsByGuid;
};

export const select_spacesInfo = (state: RootState): { name: string, previewSrc?: string, description?: string, guid: string }[] => {
    const { spacesByGuid } = state.spaces;
    const spaces = Object.values(spacesByGuid);
    return spaces.map((space) => ({
      guid: space.guid,
      name: space.name,
      previewSrc: space.previewSrc,
      description: space.description,
    }));
  };
  