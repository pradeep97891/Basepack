import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";
import {
  AvailableFlight,
  IPnrListRequest,
  PnrHistoryData,
  IPnrListResponse,
  ScoreCardData,
} from "./RescheduleTypes";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["reschedule"],
}).injectEndpoints({
  endpoints: (build) => ({
    postDataService: build.mutation({
      query: (body) => ({
        url: "",
        method: "PUT",
        body
      }),
    }),
    getPnrsList: build.query<ApiResponse<IPnrListResponse[]>, IPnrListRequest>({
      query: (param) => ({ method: "GET", url: `preplannedPNRList`, params: param }),
      providesTags: ["reschedule"],
    }),
    getDashboardAdhocData: build.mutation<any[], {}>({
      query: () => "DashboardAdhoc"
    }),
    getDashboardPaxData: build.mutation<any[], {}>({
      query: () => "DashboardPax"
    }),
    getAttentionData: build.mutation<any[], {}>({
      query: () => "AttentionData"
    }),
    getNotificationData: build.mutation<any[], {}>({
      query: () => "NotificationData"
    }),
    getTurnAroundTimeData: build.mutation<any[], {}>({
      query: () => "TurnAroundTimeData"
    }),
    getSampleMailerData: build.mutation<any[], {}>({
      query: () => "SampleMailerData"
    }),
    getBarChartData: build.mutation<any[], {}>({
      query: () => "BarChartData"
    }),
    getLineChartData: build.mutation<any[], {}>({
      query: () => "LineChartData"
    }),
    getRecentAction: build.mutation<any[], {}>({
      query: () => "recent_data"
    }),
    getUpcomingEvent: build.mutation<any[], {}>({
      query: () => "upcomingevent"
    }),
    getChartData: build.mutation<any[], {}>({
      query: (userType) => ({
        url: "db_chart",
        method: "GET",
        params: userType
      })
    }),
    getFlightSchedule: build.mutation<any[], {}>({
      query: () => "disruption_data"
    }),
    getPnrDetail: build.mutation<any[], {}>({
      query: () => "pnr_history_data"
    }),
    getFlightSearchResponse: build.mutation<any[], {}>({
      query: () => "searchFlightList"
    }),
    getAvailableFlight: build.mutation<AvailableFlight[], {}>({
      query: () => "availableFlights"
    }),
    getSyncQueue: build.mutation<any[], {}>({
      query: () => "syncQueue"
    }),
    getUsersList: build.mutation<any[], {}>({
      query: () => "usersList"
    }),
    getCreateScoreData: build.mutation<any[], {}>({
      query: () => "createScore"
    }),
    getScoreList: build.mutation<any[], {}>({
      query: () => "scoreListOld"
    }),
    // getAdhocFlightList: build.mutation<PnrHistoryData[], {}>({
    //   query: () => "adhocFlightList",
    // }),
    // getPreplannedPnrList: build.mutation<any[], {}>({
    //   query: () => "preplannedPNRList",
    // }),
    // getFlightSeatData: build.mutation<any[], {}>({
    //   query: () => "Flight_Seat",
    // })
  }),
  overrideExisting: true,
});
export const {
  usePostDataServiceMutation,
  useLazyGetPnrsListQuery, // Gets PNR Data From PlanB Submission Using Param
  useGetSyncQueueMutation, // Gets Sync Flights/PNR Data Using Param
  useGetRecentActionMutation,
  useGetUpcomingEventMutation,
  useGetAttentionDataMutation,
  useGetTurnAroundTimeDataMutation,
  useGetSampleMailerDataMutation,
  useGetFlightSearchResponseMutation,
  useGetFlightScheduleMutation, //rescheduled flight list
  useGetPnrDetailMutation, //single pnr detail
  useGetChartDataMutation,
  useGetAvailableFlightMutation,
  useGetBarChartDataMutation, // Dashboard JSONs
  useGetDashboardAdhocDataMutation,
  useGetDashboardPaxDataMutation,
  useGetLineChartDataMutation,
  useGetNotificationDataMutation,
  useGetUsersListMutation, // Gets User List Table Data
  useGetCreateScoreDataMutation, // Gets Create Score Data
  useGetScoreListMutation, // Gets Score List Table Data
  // useGetAdhocFlightListMutation, // Gets Adhoc Flight List Table Data
  // useGetPreplannedPnrListMutation, // Gets Pre-planned list table data
  // useGetFlightSeatDataMutation
} = service;
