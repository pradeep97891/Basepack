interface FlightData {
  flight_id: number;
  origin: string;
  destination: string;
  flight_number: number;
  departure: string;
  departure_time: string;
  departure_time_format: string;
  arrival: string;
  arrival_time: string;
  arrival_time_format: string;
  flight_status_name: string;
  flight_status_code: string;
  suggested_flight?: FlightData;
}

export interface Passenger {
  passenger_id: number;
  first_name: string;
  last_name: string;
  type: string;
  passenger_status_name: string;
  passenger_status_code: string;
}

interface PassengerData {
  type: string;
  total_pax: number;
  named_pax_count: number;
  unnamed_pax_count: number;
  pax_info: Passenger[];
}

export interface FlightAndPassengerData {
  flightData: {
    flightData: FlightData;
    status: string;
    date: string;
  }[];
  passengerData: PassengerData[];
  rescheduleState: string;
}
