import { CommonService } from "../Services";
import { ApiResponse } from "../ServiceTypes";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["score"]
}).injectEndpoints({
  endpoints: (build) => ({
    putScoreListData: build.mutation({
      query: ({ putData }: any) => ({
        url: `/scoreList/${putData.id}/`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["score"],
    }),
    postScoreListData: build.mutation<ApiResponse<any>, {}>({
      query: ({ policy }: any) => {
        return {
        url: "/scoreList/",
        method: "POST",
        body: policy,
      }
      },
      invalidatesTags: ["score"],
    }),
    deleteScoreListData: build.mutation<ApiResponse<any>, number | string>({
      query: (scoreId: number | string) => ({
        url: `/scoreList/${scoreId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["score"],
    }),
    getCreateScoreData: build.mutation<any[], {}>({
      query: () => "createScorePolicy"
    }),
    getScoreList: build.mutation<any[], {}>({
      query: () => "scoreList"
    }),
  }),
  overrideExisting: true,
});

export const {
  usePutScoreListDataMutation,
  useDeleteScoreListDataMutation,
  usePostScoreListDataMutation,
  useGetCreateScoreDataMutation, // Gets Create Score Data
  useGetScoreListMutation, // Gets Score List Table Data
} = service;



