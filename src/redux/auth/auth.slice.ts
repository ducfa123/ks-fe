import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Permission } from "../../types";
import { StoreService } from "../../utils";

export interface AuthState {
  isLogin: boolean;
  info: {
    _id: string;
    ho_ten: string;
    tai_khoan: string;
    phong_ban: string | null;
    vai_tro: string;
    so_du: number | null;
    email: string | null;
    sdt: string | null;
  } | null;
  permission: Array<Permission>;
  token: string | null;
  id_token: string | null;
  permissedSiderItems: any[];
}

const initialState: AuthState = {
  isLogin: false,
  info: null,
  permission: [],
  token: null,
  id_token: null,
  permissedSiderItems: [],
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (
      state: AuthState,
      action: PayloadAction<{
        _id: string;
        ho_ten: string;
        tai_khoan: string;
        phong_ban: string | null;
        vai_tro: string;
        so_du: number | null;
        email: string | null;
        sdt: string | null;
      }>
    ) => {
      state.isLogin = true;
      state.info = action.payload;
    },
    updatePermisson: (
      state: AuthState,
      action: PayloadAction<Array<Permission>>
    ) => {
      if (state.isLogin) state.permission = action.payload;
    },
    logout: (state: AuthState) => {
      state.isLogin = false;
      state.info = null;
      state.permission = [];
      state.id_token = null;
      StoreService.setAuthToken(null);
      state.permissedSiderItems = [];
      localStorage.clear();
    },
    setToken: (state: AuthState, action: PayloadAction<string>) => {
      state.token = action.payload;
      StoreService.setAuthToken(action.payload);
      console.log('Auth token set in Redux:', action.payload ? 'TOKEN_SET' : 'TOKEN_CLEARED');
    },
    setIdToken: (state: AuthState, action: PayloadAction<string>) => {
      state.id_token = action.payload;
    },
    updateInfo: (
      state: AuthState,
      action: PayloadAction<{
        _id: string;
        ho_ten: string;
        tai_khoan: string;
        phong_ban: string | null;
        vai_tro: string;
        so_du: number | null;
        email: string | null;
        sdt: string | null;
      }>
    ) => {
      state.isLogin = true;
      state.info = action.payload;
    },
    setPermissedSiderItems: (state: any, action: PayloadAction<any>) => {
      state.permissedSiderItems = action.payload;
    },
  },
});

// Add a selector to easily check if user is logged in
export const selectIsLoggedIn = (state: { auth: AuthState }) => state.auth.isLogin;
export const selectAuthToken = (state: { auth: AuthState }) => state.auth.token;
export const selectUserInfo = (state: { auth: AuthState }) => state.auth.info;

export const {
  loginSuccess,
  updatePermisson,
  logout,
  setToken,
  setIdToken,
  updateInfo,
  setPermissedSiderItems,
} = authSlice.actions;

export default authSlice.reducer;