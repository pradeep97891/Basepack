import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { IQueueList, IQueueData } from '@/services/queue/QueueTypes';

const initialState: {
  activeQueueId: string | number;
  RetrieveQueue: IQueueData | null;
  BackendQueue: IQueueData[];
  QueueList: IQueueList[];
  QueueNames: string[];
  isCreate: boolean;
  isUpdated: boolean;
  totalCount: number;
} = {
  activeQueueId: 0,
  QueueList: [],
  RetrieveQueue: null,
  QueueNames: [],
  BackendQueue: [],
  isCreate: true,
  isUpdated: false,
  totalCount: 0
};

const QueueReducers = createSlice({
  name: 'QueueReducer',
  initialState,
  reducers: {
    updateQueueName: (prevState, { payload }: PayloadAction<string[]>) => {
      prevState.QueueNames = payload;
    },
    updateActiveQueueId: (prevState, { payload }: PayloadAction<{ id: string | number }>) => {
      prevState.activeQueueId = payload.id;
      prevState.isCreate = payload.id === 0 ? true : false;
    },
    updateQueueList: (prevState, { payload }: PayloadAction<any>) => {
      prevState.QueueList = payload;
    },
    updateChangeInQueueList: (prevState, {payload}) => {
      prevState.isUpdated = payload;
    },
    updateQueueCount: (prevState, { payload }: PayloadAction<number>) => {
      prevState.totalCount = payload;
    }
  }
});
export const {
  reducer: QueueReducer,
  actions: { updateActiveQueueId, updateQueueList, updateChangeInQueueList, updateQueueCount }
} = QueueReducers;