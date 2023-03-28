import type { RootState } from 'redux-tk/store';
import { createSelector } from 'reselect';

export const selectActiveSwipeIndex = createSelector(
  (state: RootState) => state.layout.activeSwipeIndex,
  (activeSwipeIndex) => activeSwipeIndex
);