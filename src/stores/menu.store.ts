import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  menuServiceData?: any;
  local_menu?: any;
  currentMenuData?: any;
  currentSubMenuData?: any;
} = {};

const reducer = createSlice({
  name: "templateProject",
  initialState,
  reducers: {
    setMenuServiceData: (state, { payload }: PayloadAction<any>) => {
      if (payload) state.menuServiceData = payload;
    },
    setlocalMenuData: (
      state,
      { payload }: PayloadAction<{ local_menuData: any }>
    ) => {
      if (payload) {
        state.local_menu = payload.local_menuData;
      }
    },
    setMenuSelectionData: (
      state,
      {
        payload,
      }: PayloadAction<{ currentMenuData: string; currentSubMenuData: string }>
    ) => {
      if (payload) {
        state.currentMenuData = payload.currentMenuData;
        state.currentSubMenuData = payload.currentSubMenuData;
      }
    },
    cleanUpSetting: () => {
      return {};
    },
  },
  extraReducers: () => {},
});

export const {
  reducer: MenuServiceReducer,
  actions: {
    setMenuServiceData,
    setlocalMenuData,
    setMenuSelectionData,
    cleanUpSetting,
  },
} = reducer;
