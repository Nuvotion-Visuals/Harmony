// redux
import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { batchedSubscribe } from 'redux-batched-subscribe'

import { debounce } from 'lodash'

// slices
import { slice as layoutSlice } from './layout/slice'
import { slice as lexiSlice } from './lexi/slice'

const debounceNotify = debounce(notify => notify())

const rootReducer = combineReducers({
  layout: layoutSlice.reducer,
  lexi: lexiSlice.reducer
})

export const store = configureStore({
  // object of slice reducers automatically creating the root reducer
  reducer: rootReducer,

  // array of Redux middleware functions
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    logger
  ],

  // enable support for the Redux DevTools browser extension
  devTools: process.env.NODE_ENV !== 'production',

  // these will be passed to the Redux compose function, 
  // and the combined enhancer will be passed to createStore.
  // useful for cases where a store enhancer needs to be added in front of applyMiddleware, 
  // such as redux-first-router or redux-offline
  enhancers: [
    batchedSubscribe(debounceNotify)
  ]
})

export type RootState = ReturnType<typeof store.getState>

export const getStore = () => store
