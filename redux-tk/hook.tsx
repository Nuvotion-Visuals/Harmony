import {
  useSelector as useReduxSelector,
  TypedUseSelectorHook,
} from 'react-redux'
import type { RootState } from './store'

export const useSelector: TypedUseSelectorHook<RootState> = useReduxSelector