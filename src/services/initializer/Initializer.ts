import { ApiResponse } from "../ServiceTypes";
import { CommonService } from "../Services";
import { RouterResponse, MenuInterface, MenuServiceInterface } from "./InitializerTypes";
export interface menuRequest {
  url: string;
}
const service = CommonService.enhanceEndpoints({}).injectEndpoints({  
  endpoints: (build) => ({
    getRoutes: build.mutation<ApiResponse<RouterResponse[]>, {}>({
      query: () => "routes"
    }),
    getLandingRoutes: build.mutation<ApiResponse<RouterResponse[]>, {}>({
      query: () => "landingRoutes"
    }),
    // getMenus: build.mutation<ApiResponse<MenuInterface[]>, {}>({
    //   query: (userType) => ({ url: "menu", method: "GET", params: userType }),
    // }),
       getMenus: build.mutation<ApiResponse<MenuInterface[]>, {}>({
        query: () => "menu"
    }),
    getMenusRoute: build.mutation<ApiResponse<MenuInterface[]>, {}>({
      query: () => "menu/reschedule"
    }),
    getMenuService: build.mutation<MenuServiceInterface[], menuRequest>({
      // query: () => "menu"
      query: (param) => {
        return {
          url: param.url
        };
      }
    })
  }),
  overrideExisting: true,
  
});

export const {
  useGetRoutesMutation,
  useGetLandingRoutesMutation,
  useGetMenusMutation,
  useGetMenusRouteMutation,
  useGetMenuServiceMutation,


} = service;
