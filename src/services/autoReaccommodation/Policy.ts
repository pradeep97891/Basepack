import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["autoReassingPolicy"],
}).injectEndpoints({
  endpoints: (build) => ({
    // Get the Queue List
    getAutoReassignPolicies: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/autoReassignPolicies/",
        method: "GET",
      }),
      providesTags: ["autoReassingPolicy"],
    }),
    postAutoReassignPolicy: build.mutation<ApiResponse<any>, {}>({
      query: ({ policy }: any) => {
        return {
        url: "/autoReassignPolicies/",
        method: "POST",
        body: policy,
        }
      },
    }),
    putAutoReassignPolicy: build.mutation<ApiResponse<any>, {}>({
      query: ({ policyId, putData }: any) => ({
        url: `/autoReassignPolicies/${policyId}`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["autoReassingPolicy"],
    }),
    deleteAutoReassignPolicy: build.mutation<ApiResponse<any>, number | string>({
      query: (policyId: number | string) => ({
        url: `/autoReassignPolicies/${policyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["autoReassingPolicy"],
    }),
    getAutoReassignPolicyCA: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/createAutoReassignPolicy/",
        method: "GET",
      }),
      providesTags: ["autoReassingPolicy"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetAutoReassignPoliciesQuery,
  usePostAutoReassignPolicyMutation,
  usePutAutoReassignPolicyMutation,
  useDeleteAutoReassignPolicyMutation,
  useLazyGetAutoReassignPolicyCAQuery,
} = service;
