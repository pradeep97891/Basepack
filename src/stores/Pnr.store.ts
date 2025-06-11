import { createSlice, PayloadAction } from '@reduxjs/toolkit';

const initialState: {
  activePNR: any;
  activePNRDetails: {
    flightData: object[];
    paxInfo: object[];
    rescheduleStatus: string;
  };
  modifyDates: any,
  showPNRDrawer: boolean;
  selectedPNRsForAction: {
    action?: string;
    pnr?: [];
  };
  selectedPassengers: object[];
} = {
  activePNR: {},
  activePNRDetails: {
    flightData: [],
    paxInfo: [],
    rescheduleStatus: ''
  },
  modifyDates: undefined,
  showPNRDrawer: false,
  selectedPNRsForAction: {},
  selectedPassengers: []
};

const PNRReducers = createSlice({
  name: 'PNRReducer',
  initialState,
  reducers: {
    updateActivePNR: (prevState, { payload }: PayloadAction<any>) => {
      prevState.activePNR = payload;
    },
    updateActivePNRDetails: (prevState, { payload }: PayloadAction<any>) => {
      prevState.activePNRDetails = payload;
    },
    updateShowPNRDrawer: (prevState, { payload }: PayloadAction<any>) => {
      prevState.showPNRDrawer = payload;
    },
    updateSelectedPNRForAction: (prevState, { payload }: PayloadAction<any>) => {
      prevState.selectedPNRsForAction = payload;
    },
    updateModifyDates: (prevState, { payload }: PayloadAction<any>) => {
      prevState.modifyDates = payload;
    }
  }
});
export const {
  reducer: PNRReducer,
  actions: { updateActivePNR, updateActivePNRDetails, updateShowPNRDrawer, updateSelectedPNRForAction, updateModifyDates },
} = PNRReducers;
