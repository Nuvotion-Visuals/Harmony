import { configureStore, combineReducers } from '@reduxjs/toolkit'
import logger from 'redux-logger'
import { batchedSubscribe } from 'redux-batched-subscribe'
import { debounce } from 'lodash'
import { slice as layoutSlice } from './layout/slice'
import { slice as lexiSlice } from './lexi/slice'
import { slice as spacesSlice } from './spaces/slice'

const debounceNotify = debounce(notify => notify())

const rootReducer = combineReducers({
  layout: layoutSlice.reducer,
  lexi: lexiSlice.reducer,
  spaces: spacesSlice.reducer
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: getDefaultMiddleware => [
    ...getDefaultMiddleware(),
    logger
  ],
  devTools: process.env.NODE_ENV !== 'production',
  enhancers: [
    batchedSubscribe(debounceNotify)
  ]
})

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;

export const getStore = () => store