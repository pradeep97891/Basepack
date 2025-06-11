import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";

const service = CommonService.enhanceEndpoints({
  addTagTypes: ["common"],
}).injectEndpoints({
  endpoints: (build) => ({
    getSavedFilters: build.query<ApiResponse<any>, {}>({
      query: () => ({
        url: "/filters/",
        method: "GET",
      }),
      providesTags: ["common"],
    }),
    saveFilter: build.mutation<ApiResponse<any>, {}>({
      query: (filters: any) => {
        return {
          url: "/",
          method: "PUT",
          body: { service_name: "filters", data: filters },
        };
      },
      invalidatesTags: ["common"],
    }),
    updateSavedFilter: build.mutation<ApiResponse<any>, {}>({
      query: ({ filterId, putData }: any) => ({
        url: `/filters/${filterId}`,
        method: "PUT",
        body: putData,
      }),
      invalidatesTags: ["common"],
    }),
    deleteSavedFilter: build.mutation<ApiResponse<any>, number | string>({
      query: (filterId: number | string) => ({
        url: `/policies/${filterId}`,
        method: "DELETE",
      }),
      invalidatesTags: ["common"],
    }),
  }),
  overrideExisting: true,
});

export const {
  useLazyGetSavedFiltersQuery,
  useUpdateSavedFilterMutation,
  useSaveFilterMutation,
  useDeleteSavedFilterMutation,
} = service;
