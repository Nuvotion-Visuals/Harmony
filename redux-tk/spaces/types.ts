export type Guid = string;

// spaces
export interface Space {
  guid: Guid;
  name: string;
  groupGuids: Guid[];
  description?: string;
  previewSrc?: string;
  locked?: boolean;
}
export interface SpacesByGuid {
  [guid: string]: Space;
}
export interface SpaceByGuid {
  [guid: string]: Space;
}
export interface SpaceAssets {
  [spaceGuid: string]: {
    [channelGuid: string]: Asset[];
  };
}
export interface SpaceChannels {
  [spaceGuid: string]: Channel[];
}
export interface SpaceGroups {
  [spaceGuid: string]: Group[];
}

// groups
export interface Group {
  guid: Guid;
  name: string;
  channelGuids: Guid[];
  description?: string;
  previewSrc?: string;
}
export interface GroupsByGuid {
  [guid: string]: Group;
}

// channels
export interface Channel {
  guid: Guid;
  name: string;
  groupGuid: Guid;
  assetGuids: Guid[];
  description?: string;
  previewSrc?: string;
  threadGuids: Guid[];
}
export interface ChannelsByGuid {
  [guid: string]: Channel;
}

// assets
export interface Asset {
  guid: Guid;
  name: string;
  type: "text" | "image" | "audio" | "video";
  data: any; // data could be a string, buffer, or any other type depending on the asset type
  description?: string;
  previewSrc?: string;
}
export interface AssetsByGuid {
  [guid: string]: Asset;
}

// threads
export interface Thread {
  guid: Guid;
  name: string;
  channelGuid: Guid;
  messageGuids: Guid[];
  description?: string;
}
export interface ThreadsByGuid {
  [guid: string]: Thread;
}

// messages
export interface Message {
  guid: Guid;
  conversationId: string;
  parentMessageId: string;
  chatGptLabel: string;
  promptPrefix: string;
  userLabel: string;
  message: string;
  threadGuid?: string;
  response?: string;
}
export interface MessagesByGuid {
  [guid: string]: Message;
}
export interface MessageGuids {
  [threadGuid: string]: Guid[];
}


