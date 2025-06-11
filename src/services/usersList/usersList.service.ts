import { RescheduleService } from "../Services";

const service = RescheduleService.enhanceEndpoints({
  addTagTypes: ["usersList"]
}).injectEndpoints({
  endpoints: (build) => ({
    putUserData: build.mutation({  // To update single user data
      query: (data) => {
        let id = data.id;
        let updatedData = data?.value;
        return {
          url: "/user/"+id+"/",
          method: "PUT",
          body: updatedData
        }
      }
    }),
    getUserData: build.mutation({ // To get single user data
      query: (data) => ({
        url: "/user/" + data,
        method: "GET"
      })
    }),
    deleteUserData: build.mutation({ // To delete single user data
      query: (id) => ({
        url: "/user/"+id+"/",
        method: "DELETE",
      })
    }),
    // getUsersList: build.mutation<any[], {}>({  // To get full users list
    //   query: () => "users"
    // }),
    getUsersList: build.mutation<any[], {}>({  // To get full users list
      query: (params : {pageNumber : number | string}) => ({
        url: `/users/?nolimit=Y&page=${params?.pageNumber}`,
        method: 'GET'
      }),
    }),
    // Get the Queue List
    // getUsersListByPage: build.query<any, {}>({
    //   query: (params : {pageNumber : number | string}) => ({
    //     url: `/users/?nolimit=Y&page=${params?.pageNumber}`,
    //     method: 'GET'
    //   }),
    //   providesTags: ['usersList']
    // }),
    postUserDataIntoList: build.mutation<any[], {}>({  // To create new user in users list
      query: (body) => ({
        url: "/users/",
        method: "POST",
        body
      })
    }),
    getUsersGroupList: build.mutation<any[], {}>({  // To get user group list
      query: () => "auth_groups"
    })
  }),
  overrideExisting: true,
});

export const {
  usePutUserDataMutation,
  useGetUserDataMutation,
  useDeleteUserDataMutation,
  useGetUsersListMutation,
  // useLazyGetUsersListByPageQuery,
  useGetUsersGroupListMutation,
  usePostUserDataIntoListMutation
} = service;



