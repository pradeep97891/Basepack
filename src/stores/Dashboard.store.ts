import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: { chartTimeLine?: any } = {
  chartTimeLine: 'this_week'
};

const reducer = createSlice({
  name: 'rescheduleModule',
  initialState,
  reducers: {
    updateChartTimeLine: (state, { payload }: PayloadAction<{ value: any }>) => {
      if (payload) {
        state.chartTimeLine = payload as any;
      }
    },
    cleanUpSetting: () => {
      return {};
    }
  },
  extraReducers: () => {}
});

export const {
  reducer: DashboardReducer,
  actions: { updateChartTimeLine, cleanUpSetting }
} = reducer;
