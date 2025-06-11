import { Form, Input, Col, Button, message } from "antd";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import "./loginwithotp.scss";
import { ModForm } from "@/components/ModForm/ModForm";
import { FormTitle } from "@/components/Title/Title";
import { useAuth } from "../../../hooks/Auth.hook";
import {
  useAuthenticateService,
  useOTPAuthService,
  useSendOtpService,
} from "../../../services/user/User";
import Login from "../Login/Login";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useSendEmailMutation } from "@/services/email/Email";
import { useRedirect } from "@/hooks/Redirect.hook";

const LoginWithOTP = (props: any) => {
  const {redirect, isCurrentPathEqual} = useRedirect();
  const { t } = useTranslation();
  const [form] = Form.useForm();

  /* Service states */
  const [loginService, apiStatus] = useAuthenticateService();
  const [otpService, optServiceResponse] = useSendOtpService();
  const [sendEmailService, sendEmailResponse] = useSendEmailMutation();
  const [otpAuthService, otpAuthServiceResponse] = useOTPAuthService();

  const [requestOtp, setRequestOtp] = useState(false);
  const [showLoginpage, setShowLoginpage] = useState(false);
  const [Disablebtn, setDisablebtn] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();

  /* Localstorage 'email id' value & handlers */
  const [LrememberMe, LsetRememberMe, LremoveRememberMe] =
    useLocalStorage<string>("rme");

  // To check the API status and display an error message
  useEffect(() => {
    const setMessage = (message: string) => {
      form.setFields([
        { name: "email_id", errors: [] },
        { name: "user_password", errors: [message] },
      ]);
    };
    if (apiStatus.isError) {
      const { error } = apiStatus as unknown as { error: { status: string } };
      if (error && error.status === "FETCH_ERROR") {
        message.error(error.status + " check CORS");
        setMessage("unable to contact server");
      }
    } else if (apiStatus.isSuccess) {
      const data = apiStatus.data;
      if (data?.responseCode === 1) {
        setMessage(data.response.Message);
      }
    }
  }, [apiStatus, form]);

  const setName = (event: any) => {
    var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (event.match(pattern)) {
      setDisablebtn(true);
    } else {
      setDisablebtn(false);
    }
  };

  const goBackToLogin = () => {
    setShowLoginpage(!showLoginpage);
  };

  const onFinish = (values: any) => {
    if (values.remember_me) {
      LsetRememberMe(`${btoa(values.email + "&&" + values.password)}`);
    } else LremoveRememberMe();
    loginService({ email_id: values.email_id, password: values.user_password });
  };

  const handleForm = (e: any) => {
    if (e.target.name === "otp") {
      const otp = e.target.value;
      setDisablebtn(!!!otp)
    }
  };

  /* Call backend service to get OTP */
  const sendOTP = () => {
    otpService({ email: form.getFieldValue("email_id") });
    setRequestOtp(!requestOtp);
  };

  useEffect(() => {
    if (!optServiceResponse.isUninitialized && !optServiceResponse.isLoading) {
      let message: any = {};
      if (optServiceResponse.isSuccess) {
        const code = (optServiceResponse.data.response as any).data.otp;
        if (code) {
          const postData: any = {
            setting_id: 173,
            globalData: {
              otp: code,
            },
            recipientList: [
              {
                action_name: "rs_otp",
                language_code: "EN",
                to: [form.getFieldValue("email_id")],
                cc: [],
                bcc: [],
                data: {},
              },
            ],
            attachments: [],
          };

          sendEmailService(postData);
          return;
        } else {
          message = {
            type: "success",
            content: "Kindly check you mailbox for OTP!",
          };
        }
      } else {
        message = {
          type: "error",
          content: "Email not registered!",
        };
      }

      messageApi.open(message);
    }
  }, [optServiceResponse, form, messageApi, sendEmailService]);

  useEffect(() => {
    if (!sendEmailResponse?.isUninitialized && !sendEmailResponse?.isLoading) {
      let message: any = {};
      if (sendEmailResponse.isSuccess) {
        message = {
          type: "success",
          content: "OTP sent!",
        };
      } else {
        message = {
          type: "success",
          content: (sendEmailResponse.data as any).response.data,
        };
      }

      messageApi.open(message);
    }
  }, [sendEmailResponse, messageApi]);

  const selectAfter = (
    <Col className="cls-resend-code f-sbold" style={{ cursor: "pointer" }}>
      <Button type="link" className="fs-12" onClick={sendOTP}>
        Resend code
      </Button>
    </Col>
  );
  const otpLoginHandler = () => {
    const formData = form.getFieldsValue();
    if(formData?.otp){
      otpAuthService({ email: formData.email_id, otp: formData.otp });
    }
    else{
      messageApi.open({
        type: "error",
        content: "Enter OTP !",
      });
    }
  };

  useEffect(() => {
    if (otpAuthServiceResponse.isError) {
      const { error } = apiStatus as unknown as { error: { status: string } };
      if (error && error.status === "FETCH_ERROR") {
        message.error(error.status + " check CORS");
        messageApi.open({
          type: "error",
          content: "Unable to contact server",
        });
      } else if (
        (otpAuthServiceResponse?.error as any)?.data?.responseCode === 1
      ) {
        form.setFields([
          {
            name: "otp",
            errors: [""],
          },
        ]);
        messageApi.open({
          type: "error",
          content: "The OTP you entered is incorrect. Please try again.",
        });
      }
    }
  }, [otpAuthServiceResponse.isError, apiStatus, messageApi]);

  //To redirect on auth is success
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated === true) window.location.href = "/";
  }, [isAuthenticated]);

  useEffect(() => {
    if (LrememberMe) {
      try {
        const [emailId] = atob(LrememberMe).split("&&");
        form.setFieldValue("email_id", emailId);
        setName(emailId);
      } catch (e) {
        console.error("Error decoding local storage value:", e);
      }
    }
  }, [LrememberMe, form]);

  return (
    <>
      {showLoginpage ? (
        <Login model={true} />
      ) : (
        <div className={`${props?.isModal ? "cls-forgotPsw-modal" : ""}`} datatest-id="loginWithOTP">
          <div className={`${props?.isModal ? "cls-login-modal" : ""}`}>
            <div>
              <FormTitle
                title="login_with_otp"
                subTitle={
                  !requestOtp
                    ? "login_with_otp_subtitle"
                    : "login_with_otp_subtitle_2"
                }
              />
              <ModForm
                layout="vertical"
                form={form}
                name="login"
                onChange={handleForm}
                onFinish={onFinish}
                className="Login cls-login-otp"
                // initialValues={initialValues}
                scrollToFirstError
              >
                <Form.Item
                  className="cls-login-label"
                  name="email_id"
                  rules={[
                    { required: true, message: t("msg_empty_email") + "!" },
                  ]}
                >
                  <Input
                    data-testid="log_in_textarea"
                    type="email"
                    className="cls-email-input"
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    addonAfter={requestOtp ? selectAfter : ""}
                    placeholder={t("email_id_placeholder")}
                  />
                </Form.Item>
                {requestOtp ? (
                  <Col>
                    <Form.Item
                      className="cls-login-label"
                      name="otp"
                      required
                    >
                      <Input.Password
                        data-testid="log_in_textarea"
                        type={"password"}
                        name="otp"
                        autoComplete="off"
                        maxLength={4}
                        placeholder={t("enter_your_otp")}
                        className="hide-number-arrows cls-otp-input"
                      />
                    </Form.Item>{" "}
                    <Form.Item className="cls-loginotp-btn">
                      <Button
                        data-testid="log_in_btn"
                        className="cls-primary-btn"
                        type="primary"
                        htmlType="button"
                        disabled={Disablebtn}
                        onClick={otpLoginHandler}
                        loading={otpAuthServiceResponse.isLoading}
                      >
                        {t("login")}
                      </Button>
                    </Form.Item>
                  </Col>
                ) : (
                  <Form.Item className="cls-loginotp-btn">
                    <Button
                      data-testid="log_in_btn"
                      type="primary"
                      className="cls-fp-btn cls-primary-btn cls-login-with-otp-btn"
                      disabled={!Disablebtn}
                      htmlType="button"
                      onClick={sendOTP}
                    >
                      {t("request_otp")}
                    </Button>
                  </Form.Item>
                )}
                <Button
                  className="cls-back-to-login"
                  onClick={() => {
                    isCurrentPathEqual('login-with-otp')
                      ? redirect("login")
                      : goBackToLogin();
                  }}
                >
                  {t("back_to_login")}
                </Button>
              </ModForm>
            </div>
          </div>
          {contextHolder}
        </div>
      )}
    </>
  );
};

export default LoginWithOTP;
