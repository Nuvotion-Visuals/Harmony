import { useDispatch, useSelector } from 'react-redux'
import { useCallback } from 'react'
import { isEqual } from 'lodash'

import * as selectors from './selectors'

import { slice } from './slice'

export const useLayout = () => {
  const dispatch = useDispatch()

  return {
    // selectors
    activeSwipeIndex: useSelector(selectors.selectActiveSwipeIndex, isEqual),

    // actions
    incrementActiveSwipeIndex: useCallback(() => dispatch(slice.actions.incrementActiveSwipeIndex()), [dispatch]),
    decrementActiveSwipeIndex: useCallback(() => dispatch(slice.actions.deccrementActiveSwipeIndex()), [dispatch]),
    setActiveSwipeIndex: useCallback((payload: number) => dispatch(slice.actions.setActiveSwipeIndex(payload)), [dispatch]),
  }
}