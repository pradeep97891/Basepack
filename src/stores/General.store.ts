import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState: {
  messageApiValue?: {
    open: boolean;
    type: string;
    title?: string;
    description: string;
  };
  appliedFilters: {};
} = {
  messageApiValue: {
    open: false,
    type: "error" || "success" || "warning",
    title: "",
    description: "",
  },
  appliedFilters: {},
};

const reducer = createSlice({
  name: "rescheduleModule",
  initialState,
  reducers: {
    updateMessageApi: (state, { payload }: PayloadAction<any>) => {
      if (payload) state.messageApiValue = payload as any;
    },
    cleanUpMessageApi: (state) => {
      state.messageApiValue = initialState.messageApiValue;
    },
    resetAppliedFilter: (state, {payload}) => {
      state.appliedFilters = payload;
    },
  },
  extraReducers: () => {},
});

export const {
  reducer: GeneralReducer,
  actions: { updateMessageApi, cleanUpMessageApi, resetAppliedFilter },
} = reducer;
