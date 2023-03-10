import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Types from './types';

import db from 'dexie/dexie'

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

// useEffect(() => {

//   (async () => {
//     const spaces = await db.spaces.orderBy("guid").toArray();
//     const spacesObject = spaces.reduce((acc, space) => {
//       acc[space.guid] = space;
//       return acc;
//     }, {});
//     console.log(spacesObject)
//   })()
// }, [])

export const fetchInitialData = createAsyncThunk(
  'mySlice/fetchInitialData',
  async () => {
    const spaces = await db.spaces.orderBy("guid").toArray();
    const spacesByGuid = spaces.reduce((acc, space) => {
      acc[space.guid] = space;
      return acc;
    }, {});
    const spaceGuids = spaces.map((space) => space.guid);

    const groups = await db.groups.orderBy("guid").toArray();
    const groupsByGuid = groups.reduce((acc, group) => {
      acc[group.guid] = group;
      return acc;
    }, {});
    const groupGuids = groups.map((group) => group.guid);

    const channels = await db.channels.orderBy("guid").toArray();
    const channelsByGuid = channels.reduce((acc, channel) => {
      acc[channel.guid] = channel;
      return acc;
    }, {});
    const channelGuids = channels.map((channel) => channel.guid);

    const assets = await db.assets.orderBy("guid").toArray();
    const assetsByGuid = assets.reduce((acc, asset) => {
      acc[asset.guid] = asset;
      return acc;
    }, {});
    const assetGuids = assets.map((asset) => asset.guid);

    return { 
      spacesByGuid, 
      spaceGuids, 
      groupsByGuid, 
      groupGuids, 
      channelsByGuid, 
      channelGuids, 
      assetsByGuid, 
      assetGuids 
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
      
        // Set active ids if there are any
        if (state.spaceGuids.length > 0) {
          state.activeSpaceGuid = state.spaceGuids[0];
        }
        if (state.groupGuids.length > 0) {
          state.activeGroupGuid = state.groupGuids[0];
        }
        if (state.channelGuids.length > 0) {
          state.activeChannelGuid = state.channelGuids[0];
        }
        if (state.assetGuids.length > 0) {
          state.activeAssetGuid = state.assetGuids[0];
        }
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
      .addMatcher(
        (action) => action.type.endsWith('/fulfilled'),
        (state, action) => {
          if (state.status === 'idle') {
            state.spacesByGuid = action.payload.spacesByGuid;
            state.spaceGuids = action.payload.spaceGuids;
            state.status = 'succeeded';
          }
        }
      );
  },
  reducers: {
    addSpace: (state, action: PayloadAction<{ guid: Types.Guid; space: Types.Space }>) => {
      const { guid, space } = action.payload;
      state.spaceGuids.push(guid);
      state.spacesByGuid[guid] = space;

      db.spaces.add(space);
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

        db.spaces.update(spaceGuid, { groupGuids: newGroupGuids });
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

        db.groups.update(groupGuid, { channelGuids: newChannelGuids });
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

        db.channels.update(channelGuid, { assetGuids: newAssetGuids });
      }
    },
    addGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupGuids.push(guid);
      state.groupsByGuid[guid] = group;

      db.groups.add(group)
    },
    removeGroup: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.groupGuids = state.groupGuids.filter((guid) => guid !== guidToRemove);
      delete state.groupsByGuid[guidToRemove];

      db.groups.delete(guidToRemove)
    },
    addChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
      state.channelGuids.push(guid);
      state.channelsByGuid[guid] = channel;

      db.channels.add(channel)
    },
    removeChannel: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.channelGuids = state.channelGuids.filter((guid) => guid !== guidToRemove);
      delete state.channelsByGuid[guidToRemove];

      db.channels.delete(guidToRemove)
    },
    addAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetGuids.push(guid);
      state.assetsByGuid[guid] = asset;

      db.assets.add(asset)
    },
    removeAsset: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.assetGuids = state.assetGuids.filter((guid) => guid
      !== guidToRemove);
      delete state.assetsByGuid[guidToRemove];

      db.assets.delete(guidToRemove)
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

      db.spaces.update(guid, space)
    },
    updateGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupsByGuid[guid] = {
        ...state.groupsByGuid[guid],
        ...group,
      };

      db.groups.update(guid, group);
    },
    updateChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
      state.channelsByGuid[guid] = {
        ...state.channelsByGuid[guid],
        ...channel,
      };

      db.channels.update(guid, channel);
    },
    updateAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetsByGuid[guid] = {
        ...state.assetsByGuid[guid],
        ...asset,
      };

      db.assets.update(guid, asset);
    },
    removeGroupFromSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        const newSpaceGuids = space.groupGuids.filter((guid) => guid !== groupGuid)
        space.groupGuids = newSpaceGuids;

        db.spaces.update(spaceGuid, { groupGuids: newSpaceGuids });
      }
    },
    removeChannelFromGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        const newChannelGuids = group.channelGuids.filter((guid) => guid !== channelGuid);
        group.channelGuids = newChannelGuids

        db.groups.update(groupGuid, { channelGuids: newChannelGuids });
      }
    },
  }
})