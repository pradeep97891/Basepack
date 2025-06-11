interface CommonReaccommodate {
  flightNumber: string;
  sector: string;
  departureDate: string;
}

export interface IPnrListRequest extends CommonReaccommodate {
  PNR: string;
  emailId: string;
}

export interface IQueuePnrListRequest {
  queueId : string
}

export interface IQueuePnrListResponse {
  
}

export interface IPnrListResponse extends CommonReaccommodate {
  PNR: string;
  firstName: string;
  lastName: string;
  emailId: string;
  status: string;
}

export interface AvailableFlight extends CommonReaccommodate {
  seatLeft: number;
  status: string;
}

export interface ReaccommodatedList extends CommonReaccommodate {
  PNR: string;
  reaccommodatedFlightNumber: string;
  paxCout: number;
}

interface keyInteface {
  key: number;
}

export interface PnrListTable extends IPnrListResponse, keyInteface {
  pnrNumber: string;
  reassigned: string;
  active: string;
  id: string;
  paxCount: ReactNode;
  arrDate: ReactNode;
  arrTime: ReactNode;
  depTime: ReactNode;
  scoreStatus: ReactNode;
  scoreRating: ReactNode;
}

export interface AvailableFlightTable extends AvailableFlight, keyInteface {
  paxCount: string;
  duration: string;
  stops: string;
  active: string;
  data: any;
  pnrNumber: string;
  arrDate: string;
  arrTime: string;
  depTime: string;
  scoreStatus: string;
  scoreRating: string;
  id: string;
}


export interface TableDataType {
  key?: string;
  flightNumber: string;
  reassignedFlightNo: string;
  departureDate: string;
  // pnrNo: number | string;
  addedPaxCount: number;
  journey: string;
  status: string;
}

export interface PnrHistoryData {
  id: number;
  flightNumber: string;
  reassignedFlightNo: string;
  departureDate: string;
  PNRCount: number | string;
  addedPaxCount: number;
  sector: string;
  status: string;
}

interface scoreSelectOptions {
  value: string;
  label: string;
}

export interface ScoreSelectValue {
  inputValue: ValueType;
  options: DefaultOptionType[] | undefined;
  defaultValue: any;
  score: string;
  type: string;
}

interface ScoreContentData {
  typeTitle: string;
  typeScore: string;
  score: ScoreSelectValue[];
}

interface ScoreAttribute {
  type: string;
  selected: boolean;
}

interface ScoreCardDataInterface {
  title: string;
  content: string;
  cardData: ScoreContent[];
  scoreAttributes: ScoreAttribute[];
}

export interface ScoreCardData {
  Passenger: ScoreCardDataInterface[];
  Flight: ScoreCardDataInterface[];
}

export interface PassengerList {
  id: number,
  name: string,
  age: number,
  gender: string,
  seat: {
    seatNumber: number,
    seatType: string,
    seatIcon: string
  },
  baggage: {
    baggageSelected: string,
    baggageIcon: string,
  },
  meal: {
    mealSelected: '',
    mealIcon: string,
  }
}