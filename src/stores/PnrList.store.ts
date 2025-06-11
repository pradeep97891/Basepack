import { createSlice } from "@reduxjs/toolkit";

interface initialStateType {
  selectedQueue: object;
  selectedAPI: string | undefined;
  queuePnrs: [];
  reloadPnrList : boolean
}

const initialState: initialStateType = {
  selectedQueue: {},
  selectedAPI: undefined,
  queuePnrs: [],
  reloadPnrList : false
};

const reducer = createSlice({
  name: "modal",
  initialState,
  reducers: {    
    // updateStartPnrSync: (state, { payload }) => {
    //   state.startPnrSync = payload;
    // },
    updateSelectedQueue: (state, { payload }) => {
      state.selectedQueue = payload;
      state.selectedAPI = undefined;
    },
    updateSelectedAPI: (state, { payload }) => {
      state.selectedAPI = payload;
      state.selectedQueue = {};
    },
    updateQueuePnrs: (state, { payload }) => {
      state.queuePnrs = payload;
    },
    updateReloadPNRList:(state) => {
      state.reloadPnrList = !state.reloadPnrList
    } 
  },
});

export const {
  actions: {
    updateSelectedQueue,
    updateSelectedAPI,
    updateQueuePnrs,
    updateReloadPNRList
  },
  reducer: PnrListReducer,
} = reducer;
