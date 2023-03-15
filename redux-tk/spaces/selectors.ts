import { RootState } from '../store';
import * as Types from './types';

// Spaces
export const select_activeSpace = (state: RootState): Types.Space | null => {
  const { activeSpaceGuid, spacesByGuid } = state.spaces;
  return activeSpaceGuid ? spacesByGuid[activeSpaceGuid] || null : null;
};
export const select_spaceGuids = (state: RootState): Types.Guid[] => {
  return state.spaces.spaceGuids;
};
export const select_spacesByGuid = (state: RootState): Types.SpaceByGuid => {
  return state.spaces.spacesByGuid;
};
export const select_activeSpaceGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeSpaceGuid;
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

// Groups
export const select_activeGroup = (state: RootState): Types.Group | null => {
  const { activeGroupGuid, groupsByGuid } = state.spaces;
  return activeGroupGuid ? groupsByGuid[activeGroupGuid] || null : null;
};
export const select_activeGroupGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeGroupGuid;
};
export const select_groupsByGuid = (state: RootState): { [key: string]: Types.Group } => {
  return state.spaces.groupsByGuid;
};

// Channels
export const select_activeChannel = (state: RootState): Types.Channel | null => {
  const { activeChannelGuid, channelsByGuid } = state.spaces;
  return activeChannelGuid ? channelsByGuid[activeChannelGuid] || null : null;
};
export const select_activeChannelGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeChannelGuid;
};
export const select_channelsByGuid = (state: RootState): { [key: string]: Types.Channel } => {
  return state.spaces.channelsByGuid;
};

// Assets
export const select_activeAsset = (state: RootState): Types.Asset | null => {
  const { activeAssetGuid, assetsByGuid } = state.spaces;
  return activeAssetGuid ? assetsByGuid[activeAssetGuid] || null : null;
};
export const select_activeAssetGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeAssetGuid;
};
export const select_assetsByGuid = (state: RootState): { [key: string]: Types.Asset } => {
  return state.spaces.assetsByGuid;
};

// Threads
export const select_activeThread = (state: RootState): Types.Thread | null => {
  const { activeThreadGuid, threadsByGuid } = state.spaces;
  return activeThreadGuid ? threadsByGuid[activeThreadGuid] || null : null;
};
export const select_activeThreadGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeThreadGuid;
};
export const select_threadsByGuid = (state: RootState): { [key: string]: Types.Thread } => {
  return state.spaces.threadsByGuid;
};

// Messages
export const select_activeMessage = (state: RootState): Types.Message | null => {
  const { activeMessageGuid, messagesByGuid } = state.spaces;
  return activeMessageGuid ? messagesByGuid[activeMessageGuid] || null : null;
};
export const select_messageGuids = (state: RootState) : Types.Guid[] => {
  const { messageGuids } = state.spaces
  return messageGuids
}
export const select_activeMessageGuid = (state: RootState): Types.Guid | null => {
  return state.spaces.activeMessageGuid;
};
export const select_messagesByGuid = (state: RootState): { [key: string]: Types.Message } => {
  return state.spaces.messagesByGuid;
};
