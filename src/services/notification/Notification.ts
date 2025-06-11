import { NotificationService } from '../Services';

const service = NotificationService.injectEndpoints({
  endpoints: (build) => ({
    pushToken: build.mutation({
      query: (payload) => ({
        url: '/token/',
        method: 'POST',
        body: payload
      })
    }),
    getMessage: build.mutation({
      query: (payload) => ({
        url: '/message/',
        method: 'GET',
        params: payload
      })
    }),
    updateMessageStatus: build.mutation({
      query: (payload) => ({
        url: '/message/',
        method: 'PUT',
        body: payload
      })
    })
  }),
  overrideExisting: true
});
export const { usePushTokenMutation, useGetMessageMutation, useUpdateMessageStatusMutation } = service;
