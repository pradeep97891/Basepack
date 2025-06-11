import React, { useEffect, useState } from "react";
import { Form, Input, Button, Tooltip } from "antd";
import {
  CheckCircleFilled,
  CloseCircleFilled,
  LockTwoTone,
  MailTwoTone,
} from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import "./ResetPassword.scss";
import { ModForm } from "@/components/ModForm/ModForm";
import { FormTitle } from "@/components/Title/Title";

const ResetPassword = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();

  /* state */
  const [pwdLength, setPwdLength] = useState(false);
  const [pwdCase, setPwdCase] = useState(false);
  const [pwdChar, setpwdChar] = useState(false);
  const [pwdScore, setPwdScore] = useState("poor");

  useEffect(() => {
    let count = 0;
    [pwdLength, pwdCase, pwdChar].map((value) => {
      if (value === true) count += 1;
      return true;
    });
    switch (count) {
      case 3:
        setPwdScore("great");
        break;
      case 2:
        setPwdScore("medium");
        break;
      default:
        setPwdScore("poor");
        break;
    }
  }, [pwdLength, pwdCase, pwdChar]);
  /* password input change handler */
  const handlePasswordInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.target.value.length > 7 ? setPwdLength(true) : setPwdLength(false);
    e.target.value.match(/(?=(.*[a-z]))(?=(.*[A-Z]))/)
      ? setPwdCase(true)
      : setPwdCase(false);
    e.target.value.match(/(?=.*[!@#$&*])/)
      ? setpwdChar(true)
      : setpwdChar(false);
  };

  /* password tooltip starts */
  const PasswordToolTip = () => (
    <div className="cls-pwd-tooltip">
      <span className="tip-title">{t("password_hints")} :</span>
      <ul>
        <li>
          {pwdLength ? <CheckCircleFilled /> : <CloseCircleFilled />}
          <span className="fs-12">{t("password_length")}</span>
        </li>
        <li>
          {pwdCase ? <CheckCircleFilled /> : <CloseCircleFilled />}
          <span className="fs-12">{t("password_case")}</span>
        </li>
        <li>
          {pwdChar ? <CheckCircleFilled /> : <CloseCircleFilled />}
          <span className="fs-12">{t("password_special_char")}</span>
        </li>
      </ul>
      <div className={`pwd-strength ${pwdScore}`}>
        <div className="pwd-title">
          <span className="tip-title">{t("password_strength")}</span>
          <span className="pwd-comment">{t(pwdScore)}</span>
        </div>
        <div className="pwd-meter">
          <span className="p1"></span>
          <span className="p2"></span>
          <span className="p3"></span>
          <span className="p4"></span>
        </div>
      </div>
    </div>
  );
  /* password tooltip ends */

  const onFinish = (values: any) => {
    console.log("Received values of form: ", values);
  };

  return (
    <div className="ResetPassword" data-testid="ResetPassword">
      <FormTitle title="reset_title" subTitle="reset_subtitle" />
      <ModForm
        layout="vertical"
        form={form}
        name="resetPassword"
        onFinish={onFinish}
        initialValues={{ email_id: "balaji@infinitisoftware.net" }}
        scrollToFirstError
      >
        <Form.Item label={t("email_id")} name="email_id">
          <Input
            type="email"
            required
            prefix={
              <MailTwoTone
                style={{ fontSize: "16px" }}
                twoToneColor="#A4A9C2"
              />
            }
            placeholder={t("email_id_placeholder")}
            disabled={true}
          />
        </Form.Item>
        <Form.Item label={t("password")} name="user_password">
          <Tooltip
            title={PasswordToolTip}
            placement="bottom"
            color="#ffffff"
            trigger="focus"
          >
            <Input.Password
              min={8}
              required
              prefix={
                <LockTwoTone
                  style={{ fontSize: "16px" }}
                  twoToneColor="#A4A9C2"
                />
              }
              placeholder={t("password_help")}
              onChange={handlePasswordInput}
            />
          </Tooltip>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit">
            {t("reset_title")}
          </Button>
        </Form.Item>
      </ModForm>
    </div>
  );
};

export default ResetPassword;
