// CHANGES MADE TO API, HAVE TO BE REFLECTED HERE!

// createTypes for 'data' of responese and pass it to 'MailApiResponse<created_type_for_data_here>'
//
// @example <MailApiResponse<AuthResponseData>>
//
// for response with no 'data' key
// @example <MailApiResponse<undefined>>
export type ApiResponse<SuccessResponseDataType, FailureResponseDataType = undefined> =
  | FailureResponse<FailureResponseDataType>
  | SuccessResponse<SuccessResponseDataType>;

export interface FailureResponse<Type> {
  responseCode: 1;
  response: FailureResponseResponse<Type>;
}

export interface FailureResponseResponse<Type = Type | undefined> {
  Message: string;
  errors: Type;
}

export interface SuccessResponse<Type> {
  responseCode: 0;
  response: ResponseResponse<Type>;
}

export interface ResponseResponse<Type = Type | undefined> {
  Message: string;
  data: Type;
}
