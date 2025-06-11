import { Button, Card, Col, Form, Input, Row, Typography, message } from "antd";
import { useTranslation } from "react-i18next";
import "./PlanB.scss";
import { useDispatch } from "react-redux";
import { updateActivePNR } from "@/stores/Pnr.store";
import { formFinishFailedFocus, formToUpperCase } from "@/Utils/form";
import { useLazyGetPnrsListQuery } from "@/services/reschedule/Reschedule";
import { useEffect, useRef, useState } from "react";
import { LoadingOutlined } from "@ant-design/icons";
import CFG from "@/config/config.json";
import Toastr, { ToastrProps } from "@/components/Toastr/Toastr";
import UseInputValidation from "@/hooks/Validations.hook";
import {
  useLocalStorage,
  useSessionStorage,
} from "@/hooks/BrowserStorage.hook";
import { useAuth } from "@/hooks/Auth.hook";
import { isPossiblyBtoaEncoded } from "@/Utils/general";
import { useAppSelector } from "@/hooks/App.hook";
import { cleanUpMessageApi, updateMessageApi } from "@/stores/General.store";
import { NotificationType, useToaster } from "@/hooks/Toaster.hook";
import useGetPNRData from "@/hooks/GetPNRData.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
const { Title, Paragraph } = Typography;

interface ToastrComponent {
  childFunction(): void;
}

