import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import { isEqual } from 'lodash';
import * as selectors from './selectors';
import { slice } from './slice';

export const useLayout_activeSwipeIndex = () => {
  return useSelector(selectors.selectActiveSwipeIndex, isEqual);
};

export const useLayout_incrementActiveSwipeIndex = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(slice.actions.incrementActiveSwipeIndex());
  }, [dispatch]);
};

export const useLayout_decrementActiveSwipeIndex = () => {
  const dispatch = useDispatch();
  return useCallback(() => {
    dispatch(slice.actions.deccrementActiveSwipeIndex());
  }, [dispatch]);
};

export const useLayout_setActiveSwipeIndex = () => {
  const dispatch = useDispatch();
  return useCallback((payload: number) => {
    dispatch(slice.actions.setActiveSwipeIndex(payload));
  }, [dispatch]);
};