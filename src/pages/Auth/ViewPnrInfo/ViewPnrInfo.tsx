/**
 * Module : Schedule changing the resheduled flights for the respective
 * Date : May 2023
 **/
import {
  Button,
  Card,
  Col,
  Modal,
  Radio,
  Row,
  Tooltip,
  Typography,
} from "antd";
import { useAppSelector } from "@/hooks/App.hook";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useFlightChangesListData } from "@/hooks/FlightChangesList.hook";
import { updateActivePNR, updateShowPNRDrawer } from "@/stores/Pnr.store";
import "./ViewPnrInfo.scss";
import ItineraryList from "@/components/ItineraryList/ItineraryList";
import { useAuth } from "@/hooks/Auth.hook";
import Container from "@/layouts/Landing/Landing";
import { setRebookedData } from "../../../stores/ReviewFlight.store";
import ItineraryHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import dayjs from "dayjs";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import {
  useSessionStorage,
} from "@/hooks/BrowserStorage.hook";
import ViewPnrInfoSkeleton from "./ViewPnrInfo.skeleton";
import { getDynamicDate } from "@/Utils/general";
import useGetPNRData from "@/hooks/GetPNRData.hook";
import { decryptData } from "@/hooks/EncryptDecrypt.hook";
import TextArea from "antd/es/input/TextArea";
import { useResize } from "@/Utils/resize";

