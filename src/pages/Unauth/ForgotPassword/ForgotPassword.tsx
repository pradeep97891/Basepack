import { Form, Input, Button, Row, Col } from "antd";
import { useState } from "react";
import { FdPasswordSucces } from "@/components/Icons/Icons";
import { useTranslation } from "react-i18next";
import { resetPasswordService } from "../../../services/user/User";
import { useForm } from "antd/lib/form/Form";
import { LoadingOutlined } from "@ant-design/icons";
import "./ForgotPassword.scss";
import { useEffect } from "react";
import { ModForm } from "@/components/ModForm/ModForm";
import { FormTitle } from "@/components/Title/Title";
import Login from "../Login/Login";
import UseInputValidation from "@/hooks/Validations.hook";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

const ForgotPassword = (props: any) => {
  const { redirect, isCurrentPathEqual } = useRedirect();
  const { t } = useTranslation();
  const [form] = useForm();
  const [fpHide, setHide] = useState("");
  const [showLoginpage, setShowLoginpage] = useState(false);
  // const [showPassword,setShowpassword] = useState(false)
  // const [visible, setVisible] = useState(false);
  const [userName, setUserName] = useState("");
  const [Disablebtn, setDisablebtn] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [service, serviceStatus] = resetPasswordService();

  /* Localstorage 'isResetLink' value & handlers */
  const [, LsetIsResetLink] = useLocalStorage("isResetLink");

  useEffect(() => {
    if (
      (serviceStatus as any)?.isSuccess &&
      (serviceStatus as any).data.responseCode === 0
    )
      LsetIsResetLink(1);
    // eslint-disable-next-line
  }, [serviceStatus]);

  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const changeValues = (field: string) => {
    setErrors((errors) => ({
      ...errors,
      [field]: "",
    }));
  };

  const otpLoginSubmit = async (value: any) => {
    if (value === "otp") {
      var formVal = await form.validateFields();
      const errorData: { [key: string]: string } = {};
      const emailCheck = UseInputValidation({
        type: "email",
        value: formVal.email,
      });

      if (!emailCheck) {
        errorData.email = t("msg_invalid_email");
      }

      setErrors(errorData);
      if (Object.keys(errorData).length !== 0) {
        return false;
      } else {
        setHide(value);
        setDisablebtn(false);
        service({ email_id: formVal.email });
      }
    } else {
      setHide(value);
      setDisablebtn(false);
    }
  };

  const setName = (event: any) => {
    // var pattern = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
    if (event.length) {
      setDisablebtn(true);
    } else {
      setDisablebtn(false);
    }
    setUserName(event);
  };

  const setOtp = (event: any) => {
    if (event.length === 6) {
      setDisablebtn(true);
    } else {
      setDisablebtn(false);
    }
  };

  const setNewPsw = (event: any, passwordType: string) => {
    const errorData: { [key: string]: string } = {};
    if (passwordType !== "new") {
      if (newPassword === event) {
        setDisablebtn(true);
        setErrors({});
      } else {
        errorData.confirmPassword = t("password_not_matching");
        setErrors(errorData);
        setDisablebtn(false);
      }
    } else {
      setDisablebtn(false);
      const passwordCheck = UseInputValidation({
        type: "password",
        value: event,
      });

      if (!passwordCheck) {
        event.length < 8
          ? passwordType === "new"
            ? (errorData.password = t("password_length_msg"))
            : (errorData.confirmPassword = t("password_length_msg"))
          : passwordType === "new"
            ? (errorData.password = t("password_must_have"))
            : (errorData.confirmPassword = t("password_must_have"));
      }

      setErrors(errorData);

      if (Object.keys(errorData).length !== 0) {
        setNewPassword("");
        return false;
      } else {
        setNewPassword(event);
      }
    }
  };

  // const setConfirmPsw = (event: any) => {
  //   if (newPassword === event) {
  //     setDisablebtn(true);
  //   } else {
  //     setDisablebtn(false);
  //   }
  // };

  const goBackToLogin = () => {
    setShowLoginpage(!showLoginpage);
  };

  const selectAfter = (
    <Col className="cls-resend-code f-sbold" style={{ cursor: "pointer" }}>
      Resend OTP
    </Col>
  );

  return (
    <>
      {showLoginpage ? (
        <Login model={true} />
      ) : (
        <div
          className={`cls-forgot-password ${props?.isModal ? "cls-forgotPsw-modal" : ""}`}
        >
          {/* common tittle and dynamic changed subtitles */}
          <Row className="cls-success-img">
            {fpHide === "completed" ? <FdPasswordSucces /> : ""}
          </Row>
          <FormTitle
            testId="ForgotPassword"
            title={
              fpHide === "completed"
                ? "Password Successfully!"
                : "forgot_password"
            }
            subTitle={
              fpHide === ""
                ? "forgot_subtitle"
                : "" || fpHide === "otp"
                  ? "We have sent an OTP to " +
                    userName +
                    ", please enter the same to proceed"
                  : "" || fpHide === "pswChange"
                    ? "This password should be different from the previous password"
                    : "" || fpHide === "completed"
                      ? "Your password has been successfully updated"
                      : ""
            }
          />
          {/* Completed view chnages */}
          {fpHide === "completed" ? (
            <ModForm
              // onFinish={onFinish}
              form={form}
              layout="vertical"
              className="cls-completed"
              scrollToFirstError
            >
              {fpHide === "completed" ? (
                <Form.Item className="forgot"></Form.Item>
              ) : (
                <Form.Item>
                  <Input
                    placeholder={
                      fpHide === "otp"
                        ? "Enter the OTP"
                        : t("email_id_placeholder")
                    }
                  />
                </Form.Item>
              )}
              <Form.Item>
                <Button
                  onClick={() => {
                    isCurrentPathEqual('forgot-password')
                      ? redirect("login")
                      : goBackToLogin();
                  }}
                  type="link"
                  className="link cls-fp-btn"
                >
                  {t("back_to_login")}
                </Button>
              </Form.Item>
            </ModForm>
          ) : (
            // Forget password form chnages
            <ModForm
              // onFinish={onFinish}
              form={form}
              layout="vertical"
              className="cls-forgotPassword"
            >
              {fpHide === "" ? (
                <Col>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: t("msg_empty_email") + "!" },
                    ]}
                  >
                    <Input
                      className="cls-forogot-password-input"
                      onChange={(event) => {
                        setName(event.target.value);
                        changeValues("email");
                      }}
                      placeholder={t("email_id_placeholder")}
                    />
                  </Form.Item>
                  {errors.email && (
                    <div
                      style={{ display: "flex", flexWrap: "nowrap" }}
                      className="ant-form-item-explain"
                      role="alert"
                    >
                      <div className="ant-form-item-explain-error">
                        {errors.email}
                      </div>
                    </div>
                  )}
                </Col>
              ) : (
                <></>
              )}

              {fpHide === "otp" ? (
                <Form.Item
                  name="otp"
                  rules={[
                    // {
                    //   validator: validateOTP(
                    //     "Please check if the entered otp is correct and valid.!"
                    //   ),
                    // },
                    { required: true, message: "Please enter your OTP!" },
                    { max: 6 },
                  ]}
                >
                  <Input
                    className="hide-number-arrows cls-otp-input"
                    data-testid="log_in_textarea"
                    name="otp"
                    autoComplete="off"
                    onChange={(event) => {
                      setOtp(event.target.value);
                    }}
                    maxLength={6}
                    addonAfter={selectAfter}
                    placeholder={"Enter the OTP"}
                  />
                </Form.Item>
              ) : (
                <></>
              )}

              {fpHide === "pswChange" ? (
                <>
                  <Col>
                    <Form.Item className="cls-psw">
                      <Input.Password
                        className="cls-newPsw"
                        type="password"
                        onChange={(event) => {
                          setNewPsw(event.target.value, "new");
                        }}
                        placeholder={
                          fpHide === "pswChange" ? "Enter New password" : ""
                        }
                      />
                    </Form.Item>
                    {errors.password && (
                      <div
                        style={{ display: "flex", flexWrap: "nowrap" }}
                        className="ant-form-item-explain ant-form-item-explain-connected"
                        role="alert"
                      >
                        <div className="ant-form-item-explain-error">
                          {errors.password}
                        </div>
                      </div>
                    )}
                  </Col>
                  <Col>
                    <Form.Item className="cls-psw cls-cfrm-psw">
                      <Input.Password
                        className="cls-ConfirmPsw"
                        type="password"
                        disabled={newPassword ? false : true}
                        onChange={(event) => {
                          setNewPsw(event.target.value, "confirm");
                        }}
                        placeholder={
                          fpHide === "pswChange" ? "Enter Confirm password" : ""
                        }
                      />
                    </Form.Item>
                    {errors.confirmPassword && (
                      <div
                        style={{ display: "flex", flexWrap: "nowrap" }}
                        className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                        role="alert"
                      >
                        <div className="ant-form-item-explain-error">
                          {errors.confirmPassword}
                        </div>
                      </div>
                    )}
                  </Col>
                </>
              ) : (
                <></>
              )}
              <Form.Item>
                {fpHide === "otp" ? (
                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={!Disablebtn}
                    className="cls-fp-btn cls-primary-btn"
                    onClick={() => {
                      otpLoginSubmit("pswChange");
                    }}
                  >
                    {serviceStatus.isLoading ? (
                      <LoadingOutlined spin style={{ fontSize: "24px" }} />
                    ) : (
                      t("Confirm OTP")
                    )}
                  </Button>
                ) : (
                  <></>
                )}
                {fpHide === "" ? (
                  <Button
                    htmlType="submit"
                    type="primary"
                    disabled={!Disablebtn}
                    className="cls-fp-btn cls-primary-btn"
                    onClick={() => {
                      otpLoginSubmit("otp");
                    }}
                  >
                    {serviceStatus.isLoading ? (
                      <LoadingOutlined spin style={{ fontSize: "24px" }} />
                    ) : (
                      t("request_otp")
                    )}
                  </Button>
                ) : (
                  <></>
                )}
                {fpHide === "pswChange" ? (
                  <Button
                    disabled={!Disablebtn}
                    htmlType="submit"
                    type="primary"
                    className="cls-fp-btn cls-primary-btn"
                    onClick={() => {
                      otpLoginSubmit("completed");
                    }}
                  >
                    {serviceStatus.isLoading ? (
                      <LoadingOutlined spin style={{ fontSize: "24px" }} />
                    ) : (
                      t("Reset password")
                    )}
                  </Button>
                ) : (
                  <></>
                )}
              </Form.Item>
              {fpHide === "completed" ? (
                ""
              ) : (
                <Form.Item>
                  <Button
                    className="cls-back-to-login"
                    onClick={() => {
                      isCurrentPathEqual('forgot-password')
                        ? redirect("login")
                        : goBackToLogin();
                    }}
                    type="link"
                  >
                    {t("back_to_login")}
                  </Button>
                </Form.Item>
              )}
            </ModForm>
          )}
        </div>
      )}
    </>
  );
};

export default ForgotPassword;