const PlanB = () => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const {redirect, currentPath} = useRedirect();
  const dispatch = useDispatch();
  const [callQueuePnrList, queuePnrListResponse] = useLazyGetPnrsListQuery();
  const [submittable, setSubmittable] = useState(false);
  const form_values = Form.useWatch([], form);
  const { messageApiValue } = useAppSelector((state) => state.GeneralReducer);
  /* Localstorage values & handlers */
  // const [, SsetFormData, SremoveFormData] = useSessionStorage<any>("formData");
  const [, , SremoveSelectedFlights] = useSessionStorage<any>("selectedFlights");
  const [, , SremoveReviewStatus] = useSessionStorage<string>("reviewStatus");
  const [, , SremoveFinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  const [, , SremoveFinalReviewPnrData] = useSessionStorage<any>("finalReviewPNRData");
  const [, , SremoveSsrPNRData] = useSessionStorage<any>("ssrPNRData");
  const [, , SremoveSearchFlightPNRData] = useSessionStorage<any>("searchFlightPNRData");
  const [, , SremoveFinalPaymentAmount] = useSessionStorage<any>("finalPaymentAmount");
  const [, , SremoveSsrPrice] = useSessionStorage<any>("ssrPrice");
  const [, , LremoveLayout] = useLocalStorage('layout');
  const [, SsetPrevPath] = useSessionStorage("prevPath");
  const { isAuthenticated } = useAuth();
  const { showToaster, toasterContextHolder } = useToaster();
  let pnrList = useGetPNRData("pnr");
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const childRef = useRef<ToastrComponent>(null);
  const [SairlineCode] = useSessionStorage("airlineCode");

  /* To show notification if the PNR is not mapped to the logged in user */
  useEffect(() => {
    if (messageApiValue?.open) {
      showToaster({
        type: messageApiValue.type as NotificationType,
        title: messageApiValue.title as string,
        description: messageApiValue.description,
      });
      setTimeout(() => dispatch(cleanUpMessageApi()), 3000);
    }
  }, [messageApiValue]);

  let toastrPropsData: ToastrProps["data"] = {
    description: t("no_record_found"),
    position: "top",
    type: "error",
    top: 50,
    duration: 3,
    className: "cls-planb-notification",
  };

  useEffect(() => {
    // SremoveFormData();
    SremoveSelectedFlights();
    SremoveReviewStatus();
    dispatch(updateActivePNR([]));
    SremoveFinalViewPnrData();
    SremoveFinalReviewPnrData();
    SremoveSsrPNRData();
    SremoveFinalPaymentAmount();
    SremoveSearchFlightPNRData();
    SremoveSsrPrice();
    LremoveLayout();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    form.validateFields({ validateOnly: true }).then(
      () => setSubmittable(true),
      () => setSubmittable(false)
    );
  }, [form, form_values]);

  // Call the function in the child component directly from the parent
  const callChildFunction = () => {
    if (childRef.current) childRef.current.childFunction();
  };

  useEffect(() => {
    // Return until get sucess response
    if (queuePnrListResponse.status === "fulfilled") {
      // onSubmitItinerary();
    } else {
      return;
    }
    // eslint-disable-next-line
  }, [queuePnrListResponse]);

  const onSubmitItinerary = () => {
    const formData = form.getFieldsValue();
    // SsetFormData(formData);
    /* Update active PNR got from planB page */
    let matchedPnr = pnrList?.filter((pnrList: any) => {
      return (
        formData?.PNR.toUpperCase() === pnrList.PNR.toUpperCase() &&
        (formData?.emailId.toUpperCase() ===
          pnrList.lastName.toUpperCase() ||
          formData?.emailId.toUpperCase() ===
          pnrList.emailId.toUpperCase())
      )
    });

    if (matchedPnr?.length === 0) {
      form.resetFields();
      callChildFunction();
      return;
      // return setMessage(t("no_record_found"));
      // return message.error(t("no_record_found"));
    }
    dispatch(updateActivePNR(matchedPnr));

    if (isAuthenticated) {
      /* Email validation if the user is logged in */
      // let isAuthenticatedPNR = matchedPnr?.[0]?.emailId === userData?.email;
      // if (isAuthenticatedPNR) {
        redirect("viewPnrInfo");
      // } else {
      //   SremoveFormData();
      //   dispatch(
      //     updateMessageApi({
      //       open: true,
      //       type: "error",
      //       title: t("invalid_pnr"),
      //       description: t("invalid_pnr_description"),
      //     })
      //   );
      // }
    } else {
      if (matchedPnr && formData) {
        SsetPrevPath(currentPath);
        redirect("viewPnrInfo");
      }
    }
  };

  // While submitting the form validation
  const onFinish = (values: any) => {
    const newErrors: { [key: string]: string } = {};
    const emailCheck = UseInputValidation({
      type: "email",
      value: values.emailId,
    });
    const alphaCheck = UseInputValidation({
      type: "alphabet",
      value: values.emailId,
    });
    const alphaNumericCheck = UseInputValidation({
      type: "alphaNumericMust",
      value: values.PNR,
    });

    !alphaNumericCheck
      ? (newErrors.PNR =
        t("pnr_message") + " / " + t("booking_reference").toLowerCase())
      : values.PNR.length < 6 && (newErrors.PNR = t("pnr_length_message"));

    if (values.emailId && !(emailCheck || alphaCheck)) {
      if (!alphaCheck) {
        !emailCheck && (newErrors.emailId = t("msg_invalid_email"));
      }
    } else {
      values.emailId.length < 3 &&
        (newErrors.emailId = t("pnr_lastname_length_message"));
    }

    setErrors(newErrors);
    if (Object.keys(newErrors).length !== 0) {
      return false;
    }
    onSubmitItinerary()
    callQueuePnrList(values);
    return;
  };

  const changeValues = (field: string) => {
    setErrors((errors) => ({
      ...errors,
      [field]: "",
    }));
  };

  return (
    <div data-testid="planB">
      <Toastr data={toastrPropsData} ref={childRef} />
      <Row
        className={`cls-planB-container airline${SairlineCode ? SairlineCode : CFG.airline_code}`}
        align="middle"
      >
        <Col>
          <Row className="cls-planB">
            <Col span={24}>
              <Row>
                <Col span={24} className={`cls-description`}>
                  <Title level={1}>{t("planB_heading")}</Title>
                  <Paragraph>{t("planB_help_text")}</Paragraph>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Row className="cls-pnr-input-container" justify="center">
                <Col xs={24} sm={24} md={22} lg={20}>
                  <Card>
                    <Form
                      name="planB"
                      form={form}
                      layout="vertical"
                      size="large"
                      autoComplete="off"
                      onFinish={onFinish}
                      onFinishFailed={(errorInfo) =>
                        formFinishFailedFocus(errorInfo, form)
                      }
                      initialValues={{
                        emailId: "",
                        pnr: "",
                      }}
                      scrollToFirstError
                    >
                      <Row
                        justify={{ sm: "space-around", md: "space-between" }}
                        gutter={30}
                      >
                        <Col xs={23} sm={23} md={12} lg={9}>
                          <Form.Item
                            name="PNR"
                            label={t("pnr") + " / " + t("booking_reference")}
                            rules={[
                              {
                                required: true,
                                message:
                                  t("pnr_message") +
                                  " / " +
                                  t("booking_reference").toLowerCase(),
                                whitespace: true,
                              },
                            ]}
                          >
                            <Input
                              onInput={formToUpperCase}
                              autoFocus={true}
                              placeholder={
                                t("enter_pnr") +
                                " / " +
                                t("booking_reference").toLowerCase()
                              }
                              minLength={6}
                              maxLength={6}
                              onChange={() => changeValues("PNR")}
                            />
                          </Form.Item>
                          {errors.PNR && (
                            <div
                              style={{ display: "flex", flexWrap: "nowrap" }}
                            >
                              <div
                                id="planB_PNR_help"
                                className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                                role="alert"
                              >
                                <div className="ant-form-item-explain-error">
                                  {errors.PNR}
                                </div>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col xs={23} sm={23} md={12} lg={9}>
                          <Form.Item
                            name="emailId"
                            label={t("email_id") + " / " + t("last_name")}
                            rules={[
                              {
                                required: true,
                                message:
                                  t("msg_empty_email") +
                                  " / " +
                                  t("last_name").toLowerCase(),
                                whitespace: true,
                              },
                            ]}
                          >
                            <Input
                              placeholder={
                                t("email_id_placeholder") +
                                " / " +
                                t("last_name").toLowerCase()
                              }
                              maxLength={52}
                              // minLength={3}
                              onChange={() => changeValues("emailId")}
                            />
                          </Form.Item>
                          {errors.emailId && (
                            <div
                              style={{ display: "flex", flexWrap: "nowrap" }}
                            >
                              <div
                                id="planB_emailId_help"
                                className="ant-form-item-explain ant-form-css-var ant-form-item-explain-connected"
                                role="alert"
                              >
                                <div className="ant-form-item-explain-error">
                                  {errors.emailId}
                                </div>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col
                          xs={23}
                          sm={23}
                          md={12}
                          lg={6}
                          style={{ padding: "0px 15px" }}
                          className="cls-get-itinerary"
                        >
                          <Form.Item>
                            <Button
                              type="primary"
                              htmlType="submit"
                              disabled={!submittable}
                              className="cls-primary-btn"
                            // onClick={onSubmitItinerary}
                            >
                              {queuePnrListResponse.isLoading ? (
                                <LoadingOutlined
                                  spin
                                  style={{ fontSize: "24px", margin: "0 2em" }}
                                />
                              ) : (
                                t("get_itinerary")
                              )}
                            </Button>
                          </Form.Item>
                        </Col>
                      </Row>
                    </Form>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {toasterContextHolder}
      </Row>
    </div>
  );
};

export default PlanB;
