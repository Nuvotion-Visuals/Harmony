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
  activeThreadGuid: Types.Guid | null;
  activeMessageGuid:  Types.Guid | null;
  threadGuids: Types.Guid[];
  threadsByGuid: Types.ThreadsByGuid;
  messageGuids: Types.Guid[];
  messagesByGuid: Types.MessagesByGuid;
  status: string;
  error?: string;
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

    const messages = await fetchData<Types.Message>(db, 'messages');
    const messagesByGuid = messages.byGuid;
    const messageGuids = messages.guids

    const threads = await fetchData<Types.Thread>(db, 'threads');
    const threadsByGuid = threads.byGuid;
    const threadGuids = threads.guids

    return {
      spacesByGuid,
      spaceGuids,
      groupsByGuid,
      groupGuids,
      channelsByGuid,
      channelGuids,
      assetsByGuid,
      assetGuids,
      messagesByGuid,
      messageGuids,
      threadsByGuid,
      threadGuids
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
    activeThreadGuid: null,
    activeMessageGuid: null,
    threadGuids: [],
    threadsByGuid: {},
    messageGuids: [],
    messagesByGuid: {},
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
        state.threadsByGuid = action.payload.threadsByGuid;
        state.threadGuids = action.payload.threadGuids;
        state.messagesByGuid = action.payload.messagesByGuid;
        state.messageGuids = action.payload.messageGuids;
      })
      .addCase(fetchInitialData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      })
  },

  reducers: {
    // spaces
    setSpaces: (state, action: PayloadAction<Types.SpacesByGuid>) => {
      state.spaceGuids = Object.keys(action.payload);
      state.spacesByGuid = action.payload;
    },
    setActiveSpaceGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeSpaceGuid = action.payload;
    },
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
    updateSpace: (state, action: PayloadAction<{ guid: Types.Guid; space: Types.Space }>) => {
      const { guid, space } = action.payload;
  
      state.spacesByGuid[guid] = {
        ...state.spacesByGuid[guid],
        ...space,
      };

      db.spaces.set(guid, space)
    },

    // groups
    setGroups: (state, action: PayloadAction<Types.GroupsByGuid>) => {
      state.groupGuids = Object.keys(action.payload);
      state.groupsByGuid = action.payload;
    },
    setActiveGroupGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeGroupGuid = action.payload;
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
    updateGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
    
      state.groupsByGuid[guid] = {
        ...state.groupsByGuid[guid],
        ...group,
      };

      db.groups.set(guid, group)
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
    removeGroupFromSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { spaceGuid, groupGuid } = action.payload;
    
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        const newGroupGuids = space.groupGuids.filter((guid) => guid !== groupGuid);
        space.groupGuids = newGroupGuids;
    
        db.spaces.set(spaceGuid, space);
      }
    },

    // channels
    setChannels: (state, action: PayloadAction<Types.ChannelsByGuid>) => {
      state.channelGuids = Object.keys(action.payload);
      state.channelsByGuid = action.payload;
    },
    setActiveChannelGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeChannelGuid = action.payload;
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
    updateChannel: (state, action: PayloadAction<{ guid: Types.Guid; channel: Types.Channel }>) => {
      const { guid, channel } = action.payload;
    
      state.channelsByGuid[guid] = {
        ...state.channelsByGuid[guid],
        ...channel,
      };
      
      db.channels.set(guid, channel)
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
    removeChannelFromGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; channelGuid: Types.Guid }>) => {
      const { groupGuid, channelGuid } = action.payload;
    
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        const newChannelGuids = group.channelGuids.filter((guid) => guid !== channelGuid);
        group.channelGuids = newChannelGuids;

        db.groups.set(groupGuid, group);
      }
    },

    // assets
    setAssets: (state, action: PayloadAction<Types.AssetsByGuid>) => {
      state.assetGuids = Object.keys(action.payload);
      state.assetsByGuid = action.payload;
    },
    setActiveAssetGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeAssetGuid = action.payload;
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
    updateAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
    
      state.assetsByGuid[guid] = {
        ...state.assetsByGuid[guid],
        ...asset,
      };

      db.assets.set(guid, asset)
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
    removeAssetFromChannel: (state, action: PayloadAction<{ channelGuid: Types.Guid; assetGuid: Types.Guid }>) => {
      const { channelGuid, assetGuid } = action.payload;
    
      const channel = state.channelsByGuid[channelGuid];
      if (channel) {
        const newAssetGuids = channel.assetGuids.filter((guid) => guid !== assetGuid);
        channel.assetGuids = newAssetGuids;
    
        db.channels.set(channelGuid, channel);
      }
    },

    // threads
    setThreads: (state, action: PayloadAction<Types.ThreadsByGuid>) => {
      state.threadGuids = Object.keys(action.payload);
      state.threadsByGuid = action.payload;
    },
    setActiveThreadGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeThreadGuid = action.payload;
    },
    addThread: (state, action: PayloadAction<{ guid: Types.Guid; thread: Types.Thread }>) => {
      const { guid, thread } = action.payload;
      state.threadGuids.push(guid);
      state.threadsByGuid[guid] = thread;

      db.threads.set(guid, thread);
    },
    removeThread: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.threadGuids = state.threadGuids.filter((guid) => guid !== guidToRemove);
      delete state.threadsByGuid[guidToRemove];

      db.threads.delete(guidToRemove);
    },
    updateThread: (state, action: PayloadAction<{ guid: Types.Guid; thread: Types.Thread }>) => {
      const { guid, thread } = action.payload;

      state.threadsByGuid[guid] = {
        ...state.threadsByGuid[guid],
        ...thread,
      };

      db.threads.set(guid, thread);
    },
    addThreadToChannel: (state, action: PayloadAction<{ channelGuid: Types.Guid; threadGuid: Types.Guid }>) => {
      const { channelGuid, threadGuid } = action.payload;
      const channel = state.channelsByGuid[channelGuid];
      if (channel) {
        const newThreadGuids = [
          ...channel.threadGuids,
          threadGuid
        ]
        channel.threadGuids = newThreadGuids
    
        db.channels.set(channelGuid, channel);
      }
    },
    removeThreadFromChannel: (state, action: PayloadAction<{ channelGuid: Types.Guid; threadGuid: Types.Guid }>) => {
      const { threadGuid, channelGuid } = action.payload;
    
      const channel = state.channelsByGuid[channelGuid];
      if (channel) {
        const newThreadGuids = channel.threadGuids.filter((guid) => guid !== threadGuid);
        channel.threadGuids = newThreadGuids;

        db.channels.set(channelGuid, channel);
      }
    },
    
    // messages
    setMessages: (state, action: PayloadAction<Types.MessagesByGuid>) => {
      state.threadGuids = Object.keys(action.payload);
      state.messagesByGuid = action.payload;
    },
    setActiveMessageGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeMessageGuid = action.payload;
    },
    setMessageGuids: (state, action: PayloadAction<Types.Guid[]>) => {
      state.messageGuids = action.payload;
    },
    setMessagesByGuid: (state, action: PayloadAction<Types.MessagesByGuid>) => {
      state.messagesByGuid = action.payload;
    },
    addMessage: (state, action: PayloadAction<{ guid: Types.Guid; message: Types.Message }>) => {
      const { guid, message } = action.payload;
      state.messageGuids.push(guid);
      state.messagesByGuid[guid] = message;

      db.messages.set(guid, message);
    },
    removeMessage: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.messageGuids = state.messageGuids.filter((guid) => guid !== guidToRemove);
      delete state.messagesByGuid[guidToRemove];

      db.messages.delete(guidToRemove);
    },
    updateMessage: (state, action: PayloadAction<{ guid: Types.Guid; message: Types.Message }>) => {
      const { guid, message } = action.payload;

      state.messagesByGuid[guid] = {
        ...state.messagesByGuid[guid],
        ...message,
      };

      db.messages.set(guid, message);
    },
    addMessageToThread: (state, action: PayloadAction<{ threadGuid: Types.Guid; messageGuid: Types.Guid }>) => {
      const { threadGuid, messageGuid } = action.payload;
      const thread = state.threadsByGuid[threadGuid];
      if (thread) {
        const newMessageGuids = [
          ...thread.messageGuids,
          messageGuid
        ]
        thread.messageGuids = newMessageGuids
    
        db.threads.set(threadGuid, thread);
      }
    },
    removeMessageFromThread: (state, action: PayloadAction<{ threadGuid: Types.Guid; messageGuid: Types.Guid }>) => {
      const { threadGuid, messageGuid } = action.payload;
    
      const thread = state.threadsByGuid[threadGuid];
      if (thread) {
        const newMessageGuids = thread.messageGuids.filter((guid) => guid !== messageGuid);
        thread.messageGuids = newMessageGuids;

        db.threads.set(threadGuid, thread);
      }
    },
  }
})