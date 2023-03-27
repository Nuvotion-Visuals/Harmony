import { RootState } from '../store';
import * as Types from './types';

import { createSelector } from 'reselect';

// Spaces
const selectSpacesState = (state: RootState) => state.spaces;

export const select_activeSpace = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeSpaceGuid, spacesByGuid } = spacesState;
    return activeSpaceGuid ? spacesByGuid[activeSpaceGuid] || null : null;
  }
);

export const select_spaceGuids = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.spaceGuids;
  }
);

export const select_spacesByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.spacesByGuid;
  }
);

export const select_activeSpaceGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeSpaceGuid;
  }
);



// Groups
export const select_activeGroup = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeGroupGuid, groupsByGuid } = spacesState;
    return activeGroupGuid ? groupsByGuid[activeGroupGuid] || null : null;
  }
);

export const select_activeGroupGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeGroupGuid;
  }
);

export const select_groupsByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.groupsByGuid;
  }
);

// Channels
export const select_activeChannel = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeChannelGuid, channelsByGuid } = spacesState;
    return activeChannelGuid ? channelsByGuid[activeChannelGuid] || null : null;
  }
);

export const select_activeChannelGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeChannelGuid;
  }
);

export const select_channelsByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.channelsByGuid;
  }
);

// Assets
export const select_activeAsset = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeAssetGuid, assetsByGuid } = spacesState;
    return activeAssetGuid ? assetsByGuid[activeAssetGuid] || null : null;
  }
);

export const select_activeAssetGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeAssetGuid;
  }
);

export const select_assetsByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.assetsByGuid;
  }
);

// Threads
export const select_activeThread = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeThreadGuid, threadsByGuid } = spacesState;
    return activeThreadGuid ? threadsByGuid[activeThreadGuid] || null : null;
  }
);

export const select_activeThreadGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeThreadGuid;
  }
);

export const select_threadsByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.threadsByGuid;
  }
);

// Messages
export const select_activeMessage = createSelector(
  [selectSpacesState],
  (spacesState) => {
    const { activeMessageGuid, messagesByGuid } = spacesState;
    return activeMessageGuid ? messagesByGuid[activeMessageGuid] || null : null;
  }
);

export const select_messageGuids = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.messageGuids;
  }
);

export const select_activeMessageGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.activeMessageGuid;
  }
);

export const select_messagesByGuid = createSelector(
  [selectSpacesState],
  (spacesState) => {
    return spacesState.messagesByGuid;
  }
);

export const select_spacesInfo = createSelector(
  [selectSpacesState, select_groupsByGuid, select_channelsByGuid, select_threadsByGuid],
  (spacesState, groupsByGuid, channelsByGuid, threadsByGuid) => {
    const { spacesByGuid } = spacesState;
    const spaces = Object.values(spacesByGuid);
    return spaces.map((space) => {

      const groupGuids = space?.groupGuids
      const groupsCount = groupGuids?.length
    
      let channelGuids = groupGuids?.map(groupGuid =>
        groupsByGuid[groupGuid].channelGuids
      )
      let flatChannelGuids = channelGuids?.flat()
      let channelsCount = flatChannelGuids?.length
    
      let threadGuids = flatChannelGuids?.map(channelGuid =>
        channelsByGuid[channelGuid].threadGuids
      )
      let flatThreadGuids = threadGuids?.flat()
      let threadsCount = flatThreadGuids?.length
    
      let messageGuids = flatThreadGuids?.map(threadGuid =>
        threadsByGuid[threadGuid].messageGuids
      )
      let flatMessageGuids = messageGuids?.flat()
      let messageCount = flatMessageGuids?.length
    
      return ({
        guid: space.guid,
        name: space.name,
        previewSrc: space.previewSrc,
        description: space.description,
        groupsCount,
        channelsCount,
        threadsCount,
        messageCount
      })})
  }
);
