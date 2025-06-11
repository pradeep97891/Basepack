import { ApiResponse } from '../ServiceTypes';
import { RescheduleService } from '../Services';
import {
  IQueueList,
  IQueueFilterParams,
  QueueDataInterface,
  queueErrorResponse,
  UpdateQueueRequestInterface
} from './QueueTypes';
const service = RescheduleService.enhanceEndpoints({
  addTagTypes: ['queue']
}).injectEndpoints({
  endpoints: (build) => ({
    // Get the Queue List
    getQueue: build.query<ApiResponse<IQueueList>, {}>({
      query: (params : {pageNumber : number | string}) => ({
        url: `/queue/?nolimit=Y&page=${params?.pageNumber}`,
        method: 'GET'
      }),
      providesTags: ['queue']
    }),

    // Get the Regular Action List
    getRegularAction: build.query<ApiResponse<IQueueList>, {}>({
      query: () => ({ url: '/queue/rule_actions/', method: 'GET' }),
      providesTags: ['queue']
    }),

    // Get the Queue List depends on selected ID
    getEditQueue: build.query<ApiResponse<any>, { queue_id: string | number }>({
      query: ({ queue_id }) => `/queue/${queue_id}/`
    }),

    // Get masterInfo data for popoup filter
    getQueueMasterInfo: build.query<ApiResponse<IQueueList>, {}>({
      query: () => ({ url: '/queue/masterInfo/', method: 'GET' }),
      providesTags: ['queue']
    }),
    
    getFilterQueueInfo: build.query<ApiResponse<IQueueList>, {}>({
      query: (params: IQueueFilterParams) => ({
        url: '/queue/',
        method: 'GET',
        params: {
          nolimit: 'Y',
          queue_number: params.queue_number,
          status: params.status,
          purpose: params.purpose,
          start_date: params.start_date,
          end_date: params.end_date
        }
      }),
      providesTags: ['queue']
    }),

    // Update the Edited Queue Data
    putEditQueue: build.query<ApiResponse<QueueDataInterface, queueErrorResponse>,UpdateQueueRequestInterface>({
      query: ({ queue_id, queue }) => ({
        url: `/queue/${queue_id}/`,
        method: 'PUT',
        body: queue
      })
    }),

    // Delete the particular Queue Data
    deleteQueue: build.mutation({
      query: (id) => ({
        url: "/queue/"+id+"/",
        method: "DELETE",
      })
    }),

    //create new Queue
    addqueue: build.query<ApiResponse<QueueDataInterface, queueErrorResponse>, UpdateQueueRequestInterface>({
      query: ({ queue }) => ({
        url: `/queue/`,
        method: 'POST',
        body: queue
      })
    })
  }),
  overrideExisting: true
});

export const {
  useLazyGetQueueQuery,
  useLazyGetEditQueueQuery,
  useLazyGetQueueMasterInfoQuery,
  useLazyGetFilterQueueInfoQuery,
  useLazyAddqueueQuery,
  useLazyPutEditQueueQuery,
  useDeleteQueueMutation,
  useLazyGetRegularActionQuery
} = service;
