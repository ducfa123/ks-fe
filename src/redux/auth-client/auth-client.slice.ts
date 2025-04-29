import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { StoreService } from "../../utils";

export interface AuthClientState {
  isLogin: boolean;
  info: any;
  token: string | null;
}

const initialState: AuthClientState = {
  isLogin: false,
  info: null,
  token: null,
};

export const authClientSlice = createSlice({
  name: "authClient",
  initialState,
  reducers: {
    loginClientSuccess: (
      state: AuthClientState,
      action: PayloadAction<any>
    ) => {
      state.isLogin = true;
      state.info = action.payload;
    },
    logoutClient: (state: AuthClientState) => {
      state.isLogin = false;
      state.info = null;
      state.token = null;
      StoreService.setAuthToken(null);
      localStorage.clear();
    },
    setClientToken: (state: AuthClientState, action: PayloadAction<string>) => {
      state.token = action.payload;
      StoreService.setAuthToken(action.payload);
    },
    updateClientInfo: (
      state: AuthClientState,
      action: PayloadAction<any>
    ) => {
      state.isLogin = true;
      state.info = action.payload;
    },
  },
});

export const {
  loginClientSuccess,
  logoutClient,
  setClientToken,
  updateClientInfo,
} = authClientSlice.actions;

export default authClientSlice.reducer;
