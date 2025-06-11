import { EmailService } from "../Services";

const service = EmailService.enhanceEndpoints({
  addTagTypes: ["emailApi"],
}).injectEndpoints({
  endpoints: (build) => ({
    getTemplatesList: build.query<any, any>({
      query: () => ({
        method: "GET",
        url: `template/?folder=${process.env.REACT_APP_MAIL_RESCHEDULE_TEMPLATE_FOLDER_ID}`
      }),
      providesTags: ["emailApi"],
    }),
    getTemplate: build.query<any, any>({
      query: () => ({
        method: "GET",
        url: `template/6071/?folder=${process.env.REACT_APP_MAIL_RESCHEDULE_TEMPLATE_FOLDER_ID}`
      }),
      providesTags: ["emailApi"],
    }),
    getPreviewTemplate: build.mutation<any, any[]>({
      query: (data) => {
        return { method: "POST", url: "template/preview/", body: data };
      },
    }),
    sendEmail: build.mutation<any, any[]>({
      query: (data) => {
        return { method: "POST", url: "trigger_servicev3/", body: data };
      }
    })
  }),
});

export const {useLazyGetTemplatesListQuery, useLazyGetTemplateQuery, useGetPreviewTemplateMutation, useSendEmailMutation } =
  service;
