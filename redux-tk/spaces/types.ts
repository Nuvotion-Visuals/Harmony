export type Guid = string;

export interface Asset {
  guid: Guid;
  name: string;
  type: "text" | "image" | "audio" | "video";
  data: any; // data could be a string, buffer, or any other type depending on the asset type
  description?: string;
  previewSrc?: string;
}

export interface Group {
  guid: Guid;
  name: string;
  projectGuid: Guid;
  assetGuids: Guid[];
  description?: string;
  previewSrc?: string;
}

export interface Project {
  guid: Guid;
  name: string;
  groupGuids: Guid[];
  description?: string;
  previewSrc?: string;
}

export interface SpacesByGuid {
  [guid: string]: Space;
}

export interface GroupsByGuid {
  [guid: string]: Group;
}

export interface AssetsByGuid {
  [guid: string]: Asset;
}

export interface ProjectsByGuid {
  [guid: string]: Project;
}

export interface Space {
  guid: Guid;
  name: string;
  projectGuids: Guid[];
  description?: string;
  previewSrc?: string;
}

export interface SpaceByGuid {
  [guid: string]: Space;
}

export interface SpaceAssets {
  [spaceGuid: string]: {
    [groupGuid: string]: Asset[];
  };
}

export interface SpaceGroups {
  [spaceGuid: string]: Group[];
}

export interface SpaceProjects {
  [spaceGuid: string]: Project[];
}
