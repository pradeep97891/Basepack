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

const initialState: {
  selectedPassengers: FCPassengerDetailInterface[];
} = {
  selectedPassengers: []
};

const reducer = createSlice({
  name: 'rescheduleModule',
  initialState,
  reducers: {
    updateSelectedPassengersList: (prevState, { payload }: PayloadAction<any>) => {
      prevState.selectedPassengers = payload;
    }
  },
  extraReducers: () => {}
});

export const {
  reducer: PassengerListReducer,
  actions: { updateSelectedPassengersList }
} = reducer;
