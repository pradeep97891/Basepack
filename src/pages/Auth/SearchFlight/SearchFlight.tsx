import {
  Col,
  Row,
  Button,
  Card,
  Divider,
  Typography,
  Collapse,
  DatePicker,
  GetProps,
  Select,
  Flex,
  Drawer,
} from "antd";
import { EditOutlined, LeftOutlined } from "@ant-design/icons";
import BookTicket from "../BookTicket/BookTicket";
import "./SearchFlight.scss";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/App.hook";
import { useDispatch } from "react-redux";
import { setOriginalFlightData } from "@/stores/ReviewFlight.store";
import { FlightLogoIcon } from "@/components/Icons/Icons";
import AddOnPopup, {
  AddOnPopupProps,
} from "@/components/AddOnPopup/AddOnPopup";
import dayjs, { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import SearchFlightSkeleton from "./SearchFlight.skeleton";
import { useGetFlightSearchResponseMutation } from "@/services/reschedule/Reschedule";
import React from "react";
import TweenOne from "rc-tween-one";
import { getDynamicDate } from "@/Utils/general";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useResize } from "@/Utils/resize";
import { useToggle } from "@/hooks/Toggle.hook";
const Text = Typography.Text;

const SearchFlight = () => {
  const dispatch = useDispatch();
  const { redirect } = useRedirect();
  const { t } = useTranslation();
  const { isSmallScreen } = useResize(991);
  const [open, toggleOpen] = useToggle(false);  // Toggle for opening/closing the filter drawer
  const [flightTabDetail, setFlightTabDetail] = useState<any>([]); // To store selected flight tab details
  const [modifyopen, setmodfiyOpen] = useState(false); // To open modify options collapse
  const [flightDetails, setflightDetails] = useState([]); // To set flights to be modified
  const [selectedFlightLength, setSelectedFlightLength] = useState();
  const [selectedFlight, setSelectedFlight] = useState<string[]>([]);
  const [SselectedFlights, SsetSelectedFlights] = useSessionStorage<any>("selectedFlights");
  const [searchFlightData, searchFlightDataStatus] =
    useGetFlightSearchResponseMutation();
  const { activePNR } = useAppSelector((state: any) => state.PNRReducer);
  /* Session storage values & handlers */
  const [SreviewStatus] = useSessionStorage<string>("reviewStatus");
  const [, , SremoveSsrPNRData] = useSessionStorage<any>("ssrPNRData");
  const [SfinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  const [SmodifyDates] = useSessionStorage<any>("modifyDates");
  const [, SsetSearchFlightPNRData] = useSessionStorage<any>(
    "searchFlightPNRData"
  );
  const [activePNRData, setActivePNRData] = useState(
    SfinalViewPnrData
  );
  var addOnProps: AddOnPopupProps = {
    currentTab: "modify",
    selectedFlights: selectedFlight,
  };

  useEffect(() => {
    //Service hit done for flight list to be shown
    searchFlightData([]);

    if (SselectedFlights) {
      setSelectedFlight(SselectedFlights);
    }

    var data;
    var pnrData;
    if (SreviewStatus !== "Custom") {
      pnrData =
        activePNRData &&
        activePNRData[0]?.originalFlightDetails?.map(
          (item: any, index: number) => {
            data = item?.flightDetails.filter(
              (flight: any) => flight.statusCode !== "HK"
            );
            if (data.length) {
              return {
                ...item,
                select: index === 0 ? "Y" : "N",
              };
            }
            return [];
          }
        );
    } else {
      pnrData =
        activePNRData &&
        activePNRData[0]?.rebookOptionalFlightDetails
          ?.map((item: any, index: number) => {
            if (item?.itinerary_status === "modify") {
              data = item?.flightDetails.filter(
                (flight: any) => flight.statusCode !== "HK"
              );
              if (data.length) {
                return {
                  ...item,
                  select: index === 0 ? "Y" : "N",
                };
              }
            }
            return [];
          })
          .filter((item: any) => item !== undefined); // Filter out null values
    }
    pnrData = pnrData?.filter(
      (pnr: any) => pnr !== undefined && pnr.length !== 0
    );
    handleTrip(pnrData);
    setflightDetails(pnrData);
    setFlightTabDetail(pnrData);
    dispatch(setOriginalFlightData(pnrData));
    window.scroll(0, 0);
    // eslint-disable-next-line
  }, []);

  const updatebooknow = (data: any): void => {
    let tempSelectedFlight: any[] = [];

    // To get the active flight tab detail
    var filterFlight: any =
      flightDetails.length !== 1
        ? flightDetails?.filter((item: any) => item?.select === "Y")
        : flightDetails;

    // Adding the required keys in flight data 
    var flightData = JSON.parse(JSON.stringify(data));
    flightData.status = "Schedule Changed";
    flightData.statusCode = "SC";
    flightData.trip = (filterFlight[0] as any)?.trip;

    // var filterFlightDate = getDynamicDate(
    //   dayjs(
    //     SmodifyDates[
    //       filterFlight[0].trip ? Number(filterFlight[0]?.trip) - 1 : 0
    //     ]?.dateData
    //   ).format("MMM DD, YYYY"),
    //   true
    // );

    tempSelectedFlight = selectedFlight;

    if (tempSelectedFlight.length) {
      let indexToRemove =
        tempSelectedFlight.findIndex(
          (flight) =>
            flight.originAirportCode === flightData.originAirportCode &&
            flight.destinationAirportCode === flightData.destinationAirportCode
        );
      if (indexToRemove !== -1) {
        let check = tempSelectedFlight[indexToRemove].id === flightData.id;
        tempSelectedFlight.splice(indexToRemove, 1);
        if (!check) {
          tempSelectedFlight.push(flightData);
        }
      } else {
        tempSelectedFlight.push(flightData);
      }
    } else {
      tempSelectedFlight.push(flightData);
    }

    // selectedFlight?.map((item: any) => {
    // if (
    //   item?.date !== flightData?.date && 
    //   item?.date !== filterFlightDate
    // ) {
    //   tempSelectedFlight.push(item);
    //   console.log(item, "if");
    // } 
    // else if (!flightData?.isActive) {
    //   console.log(item, "else");
    //   tempSelectedFlight.push(flightData);
    // }
    //   return item;
    // });

    // var check = selectedFlight?.some(
    //   (item: any) => item?.date === flightData.date
    // );
    // if (!check) tempSelectedFlight[tempSelectedFlight.length] = flightData;
    // if (selectedFlight.length === 0) tempSelectedFlight[0] = flightData;

    // console.log(tempSelectedFlight, selectedFlight);

    tempSelectedFlight?.forEach((flight: any, index: number) => {
      // Check if the index is within the bounds of SmodifyDates
      if (index >= SmodifyDates.length) {
        return;
      }
      // Set the flight date
      flight.date = getDynamicDate(
        dayjs(SmodifyDates[index].dateData).format("MMM DD, YYYY"),
        true
      );

      // Update viaFlightDetails
      flight?.viaFlightDetails?.forEach((viaFlight: any) => {
        // Determine arrivalDate based on whether it matches departDate
        viaFlight.arrivalDate =
          viaFlight.arrivalDate === viaFlight.departDate
            ? getDynamicDate(dayjs(SmodifyDates[index].dateData).format("MMM DD, YYYY"), true)
            : getDynamicDate(dayjs(SmodifyDates[index].dateData).add(1, "day").format("MMM DD, YYYY"), true);

        // Set departDate
        viaFlight.departDate = getDynamicDate(
          dayjs(SmodifyDates[index].dateData).format("MMM DD, YYYY"),
          true
        );
      });
    });

    setSelectedFlight(tempSelectedFlight);
    SsetSelectedFlights(tempSelectedFlight);
    SremoveSsrPNRData();

    var tempFlightDetails: any = [];
    // var tempPaxInfo:any = [];
    var rebookData = JSON.parse(JSON.stringify(activePNRData));
    tempSelectedFlight?.forEach((flight: any) => {
      rebookData[0]?.rebookOptionalFlightDetails?.forEach(
        (tripData: any, index: number) => {
          if (tripData.trip === flight.trip && tripData.modified !== true) {
            // tripData.date = flight.date;
            tripData.date = getDynamicDate(
              dayjs(SmodifyDates[index].dateData).format("MMM DD, YYYY"),
              true
            );
            tripData.origin = flight.origin;
            tripData.originAirportCode = flight.originAirportCode;
            tripData.destination = flight.destination;
            tripData.destinationAirportCode = flight.destinationAirportCode;
            tripData.stops = flight.stops;
            var stopDetails = [
              {
                airportName: "",
                airportCode: flight.viaPoints,
              },
            ];
            tripData.stopDetails = flight.viaPoints ? stopDetails : "";
            tempFlightDetails = [];
            flight?.viaFlightDetails?.forEach(
              (viaFlight: any, subIndex: number) => {
                tempFlightDetails.push({
                  arrival: viaFlight.arrival,
                  arrivalDate:
                    viaFlight.arrivalDate === viaFlight.departDate
                      ? getDynamicDate(
                        dayjs(SmodifyDates[index].dateData).format(
                          "MMM DD, YYYY"
                        ),
                        true
                      )
                      : getDynamicDate(
                        dayjs(SmodifyDates[index].dateData)
                          .add(1, "day")
                          .format("MMM DD, YYYY"),
                        true
                      ),
                  depart: viaFlight.depart,
                  departDate: getDynamicDate(
                    dayjs(SmodifyDates[index].dateData).format("MMM DD, YYYY"),
                    true
                  ),
                  destination: viaFlight.destination,
                  destinationAirportCode: viaFlight.destinationAirportCode,
                  duration: viaFlight.duration,
                  flightNumber: viaFlight.flightNumber,
                  id: tripData?.flightDetails[subIndex]?.id,
                  nextDayArrival: "",
                  origin: viaFlight.origin,
                  originAirportCode: viaFlight.originAirportCode,
                  paxCount: tripData?.flightDetails[subIndex]?.paxCount,
                  ssrData: viaFlight.ssrData,
                  stops: tripData?.flightDetails[subIndex]?.stops,
                  status: tripData?.flightDetails[subIndex]?.status || "Schedule changed",
                  statusCode: tripData?.flightDetails[subIndex]?.statusCode || "SC",
                });
              }
            );
            tripData.flightDetails = tempFlightDetails;
            tripData.modified = true;

            // Update SSR data
            rebookData[0].paxInfo.forEach((pax: any) => {
              // Update SSR data based on viaFlightDetails count
              const ssrDataCount = flight?.viaFlightDetails.length;
              pax.rebookSsrData.forEach((ssr: any) => {
                if (ssr.trip === flight.trip) {
                  // Add or remove SSR entries to match viaFlightDetails count
                  while (ssr.ssrData.length < ssrDataCount) {
                    ssr.ssrData.push({
                      isSeatChecked: false,
                      isBaggageChecked: false,
                      isMealsChecked: false,
                      seatDetail: {
                        number: "",
                        price: "",
                        type: "",
                        icon: "",
                        selected: false,
                      },
                      baggageDetail: {
                        item: "",
                        price: "",
                        selected: false,
                      },
                      mealsDetail: {
                        item: "",
                        type: "",
                        price: "",
                        selected: false,
                      },
                    });
                  }
                  while (ssr.ssrData.length > ssrDataCount) {
                    ssr.ssrData.pop();
                  }
                }
              });
            });
          }
        }
      );
    });

    SsetSearchFlightPNRData(rebookData);
    setSelectedFlightLength(
      rebookData[0]?.rebookOptionalFlightDetails?.some(
        (flight: any) => flight.flightDetails.length
      )
    );
    changeTrip();
  };

  const handleTrip = (dataId: number) => {
    let newArray: any;
    newArray = flightDetails?.map((itinerary: any, itineraryIndex: number) => {
      return {
        ...itinerary,
        select: itineraryIndex === dataId ? "Y" : "N",
      };
    });
    var selectedOriginalFlight = newArray?.filter((item: any) => {
      return item.select === "Y";
    });
    setFlightTabDetail(selectedOriginalFlight);
    setflightDetails(newArray);
  };

  // const disabledDate = (current: Dayjs, enabledDate: any) => {
  //   return !current.isSame(dayjs(enabledDate), "day");
  // };

  // type RangePickerProps = GetProps<typeof DatePicker.RangePicker>;

  // const disabledDate: RangePickerProps["disabledDate"] = (current) => {
  //   // Can not select days before today and today
  //   return current && current < dayjs().endOf("day");
  // };

  const changeTrip = () => {
    var tripElements = document.querySelectorAll(".cls-other-trips");
    var tripNumber =
      Number(document.querySelector(".cls-active .hide")?.innerHTML) + 1;
    if (tripNumber !== tripElements.length) {
      (document.getElementById("app") as any).scrollIntoView({
        behavior: "smooth",
      });
      setTimeout(() => {
        tripElements.forEach((item, index) => {
          if (
            item.classList.contains("cls-active") &&
            index + 1 !== tripElements.length
          ) {
            handleTrip(Number(item.querySelector(".hide")?.innerHTML) + 1);
          }
        });
      }, 500);
    }
  };

  const [flightConnectionType, setFlightConnectionType] = useState<string[]>([]);

  const handleFlightConnectionTypeChange = (value: string[]) => {
    setFlightConnectionType(value);
  };

  return (
    <>
      {(searchFlightDataStatus.data as any)?.response?.data?.length ? (
        <>
          <div className="cls-searchFlightMain" data-testid="searchFlight">
            <div className={`cls-head-bg fade-card ${modifyopen ? "fade" : ""}`}>
              <div className="fade-card-inner">
                {flightDetails?.length && flightDetails?.length !== 1 || isSmallScreen ? (
                  <>
                    <Row className="cls-head-content fade-card-front">
                      <Col xl={21} className="d-flex cls-searchFlightHeader">
                        {flightDetails?.map(
                          (itinerary: any, itineraryIndex: number) => {
                            const formattedDate = dayjs(
                              SmodifyDates[itineraryIndex]?.dateData
                            ).format("MMM DD, YYYY");
                            const dynamicDate = getDynamicDate(
                              formattedDate,
                              true
                            );
                            // Check if dynamicDate is defined before calling getDynamicDate again
                            const finalDate = dynamicDate
                              ? getDynamicDate(dynamicDate)
                              : undefined;
                            return (
                              <React.Fragment
                                key={"searchFlightHead" + itineraryIndex}
                              >
                                <Col
                                  xl={3}
                                  style={{ cursor: "pointer" }}
                                  className={`cls-other-trips ${flightDetails?.length !== itineraryIndex + 1 ? "cls-border-right" : ""} ${itinerary?.select !== "N" ? "cls-active" : "cls-inactive"}`}
                                  onClick={() => handleTrip(itineraryIndex)}
                                >
                                  <Text className="hide">
                                    {" "}
                                    {itineraryIndex}{" "}
                                  </Text>
                                  <Text className="fs-11">
                                    Trip {itineraryIndex + 1}
                                  </Text>
                                  <Text className={`${isSmallScreen ? "fs-13" : "fs-15"} f-bold`}>
                                    {itinerary?.originAirportCode} -
                                    {itinerary?.destinationAirportCode}
                                  </Text>
                                  <Text className="fs-12 f-med">
                                    {finalDate as string}
                                    {/* {getDynamicDate(itinerary?.date) as string} */}
                                  </Text>
                                </Col>
                              </React.Fragment>
                            );
                          }
                        )}
                      </Col>
                      <Col xl={3} className="cls-btn-col">
                        <Button
                          type="primary"
                          icon={<EditOutlined />}
                          onClick={() => {
                            setmodfiyOpen(!modifyopen);
                          }}
                        >
                          {isSmallScreen ? "" : t("modify_search")}
                        </Button>
                      </Col>
                    </Row>
                    <Row
                      className="cls-head-content fade-card-back"
                      justify="start"
                    >
                      {isSmallScreen ? (
                        <Col
                          className="cls-modify-title"
                          onClick={() => { setmodfiyOpen(!modifyopen) }}
                        >
                          <Text className="cls-icon Infi-Fd_06_DownArrow" />
                          <Text className="cls-modify-text fs-14 f-med">
                            {t("modify_search")}
                          </Text>
                        </Col>
                      ) :
                        <></>
                      }
                      <Col>
                        <Row>
                          {flightDetails?.map(
                            (itinerary: any, itineraryIndex: number) =>
                              itinerary?.flightDetails?.map(
                                (item: any, index: number) => (
                                  <Col
                                    xs={12}
                                    sm={12}
                                    md={8}
                                    key={"searchFlightHeadMulti" + itineraryIndex}
                                  >
                                    <Col xl={24} className="mt-1">
                                      <Text className={`fs-13 f-med ${isSmallScreen ? "p-clr" : ""}`}>
                                        Trip &nbsp;
                                        {itinerary?.flightDetails?.length === 1
                                          ? itineraryIndex + 1
                                          : index + 1}
                                      </Text>
                                    </Col>
                                    <Col className="text-left mb-2 " xl={21}>
                                      <Text className={`${isSmallScreen ? "fs-13 f-med" : "fs-18 f-bold"} cls-single-trip`}>
                                        {item?.origin} ({item.originAirportCode})
                                        <Text className={`${isSmallScreen ? "fs-13 f-med" : "fs-16 f-bold"} px-4 `}>
                                          {" "}
                                          To{" "}
                                        </Text>
                                        {item?.destination} (
                                        {item.destinationAirportCode})
                                      </Text>
                                      <DatePicker
                                        size="middle"
                                        inputReadOnly={true}
                                        showToday={false}
                                        format="MMM DD, YYYY"
                                        className="cls-modify-calender"
                                        allowClear={false}
                                        // disabledDate={date => disabledDate(date, itinerary?.date)}
                                        // disabledDate={disabledDate}
                                        // value={dayjs(
                                        //   getDynamicDate(itinerary.date)
                                        // )}
                                        disabledDate={(date) => {
                                          // Ensure that only the selected date is enabled
                                          return !date.isSame(
                                            dayjs(
                                              SmodifyDates[itineraryIndex].dateData
                                            )
                                            , 'day'
                                          );
                                        }}
                                        value={dayjs(
                                          SmodifyDates[itineraryIndex].dateData
                                        )}
                                        // value={dayjs(itinerary.date, "MMM DD, YYYY")}
                                        // onChange={(date) => handleDateChange(date, mainIndex)}
                                        suffixIcon={
                                          <Text className="Infi-Fd_52_Calender"></Text>
                                        }
                                      />
                                    </Col>
                                    {itineraryIndex === 0 && index === 0 && !isSmallScreen ? (
                                      <Col xl={3} className="cls-btn-col mb-2">
                                        <Button
                                          type="primary"
                                          icon={<EditOutlined />}
                                          onClick={() => {
                                            setmodfiyOpen(!modifyopen);
                                          }}
                                        >
                                          {t("modify_search")}
                                        </Button>
                                      </Col>
                                    ) : (
                                      <></>
                                    )}
                                  </Col>
                                )
                              )
                          )}
                        </Row>
                      </Col>
                      {isSmallScreen && modifyopen ? (
                        <Col className="cls-modify-btn">
                          <Button
                            className="cls-primary-btn w-100 h-38"
                            onClick={() => setmodfiyOpen(!modifyopen)}
                          >
                            Apply
                          </Button>
                        </Col>
                      ) :
                        <></>
                      }
                    </Row>
                  </>
                ) : (
                  <Row className="cls-head-content cls-one-trip">
                    {flightDetails?.map((itinerary: any, index: any) =>
                      SreviewStatus !== "Custom" ? (
                        <Col key={"modifyFlightData" + index}>
                          <Text className="fs-18 f-bold cls-single-trip">
                            {itinerary?.origin} ({itinerary?.originAirportCode})
                            <Text className="px-4 fs-16 f-bold"> To </Text>
                            {itinerary?.destination} (
                            {itinerary?.destinationAirportCode})
                          </Text>
                          <DatePicker
                            size="middle"
                            inputReadOnly={true}
                            showToday={false}
                            allowClear={false}
                            format="MMM DD, YYYY"
                            className="cls-modify-calender"
                            // disabledDate={disabledDate}
                            // disabledDate={date => disabledDate(date, itinerary?.date)}
                            disabledDate={(date) => {
                              // Ensure that only the selected date is enabled
                              return !date.isSame(
                                dayjs(
                                  SmodifyDates[index].dateData
                                )
                                , 'day'
                              );
                            }}
                            value={dayjs(
                              SmodifyDates[index].dateData
                            )}
                            // onChange={(date) => handleDateChange(date, mainIndex)}
                            suffixIcon={
                              <Text className="Infi-Fd_52_Calender"></Text>
                            }
                          />
                        </Col>
                      ) : (
                        <Col key={"modifyFlight" + index}>
                          <Text className="fs-18 f-bold cls-single-trip">
                            {itinerary?.origin} ({itinerary?.originAirportCode})
                            <Text className="px-4 fs-16 f-bold">
                              {" "}
                              {t("to")}{" "}
                            </Text>
                            {itinerary?.destination} (
                            {itinerary?.destinationAirportCode})
                          </Text>
                          <DatePicker
                            size="middle"
                            inputReadOnly={true}
                            allowClear={false}
                            showToday={false}
                            format="MMM DD, YYYY"
                            className="cls-modify-calender"
                            // disabledDate={disabledDate}
                            disabledDate={(date) => {
                              // Ensure that only the selected date is enabled
                              return !date.isSame(
                                dayjs(
                                  SmodifyDates[index].dateData
                                )
                                , 'day'
                              );
                            }}
                            value={dayjs(
                              SmodifyDates[index].dateData
                            )}
                            // disabledDate={date => disabledDate(date, itinerary?.date)}
                            // value={dayjs(getDynamicDate(itinerary.date))}
                            // onChange={(date) => handleDateChange(date, mainIndex)}
                            suffixIcon={
                              <Text className="Infi-Fd_52_Calender"></Text>
                            }
                          />
                        </Col>
                      )
                    )}
                  </Row>
                )}
              </div>
            </div>
            <Row className="cls-modify-fl">
              <Col xs={24} lg={16} xl={17}>
                <Row justify="space-between" align="middle">
                  {isSmallScreen
                    ? (
                      <>
                        <Button
                          className={`Infi-Fd_05_Filter cls-filterOpenIcon`}
                          onClick={() => toggleOpen()}
                        ></Button>
                        <Drawer
                          onClose={() => toggleOpen()}
                          open={open}
                          styles={{ header: { display: "none" } }}
                          closable={true}
                          width={280}
                        >
                          <Row className="cls-filter-component">
                            <Col className={`cls-filterCloseIcon`} onClick={() => toggleOpen()}>
                              <Text className="Infi-Fd_82_CloseMark"></Text>
                            </Col>
                            <Col className="cls-filter-header h-56">
                              <Row>
                                <Col>
                                  <Text
                                    className={`Infi-Fd_05_Filter cls-filter-icon`}
                                  ></Text>
                                  <Text className="cls-filter-title">
                                    {t("filters")}
                                  </Text>
                                </Col>
                                <Col>
                                  <Button
                                    htmlType="button"
                                    className="cls-reset-button"
                                    type="link"
                                    onClick={() => setFlightConnectionType([])}
                                  >
                                    {t("reset_all")}
                                  </Button>
                                </Col>
                              </Row>
                            </Col>
                            <Col span={24} className="cls-filter-body px-3 pt-2">
                              <Flex gap={10} align='center' justify='start' wrap>
                                <Text type='secondary'>Filter by</Text>
                                <Select
                                  mode="multiple"
                                  allowClear
                                  value={flightConnectionType}
                                  style={{ width: 250 }}
                                  placeholder="Flight connection type"
                                  onChange={handleFlightConnectionTypeChange}
                                  options={[
                                    {
                                      label: "Direct",
                                      value: "direct",
                                    },
                                    {
                                      label: "Connecting",
                                      value: "connecting",
                                    },
                                  ]}
                                />
                              </Flex>
                            </Col>
                            <Col span={24} className="px-3 py-3 cls-filter-btm">
                              <Button
                                className="cls-primary-btn w-100 h-38"
                                onClick={toggleOpen}
                              >
                                Apply
                              </Button>
                            </Col>
                          </Row>
                        </Drawer>
                      </>
                    )
                    : (
                      <>
                        <Col xl={8} className="mb-2">
                          <Text
                            className="fs-13 f-reg"
                            style={{
                              margin: "0px",
                              fontStyle: "italic",
                              color: "var(--t-descriptionHeader-description)",
                            }}
                          >
                            {t("modify_search_subtitle")}
                          </Text>
                        </Col>
                        <Col xl={9}>
                          <Flex gap={10} align='center' justify='end'>
                            <Text type='secondary'>Filter by</Text>
                            <Select
                              mode="multiple"
                              allowClear
                              style={{ width: isSmallScreen ? 230 : 250 }}
                              placeholder="Flight connection type"
                              onChange={handleFlightConnectionTypeChange}
                              options={[
                                {
                                  label: "Direct",
                                  value: "direct",
                                },
                                {
                                  label: "Connecting",
                                  value: "connecting",
                                },
                              ]}
                            />
                          </Flex>
                        </Col>
                      </>
                    )
                  }
                </Row>
              </Col>
              <Col xs={24} lg={8} xl={7} className="text-right mb-2 cls-back-btn">
                <Button
                  className="fs-13 cls-back"
                  type="link"
                  onClick={() => redirect("viewPnrInfo")}
                >
                  <LeftOutlined />
                  {t("back_to_itinerary_details")}
                </Button>
              </Col>
            </Row>
            <Row className="cls-searchFlight mx-6" style={{ marginBottom: "90px" }}>
              <Col xs={24} lg={16} xl={17} className="cls-book-flight">
                <BookTicket
                  updatebooknow={updatebooknow}
                  selectTabFlightData={flightTabDetail}
                  connectionTypeFilter={flightConnectionType}
                />
              </Col>
              <Col xs={24} lg={8} xl={7} className="cls-selected-flight pl-4">
                <Card className="cls-flightlist-card" bordered={!isSmallScreen}>
                  <Row>
                    <Col className="fs-13 f-med">{t("original_flights")}</Col>
                  </Row>
                  {activePNRData?.[0]?.originalFlightDetails?.length > 0 &&
                    activePNRData?.[0]?.originalFlightDetails?.map(
                      (itinerary: any) =>
                        itinerary?.flightDetails?.map(
                          (item: any, index: number) => (
                            <Collapse
                              className="cls-collapse"
                              key={"colModifyFlight" + index}
                            >
                              <Collapse.Panel
                                key="CollapseFlight"
                                header={
                                  <Row
                                    className="cls-destination-origin"
                                    justify={"space-between"}
                                  >
                                    <Col xs={14} lg={11} xl={11} className="fs-14 f-med">
                                      <Text className={`fs-14 f-med d-block ${isSmallScreen ? "" : "w-100"}`}>
                                        {item?.originAirportCode}
                                        <Text className="fs-16 Infi-Fd_41_OnwardTo px-1"></Text>
                                        {item?.destinationAirportCode}
                                      </Text>
                                      <Text className="fs-12 f-reg cls-date cls-grey">
                                        {
                                          getDynamicDate(
                                            item.departDate
                                          ) as string
                                        }
                                      </Text>
                                    </Col>
                                    <Col
                                      xs={10} lg={13} xl={13}
                                      className="fs-13 f-reg my-2 text-right cls-status"
                                      style={{
                                        color:
                                          item?.statusCode === "HK"
                                            ? "var(--t-viewPnr-accept-color)"
                                            : item.statusCode === "SC"
                                              ? "var(--t-common-primary)"
                                              : item.statusCode === "WK"
                                                ? "var(--t-form-input-error)"
                                                : "var(--t-viewPnr-time-change-bg)",
                                      }}
                                    >
                                      {item.status} ({item.statusCode})
                                    </Col>
                                  </Row>
                                }
                                showArrow={false}
                              >
                                <Row
                                  className="cls-flight-details"
                                  justify="space-between"
                                  align="middle"
                                >
                                  <Col className="f-sbold fs-11 cls-flight-no text-center">
                                    {[...Array(item.stops)].map(
                                      (_, logoIndex) => (
                                        <FlightLogoIcon
                                          key={"flight" + logoIndex}
                                        />
                                      )
                                    )}
                                    <FlightLogoIcon />
                                    <Text className="fs-11 f-med d-block">
                                      {item.flightNumber}
                                    </Text>
                                  </Col>
                                  <Col className="f-sbold fs-13 cls-hours">
                                    {item.depart} - {item.arrival}
                                  </Col>
                                  <Col className="f-reg fs-12 cls-duration cls-grey">
                                    {item.duration}
                                    <Divider
                                      dashed
                                      type="vertical"
                                      style={{
                                        margin: "5px 5px 5px 7px",
                                        borderColor:
                                          "var(--t-common-grey-color-md)",
                                      }}
                                    />
                                    <Text className="f-reg fs-12 cls-stops">
                                      {item.stops} {t("stops")}
                                    </Text>
                                  </Col>
                                </Row>
                              </Collapse.Panel>
                            </Collapse>
                          )
                        )
                    )}
                  <Text className="cls-flight-row">
                    <Divider
                      dashed
                      style={{
                        margin: "15px 0px 10px",
                        borderColor: "var(--t-common-grey-color-md)",
                      }}
                    />
                    <Row>
                      <Col className="fs-13 f-med">{t("flights_selected")}</Col>
                    </Row>
                    {activePNRData?.[0]?.originalFlightDetails?.length > 0 &&
                      activePNRData?.[0]?.originalFlightDetails?.map(
                        (itinerary: any) =>
                          itinerary?.flightDetails?.map(
                            (item: any, index: number) =>
                              itinerary?.flightDetails?.every((item: any) => item?.statusCode === "HK") && item?.statusCode === "HK" ? (
                                <Collapse
                                  className="cls-collapse cls-confirmed-flight"
                                  key={"confirmedFlight" + index}
                                >
                                  <Collapse.Panel
                                    key="CollapseConfirmedFlight"
                                    header={
                                      <Row
                                        className="cls-destination-origin"
                                        justify={"space-between"}
                                      >
                                        <Col xs={14} lg={11} xl={11} className="fs-14 f-med">
                                          <Text className={`fs-14 f-med d-block ${isSmallScreen ? "" : "w-100"}`}>
                                            {item?.originAirportCode}
                                            <Text className="fs-16 Infi-Fd_41_OnwardTo px-1"></Text>
                                            {item?.destinationAirportCode}
                                          </Text>
                                          <Text className="fs-12 f-reg cls-date cls-grey">
                                            {
                                              getDynamicDate(
                                                item.departDate
                                              ) as string
                                            }
                                          </Text>
                                        </Col>
                                        <Col
                                          xs={10} lg={13} xl={13}
                                          className="fs-13 f-reg my-2 cls-status text-right"
                                          style={{
                                            color:
                                              item?.statusCode === "HK"
                                                ? "var(--t-viewPnr-accept-color)"
                                                : item.statusCode === "SC"
                                                  ? "var(--t-common-primary)"
                                                  : item.statusCode === "WK"
                                                    ? "var(--t-form-input-error)"
                                                    : "var(--t-viewPnr-time-change-bg)",
                                          }}
                                        >
                                          {item.status} ({item.statusCode})
                                        </Col>
                                      </Row>
                                    }
                                    showArrow={false}
                                  >
                                    <Row
                                      className="cls-flight-details"
                                      justify="space-between"
                                      align="middle"
                                    >
                                      <Col className="f-sbold fs-11 cls-flight-no text-center">
                                        {[...Array(item.stops)].map(
                                          (_, logoIndex) => (
                                            <FlightLogoIcon
                                              key={"confirmed" + logoIndex}
                                            />
                                          )
                                        )}
                                        <FlightLogoIcon />
                                        <Text className="fs-11 f-med d-block">
                                          {item.flightNumber}
                                        </Text>
                                      </Col>
                                      <Col className="f-sbold fs-13 cls-hours">
                                        {item.depart} - {item.arrival}
                                      </Col>
                                      <Col className="f-reg fs-12 cls-duration cls-grey">
                                        {item.duration}
                                        <Divider
                                          dashed
                                          type="vertical"
                                          style={{
                                            margin: "5px 5px 5px 7px",
                                            borderColor:
                                              "var(--t-common-grey-color-md)",
                                          }}
                                        />
                                        <Text className="f-reg fs-12 cls-stops">
                                          {item.stops} {t("stops")}
                                        </Text>
                                      </Col>
                                    </Row>
                                  </Collapse.Panel>
                                </Collapse>
                              ) : (
                                <></>
                              )
                          )
                      )}
                    {SreviewStatus === "Custom" ? (
                      activePNRData[0]?.rebookOptionalFlightDetails?.map(
                        (itinerary: any, index: number) =>
                          itinerary?.itinerary_status &&
                            itinerary?.itinerary_status !== "modify" ? (
                            <Collapse
                              className="cls-collapse cls-confirmed-flight"
                              key={"pnrcustom" + index}
                            >
                              <Collapse.Panel
                                key="CollapseCustomConfirm"
                                header={
                                  <Row
                                    className="cls-destination-origin"
                                    justify={"space-between"}
                                  >
                                    <Col xs={14} lg={11} xl={11} className="fs-14 f-med">
                                      <Text className={`fs-14 f-med d-block ${isSmallScreen ? "" : "w-100"}`}>
                                        {itinerary?.originAirportCode}
                                        <Text className="fs-16 Infi-Fd_41_OnwardTo px-1"></Text>
                                        {itinerary?.destinationAirportCode}
                                      </Text>
                                      <Text className="fs-12 f-reg cls-date cls-grey">
                                        {itinerary.date}
                                      </Text>
                                    </Col>
                                    <Col
                                      xs={10} lg={13} xl={13}
                                      className="fs-13 f-reg my-2 cls-status"
                                      style={{
                                        color:
                                          itinerary?.itinerary_status ===
                                            "accept"
                                            ? "var(--t-viewPnr-accept-color)"
                                            : itinerary?.itinerary_status ===
                                              "decline"
                                              ? "var(--t-form-input-error)"
                                              : "var(--t-viewPnr-time-change-bg)",
                                      }}
                                    >
                                      {itinerary?.itinerary_status}{" "}
                                      {itinerary?.itinerary_status ===
                                        "Decline"}
                                    </Col>
                                  </Row>
                                }
                                showArrow={false}
                              >
                                {itinerary?.flightDetails?.map(
                                  (item: any, itemIndex: number) =>
                                    item && (
                                      <Row
                                        className="cls-flight-details"
                                        justify="space-between"
                                        align="middle"
                                        key={"optionalFlight" + itemIndex}
                                      >
                                        <Col className="f-sbold fs-11 cls-flight-no text-center">
                                          {[...Array(item.stops)].map(
                                            (_, index) => (
                                              <FlightLogoIcon
                                                key={"optional" + index}
                                              />
                                            )
                                          )}
                                          <FlightLogoIcon />
                                          <Text className="fs-11 f-med d-block">
                                            {item.flightNumber}
                                          </Text>
                                        </Col>
                                        <Col className="f-sbold fs-13 cls-hours">
                                          {item.depart} - {item.arrival}
                                        </Col>
                                        <Col className="f-reg fs-12 cls-duration cls-grey">
                                          {item.duration}
                                          <Divider
                                            dashed
                                            type="vertical"
                                            style={{
                                              margin: "5px 5px 5px 7px",
                                              borderColor:
                                                "var(--t-common-grey-color-md)",
                                            }}
                                          />
                                          <Text className="f-reg fs-12 cls-stops">
                                            {item.stops} {t("stops")}
                                          </Text>
                                        </Col>
                                      </Row>
                                    )
                                )}
                              </Collapse.Panel>
                            </Collapse>
                          ) : (
                            <></>
                          )
                      )
                    ) : (
                      <></>
                    )}
                    {SselectedFlights &&
                      SselectedFlights?.map((ele: any, eleIndex: number) => (
                        <>
                          <Collapse
                            className={`cls-collapse ${ele?.statusCode !== "HK" ? "cls-collapse-bdr" : ""} cls-selected-row`}
                            key={"selectedCustom" + eleIndex}
                          >
                            <Collapse.Panel
                              key="flightCollapse"
                              header={
                                <Row
                                  className="cls-destination-origin"
                                  justify={"space-between"}
                                >
                                  <Col xs={14} lg={11} xl={11} className="fs-14 f-med">
                                    <Text className={`fs-14 f-med d-block ${isSmallScreen ? "" : "w-100"}`}>
                                      {ele?.originAirportCode}
                                      <Text className="Infi-Fd_41_OnwardTo px-1"></Text>
                                      {ele?.destinationAirportCode}
                                    </Text>
                                    <Text className="fs-12 f-reg cls-date cls-grey">
                                      {getDynamicDate(ele.date) as string}
                                    </Text>
                                  </Col>
                                  <Col
                                    xs={10} lg={13} xl={13}
                                    className="fs-13 f-reg my-2 cls-status"
                                    style={{
                                      color:
                                        ele?.statusCode === "HK"
                                          ? "var(--t-viewPnr-accept-color)"
                                          : ele?.statusCode === "SC"
                                            ? "var(--t-common-primary)"
                                            : ele?.statusCode === "WK"
                                              ? "var(--t-form-input-error)"
                                              : "var(--t-viewPnr-time-change-bg)",
                                    }}
                                  >
                                    {ele?.status} ({ele?.statusCode})
                                  </Col>
                                </Row>
                              }
                              showArrow={false}
                            >
                              <Row
                                className="cls-flight-details"
                                justify="space-between"
                                align="middle"
                              >
                                <Col className="f-sbold fs-11 cls-flight-no text-center">
                                  {[...Array(ele.stops + 1)].map(
                                    (_, logoIndex) => (
                                      <FlightLogoIcon
                                        key={"custom" + logoIndex}
                                      />
                                    )
                                  )}
                                  <Text className="fs-11 f-med d-block">
                                    {ele.flightNumber}
                                  </Text>
                                </Col>
                                <Col className="f-sbold fs-13 cls-hours">
                                  {ele.overAllDepartureTime} -
                                  {ele.overAllArrivalTime}
                                </Col>
                                <Col className="f-reg fs-12 cls-duration cls-grey">
                                  {ele.overAllDuration}
                                  <Divider
                                    dashed
                                    type="vertical"
                                    style={{
                                      margin: "5px 5px 5px 7px",
                                      borderColor:
                                        "var(--t-common-grey-color-md)",
                                    }}
                                  />
                                  <Text className="f-reg fs-12 cls-stops">
                                    {ele?.stops === 0 ? "No" : ele?.stops}{" "}
                                    {t("stops")}
                                  </Text>
                                </Col>
                              </Row>
                            </Collapse.Panel>
                          </Collapse>
                        </>
                      ))}
                  </Text>
                </Card>
              </Col>
            </Row>
          </div>
          <TweenOne
            animation={{
              maxHeight: selectedFlight.length > 0 ? "auto" : 0,
              opacity: selectedFlight.length > 0 ? 1 : 0,
              duration: 350,
            }}
          >
            <AddOnPopup {...addOnProps} />
          </TweenOne>
        </>
      ) : (
        <SearchFlightSkeleton />
      )}
    </>
  );
};

export default SearchFlight;
