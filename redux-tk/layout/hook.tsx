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
    setActiveSwipeIndex: useCallback(payload => dispatch(slice.actions.setActiveSwipeIndex(payload)), [dispatch]),
    incrementActiveSwipeIndex: useCallback(() => dispatch(slice.actions.incrementActiveSwipeIndex()), [dispatch]),
  }
}