const ViewPnrInfo = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  // useGetPNRData();
  const isExpand = props.isExpand === undefined ? true : props.isExpand;
  const { redirect } = useRedirect();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { activePNR, modifyDates } = useAppSelector(
    (state: any) => state.PNRReducer
  );
  const { FCDataList } = useFlightChangesListData();
  // eslint-disable-next-line
  const [dataArray, setDataArray] = useState([]);
  const [rescheduleStatus, setRescheduleStatus] = useState("");
  const { isAuthenticated, logout } = useAuth();
  // Setting first PNR as active PNR for temporary purpose
  const [pnrObject, setPNRObject] = useState<any>({});
  const [visible, setVisible] = useState(false);
  const { Text } = Typography;
  const [enableBtn, setEnableBtn] = useState<boolean>(false);
  const [showTooltip, setShowTooltip] = useState<boolean>(true);
  /* Localstorage values & handlers */
  const [, , SremoveSelectedFlights] = useSessionStorage<any>("selectedFlights");
  const [, SsetReviewStatus, SremoveReviewStatus] = useSessionStorage<string>("reviewStatus");
  const [, , SremoveSsrPrice] = useSessionStorage<any>("ssrPrice");
  const [, , SremoveTicketDetail] = useSessionStorage<any>("ticketDetail");
  const [SfinalViewPnrData, SsetFinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  const [, SsetFinalReviewPnrData, SremoveFinalReviewPnrData] = useSessionStorage<any>("finalReviewPNRData");
  const [, , SremoveSsrPNRData] = useSessionStorage<any>("ssrPNRData");
  const [, , SremoveSearchFlightPNRData] = useSessionStorage<any>("searchFlightPNRData");
  const [, , SremoveFinalPaymentAmount] = useSessionStorage<any>("finalPaymentAmount");
  const [navigateBool, setNavigateBool] = useState(false);
  let activePNRData = SfinalViewPnrData;
  // activePNR.length ? activePNR : SfinalViewPnrData;
  const user: any = localStorage.getItem(
    process.env.REACT_APP_STORAGE_PREFIX + "user"
  );
  
  const { isSmallScreen } = useResize(991);

  const [, SsetModifyDates, SremoveModifyDates] =
    useSessionStorage<any>("modifyDates");
  const [reason, setReason] = useState("");
  const [SprevPath] = useSessionStorage<any>("prevPath");
  // Get the query parameter(PNR) from the URL
  let queryParam = window.location.search.substring(1);
  let userRole: any;
  const decodedUser:any = atob(user);
  let user_local: any;
  let userTypeCheck;
  if(isAuthenticated) {
    try {
      user_local = JSON.parse(decodedUser);
      if (user_local?.groups?.length) {
        userRole = user_local.groups
          .find((group: string) => group.includes("fdms"))
          .split("_")
          .splice(1)
          .join(" "); // Split the string into an array of word
        userRole = userRole.charAt(0).toUpperCase() + userRole.substring(1);
      }
    } catch (error) {
      console.error("Failed to parse JSON:", error, decodedUser);
    }
    userTypeCheck = (JSON.parse(decodedUser)?.groups[0] !== "fdms_retail_customer");
  }

  let pnrList = useGetPNRData("pnr");
  useEffect(() => {
    const parseQueryParam = async () => {
      try {
        let [pnr, lastName] = decryptData(queryParam).split(".");

        if (!(pnr && lastName)) throw new Error("PNR not found!");

        let matchedPnr = pnrList?.filter((pnrData: any) => {
          return (
            pnr.toUpperCase() === pnrData.PNR.toUpperCase() &&
            (lastName.toUpperCase() === pnrData.lastName.toUpperCase() ||
              lastName.toUpperCase() === pnrData.emailId.toUpperCase())
          );
        });
        
        if (isAuthenticated && JSON.parse(decodedUser)?.lastName.toLowerCase() !== lastName.toLowerCase()) await logout();

        SsetFinalViewPnrData(matchedPnr);
        dispatch(updateActivePNR(matchedPnr));
      } catch (error) {
        redirect("404");
      }
    };

    if (queryParam && pnrList?.length) parseQueryParam();
  }, [queryParam, user, pnrList]);

  const [action, setAction] = useState<{
    active: boolean;
    content: string;
    class: string;
  }>({
    active: false,
    content: "",
    class: "",
  });

  useEffect(() => {
    // SremoveFinalViewPnrData();
    SremoveSelectedFlights();
    SremoveReviewStatus();
    SremoveSsrPrice();
    SremoveTicketDetail();
    SremoveFinalReviewPnrData();
    SremoveSsrPNRData();
    SremoveFinalPaymentAmount();
    SremoveSearchFlightPNRData();
    SremoveModifyDates();
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (activePNR?.length && !SfinalViewPnrData?.length) {
      SsetFinalViewPnrData(activePNR);
    }
    if (isAuthenticated && activePNRData) {
      if (activePNRData !== null) {
        let matchedPnr = activePNRData;
        dispatch(setRebookedData({ rescheduleStatus: rescheduleStatus }));
        SsetReviewStatus(rescheduleStatus);
        if (matchedPnr.length > 0)
          matchedPnr?.forEach((item: any) => {
            setDataArray(item?.rebookOptionalFlightDetails);
            setPNRObject(item);
          });
      }
    } else {
      if (activePNRData?.length > 0)
        activePNRData?.forEach((item: any) => {
          setPNRObject(item);
        });
    }
    // eslint-disable-next-line
  }, [isAuthenticated, activePNRData, rescheduleStatus]);

  // Opening PNR list drawer at the first time
  useEffect(() => {
    dispatch(updateShowPNRDrawer(false));
  }, [dispatch]);

  // Updating active PNR details
  useEffect(() => {
    // dispatch(updateActivePNRDetails(FCDataList));
  }, [FCDataList, dispatch]);

  const updateRescheduleState = (newValue: string) => {
    setRescheduleStatus(newValue);
  };

  const handleRadioButtonChanges = (value: any) => {
    let radioValue = value.target.value;
    setAction({
      active: radioValue !== "Custom" && true,
      content:
        radioValue === "Accept"
          ? "Accepted"
          : radioValue === "Cancel"
            ? "Cancelled"
            : radioValue === "Modify"
              ? "Modified"
              : "Custom",
      class: `cls-${radioValue.toLowerCase()}`,
    });

    setEnableBtn(
      radioValue === "Accept" ||
        radioValue === "Cancel" ||
        radioValue === "Modify"
        ? true
        : false
    );
    setShowTooltip(false);
    if (radioValue === "Modify") {
      setTimeout(() => {
        const input = document.querySelector(".ant-picker-input input");
        if (input) {
          (input as HTMLElement).scrollIntoView({
            behavior: "smooth",
            block: "start",
          });
          (input as HTMLInputElement).focus();
        }
      }, 1);
    } else {
      (document.getElementById("applybtn") as any).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    dispatch(setRebookedData({ rescheduleStatus: value.target.value }));
    SsetReviewStatus(value.target.value);
    var updatedPNR;
    updatedPNR = activePNRData?.map((pnr: any) => {
      return {
        ...pnr,
        rebookOptionalFlightDetails: pnr.rebookOptionalFlightDetails.map(
          (item: any) => ({
            ...item,
            itinerary_status: "",
          })
        ),
      };
    });
    dispatch(updateActivePNR(updatedPNR));
    SsetFinalViewPnrData(updatedPNR);
    updateRescheduleState && updateRescheduleState(radioValue);
  };  

  let headerProps: ItineraryHeaderProps["data"] = {
    title: `${t("itinerary_details")}`,
    description: `${t("review_itinerary_changes_description")}`,
  };

  if (Object.keys(pnrObject).length !== 0) {
    headerProps = {
      ...headerProps,
      primaryHeading: "pnr",
      primaryValue: pnrObject?.PNR,
      secondaryHeading: "dateOfBooking",
      secondaryValue: `${pnrObject?.dateOfBooking.split(" ")[1]}, ${getDynamicDate(pnrObject?.dateOfBooking.split(" ")[0]) as string} ${pnrObject?.dateOfBooking.split(" ")[2]}`,
      breadcrumbProps: [
        {
          path: SprevPath !== "/planB" && userTypeCheck ? SprevPath : "/planB",
          title: SprevPath === "/prePlanned" && userTypeCheck
            ? t("pre_planned") + " " + t("disruption_list").toLowerCase()
            : SprevPath === "/adhocPnrList" && userTypeCheck
              ? t("adhoc") + " " + t("disruption_list").toLowerCase()
              : t("planb"),
          breadcrumbName: SprevPath === "/prePlanned" && userTypeCheck
            ? t("pre_planned") + " " + t("disruption_list").toLowerCase()
            : SprevPath === "/adhocPnrList" && userTypeCheck
              ? t("adhoc") + " " + t("disruption_list").toLowerCase()
              : t("planb"),
          key: SprevPath === "/prePlanned" && userTypeCheck
            ? t("pre_planned") + " " + t("disruption_list").toLowerCase()
            : SprevPath === "/adhocPnrList" && userTypeCheck
              ? t("adhoc") + " " + t("disruption_list").toLowerCase()
              : t("planb"),
        },
        {
          path: "/viewPnrInfo",
          title: t("itinerary_details"),
          breadcrumbName: "viewPnrInfo",
          key: "viewPnrInfo",
        },
      ],
    };
  }

  const handleChildData = (
    flightIndex: any,
    status: any,
    modifyBtnEnable: boolean = false,
    btnEnable: boolean = false
  ) => {
    if (modifyBtnEnable) {
      setEnableBtn(btnEnable);
      return true;
    }
    // setShowTooltip(status === "modify" ? true : false);
    setEnableBtn(true);

    // setDataArray((prevDataArray: any) => {
    const checkConfirmed = activePNRData[0]?.rebookOptionalFlightDetails
      ?.map((item: any) =>
        item?.flightDetails?.filter(
          (flight: any) => flight?.statusCode !== "HK"
        )
      )
      ?.filter((item: any) => item.length);

    const updatedArray = activePNRData[0]?.rebookOptionalFlightDetails?.map(
      (item: any, index: number) =>
        index === flightIndex ? { ...item, itinerary_status: status } : item
    );

    dispatch(setRebookedData({ rescheduleStatus }));
    SsetReviewStatus(rescheduleStatus);

    var check = updatedArray.every((flight: any) => {
      if (rescheduleStatus.toLowerCase() !== "custom") {
        return flight.itinerary_status !== "";
      } else {
        if (flight.itinerary_status) {
          return (
            flight.itinerary_status !== "" &&
            flight.itinerary_status.toLowerCase() !== "modify"
          );
        }
        return false;
      }
    });

    // setEnableBtn(!check ? checkConfirmed.length === 1 && status !== "modify" : check);
    // Create a new array by mapping over the activePNRData
    var updatedPNR;
    updatedPNR = activePNRData?.map((pnr: any) => {
      return {
        ...pnr,
        rebookOptionalFlightDetails: pnr.rebookOptionalFlightDetails.map(
          (item: any, index: number) =>
            index === flightIndex ? { ...item, itinerary_status: status } : item
        ),
      };
    });

    dispatch(updateActivePNR(updatedPNR));
    setPNRObject(updatedPNR[0]);
    SsetFinalViewPnrData(updatedPNR);
    return updatedArray;
  };

  const customHandler = () => {    
    if (
      activePNRData[0]?.rebookOptionalFlightDetails?.some(
        (item: any, index: number) =>
          item?.itinerary_status?.toLowerCase() === "modify"
      )
    ) {
      redirect("searchFlight");
      // setIsCustomApplied(true);
    // } else if (
    //   activePNRData[0]?.rebookOptionalFlightDetails?.some(
    //     (item: any) => item?.itinerary_status?.toLowerCase() === "cancel"
    //   )
    // ) {
    //   handlePopupData(true);
    } else {
      redirect("reviewflight");
    }
  };

  // Setting data object for the cancel pnr popup
  const popupData = {
    modalName: "cancel",
    page: "viewPnrInfo",
    header: t("cancel_pnr_header") + pnrObject?.PNR,
    description: t("cancel_pnr_description"),
    modalToggle: isModalOpen,
    modalClass: "cls-cancelpnr-modal",
    modalWidth: 540,
    primaryBtn: { text: "No", value: false },
    secondaryBtn: { text: "Yes, Cancel", value: true },
  };

  // Function to get data from cancel pnr popup
  const handlePopupData = (data: boolean) => {
    setIsModalOpen(data);
    if (data) {
      var temp = JSON.parse(JSON.stringify(activePNRData));
      temp[0]?.rebookOptionalFlightDetails.forEach((data: any) => {
        data.flightDetails.forEach((flightData: any) => {
          flightData.statusCode = "WK";
          flightData.status = "Cancelled";
        });
      });
      dispatch(setRebookedData("cancelled"));
      SsetReviewStatus("cancelled");
      SsetFinalReviewPnrData(temp);
      setNavigateBool(true);
    }
  };

  useEffect(() => {
    if (navigateBool) redirect("itineraryConfirm");
  }, [navigateBool]);

  const handleApply = () => {
    if (rescheduleStatus === "Modify") {
      redirect("searchFlight");
    } else if (rescheduleStatus === "Custom") {
      customHandler();
    } else if (rescheduleStatus === "Cancel") {
      handlePopupData(true);
    } else if (rescheduleStatus === "Accept") {
      redirect("reviewflight");
    }
    // if(!modifyDates.length) {
    var datesArr: any = [];
    var datesChangedArr: any = [];
    activePNRData[0]?.rebookOptionalFlightDetails?.forEach(
      (flight: any, index: number) => {
        var check = modifyDates
          ? modifyDates?.filter((modify: any) => modify.flightId === index)
          : [];
        datesArr.push(
          getDynamicDate(
            check.length
              ? getDynamicDate(check[0]?.date, true, "DD/MM/YYYY")
              : flight.date
          )
        );
      }
    );

    datesArr.forEach((date: any) => {
      if (date) {
        const parsedDate = dayjs(date, "MMM DD, YYYY"); // Parsing the date
        if (parsedDate.isValid()) {
          datesChangedArr.push({
            date: parsedDate.format("DD/MM/YYYY"), // "02/09/2024"
            dateData: parsedDate.toISOString(), // "2024-09-01T00:00:00.000Z"
          });
        } else {
          console.warn(`Invalid date parsed for input: ${date}`);
        }
      } else {
        console.warn(`Invalid input date: ${date}`);
      }
    });
    SsetModifyDates(datesChangedArr);
    dispatch(updateActivePNR(activePNRData));
    SsetFinalViewPnrData(activePNRData);
    // }
  };

  return (
    <>
      {activePNRData?.length &&
      pnrObject?.originalFlightDetails &&
      pnrObject?.rebookOptionalFlightDetails ? (
        <>
          <Row
            data-testid="viewPnrInfo"
            className={isExpand ? "cls-flightchange-row" : "cls-fight-change"}
          >
            <Col span={24}>
              <ItineraryHeader data={headerProps} />
              <Row
                justify="space-between"
                className="cls-original-flights-header"
              >
                <Col className="cls-flight-card-header">
                  <Text className={`${isSmallScreen ? "fs-15 f-sbold" : "fs-18 f-reg"} cls-bgLayout-text-color`}>
                    {t("originalFlightDetails")}
                  </Text>
                  <Text className={`${isSmallScreen ? "fs-12" : "fs-16"} f-reg`}>
                    ({t("we_highlighted_time_changes")})
                  </Text>
                </Col>
                {/* <Col className="cls-cancelpnr-btn">
                  {isAuthenticated ? (
                    <Button
                      type="link"
                      onClick={() => {
                        setIsModalOpen(true);
                      }}
                    >
                      {t("cancel_pnr")}
                    </Button>
                  ) : (
                    <></>
                  )}
                </Col> */}
              </Row>
            </Col>
            <Col span={24} className="cls-pnrlistv1-1">
              {pnrObject?.originalFlightDetails ? (
                <ItineraryList
                  sendDataToParent={handleChildData}
                  flight_details={pnrObject?.originalFlightDetails}
                  action={undefined}
                />
              ) : (
                <></>
              )}
            </Col>
            <Col span={24}>
              <Row className="cls-suggested-flights-header">
                <Col className="cls-flight-card-header">
                  <Text className={`${isSmallScreen ? "fs-15 f-sbold" : "fs-18 f-reg"} cls-bgLayout-text-color`}>
                    {t("rebook_optional_flight_details")}
                  </Text>
                </Col>
              </Row>
            </Col>
            <Col span={24}>
              <Col span={24} className="cls-rebooked-col">
                {!isAuthenticated ? (
                  <Col span={24} className="mt-2">
                    <Text style={{ color: "#FF4D4F" }} className="f-reg">
                      {t("to_process_further_actions_Kindly")}
                    </Text>
                    <Text
                      className="cls-sign-in f-reg pl-1"
                      style={{
                        color: "var(--t-common-primary)",
                        cursor: "pointer",
                      }}
                      onClick={() => setVisible(true)}
                    >
                      {t("sign_in")}
                    </Text>
                  </Col>
                ) : (
                  ""
                )}
                <Row className="cls-radio-reschedule">
                  <Col span={24}>
                    <Card
                      className={`${isAuthenticated && isAuthenticated ? "" : "cls-disabled no-events"} cls-bg-radio-reschedule`}
                    >
                      <Row justify="space-between">
                        <Col className="mb-1">
                          <Text className={`${isSmallScreen ? "fs-12 f-sbold" : "fs-18" } mb-0 cls-header-text`}>
                            {t("how_do_you_want_to_proceed?")}
                          </Text>
                        </Col>
                      </Row>

                      <Row justify="space-between">
                        <Col>
                          <Radio.Group
                            className="f-sbold"
                            value={rescheduleStatus}
                            onChange={(e) => {
                              handleRadioButtonChanges(e);
                            }}
                          >
                            <Radio value="Accept" className={`f-reg ${isSmallScreen ? "mr-1" : "mr-3"}`}>
                              {t("accept")}
                            </Radio>
                            {activePNRData[0]?.modify ?? (
                              <>
                                <Radio value="Modify" className={`f-reg ${isSmallScreen ? "mr-1" : "mr-3"}`}>
                                  {t("modify")}
                                </Radio>
                                <Radio value="Custom" className={`f-reg ${isSmallScreen ? "mr-1" : "mr-3"}`}>
                                  {t("custom")}
                                </Radio>
                              </>
                            )}
                            <Radio value="Cancel" className={`f-reg ${isSmallScreen ? "mr-1" : "mr-3"}`}>
                              {t("cancel")}
                            </Radio>
                          </Radio.Group>
                        </Col>
                        <Col className="cls-cancel-pnr"></Col>
                      </Row>
                      <Row className="hide-res-only">
                        <Col className="cls-description-text mt-2">
                          {t("rebooked_flight_description")}
                        </Col>
                      </Row>
                    </Card>
                    <Col className="cls-pnrlistv1-2">
                      {pnrObject?.rebookOptionalFlightDetails ? (
                        <ItineraryList
                          sendDataToParent={handleChildData}
                          action={action}
                          flight_details={
                            pnrObject?.rebookOptionalFlightDetails
                          }
                        />
                      ) : (
                        <></>
                      )}
                    </Col>
                  </Col>
                </Row>
              </Col>
            </Col>
            {/* PNR history */}
            {/* <Col span={24}>
              <Row>
                <Col span={6} className="cls-pnr-history f-sbold">
                  <Button
                    type="link"
                    onClick={() => {
                      setshow_pnr_history(!show_pnr_history);
                    }}
                  >
                    {t("view_pnr_history")} (3)
                    {show_pnr_history ? (
                      <span>&nbsp; &#9650;</span>
                    ) : (
                      <span>&nbsp; &#9660;</span>
                    )}
                  </Button>
                </Col>
              </Row>
              {show_pnr_history && (
                <Row>
                  {show_pnr_history ? (
                    <Col span={24}>
                      <PnrHistory />
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
              )}
            </Col> */}
            {/* Apply button */}

            <Col span={24}>
              <Row
                justify="center"
                align="middle"
                style={{ gap: "20px" }}
                className="my-6"
              >
                {userRole === "Service executive" ? (
                  <TextArea
                    placeholder="Please enter the reason for action:"
                    autoSize={{ minRows: 2, maxRows: 6 }}
                    value={reason}
                    onChange={(e) => {
                      setReason(e.target.value);
                    }}
                  />
                ) : (
                  ""
                )}
                {isAuthenticated && (
                  <Col className="cls-footer-btn" xs={12} xl={4}>
                    <Tooltip
                      title={`${enableBtn ? "" : (rescheduleStatus === "Modify" || showTooltip) && rescheduleStatus !== "" ? t("select_date_from_msg") : t("select_option_msg")}`}
                    >
                      <Text>
                        <Button
                          className={`cls-bg-btn ${
                            userRole === "Service executive"
                              ? reason &&
                                activePNRData[0]?.rebookOptionalFlightDetails
                                  ?.length > 0 &&
                                enableBtn
                                ? ""
                                : "cls-disabled no-events"
                              : activePNRData[0]?.rebookOptionalFlightDetails
                                    ?.length > 0 && enableBtn
                                ? ""
                                : "cls-disabled no-events"
                          }`}
                          type="primary"
                          size="large"
                          id="applybtn"
                          onClick={handleApply}
                        >
                          {t("apply")}
                        </Button>
                      </Text>
                    </Tooltip>
                  </Col>
                )}
                {/* )} */}
              </Row>
            </Col>
          </Row>
          <Text>
            {activePNR[0]?.rebookOptionalFlightDetails?.length > 0 && enableBtn}
            {activePNR[0]?.rebookOptionalFlightDetails?.length > 0}
            {enableBtn}
          </Text>
          <ConfirmModalPopup onData={handlePopupData} props={popupData} />
          <Modal
            style={{ padding: "0px" }}
            className="cls-login-modal"
            width="895px"
            open={visible}
            onOk={() => setVisible(false)}
            onCancel={() => setVisible(false)}
            centered
            footer={false}
          >
            <Container isPlanb={true} />
          </Modal>
        </>
      ) : (
        <ViewPnrInfoSkeleton />
      )}
    </>
  );
};
export default ViewPnrInfo;
