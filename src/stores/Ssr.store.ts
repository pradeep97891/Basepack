import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SeatData } from '@/pages/Auth/AddSSR/AddSSRTypes';

interface RescheduleState {
  seatDetails?: SeatData;
  baggageDetails?: any;
  mealsDetails?: any;
  pnrData: any[];
}

const initialState: RescheduleState = {
  seatDetails: undefined,
  baggageDetails: undefined,
  mealsDetails: undefined,
  pnrData: []
};

const rescheduleModule = createSlice({
  name: 'rescheduleModule',
  initialState,
  reducers: {
    setSeatDetails: (state, { payload }: PayloadAction<{ value: SeatData }>) => {
      state.seatDetails = payload as any;
    },
    setSsrPNRData: (state, { payload }: PayloadAction<{ value: any }>) => {
      state.pnrData = payload.value;
    },
    cleanUpSetting: () => initialState,
  },
});

export const { 
  reducer: FlightSeatReducer, 
  actions 
} = rescheduleModule;

export const { 
  setSeatDetails, 
  setSsrPNRData,
  cleanUpSetting 
} = actions;