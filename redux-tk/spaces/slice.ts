import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Types from './types';

import db from 'y/y'

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
  status: string;
  error?: string
}

interface Item {
  guid: string;
  // Add additional properties as needed
}

interface FetchDataResult<T extends Item> {
  byGuid: { [key: string]: T };
  guids: string[];
}

async function fetchData<T extends Item>(db: any, objectType: string): Promise<FetchDataResult<T>> {
  const iterator = db[objectType].values();
  const array: T[] = [];
  let item = iterator.next();
  while (!item.done) {
    array.push(item.value);
    item = iterator.next();
  }
  const byGuid = array.reduce((acc: { [key: string]: T }, item: T) => {
    acc[item.guid] = item;
    return acc;
  }, {});
  const guids = array.map((item) => item.guid);
  return {
    byGuid,
    guids,
  };
}

export const fetchInitialData = createAsyncThunk(
  'spaces/fetchInitialData',
  async () => {
    const spaces = await fetchData<Types.Space>(db, 'spaces');
    const spacesByGuid = spaces.byGuid;
    const spaceGuids = spaces.guids;

    const groups = await fetchData<Types.Group>(db, 'groups');
    const groupsByGuid = groups.byGuid;
    const groupGuids = groups.guids;

    const channels = await fetchData<Types.Channel>(db, 'channels');
    const channelsByGuid = channels.byGuid;
    const channelGuids = channels.guids;

    const assets = await fetchData<Types.Asset>(db, 'assets');
    const assetsByGuid = assets.byGuid;
    const assetGuids = assets.guids;

    return { 
      spacesByGuid,
      spaceGuids,
      groupsByGuid,
      groupGuids,
      channelsByGuid,
      channelGuids,
      assetsByGuid,
      assetGuids,
    };
  }
);

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
    status: 'idle',
    error: ''
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInitialData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchInitialData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.spacesByGuid = action.payload.spacesByGuid;
        state.spaceGuids = action.payload.spaceGuids;
        state.groupsByGuid = action.payload.groupsByGuid;
        state.groupGuids = action.payload.groupGuids;
        state.channelsByGuid = action.payload.channelsByGuid;
        state.channelGuids = action.payload.channelGuids;
        state.assetsByGuid = action.payload.assetsByGuid;
        state.assetGuids = action.payload.assetGuids;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },
  reducers: {
    addSpace: (state, action: PayloadAction<{ guid: Types.Guid; space: Types.Space }>) => {
      const { guid, space } = action.payload;
      state.spaceGuids.push(guid);
      state.spacesByGuid[guid] = space;

      db.spaces.set(guid, space);
    },
    removeSpace: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.spaceGuids = state.spaceGuids.filter((guid) => guid !== guidToRemove);
      delete state.spacesByGuid[guidToRemove];
    
      db.spaces.delete(guidToRemove);
    },
    addGroupToSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        const newGroupGuids = [
          ...space.groupGuids,
          groupGuid
        ]
        space.groupGuids = newGroupGuids
    
        db.spaces.set(spaceGuid, space);
      }
    },
    addChannelToGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        const newChannelGuids = [
          ...group.channelGuids,
          channelGuid
        ]
        group.channelGuids = newChannelGuids
    
        db.groups.set(groupGuid, group);
      }
    },
    addAssetToChannel: (state, action: PayloadAction<{ channelGuid: Types.Guid; assetGuid: Types.Guid }>) => {
      const { channelGuid, assetGuid } = action.payload;
      const channel = state.channelsByGuid[channelGuid];
      if (channel) {
        const newAssetGuids = [
          ...channel.assetGuids,
          assetGuid
        ]
        channel.assetGuids = newAssetGuids
    
        db.channels.set(channelGuid, channel);
      }
    },
    addGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupGuids.push(guid);
      state.groupsByGuid[guid] = group;
    
      db.groups.set(guid, group);
    },
    removeGroup: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.groupGuids = state.groupGuids.filter((guid) => guid !== guidToRemove);
      delete state.groupsByGuid[guidToRemove];

      db.groups.delete(guidToRemove);
    },
    addChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
      state.channelGuids.push(guid);
      state.channelsByGuid[guid] = channel;

      db.channels.set(guid, channel);
    },
    removeChannel: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.channelGuids = state.channelGuids.filter((guid) => guid !== guidToRemove);
      delete state.channelsByGuid[guidToRemove];

      db.channels.delete(guidToRemove);
    },
    addAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetGuids.push(guid);
      state.assetsByGuid[guid] = asset;

      db.assets.set(guid, asset);
    },
    removeAsset: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.assetGuids = state.assetGuids.filter((guid) => guid !== guidToRemove);
      delete state.assetsByGuid[guidToRemove];

      db.assets.delete(guidToRemove);
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

      db.spaces.set(guid, space)
    },
    updateGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
    
      state.groupsByGuid[guid] = {
        ...state.groupsByGuid[guid],
        ...group,
      };

      db.groups.set(guid, group)
    },
    updateChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
    
      state.channelsByGuid[guid] = {
        ...state.channelsByGuid[guid],
        ...channel,
      };
      
      db.channels.set(guid, channel)
    },
    updateAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
    
      state.assetsByGuid[guid] = {
        ...state.assetsByGuid[guid],
        ...asset,
      };

      db.assets.set(guid, asset)
    },
    removeGroupFromSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
    
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        const newGroupGuids = space.groupGuids.filter((guid) => guid !== groupGuid);
        space.groupGuids = newGroupGuids;
    
        db.spaces.set(spaceGuid, space);
      }
    },
    removeChannelFromGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
    
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        const newChannelGuids = group.channelGuids.filter((guid) => guid !== channelGuid);
        group.channelGuids = newChannelGuids;

        db.groups.set(groupGuid, group);
      }
    },
  }
})