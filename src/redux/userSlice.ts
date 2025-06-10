import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface UserState {
  userInfo: any | null;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  userInfo: null,
  isAuthenticated: false,
};

export const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUserInfo: (state, action: PayloadAction<any>) => {
      state.userInfo = action.payload;
      state.isAuthenticated = true;
    },
    clearUserInfo: (state) => {
      state.userInfo = null;
      state.isAuthenticated = false;
    },
  },
});

export const { setUserInfo, clearUserInfo } = userSlice.actions;

export default userSlice.reducer;
