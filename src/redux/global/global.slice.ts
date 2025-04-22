import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

export interface GlobalState {
  modalChangePasswordState: boolean;
  isOpenModal: boolean;
  siderKey: string;
  collapsed: boolean;
  modalUpdateUserInfoState: boolean;
}

const initialState: GlobalState = {
  modalChangePasswordState: false,
  isOpenModal: false,
  siderKey: "",
  collapsed: false,
  modalUpdateUserInfoState: true,
};

export const globalSlice = createSlice({
  name: "global",
  initialState,
  reducers: {
    setModalChangePasswordState: (
      state: GlobalState,
      action: PayloadAction<boolean>
    ) => {
      state.modalChangePasswordState = action.payload;
    },
    setIsOpenModalRedux: (
      state: GlobalState,
      action: PayloadAction<boolean>
    ) => {
      state.isOpenModal = action.payload;
    },
    setSiderKey: (state = initialState, actions: PayloadAction<any>) => {
      return {
        ...state,
        siderKey: actions.payload,
      };
    },
    setCollapsed: (state = initialState, action: PayloadAction<boolean>) => {
      return { ...state, collapsed: action.payload };
    },
    setModalChangeUserInfoState: (
      state = initialState,
      action: PayloadAction<boolean>
    ) => {
      return {
        ...state,
        ...{
          modalUpdateUserInfoState: action.payload,
        },
      };
    },
  },
});

export const {
  setModalChangePasswordState,
  setIsOpenModalRedux,
  setSiderKey,
  setCollapsed,
  setModalChangeUserInfoState,
} = globalSlice.actions;

export default globalSlice.reducer;
