import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import * as Types from './types';

interface SpaceState {
  spaceGuids: Types.Guid[];
  spacesByGuid: Types.SpacesByGuid;
  projectGuids: Types.Guid[];
  projectsByGuid: Types.ProjectsByGuid;
  groupGuids: Types.Guid[];
  groupsByGuid: Types.GroupsByGuid;
  assetGuids: Types.Guid[];
  assetsByGuid: Types.AssetsByGuid;
  activeSpaceGuid: Types.Guid | null;
  activeProjectGuid: Types.Guid | null;
  activeGroupGuid: Types.Guid | null;
  activeAssetGuid: Types.Guid | null;
}

export const slice = createSlice({
  name: 'spaces',
  initialState: <SpaceState>{
    spaceGuids: [],
    spacesByGuid: {},
    projectGuids: [],
    projectsByGuid: {},
    groupGuids: [],
    groupsByGuid: {},
    assetGuids: [],
    assetsByGuid: {},
    activeSpaceGuid: null,
    activeProjectGuid: null,
    activeGroupGuid: null,
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
    addProjectToSpace: (state, action: PayloadAction<{ spaceGuid: Types.Guid; projectGuid: Types.Guid }>) => {
      const { spaceGuid, projectGuid } = action.payload;
      const space = state.spacesByGuid[spaceGuid];
      if (space) {
        space.projectGuids.push(projectGuid);
      }
    },
    addGroupToProject: (state, action: PayloadAction<{ projectGuid: Types.Guid; groupGuid: Types.Guid }>) => {
      const { projectGuid, groupGuid } = action.payload;
      const project = state.projectsByGuid[projectGuid];
      if (project) {
        project.groupGuids.push(groupGuid);
      }
    },
    addAssetToGroup: (state, action: PayloadAction<{ groupGuid: Types.Guid; assetGuid: Types.Guid }>) => {
      const { groupGuid, assetGuid } = action.payload;
      const group = state.groupsByGuid[groupGuid];
      if (group) {
        group.assetGuids.push(assetGuid);
      }
    },
    addProject: (state, action: PayloadAction<{ guid: Types.Guid; project: Types.Project }>) => {
      const { guid, project } = action.payload;
      state.projectGuids.push(guid);
      state.projectsByGuid[guid] = project;
    },
    removeProject: (state, action: PayloadAction<Types.Guid>) => {
      const guidToRemove = action.payload;
      state.projectGuids = state.projectGuids.filter((guid) => guid !== guidToRemove);
      delete state.projectsByGuid[guidToRemove];
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
    setActiveProjectGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeProjectGuid = action.payload;
    },
    setActiveGroupGuid: (state, action: PayloadAction<Types.Guid | null>) => {
      state.activeGroupGuid = action.payload;
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
    updateProject: (state, action: PayloadAction<{ guid: Types.Guid; project: Types.Project }>) => {
      const { guid, project } = action.payload;
      state.projectsByGuid[guid] = {
        ...state.projectsByGuid[guid],
        ...project,
      };
    },
    updateGroup: (state, action: PayloadAction<{ guid: Types.Guid; group: Types.Group }>) => {
      const { guid, group } = action.payload;
      state.groupsByGuid[guid] = {
        ...state.groupsByGuid[guid],
        ...group,
      };
    },
    updateAsset: (state, action: PayloadAction<{ guid: Types.Guid; asset: Types.Asset }>) => {
      const { guid, asset } = action.payload;
      state.assetsByGuid[guid] = {
        ...state.assetsByGuid[guid],
        ...asset,
      };
    },
  }
})