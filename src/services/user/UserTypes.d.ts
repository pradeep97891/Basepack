// login page service request type
export interface UnAuththenticatedUser {
  email_id: string;
  password: string;
}

// login page service response type
export interface AuthResponseData {
  user_id: number;
  email_id: string;
  first_name: string;
  last_name: string;
  groups: string[];
  token: string;
}

// reset link service request type
export interface ResetLink {
  token: string;
}

// reset link service response type
export interface ResetLinkResonse extends ResetLink {
  email: string;
}

// reset password service request type
export interface ResetPassword extends ResetLinkResonse {
  password: string;
  confirm_password: string;
}

// forpassword request

export interface ForgotPassword {
  email_id: string;
}
