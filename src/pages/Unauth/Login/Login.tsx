import {
  Form,
  Input,
  Row,
  Col,
  Checkbox,
  Button,
  message,
  Typography,
} from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./Login.scss";
import { useEffect, useState } from "react";
import { ModForm } from "@/components/ModForm/ModForm";
import { FormTitle } from "@/components/Title/Title";
import { useAuth } from "../../../hooks/Auth.hook";
import { useAuthenticateService } from "../../../services/user/User";
import {
  FdLinkedInIcon,
  FdGmailIcon,
  FdFbIcon,
} from "@/components/Icons/Icons";
import UseInputValidation from "@/hooks/Validations.hook";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import ForgotPassword from "../ForgotPassword/ForgotPassword";
import LoginWithOTP from "../LoginWithOTP/loginwithotp";
import { useRedirect } from "@/hooks/Redirect.hook";

const Text = Typography;

const Login = (props: any) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [loginService, apiStatus] = useAuthenticateService();
  const [showOTPpage, setShowOTPpage] = useState(false);
  const [showForgetPswpage, setshowForgetPswpage] = useState(false);
  const { redirect, isCurrentPathEqual } = useRedirect();

  /* Localstorage 'email id' value & handlers */
  const [LrememberMe, LsetRememberMe, LremoveRememberMe] =
    useLocalStorage<string>("rme");

  // To check the API status and display an error message
  useEffect(() => {
    const setMessage = (message: string) => {
      form.setFields([
        { name: "email", errors: [] },
        { name: "password", errors: [message] },
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
  }, [apiStatus.isSuccess, apiStatus.isError, apiStatus, form]);

  //To redirect on auth is success
  const { isAuthenticated } = useAuth();
  useEffect(() => {
    if (isAuthenticated === true) window.location.href = "/";
  }, [isAuthenticated]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const changeValues = (field: string) => {
    setErrors((errors) => ({
      ...errors,
      [field]: "",
    }));
  };

  const onFinish = (values: any) => {
    const newErrors: { [key: string]: string } = {};
    const emailCheck = UseInputValidation({
      type: "email",
      value: values.email,
    });
    const passwordCheck = UseInputValidation({
      type: "password",
      value: values.password,
    });

    if (!emailCheck) {
      newErrors.email = t("msg_invalid_email");
    }

    if (!passwordCheck) {
      values.password.length < 8
        ? (newErrors.password = t("password_length_msg"))
        : (newErrors.password = t("password") + " " + t("invalid"));
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return false;
    }

    if (values.remember_me) {
      LsetRememberMe(`${btoa(values.email + "&&" + values.password)}`);
    } else LremoveRememberMe();
    loginService({ email_id: values.email, password: values.password });
  };

  let initialValues = {};
  if (LrememberMe) {
    try {
      const [emailId, password] = atob(LrememberMe).split("&&");
      initialValues = {
        email: emailId,
        password: password,
        remember_me: true,
      };
    } catch (e) {
      console.error("Error decoding local storage value:", e);
    }
  }

  return (
    <>
      {showForgetPswpage ? <ForgotPassword isModal={true} /> : ""}
      {showOTPpage ? (
        <LoginWithOTP isModal={true} />
      ) : (
        <>
          <div
            data-testid="login"
            className={`${
              !isCurrentPathEqual("login")
                ? "cls-modal-height"
                : "cls-login-theme"
            } ${showForgetPswpage ? "cls-forgot-psw-header" : ""} ${
              props.isPlanb ? "mohan" : ""
            }`}
          >
            <FormTitle title="login" subTitle="login_subtitle" />
            <ModForm
              layout="vertical"
              form={form}
              name="login"
              onFinish={onFinish}
              className="Login"
              initialValues={initialValues}
              scrollToFirstError
            >
              <Col>
                <Form.Item
                  className="cls-login-label"
                  label={t("email_id")}
                  name="email"
                  rules={[
                    // { type: "email", message: t("msg_invalid_email") + "!" },
                    { required: true, message: t("msg_empty_email") + "!" },
                  ]}
                >
                  <Input
                    data-testid="log_in_textarea"
                    // type="email"
                    className="cls-email-input"
                    placeholder={t("email_id_placeholder")}
                    onChange={() => changeValues("email")}
                  />
                </Form.Item>
                {errors.email && (
                  <div
                    style={{ display: "flex", flexWrap: "nowrap" }}
                    className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                    role="alert"
                  >
                    <div className="ant-form-item-explain-error">
                      {errors.email}
                    </div>
                  </div>
                )}
              </Col>
              <Col>
                <Form.Item
                  label={t("password")}
                  name="password"
                  className="cls-password-input-container"
                  rules={[
                    { required: true, message: t("msg_empty_password") + "!" },
                    // { min: 8 },
                  ]}
                >
                  <Input.Password
                    data-testid="log_in_pwdarea"
                    className="cls-login-psw-section"
                    placeholder={t("password_help")}
                    onChange={() => changeValues("password")}
                  />
                </Form.Item>
                {errors.password && (
                  <div
                    style={{ display: "flex", flexWrap: "nowrap" }}
                    className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                    role="alert"
                  >
                    <div className="ant-form-item-explain-error">
                      {errors.password}
                    </div>
                  </div>
                )}
              </Col>
              <Row className="cls-rememberRow">
                <Col span={12} className="remember">
                  <Form.Item name="remember_me" valuePropName="checked">
                    <Checkbox className="link">{t("remember_me")}</Checkbox>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item className="forgot">
                    <Button
                      onClick={() => {
                        isCurrentPathEqual("login")
                          ? redirect("forgot-password")
                          : setshowForgetPswpage(!showForgetPswpage);
                      }}
                      className="link"
                      type="link"
                    >
                      {t("forgot_password")}?
                    </Button>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item className="cls-login-btn">
                <Button
                  className="cls-primary-btn"
                  data-testid="log_in_btn"
                  type="primary"
                  htmlType="submit"
                >
                  {apiStatus.isLoading ? (
                    <LoadingOutlined spin style={{ fontSize: "24px" }} />
                  ) : (
                    t("login")
                  )}
                </Button>
              </Form.Item>
              <Form.Item className="cls-login-btn">
                <Button
                  data-testid="log_in_btn"
                  className="cls-login-otp-btn"
                  type="default"
                  htmlType="button"
                  onClick={() => {
                    isCurrentPathEqual("login")
                      ? redirect("login-with-otp")
                      : setShowOTPpage(!showOTPpage);
                  }}
                >
                  {t("login_with_otp")}
                </Button>
              </Form.Item>
              <Row justify="center" align="middle">
                <Col className="cls-sm-col mb-3" span={24}>
                  <Text className="cls-socialmedia">{t("or_login_with")}</Text>
                </Col>
                <Col span={4} sm={6} xs={6} className="cls-cursor-pointer">
                  <FdGmailIcon />
                </Col>
                <Col span={4} sm={6} xs={6} className="cls-cursor-pointer">
                  <FdFbIcon />
                </Col>
                <Col span={4} sm={6} xs={6} className="cls-cursor-pointer">
                  <FdLinkedInIcon />
                </Col>
              </Row>
            </ModForm>
          </div>
        </>
      )}
    </>
  );
};

export default Login;
