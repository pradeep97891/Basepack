import { ApiResponse } from '../ServiceTypes';
import { AuthService } from '../Services';
import { AuthResponseData, ForgotPassword, UnAuththenticatedUser } from './UserTypes';

// auth url is different for backend
const AUTH_URL = process.env.REACT_APP_API_URL?.substr(0, process.env.REACT_APP_API_URL.lastIndexOf('/'));
// injecting authentication service into base service
const service = AuthService.injectEndpoints({
  endpoints: (build) => ({
    initialAuthService: build.mutation<'', void>({
      query: () => ({
        method: 'POST',
        url: `${AUTH_URL}/checksession/`
      })
    }),
    logoutService: build.mutation<'', void>({
      query: () => ({
        method: 'POST',
        url: `${AUTH_URL}/web_app_logout/`
      })
    }),
    authenticateService: build.mutation<ApiResponse<AuthResponseData>, UnAuththenticatedUser>({
      query: (data) => {
        return {
          method: 'POST',
          url: `${AUTH_URL}/web_app_login/`,
          body: data
        };
      }
    }),
    sendOTPservice: build.mutation<ApiResponse<any>, any>({
      query: (data) => {
        return {
          method : 'POST',
          url : `/generateOtp/`,
          body : data
        }
      }
    }),
    otpAuthencateService: build.mutation<ApiResponse<any>, any>({
      query: (data) => {
        return {
          method : 'POST',
          url : `/otp_login/`,
          body : data
        }
      }
    }),
    resetPasswordService: build.mutation<ApiResponse<undefined>, ForgotPassword>({
      query: (data) => {
        return {
          method: 'POST',
          url: `${AUTH_URL}/forgotpassword/`,
          body: data
        };
      }
    })
  }),
  overrideExisting: false
});

export const {
  useAuthenticateServiceMutation: useAuthenticateService,
  useInitialAuthServiceMutation: useInitialAuthService,
  useLogoutServiceMutation: useLogoutService,
  useSendOTPserviceMutation: useSendOtpService,
  useOtpAuthencateServiceMutation: useOTPAuthService,
  useResetPasswordServiceMutation: resetPasswordService,
  endpoints: { authenticateService, initialAuthService, otpAuthencateService }
} = service;
