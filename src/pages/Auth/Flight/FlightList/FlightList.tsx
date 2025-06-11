/**
 * Module : Component with mutiple purpose to show schedule changed flights detail and to handle rescheduling
 * Date : May 2023
 **/

import { useEffect, useState } from "react";
import "./FlightList.scss";
import { Button, Card, Col, DatePicker, Radio, Row, Typography } from "antd";
import {
  FdFlightDestinationDotIcon,
  RSUserRe,
  InfoRe,
  DatePickerRe,
  FlightRouteRe,
  BlueInfoRe,
  RightArrowRe,
} from "@/components/Icons/Icons";
import { useAppSelector } from "@/hooks/App.hook";
import { DateFormatForReschedule, getDifferenceInTime } from "@/Utils/date";
import { useDispatch } from "react-redux";
import moment from "moment";
import { setReviewFlightDetail } from "@/stores/ReviewFlight.store";
import { useFlightChangesListData } from "@/hooks/FlightChangesList.hook";
import { useAuth } from "@/hooks/Auth.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
const { Text } = Typography;
interface FlightListProps {
  flight: string;
  rescheduleStatus?: string;
  updateRescheduleState?: (newValue: string) => void;
  isCustomApplied?: boolean;
}

const FlightList: React.FC<FlightListProps> = (props) => {
  const {redirect} = useRedirect();
  const { reviewFlightDetail } = useAppSelector(
    (state) => state.ReviewFlightReducer
  );
  const { activePNRDetails, activePNR } = useAppSelector(
    (state) => state.PNRReducer
  );
  const { FCDataList } = useFlightChangesListData();
  const [flightChangesListData, setFlightChangesListData] = useState<any>({});
  const [isReview, setIsReview] = useState<boolean>(true);
  const flightSpacing = "--";
  const dispatch = useDispatch();
  const [componentType, setComponentType] = useState<string>(props.flight);
  const [action, setAction] = useState<{
    active: boolean;
    content: string;
    class: string;
  }>({
    active: false,
    content: "",
    class: "",
  });

  const {isAuthenticated} = useAuth();

  // Setting Flight changes details to a state for further use as per component type
  useEffect(() => {
    if (props.flight === "review") {
      setFlightChangesListData(reviewFlightDetail.flightData);
    } else {
      setFlightChangesListData(FCDataList.flightData);
    }
  }, [FCDataList, props.flight]);

  // Enable Apply button id all required details are satisfied
  useEffect(() => {
    if (flightChangesListData) {
      let tempReview;
      if (props.rescheduleStatus === "Modify") {
        // setIsReview(false); //set this to true while working on modify flow to directly move to search flight page (enables 'apply' button)
        tempReview = flightChangesListData?.some((flight: any) => {
          return flight.flightData.flightStatusName === "Confirmed"
            ? false
            : !flight.date;
        });
        setIsReview(tempReview);
      } else if (props.rescheduleStatus === "Custom") {
        tempReview = flightChangesListData?.some(
          (flight: any) =>
            !(
              flight.flightData.flightStatusName === "Confirmed" ||
              flight.status === "Accept" ||
              flight.status === "Refund" ||
              (flight.status === "Modify" && flight.date !== "")
            )
        );
        setIsReview(tempReview);
      }
    }
  }, [flightChangesListData]);

  // The flight changes list data is updated using the following useEffect, which is then used to process the value locally.
  useEffect(() => {
    if (componentType !== "review") {
      if (FCDataList) {
        dispatch(
          setReviewFlightDetail({
            flightData: flightChangesListData,
            isReview: isReview,
            overAllStatus: props.rescheduleStatus,
            isBack: false,
            isEdit: false,
          })
        );
      }
    }
  }, [isReview, flightChangesListData]);

  // Setting action values for further use on changing status of flights on clicking schedule change radio button
  const handleRadioButtonChanges = (value: any) => {
    let radioValue = value.target.value;

    setAction({
      active: radioValue !== "Custom" && true,
      content:
        radioValue === "Accept"
          ? "Accepted"
          : radioValue === "Refund"
          ? "Refunded"
          : radioValue === "Modify"
          ? "Modified"
          : "Custom",
      class: `cls-${radioValue.toLowerCase()}`,
    });

    props.updateRescheduleState && props.updateRescheduleState(radioValue);
  };

  // This useEffect is for handling data level modification on changing flight status
  useEffect(() => {
    let changeInFlight;
    let isUpdated: boolean;

    const updateFlightChangesList = (status: string) => {
      changeInFlight = reviewFlightDetail.flightData.map((flightData: any) => {
        const flightStatus = flightData.flightData.flightStatusName;
        const flightStatusAccepted =
          flightStatus === "Confirmed" ? "Accept" : status;

        return {
          ...flightData,
          status: flightStatusAccepted,
        };
      });

      setFlightChangesListData(changeInFlight);

      if (status === "Modify") {
        isUpdated = flightChangesListData.every(
          (flight: any) => flight.date !== ""
        );
        setIsReview(!isUpdated);
      } else if (status === "Custom") {
        isUpdated = flightChangesListData.every(
          (flight: any) =>
            flight.status !== "" ||
            flight.flightData.flightStatusName === "Confirmed"
        );
        setIsReview(!isUpdated);
      }
    };

    if (
      props.rescheduleStatus === "Accept" ||
      props.rescheduleStatus === "Refund"
    ) {
      setIsReview(false);
      updateFlightChangesList(props.rescheduleStatus);
    } else if (
      props.rescheduleStatus === "Modify" ||
      props.rescheduleStatus === "Custom"
    ) {
      updateFlightChangesList(props.rescheduleStatus);
    }
  }, [props.rescheduleStatus]);

  // Date and status data handling for specific flight on changing status
  const customDataHandling = (data: any, status: string, type?: string) => {
    setFlightChangesListData((prevFlight: any) =>
      prevFlight.map((flight: any) => {
        return flight.flightData.flightNumber === data.flightData.flightNumber
          ? {
              ...flight,
              date: type === "date" ? status : "",
              status: type === "status" ? status : data.status,
            }
          : flight;
      })
    );
  };

  // Design level status information handler
  const cardButtonStatusHandler = (value: any) => {
    if (
      componentType === "original" ||
      value.flightData.flightStatusName === "Confirmed"
    ) {
      return (
        value.flightData.flightStatusName +
        " (" +
        value.flightData.flightStatusCode +
        ")"
      );
    } else if (componentType === "suggested") {
      if (value.status === "Accept" && action.active) {
        return "Yet to confirm (HN)";
      } else if (value.status === "Refund" && action.active) {
        return "Yet to cancel (HN)";
      } else {
        return (
          value.flightData.suggestedFlight.flightStatusName +
          " (" +
          value.flightData.suggestedFlight.flightStatusCode +
          ")"
        );
      }
    } else if (componentType === "review") {
      if (value.status === "Accept") {
        return "Yet to confirm (HN)";
      } else if (value.status === "Refund") {
        return "Yet to cancel (HN)";
      } else if (value.status === "Modify") {
        return "Yet to confirm (HN)";
      }
    }
  };
  return (
    <Row
      data-testId="FlightList"
      className={`cls-flight-list-container  ${
        componentType === "original"
          ? "cls-original-flights"
          : componentType === "suggested"
          ? "cls-schedule-change pb-4"
          : `cls-review-flights  ${
              reviewFlightDetail.overAllStatus === "Accept"
                ? "cls-accepted"
                : reviewFlightDetail.overAllStatus === "Refund"
                ? "cls-cancelled"
                : reviewFlightDetail.overAllStatus === "Modify"
                ? "cls-modified"
                : ""
            }`
      } `}
    >
      {componentType === "review" && (
        <span
          className={` cls-review-status-label cls-${reviewFlightDetail.overAllStatus.toLowerCase()}`}
        >
          {reviewFlightDetail.overAllStatus === "Accept"
            ? "Accepted"
            : reviewFlightDetail.overAllStatus === "Refund"
            ? "Cancelled"
            : reviewFlightDetail.overAllStatus === "Modify"
            ? "Modified"
            : ""}
        </span>
      )}

      {componentType === "suggested" && (
        <Col span={24}>
          <Row className="cls-radio-reschedule">
            <Col span={24}>
              {!isAuthenticated && (
                <Col className="cls-login-info fs-16">
                  To process further actions, kindly{" "}
                  <span
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => redirect("login")}
                  >
                    sign in.
                  </span>
                </Col>
              )}
              <Card className={!isAuthenticated ? "cls-disabled no-events" : ""}>
                <Row justify="space-between">
                  <Col className="mb-2">
                    <h3 className="f-sbold  mb-0 cls-header-text">
                      How do you want to reschedule ?{" "}
                    </h3>
                  </Col>
                </Row>

                <Row justify="space-between">
                  <Col>
                    <Radio.Group
                      className="f-sbold"
                      value={props.rescheduleStatus}
                      onChange={(e) => {
                        handleRadioButtonChanges(e);
                      }}
                    >
                      <Radio value="Accept">Accept all</Radio>
                      <Radio value="Refund">Refund all</Radio>
                      <Radio value="Modify">Modify all</Radio>
                      <Radio value="Custom">Custom</Radio>
                    </Radio.Group>
                  </Col>
                  <Col className="cls-cancel-pnr"></Col>
                </Row>
                <Row>
                  <Col className="fs-13 cls-description-text mt-2">
                    Please select Accept all, Refund all, Modify all, Customer
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </Col>
      )}
      {componentType !== "review" && (
        <Col span={24}>
          <Row className="cls-table-dtl">
            <Col span={4}>Sector</Col>
            <Col span={2}>Flight no</Col>
            <Col span={4}>Date</Col>
            <Col span={3}>Depart</Col>
            <Col span={4}>Duration</Col>
            <Col span={3}>Arrival</Col>
            <Col span={4}>Status</Col>
          </Row>
        </Col>
      )}
      <Col
        span={24}
        className={`cls-flight-details-container ${
          action.active && action.class + " cls-action"
        }`}
      >
        {flightChangesListData &&
          Object.keys(flightChangesListData).length !== 0 &&
          flightChangesListData.map((value: any, index: number) => {
            return componentType === "original" ||
              "review" ||
              value.flightData?.suggestedFlight ||
              (componentType === "suggested" &&
                value.flightData.flightStatusName === "Confirmed") ? (
              <div
                className={`cls-flight-details ${
                  componentType === "suggested" &&
                  props.isCustomApplied &&
                  " cls-action "
                } ${
                  value.status === "Accept"
                    ? "cls-accept"
                    : value.status === "Refund"
                    ? "cls-refund"
                    : "cls-modify"
                }`}
              >
                <Row
                  className="cls-flight-row "
                  style={{
                    backgroundColor:
                      componentType === "suggested" &&
                      value.flightData.flightStatusName === "Confirmed"
                        ? "#f6f6f6"
                        : "#fff",
                  }}
                >
                  <Col span={4} className="cls-flight-itenerary">
                    {componentType === "original" ||
                    value.flightData.flightStatusName === "Confirmed" ? (
                      <>
                        <span>{value.flightData.originAirportCode}</span> <RightArrowRe />
                        <span>{value.flightData.destinationAirportCode}</span>
                      </>
                    ) : (
                      <>
                        <span>{value.flightData.suggestedFlight.originAirportCode}</span>{" "}
                        <RightArrowRe />
                        <span>
                          {value.flightData.suggestedFlight.destinationAirportCode}
                        </span>
                      </>
                    )}
                  </Col>
                  <Col
                    span={2}
                    className={`${componentType === "review" && "fw-500"}`}
                  >
                    {componentType === "original" ||
                    value.flightData.flightStatusName === "Confirmed"
                      ? `${value.flightData?.airlineCode}-${value.flightData?.flightNumber}`
                      : componentType === "review" && value.status === "Modify"
                      ? `${value.flightData?.bookedFlight?.airlineCode}-${value.flightData?.bookedFlight?.flightNumber}`
                      : `${value.flightData?.suggestedFlight?.airlineCode}-${value.flightData?.suggestedFlight?.flightNumber}`}
                  </Col>
                  <Col
                    span={4}
                    className={`${
                      componentType === "review" ? "fs-13 fw-500" : "fs-16"
                    }`}
                  >
                    {DateFormatForReschedule(
                      componentType === "original" ||
                        value.flightData.flightStatusName === "Confirmed"
                        ? value.flightData.departure
                        : value.flightData.suggestedFlight.departure
                    )}
                  </Col>
                  <Col
                    span={3}
                    className="cls-flight-time"
                    style={
                      componentType === "review" ? { textAlign: "center" } : {}
                    }
                  >
                    <span
                      className={`${
                        componentType === "review" && "fs-16 fw-600"
                      } ${
                        value.flightData.flightStatusName !== "Confirmed" &&
                        componentType !== "review" &&
                        "cls-time-highlight"
                      } `}
                    >
                      {componentType === "original" ||
                      value.flightData.flightStatusName === "Confirmed"
                        ? value.flightData.departureTime +
                          " " +
                          value.flightData.departureTimeFormat
                        : value.flightData.suggestedFlight.departureTime +
                          " " +
                          value.flightData.suggestedFlight.departureTimeFormat}
                    </span>
                  </Col>
                  <Col span={4}>
                    <Row
                      className="cls-flight-route-container"
                      justify={componentType === "review" ? "center" : "start"}
                    >
                      <Col className="cls-flight-duration">
                        <FlightRouteRe />
                      </Col>
                      <span className="cls-travel-point">{flightSpacing}</span>

                      <Col
                        className={`cls-flight-duration ${
                          componentType === "review" ? "fs-13" : "fs-14"
                        }`}
                      >
                        {componentType === "original" ||
                        value.flightData.flightStatusName === "Confirmed"
                          ? getDifferenceInTime(
                              value.flightData.departure,
                              value.flightData.arrival
                            )
                          : getDifferenceInTime(
                              value.flightData.suggestedFlight.departure,
                              value.flightData.suggestedFlight.arrival
                            )}
                      </Col>
                      <span className="cls-travel-point">{flightSpacing}</span>
                      <Col>
                        <FdFlightDestinationDotIcon />
                      </Col>
                    </Row>
                  </Col>
                  <Col
                    span={3}
                    className={`${
                      componentType === "review" ? "fs-16 fw-600" : "fs-14"
                    }`}
                    style={
                      componentType === "review" ? { textAlign: "center" } : {}
                    }
                  >
                    <span
                      className={` ${
                        value.flightData.flightStatusName !== "Confirmed" &&
                        componentType !== "review" &&
                        "cls-time-highlight"
                      } `}
                    >
                      {componentType === "original" ||
                      value.flightData.flightStatusName === "Confirmed"
                        ? value.flightData.arrivalTime +
                          " " +
                          value.flightData.arrivalTimeFormat
                        : value.flightData.suggestedFlight.arrivalTime +
                          " " +
                          value.flightData.suggestedFlight.arrivalTimeFormat}
                    </span>
                  </Col>

                  <Col
                    span={4}
                    className={`cls-rs-btn ${
                      componentType === "original" ||
                      (componentType === "suggested" &&
                        value.flightData?.flightStatusName === "Confirmed")
                        ? `${
                            value.flightData?.flightStatusName === "Confirmed"
                              ? " cls-rs-status-confirm"
                              : " cls-rs-status"
                          }`
                        : componentType === "suggested"
                        ? " cls-schedule-changed-btn"
                        : value.status === "Refund"
                        ? "cls-review-cancelled"
                        : value.status === "Accept" || "Modify"
                        ? "cls-review-confirm"
                        : ""
                    }`}
                  >
                    <Button
                      icon={
                        componentType === "original" ||
                        value.flightData?.flightStatusName === "Confirmed" ? (
                          <RSUserRe />
                        ) : (
                          <Text className="Infi-Fd_02_Flight"> </Text>
                        )
                      }
                      style={{
                        backgroundColor:
                          value.flightData.suggestedFlight?.flightStatusName !==
                            "Confirmed" &&
                          action.active &&
                          value.flightData.flightStatusName !== "Confirmed"
                            ? "#368D88"
                            : "",
                      }}
                      block
                      size="small"
                      disabled
                    >
                      {cardButtonStatusHandler(value)}
                    </Button>
                  </Col>
                </Row>
                {componentType === "suggested" && (
                  <Row className="cls-flight-description">
                    <span className="fs-13">
                      {value.flightData.flightStatusName === "Confirmed" ? (
                        "No changes in the flight"
                      ) : (
                        <>
                          <InfoRe />
                          &nbsp;Flight departure time was postponed for{" "}
                          {getDifferenceInTime(
                            value.flightData.departure,
                            value.flightData.suggestedFlight.departure
                          )}
                        </>
                      )}
                    </span>
                  </Row>
                )}

                <Row align="middle">
                  <Col span={12}>
                    {componentType === "suggested" &&
                      (action.content === "Modified" ||
                        (action.content === "Custom" &&
                          value.status === "Modify")) &&
                      value.flightData.flightStatusName !== "Confirmed" && (
                        <Row className="cls-modify-row">
                          <Col className="cls-modify-text">
                            Please select your conveniant date for flight
                            depature
                          </Col>
                          <Col className="cls-date-picker-container ml-2">
                            <DatePicker
                              inputReadOnly={true}
                              showToday={false}
                              disabled={props.isCustomApplied ? true : false}
                              suffixIcon={<DatePickerRe />}
                              size="middle"
                              format="DD/MM/YYYY"
                              disabledDate={(current) => {
                                return moment().add(-1, "days") >= current;
                              }}
                              onChange={(date, dateString : any) =>
                                customDataHandling(value, dateString, "date")
                              }
                            />
                          </Col>
                        </Row>
                      )}
                  </Col>
                  <Col span={12}>
                    {componentType === "suggested" &&
                      !props.isCustomApplied &&
                      action.content === "Custom" &&
                      !(value.flightData.flightStatusName === "Confirmed") && (
                        <Row className="cls-custom-radio-row" justify="end">
                          <Col>
                            <Radio.Group>
                              <Radio
                                onChange={() =>
                                  customDataHandling(value, "Accept", "status")
                                }
                                value="accept"
                              >
                                Accept
                              </Radio>
                              <Radio
                                onChange={() =>
                                  customDataHandling(value, "Refund", "status")
                                }
                                value="refund"
                              >
                                Refund
                              </Radio>
                              <Radio
                                onChange={() =>
                                  customDataHandling(value, "Modify", "status")
                                }
                                value="change itinerary"
                              >
                                Change itinerary
                              </Radio>
                            </Radio.Group>
                          </Col>
                        </Row>
                      )}
                  </Col>
                </Row>
              </div>
            ) : null;
          })}
        {componentType === "review" && (
          <div className="cls-review-end-msg">
            <BlueInfoRe />
            <span>Segment going to accept</span>
          </div>
        )}
      </Col>
    </Row>
  );
};

export default FlightList;
