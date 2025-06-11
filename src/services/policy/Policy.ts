import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["policy"],
}).injectEndpoints({
  endpoints: (build) => ({
    // Get the Queue List
    getPolicies: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/policies/",
        method: "GET",
      }),
      providesTags: ["policy"],
    }),
    postPolicy: build.mutation<ApiResponse<any>, {}>({
      query: ({ policy }: any) => {
        return {
        url: "/policies/",
        method: "POST",
        body: policy,
        }
      },
    }),
    putPolicy: build.mutation<ApiResponse<any>, {}>({
      query: ({ policyId, putData }: any) => ({
        url: `/policies/${policyId}`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["policy"],
    }),
    deletePolicy: build.mutation<ApiResponse<any>, number | string>({
      query: (policyId: number | string) => ({
        url: `/policies/${policyId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["policy"],
    }),
    getPolicyCA: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/createPolicy/",
        method: "GET",
      }),
      providesTags: ["policy"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetPoliciesQuery,
  usePostPolicyMutation,
  usePutPolicyMutation,
  useDeletePolicyMutation,
  useLazyGetPolicyCAQuery,
} = service;
