import {configureStore} from '@reduxjs/toolkit';
import {AppReducer, DBReducer, HomeReducer, LoginReducer} from './Reducers';
import {useDispatch} from 'react-redux';

const Store = configureStore({
  reducer: {
    LoginReducer,
    HomeReducer,
    AppReducer,
    DBReducer,
  },
});

export type RootState = ReturnType<typeof Store.getState>;
export type AppDispatch = typeof Store.dispatch;
export const useAppDispatch = () => useDispatch<AppDispatch>();

export default Store;
