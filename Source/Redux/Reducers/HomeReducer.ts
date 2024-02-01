import {createSlice} from '@reduxjs/toolkit';

const initialState = {
  HomeLoading: false,
};

const HomeReducer = createSlice({
  name: 'Home',
  initialState,
  reducers: {
    SetHomeLoading: (state, action) => {
      state.HomeLoading = action.payload;
    },
  },
});

export const {SetHomeLoading} = HomeReducer.actions;

export default HomeReducer.reducer;
