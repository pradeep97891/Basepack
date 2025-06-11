import { decryptData } from "@/hooks/EncryptDecrypt.hook";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const storageKey = process.env.REACT_APP_STORAGE_PREFIX + "airlineCode";
const encryptedTheme = sessionStorage.getItem(storageKey);

// Decrypt and validate the theme once
const decryptedTheme = encryptedTheme ? decryptData(encryptedTheme) : null;

// Set default values
let dynamic_baseUrl = process.env.REACT_APP_MOCK_API_URL;

if (decryptedTheme === "GF") {
  dynamic_baseUrl = process.env.REACT_APP_MOCK_API_GF_URL;
}


const prepareHeader = (headers: Headers) => {
  const user = localStorage.getItem(process.env.REACT_APP_STORAGE_PREFIX + "user") as any;
 
  if (user) {
    const token = JSON.parse(atob(user))?.token;
    token && headers.set("X-XSRF-TOKEN", token);
  }
  return headers;
};


const AuthService = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_AUTH_API_URL,
    credentials: "include",
    prepareHeaders: prepareHeader,
  }),
  endpoints: () => ({}),
});

const EmailService = createApi({
  reducerPath: "emailApi",
  baseQuery: async (args, api, extraOptions) => {
    const result = await fetchBaseQuery({
      baseUrl: process.env.REACT_APP_MAIL_API_URL,
      credentials: "include",
      prepareHeaders: async (headers) => {
        try {
          const endPoint = process.env.REACT_APP_MAIL_API_URL;
          const tokenResponse = await fetch(
            `${endPoint?.substring(0, endPoint.lastIndexOf("/"))}/createtoken/`,
            {
              method: "POST",
              credentials: "include",
              headers: {
                ...args.headers,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                email_id: "superadmin@grmapi.com",
                password: "!NFI@$upeR",
              }),
            }
          );

          if (tokenResponse.ok) {
            const data = await tokenResponse.json();
            headers.set("Authorization", `Bearer ${data?.access}`);
          } else {
            throw new Error("Failed to refresh access token");
          }
        } catch (error) {
          console.error(error);
        }
      },
    })(args, api, extraOptions);

    return result;
  },
  endpoints: () => ({}),
});

const RescheduleService = createApi({
  reducerPath: "rescheduleApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_API_URL,
    credentials: "include",
    prepareHeaders: prepareHeader,
  }),
  endpoints: () => ({}),
});

const CommonService = createApi({
  reducerPath: "CommonApi",
  baseQuery: fetchBaseQuery({
    baseUrl: dynamic_baseUrl,
    credentials: "include",
    prepareHeaders: prepareHeader,
  }),
  endpoints: () => ({}),
});

const NotificationService = createApi({
  reducerPath: "notificationApi",
  baseQuery: fetchBaseQuery({
    baseUrl: process.env.REACT_APP_PUSH_API_URL,
    credentials: "include",
    prepareHeaders: prepareHeader,
  }),
  endpoints: () => ({}),
});

export {
  RescheduleService,
  CommonService,
  EmailService,
  AuthService,
  NotificationService,
};
