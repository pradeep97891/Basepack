export interface SeatColDetail {
  item: string;
  icon: string;
  seat_number: string;
}
export type SeatRow = SeatColDetail[];
export type SeatData = SeatRow[];

export interface TicketDetail {
  id?: number;
  isChecked?: boolean;
  passengerDetail?: PassengerDetail;
  seatDetail?: SeatDetail;
  baggage_detail?: BaggageDetail;
  meals_detail?: MealsDetail;
  total?: string;
  isSeatChecked?: boolean;
  isBaggageChecked?: boolean;
  isMealsChecked?: boolean;
}
export interface PassengerDetail {
  name: string;
  age: string | number;
  gender: string;
  pnr: string;
}
export interface SeatDetail {
  number: string;
  type: string;
  item: string;
  price: string | number;
  icon?: string;
  selected: boolean;
}
export interface BaggageDetail {
  weight: string;
  price: string | number;
  selected: boolean;
}
export interface MealsDetail {
  name: string;
  price: string | number;
  selected: boolean;
}