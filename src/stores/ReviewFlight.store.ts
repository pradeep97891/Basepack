import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface FCFlightDetailInterface {
  flight_id: number | string;
  origin: string;
  destination: string;
  flight_number: string | number;
  departure: string;
  arrival: string;
  flight_status_name: string;
  flight_status_code: string;
  suggested_flight?: {
    flight_id: number | string;
    origin: string;
    destination: string;
    flight_number: number | string;
    departure: string;
    arrival: string;
    flight_status_name: string;
    flight_status_code: string;
  };
  RescheduleStatus?: string;
}

export interface FCPassengerDetailInterface {
  passenger_id: number | string;
  first_name: string;
  last_name: string;
  type: string;
  passenger_status_name: string;
  passenger_status_code: string;
}

export interface FCReviewFlightInterface {
  flight_detail: FCFlightDetailInterface[];
  passender_detail: FCPassengerDetailInterface[];
  RescheduleStatus?: string;
}

const initialState:  any  = {
  reviewFlightDetail: {
    flightData: [],
    isBack: false,
    isEdit: false,
    isReview: true,
    overAllStatus: ''
  },
  reviewStatus:'',
  disruptedPNRData: {},
  original_flight_data: [],
  totalFlightData: [],
  // pnrData:[],
  nextPage: ''
};

const reducer = createSlice({
  name: 'rescheduleModule',
  initialState,
  reducers: {
    setDisruptedPNRData: (state, data: PayloadAction<any>) => {
      if(data.payload) {
        state.disruptedPNRData = data.payload;
      }
    },
    setReviewFlightDetail: (state, { payload }: PayloadAction<any>) => {
      if (payload) {
        state.reviewFlightDetail = payload;
      }
    },
    setRebookedData: (state, { payload }: PayloadAction<any>) => {
      if (payload) {
        state.reviewStatus = payload.rescheduleStatus;
      }
    },
    setTotalFlightData: (state, data: PayloadAction<any>) => {
      if(data) {
        state.totalFlightData = data.payload;
      }
    },
    setOriginalFlightData: (state, data: PayloadAction<any>) => {
      if(data) {
        state.original_flight_data = data.payload;
      }
    },
    setNextPage: (state, data: PayloadAction<any>) => {
      if(data) {
        state.nextPage = data.payload;
      }
    },
    cleanUpSetting: () => {
      return {};
    }
  },
  extraReducers: () => {}
});

export const {
  reducer: ReviewFlightReducer,
  actions: { setDisruptedPNRData, setReviewFlightDetail, setRebookedData, setTotalFlightData, setOriginalFlightData, setNextPage, cleanUpSetting }
} = reducer;
