import {
  Alert,
  Col,
  DatePicker,
  GetProps,
  Radio,
  RadioChangeEvent,
  Row,
  Tag,
  Typography,
} from "antd";
import "./ItineraryList.scss";
import { useEffect, useState } from "react";
import {
  DatePickerRe,
  FdFlightDestinationDotIcon,
  FlightRouteRe,
  FdArrowRightIcon,
} from "../Icons/Icons";
import { updateModifyDates } from "@/stores/Pnr.store";
import { useTranslation } from "react-i18next";
import dayjs, { Dayjs } from "dayjs";
import ItineraryListSkeleton from "./ItineraryList.skeleton";
import { getDynamicDate } from "@/Utils/general";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useDispatch } from "react-redux";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

interface ItineraryListProps {
  sendDataToParent: (
    flight: any,
    status: any,
    modifyBtnEnable?: boolean,
    btnEnable?: boolean
  ) => void;
  action: any /* specify the type for action */;
  flight_details: any /* specify the type for flight_details */;
  modifyBtnEnable?: boolean;
}

const ItineraryList: React.FC<ItineraryListProps> = ({
  sendDataToParent,
  action,
  flight_details,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const flightSpacing = "--";
  const [selectedDates, setSelectedDates] = useState<any>([]);
  const [enabledDatePickers, setEnabledDatePickers] = useState<number[]>([0]); // Initially enable only the first DatePicker
  const [flightData, setFlightData] = useState<any>();
  const [, SsetModifyDates] = useSessionStorage<any>("modifyDates");
  var resFlightCount: boolean[] = [];

  const { isSmallScreen, isMediumScreen } = useResize();

  useEffect(() => {
    setFlightData(flight_details);
  }, [flight_details]);

  useEffect(() => {
    var checkModify = [];
    if (action?.content?.toLowerCase() === "modified") {
      var nonConfirmedFlights = flightData.map((pnr: any) =>
        pnr.flightDetails.filter((flight: any) => flight.statusCode !== "HK")
      );
      checkModify = nonConfirmedFlights?.filter((flight: any) => flight.length);
    } else {
      if (action?.content?.toLowerCase() === "custom") {
        checkModify = flightData?.filter(
          (flight: any) => flight?.itinerary_status === "modify"
        );
      }
    }

    if (
      !Object.keys(selectedDates).length ||
      Object.keys(selectedDates).length < checkModify.length
    ) {
      // sendDataToParent("", "", true, false);
    } else {
      if (Object.keys(selectedDates).length === checkModify.length) {
        sendDataToParent("", "", true, true);
      }
    }    
    dispatch(updateModifyDates(selectedDates));
    SsetModifyDates(selectedDates);
    // eslint-disable-next-line
  }, [selectedDates]);

  useEffect(() => {
    if (action?.content?.toLowerCase() === "modified") {
      setSelectedDates([]);
    }
  }, [action]);

  const handleDateChange = (date: Dayjs | null, flightId: number) => {
    const formattedDate = date ? date.format("DD/MM/YYYY") : "";
    // setSelectedDates((prevDates: any) => {
    //   if (formattedDate === "") {
    //     const { [flightId]: removed, ...remainingDates } = prevDates;
    //     return remainingDates;
    //   } else {
    //     return {
    //       ...prevDates,
    //       [flightId]: {
    //         date: formattedDate,
    //         dateData: date,
    //       },
    //     };
    //   }
    // });

    setSelectedDates((prevDates:any) => {
      if (formattedDate === "") {
        // Remove the entry if formattedDate is empty
        return prevDates.filter((entry:any) => entry.flightId !== flightId);
      }
    
      // Create the new entry
      const newEntry = { flightId, date: formattedDate, dateData: date };
    
      // Check if the entry already exists
      const existingIndex = prevDates.findIndex((entry:any) => entry.flightId === flightId);
    
      // If it exists, update; otherwise, add a new entry
      return existingIndex !== -1
        ? prevDates.map((entry:any, index:number) => (index === existingIndex ? newEntry : entry))
        : [...prevDates, newEntry];
    });

    flightData?.forEach((data: any) => {
      var check = data?.flightDetails.filter(
        (flight: any) => flight.statusCode !== "HK"
      );
      resFlightCount.push(!check.length);
    });
    resFlightCount = resFlightCount.filter((data: any) => data === false);

    if (resFlightCount.length === enabledDatePickers.length) {
      sendDataToParent("", "", true, true);
    } else {
      if (!enabledDatePickers.includes(flightId + 1)) {
        setEnabledDatePickers((prev) => [...prev, flightId + 1]);
      }
    }
  };

  type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

  // const disabledDate: RangePickerProps['disabledDate'] = (current) => {
  //   // Can not select days before today and today
  //   return current && current < dayjs().endOf('day');
  // };

  const title = [
    "sector",
    "flightNumber",
    "date",
    "depart",
    "duration",
    "arrival",
    "status",
  ];  

  return flightData?.length ? (
    <div data-testid="ItineraryList" className="cls-itineraryListMain">
      <div className="hide-res-only">
        <Row justify="space-between" className="mt-3 mb-4 cls-heading">
          {title?.map((heading: string, index: number) => (
            <Col
              md={index % 2 === 0 ? 4 : 2}
              lg={
                  title?.length === index + 1
                    ? 5 :
                      index === 1 || index === 2
                        ? 3
                        : index % 2 === 0 
                          ? 4 : 2
                  }
              xl={index % 2 === 0 ? 4 : 2}
              className="fs-12 cls-lightgray"
              key={`heading-${index}`}
            >
              {t(heading).toUpperCase()} 
            </Col>
          ))}
        </Row>
      </div>
      <div className={`cls-pnrlistv1-2 cls-action ${action?.class}`}>
        <Row justify="start" className="cls-statusRow">
          <Text className={`${action?.class}-span`}>
            {action?.content === "Custom" ? null : action?.content}
          </Text>
        </Row>
        {flightData?.map((data: any, mainIndex: number) => {
          return (
            <div key={`data-${mainIndex}`} className="cls-accept">
              <Text
                className={`d-iblock p-clr cls-trip ${isSmallScreen || isMediumScreen ? "pt-0" : "pt-3"}`}
                key={`trip-${mainIndex}`}
              >
                {" "}
                Trip {data.trip}
              </Text>
              {data.flightDetails.map((item: any, index: number) => (
                <div
                  key={`flight-${mainIndex}-${index}`}
                  className={`${data.flightDetails.length === index + 1 && flightData.length !== mainIndex + 1 ? "bordered-row" : ""} ${isSmallScreen || isMediumScreen ? "pt-3 pb-2" : "pt-2 pb-3"}`}
                >
                  <Row justify="space-between" className="relative">
                    <Col xs={6} sm={6} md={6} lg={4} xl={4} className="fs-15 f-sbold hide-res-only">
                      <Text className="mr-3">{item?.originAirportCode}</Text>{" "}
                      <FdArrowRightIcon />
                      <Text className="ml-3">
                        {item?.destinationAirportCode}
                      </Text>
                    </Col>
                    <Col xs={5} sm={6} md={6} lg={3} xl={2} className={`${isSmallScreen || isMediumScreen ? "fs-12 f-sbold" : "f-reg"} text-ellipsis`}>
                      {item?.flightNumber}
                    </Col>
                    <Col xs={24} md={24} lg={3} xl={4} className={`f-reg cls-depDate ${isSmallScreen || isMediumScreen ? "fs-13 h-24 py-1" : "fs-15"}`}>
                      {getDynamicDate(item?.departDate) as string}
                    </Col>
                    <Col xs={4} md={4} lg={2} xl={2}>
                      <Text className="fs-14 f-sbold res-only w-100">{item?.originAirportCode}</Text>
                      <Text className={`f-reg ${item?.statusCode !== "HK" ? "cls-highlight" : ""}`}>
                        {item?.depart}
                      </Text>
                    </Col>
                    <Col xs={10} sm={9} md={9} lg={4} xl={4} className={`fs-13 cls-lightgray`}>
                      <Row
                        className="cls-flight-route-container"
                        justify="start"
                        wrap={isSmallScreen || isMediumScreen ? true : false}
                      >
                        <Col className="cls-flight-duration-div">
                          <FlightRouteRe />
                        </Col>
                        <Text className="cls-travel-point">
                          {flightSpacing}
                        </Text>
                        <Col className={`cls-flight-duration f-reg ${isSmallScreen || isMediumScreen ? "fs-11" : ""}`}>
                          {item?.duration}
                        </Col>
                        <Text className="cls-travel-point">
                          {flightSpacing}
                        </Text>
                        <Col>
                          <FdFlightDestinationDotIcon />
                        </Col>
                      </Row>
                    </Col>
                    <Col xs={5} md={5} lg={2} xl={2} className={`f-reg ${isSmallScreen || isMediumScreen ? "text-right" : ""}`}>
                      <Text className="fs-14 f-sbold res-only w-100">{item?.destinationAirportCode}</Text>
                      <Text
                        className={`${item?.statusCode !== "HK" ? "cls-highlight" : ""}`}
                      >
                        {item?.nextDayArrival !== "" ? (
                          <>
                            {item?.arrival}
                            <sup>{item?.nextDayArrival}</sup>
                          </>
                        ) : (
                          item.arrival
                        )}
                      </Text>
                    </Col>
                    <Col xs={24} md={24} lg={5} xl={4} className="cls-disruptionStatus">
                      <Tag
                        className="f-bold d-iblock text-ellipsis"
                        color={
                          item?.statusCode === "HK"
                            ? "var(--ant-color-success-text-active)"
                            : item.statusCode === "SC"
                              ? "var(--t-viewPnr-schedule-change-bg)"
                              : item.statusCode === "WK"
                                ? "var(--ant-color-error-text-active)"
                                : "var(--t-viewPnr-time-change-bg)"
                        }
                      >
                        {item?.status} ({item.statusCode})
                      </Tag>
                    </Col>
                    <Col xs={24} md={24} lg={24} xl={24}>
                      { item?.reason && <Alert
                          message={
                            <Text className="ml-4 d-iblock">
                              {item?.reason}
                            </Text>
                          }
                          type="warning"
                        /> }
                    </Col>
                  </Row>
                  {data.flightDetails.length !== index + 1 &&
                    data.stops !== "" && (
                      <Row
                        className="text-center"
                        key={`stop-${mainIndex}-${index}`}
                      >
                        <Text className="d-block cls-stop">
                          {" "}
                          {data?.stops} stop(s) -{" "}
                          {data?.stopDetails[index]?.airportName} (
                          {data?.stopDetails[index]?.airportCode}){" - "}
                          {data?.stopDetails[index]?.stopOverTime}
                        </Text>
                      </Row>
                    )}
                  {action?.content === "Modified" &&
                  data.flightDetails.length === index + 1 &&
                  data.flightDetails?.some((item:any) => item?.statusCode !== "HK") ? (
                    <Row key={`modified-${mainIndex}-${index}`} className="cls-dateRow">
                      <Col
                        className={`${isSmallScreen || isMediumScreen ? "mt-3 fs-13" : "mt-5"}`}
                        style={{
                          color: "var(--t-common-grey-color)",
                          fontStyle: "italic",
                        }}
                        xl={7}
                      >
                        {t("select_date_msg")}
                      </Col>
                      <Col className="mt-3 ml-3">
                        <DatePicker
                          size="middle"
                          showToday={false}
                          allowClear={false}
                          inputReadOnly={true}
                          format="MMM DD, YYYY"
                          // disabledDate={disabledDate}
                          disabledDate={(date) => {
                            // Ensure that only the selected date is enabled
                            return !date.isSame(
                              selectedDates[mainIndex]?.dateData 
                              ? dayjs(getDynamicDate(selectedDates[mainIndex]?.dateData)) 
                              : dayjs(getDynamicDate(data.date))
                              , 'day'
                            );
                          }}
                          value={
                            selectedDates[mainIndex]?.dateData ? 
                            dayjs(getDynamicDate(
                              selectedDates[mainIndex]?.dateData
                            )) :
                            dayjs(getDynamicDate(
                              data.date
                            ))
                          }
                          onChange={(date) => handleDateChange(date, mainIndex)}
                          suffixIcon={<DatePickerRe />}
                        />
                      </Col>
                    </Row>
                  ) : (
                    ""
                  )}
                  {action?.content === "Custom" &&
                  data.flightDetails.length === index + 1 &&
                  data.flightDetails?.some((item:any) => item?.statusCode !== "HK") ? (
                    <>
                      <Row
                        className="mt-5 mb-1 mr-3 cls-customModifyRow"
                        align="middle"
                        wrap
                        key={`custom-${mainIndex}-${index}`}
                      >
                        <Col
                          className={`cls-grey d-flex align-center flex-wrap`}
                          style={{ fontStyle: "italic" }}
                          xs={24}
                          lg={16}
                          xl={16}
                        >
                          {data?.itinerary_status?.toLowerCase() === "modify" ? (
                            <>
                              <Text 
                                className={`${isSmallScreen || isMediumScreen ? "fs-13 f-reg w-100 d-block mt-1" : ""} cls-grey`}
                              >
                                {t("select_date_msg")}
                              </Text>
                              <DatePicker
                                className={`${isSmallScreen ? "my-2" : "ml-3"}`}
                                size="middle"
                                inputReadOnly={true}
                                allowClear={false}
                                showToday={false}
                                format="MMM DD, YYYY"
                                value={
                                  selectedDates[mainIndex]?.dateData ? 
                                  dayjs(getDynamicDate(
                                    selectedDates[mainIndex]?.dateData
                                  )) :
                                  dayjs(getDynamicDate(
                                    data.date
                                  ))
                                }
                                disabledDate={(date) => {
                                  // Ensure that only the selected date is enabled
                                  return !date.isSame(
                                    selectedDates[mainIndex]?.dateData 
                                    ? dayjs(getDynamicDate(selectedDates[mainIndex]?.dateData)) 
                                    : dayjs(getDynamicDate(data.date))
                                    , 'day'
                                  );
                                }}
                                onChange={(date) =>
                                  handleDateChange(date, mainIndex)
                                }
                                suffixIcon={<DatePickerRe />}
                              />
                            </>
                          ) : (
                            <></>
                          )}
                        </Col>
                        <Col xs={24} xl={8} className="text-right">
                          <Radio.Group
                            className="cls-radio-group"
                            onChange={(e: RadioChangeEvent) => {
                              // handleRadioChange(e);
                              sendDataToParent(mainIndex, e.target.value);
                            }}
                          >
                            <Radio
                              checked={
                                item?.itinerary_status === "accept"
                                  ? true
                                  : false
                              }
                              value="accept"
                            >
                              {" "}
                              {t("accept")}{" "}
                            </Radio>
                            <Radio
                              checked={
                                item?.itinerary_status === "modify"
                                  ? true
                                  : false
                              }
                              value="modify"
                            >
                              {" "}
                              {t("modify")}{" "}
                            </Radio>
                            <Radio
                              checked={
                                item?.itinerary_status === "cancel"
                                  ? true
                                  : false
                              }
                              value="cancel"
                            >
                              {" "}
                              {t("cancel")}{" "}
                            </Radio>
                          </Radio.Group>
                        </Col>
                      </Row>
                    </>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </div>
          );
        })}
      </div>
    </div>
  ) : (
    <ItineraryListSkeleton data-testid="ItineraryList" />
  );
};

export default ItineraryList;
