import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Types from './types';

interface SpaceState {
  spaceGuids: Types.Guid[];
  spacesByGuid: Types.SpacesByGuid;
  groupGuids: Types.Guid[];
  groupsByGuid: Types.GroupsByGuid;
  channelGuids: Types.Guid[];
  channelsByGuid: Types.ChannelsByGuid;
  assetGuids: Types.Guid[];
  assetsByGuid: Types.AssetsByGuid;
  activeSpaceGuid: Types.Guid | null;
  activeGroupGuid: Types.Guid | null;
  activeChannelGuid: Types.Guid | null;
  activeAssetGuid: Types.Guid | null;
}

export const slice = createSlice({
  name: 'spaces',
  initialState: <SpaceState>{
    spaceGuids: [],
    spacesByGuid: {},
    groupGuids: [],
    groupsByGuid: {},
    channelGuids: [],
    channelsByGuid: {},
    assetGuids: [],
    assetsByGuid: {},
    activeSpaceGuid: null,
    activeGroupGuid: null,
    activeChannelGuid: null,
    activeAssetGuid: null,
  },
  reducers: {
    addSpace: (state, action: PayloadAction<{ guid: Types.Guid; space: Types.Space }>) => {
      const { guid, space } = action.payload;
      state.spaceGuids.push(guid);
      state.spacesByGuid[guid] = space;
    },
    removeSpace: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.spaceGuids = state.spaceGuids.filter((guid) => guid !== guidToRemove);
      delete state.spacesByGuid[guidToRemove];
    },
    addGroupToSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        space.groupGuids.push(groupGuid);
      }
    },
    addChannelToGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        group.channelGuids.push(channelGuid);
      }
    },
    addAssetToChannel: (state, action: PayloadAction<{ channelGuid: Types.Guid; assetGuid: Types.Guid }>) => {
      const { channelGuid, assetGuid } = action.payload;
      const channel = state.channelsByGuid[channelGuid];
      if (channel) {
        channel.assetGuids.push(assetGuid);
      }
    },
    addGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupGuids.push(guid);
      state.groupsByGuid[guid] = group;
    },
    removeGroup: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.groupGuids = state.groupGuids.filter((guid) => guid !== guidToRemove);
      delete state.groupsByGuid[guidToRemove];
    },
    addChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
      state.channelGuids.push(guid);
      state.channelsByGuid[guid] = channel;
    },
    removeChannel: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.channelGuids = state.channelGuids.filter((guid) => guid !== guidToRemove);
      delete state.channelsByGuid[guidToRemove];
    },
    addAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetGuids.push(guid);
      state.assetsByGuid[guid] = asset;
    },
    removeAsset: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.assetGuids = state.assetGuids.filter((guid) => guid
      !== guidToRemove);
      delete state.assetsByGuid[guidToRemove];
    },
    setActiveSpaceGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeSpaceGuid = action.payload;
    },
    setActiveGroupGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeGroupGuid = action.payload;
    },
    setActiveChannelGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeChannelGuid = action.payload;
    },
    setActiveAssetGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeAssetGuid = action.payload;
    },
    updateSpace: (state, action: PayloadAction<{ guid: Types.Guid; space: Types.Space }>) => {
      const { guid, space } = action.payload;
      state.spacesByGuid[guid] = {
        ...state.spacesByGuid[guid],
        ...space,
      };
    },
    updateGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupsByGuid[guid] = {
        ...state.groupsByGuid[guid],
        ...group,
      };
    },
    updateChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
      state.channelsByGuid[guid] = {
        ...state.channelsByGuid[guid],
        ...channel,
      };
    },
    updateAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetsByGuid[guid] = {
        ...state.assetsByGuid[guid],
        ...asset,
      };
    },
    removeGroupFromSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        space.groupGuids = space.groupGuids.filter((guid) => guid !== groupGuid);
      }
    },
    removeChannelFromGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        group.channelGuids = group.channelGuids.filter((guid) => guid !== channelGuid);
      }
    },
    
  }
})