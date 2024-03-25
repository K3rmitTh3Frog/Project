import { configureStore, combineReducers } from '@reduxjs/toolkit'
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux'
import MasterReducer from './reducers/MasterReducer'
import { persistStore, persistReducer } from 'redux-persist'
import AsyncStorage from '@react-native-async-storage/async-storage'
import ToDoReducer from './reducers/ToDoReducer'
import LoadingReducer from './reducers/LoadingReducer'
import CredentialReducer from './reducers/CredentialReducer'

const reducers = combineReducers({
    loading: LoadingReducer,
    credentials: CredentialReducer,
})

const persistedReducers = combineReducers({
    master: MasterReducer,
    todo: ToDoReducer,
})

// this is for local storage, whenever you save to redux it will save to localstorage as middleware
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
}

const persistedReducer = persistReducer(persistConfig, persistedReducers)

const finalReducers = combineReducers({
    saved: persistedReducer,
    normal: reducers,
})

const store = configureStore({
    reducer: finalReducers,
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})

export type RootState = ReturnType<typeof store.getState>
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch
export const useAppDispatch: () => AppDispatch = useDispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const persistor = persistStore(store)

export default store
