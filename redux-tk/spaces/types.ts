export type Guid = string;

export interface Asset {
  guid: Guid;
  name: string;
  type: "text" | "image" | "audio" | "video";
  data: any; // data could be a string, buffer, or any other type depending on the asset type
  description?: string;
  previewSrc?: string;
}

export interface Channel {
  guid: Guid;
  name: string;
  groupGuid: Guid;
  assetGuids: Guid[];
  description?: string;
  previewSrc?: string;
}

export interface Group {
  guid: Guid;
  name: string;
  channelGuids: Guid[];
  description?: string;
  previewSrc?: string;
}

export interface SpacesByGuid {
  [guid: string]: Space;
}

export interface ChannelsByGuid {
  [guid: string]: Channel;
}

export interface AssetsByGuid {
  [guid: string]: Asset;
}

export interface GroupsByGuid {
  [guid: string]: Group;
}

export interface Space {
  guid: Guid;
  name: string;
  groupGuids: Guid[];
  description?: string;
  previewSrc?: string;
  locked?: boolean
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

// spaces -> groups -> channels -> assets
// spaces -> channels -> channels -> groups -> assets