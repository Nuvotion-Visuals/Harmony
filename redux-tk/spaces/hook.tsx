import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isEqual } from 'lodash';
import type { RootState } from '../store';
import * as selectors from './selectors';
import { slice } from './slice';
import type { Guid, Space, Project, Group, Asset } from './types';

export const useLexi = () => {
  const dispatch = useDispatch();

  return {
    // selectors
    activeSpace: useSelector(selectors.select_activeSpace, isEqual),
    activeProject: useSelector(selectors.select_activeProject, isEqual),
    activeGroup: useSelector(selectors.select_activeGroup, isEqual),
    activeAsset: useSelector(selectors.select_activeAsset, isEqual),
    spacesInfo: useSelector(selectors.select_spacesInfo, isEqual),
    
    // reducers
    addSpace: useCallback((payload: { guid: Guid; space: Space }) => {
      dispatch(slice.actions.addSpace(payload));
    }, [dispatch]),
    removeSpace: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeSpace(payload));
    }, [dispatch]),
    addProjectToSpace: useCallback((payload: { spaceGuid: Guid; projectGuid: Guid }) => {
      dispatch(slice.actions.addProjectToSpace(payload));
    }, [dispatch]),
    addGroupToProject: useCallback((payload: { projectGuid: Guid; groupGuid: Guid }) => {
      dispatch(slice.actions.addGroupToProject(payload));
    }, [dispatch]),
    addAssetToGroup: useCallback((payload: { groupGuid: Guid; assetGuid: Guid }) => {
      dispatch(slice.actions.addAssetToGroup(payload));
    }, [dispatch]),
    removeProject: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeProject(payload));
    }, [dispatch]),
    addGroup: useCallback((payload: { guid: Guid; group: Group }) => {
      dispatch(slice.actions.addGroup(payload));
    }, [dispatch]),
    removeGroup: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeGroup(payload));
    }, [dispatch]),
    addAsset: useCallback((payload: { guid: Guid; asset: Asset }) => {
      dispatch(slice.actions.addAsset(payload));
    }, [dispatch]),
    removeAsset: useCallback((payload: Guid) => {
      dispatch(slice.actions.removeAsset(payload));
    }, [dispatch]),
    setActiveSpaceGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveSpaceGuid(payload));
    }, [dispatch]),
    setActiveProjectGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveProjectGuid(payload));
    }, [dispatch]),
    setActiveGroupGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveGroupGuid(payload));
    }, [dispatch]),
    setActiveAssetGuid: useCallback((payload: Guid | null) => {
      dispatch(slice.actions.setActiveAssetGuid(payload));
    }, [dispatch]),
  };
};
