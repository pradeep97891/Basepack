import "./BookTicket.scss";
import {
  Col,
  Row,
  Card,
  Button,
  Typography,
  Collapse,
  notification,
} from "antd";
import { FlightLogoIcon, FdOriginDestination, FdGFFlightLogoIcon } from "@/components/Icons/Icons";
import flight_gray from "../../../assets/images/Common/flight_gray.png";
import { useGetFlightSearchResponseMutation } from "@/services/reschedule/Reschedule";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/App.hook";
import { useDispatch } from "react-redux";
import { setTotalFlightData } from "@/stores/ReviewFlight.store";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import BookTicketSkeleton from "./BookTicket.skeleton";
import { useTranslation } from "react-i18next";
import { getDynamicDate } from "@/Utils/general";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

interface IfirstChildProps {
  updatebooknow: any;
  selectTabFlightData: any;
  connectionTypeFilter: string[];
}

const BookTicket: React.FC<IfirstChildProps> = ({
  updatebooknow,
  selectTabFlightData,
  connectionTypeFilter,
}) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResize(991);
  const [searchFlightData, searchFlightDataStatus] =
    useGetFlightSearchResponseMutation();
  const [flightData, setFlightdata] = useState([]);
  const [selectedFlightList, setSelectedFlightList] = useState([]);
  const { totalFlightData } = useAppSelector(
    (state) => state.ReviewFlightReducer
  );
  const [, , SremoveSsrPrice] = useSessionStorage<any>("ssrPrice");
  const [SselectedFlights] = useSessionStorage<any>("selectedFlights");
  const { activePNR } = useAppSelector((state: any) => state.PNRReducer);
  const [SfinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  var activePNRData = activePNR.length ? activePNR : SfinalViewPnrData;
  const [SairlineCode] = useSessionStorage("airlineCode");

  useEffect(() => {
    searchFlightData({});
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      searchFlightDataStatus.isSuccess &&
      (searchFlightDataStatus?.data as any)?.responseCode === 0
    ) {
      window.scroll(0, 0);

      let temp = (searchFlightDataStatus.data as any).response.data;
      let newData = temp?.map((item: any, index: number) => {
        if (SselectedFlights) {
          var check = SselectedFlights?.find(
            (flight: any) => flight?.id === item?.id
          );
          return {
            ...item,
            isActive: check ? true : false,
          };
        } else {
          return { ...item, isActive: false };
        }
      });

      /* Flight filtering based on flight connection type. Currently 'direct' & 'connecting' are only implemented. */
      if (connectionTypeFilter.length) {
        newData = newData.filter((flight: any) => {
          if (
            connectionTypeFilter.includes("direct") &&
            connectionTypeFilter.includes("connecting")
          )
            return true;

          if (connectionTypeFilter.includes("direct") && flight.stops === 0)
            return true;

          if (connectionTypeFilter.includes("connecting") && flight.stops > 0)
            return true;

          return false;
        });
      }

      dispatch(setTotalFlightData(newData));
      setFlightdata(newData);
    } // eslint-disable-next-line
  }, [searchFlightDataStatus, connectionTypeFilter]);

  useEffect(() => {
    if (selectTabFlightData?.length && flightData?.length) {
      const filteredFlight = selectTabFlightData?.filter((flight:any) => flight?.select === "Y");
      const data = flightData?.filter((item: any) => (item.date === filteredFlight[0]?.date && 
                                                      item?.destinationAirportCode === filteredFlight[0]?.destinationAirportCode && 
                                                      item?.originAirportCode === filteredFlight[0]?.originAirportCode));
      setSelectedFlightList(data);
    }
  }, [selectTabFlightData, flightData]);

  const handleBooknow = (data: any) => (e: React.MouseEvent<HTMLButtonElement>) => {
      if (data?.seatsLeft < activePNRData[0]?.totalPaxCount) {
        notification.warning({
          key: 1,
          message: t("flight_select_msg"),
          duration: 5,
        });
        return;
      }
      SremoveSsrPrice();
      updatebooknow(data);
      if (totalFlightData) {
        var array = JSON.parse(JSON.stringify(totalFlightData));
        array?.forEach((item: any) => {
          if (item.date === data.date) {
            if (item.id === data.id) {
              item.isActive ? (item.isActive = false) : (item.isActive = true);
            } else {
              item.isActive = false;
            }
          }
        });
        setFlightdata(array);
        dispatch(setTotalFlightData(array));
      }
    };

  const toggleDetails = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLElement;
    const container = target.closest(".cls-more-detail") as HTMLElement;
    container.classList.toggle("open");
    container
      .closest(".cls-flight-card")
      ?.querySelector(".cls-more-detail-div")
      ?.classList.toggle("open");
  };

  return (
    <>
      {selectedFlightList.length ? (
        <Row className="cls-flightlist" data-testid="bookTicket">
          {selectedFlightList?.map((item: any, index: number) => (
            <Col
              xs={24}
              xl={24}
              className="cls-flight-card mb-3"
              key={"flightList" + index}
            >
              <Card>
                <Row>
                  <Col
                    xs={5}
                    sm={7}
                    lg={4}
                    xl={4}
                    className="cls-flight-col Infi-Fd_72_DealStrip cls-border"
                  >
                    <Text className={`cls-deal-strip f-reg ${isSmallScreen ? "fs-11" : "fs-13"}`}>
                      {/* {t("deal")} */}
                      {
                        item.stops === 0 
                          ? t("direct") 
                          : item.stops === 1 
                            ? t("connecting")
                            : t("via")
                      }
                    </Text>
                    <Col className="mt-2">
                      {[...Array(item.stops + 1)].map((_, logoIndex) => (
                       SairlineCode === "GF" ? <FdGFFlightLogoIcon key={logoIndex} /> : <FlightLogoIcon key={logoIndex} />
                      ))}
                    </Col>
                    <Text
                      className="f-med fs-13 d-block w-100 text-ellipsis"
                      title={item?.flightNumber}
                    >
                      {item?.flightNumber}
                    </Text>
                  </Col>
                  <Col xs={4} sm={3} lg={4} xl={4} className="cls-time-date cls-depart">
                    <div className={`${isSmallScreen ? "fs-14" : "fs-18"} f-bold`}>
                      {item.overAllDepartureTime}
                    </div>
                    <Text className={`${isSmallScreen ? "fs-12 f-med" : "fs-16"} pr-1 cls-grey d-block`}>
                      {item.originAirportCode}
                    </Text>
                  </Col>
                  <Col xs={6} lg={5} xl={5} className="cls-stop-col text-center">
                    <Text className={`${isSmallScreen ? "fs-11" : "fs-12"} f-reg cls-grey w-100`}>
                      {item.stops} {t("stops")}
                    </Text>
                    {/* <Text className="fs-12 f-reg cls-border-left cls-grey cls-stop-time">
                      {item.overAllDuration}
                    </Text> */}
                    <Text className={`mt-1 ${isSmallScreen ? "" : "w-100"} cls-origindesti d-block`}>
                      <Text className="cls-flight-icon d-flex align-center">
                        <img src={flight_gray} alt="flight" />
                      </Text>
                      <Text className="f-reg fs-13 cls-stop">
                        {item.viaPoints}
                      </Text>
                    </Text>
                    <Text className={`${isSmallScreen ? "fs-11" : "fs-12"} f-reg w-100 mt-1 cls-border-left cls-grey cls-stop-time`}>
                      {item.overAllDuration}
                    </Text>
                    {/* <Text className="mt-1 cls-weekdays f-med fs-13 d-flex">
                      {item.daysOfOperation.map((week: any, weekIndex: number) => (
                        <Text
                          key={"daysmap"+weekIndex}
                          className={`${week.available === false ? "cls-grey" : ""} ${item.dayCode === week.dayCode ? "cls-circle-dot" : ""} ${item.dayCode === week.dayCode && week.dayCode === "W" ? "wed" : ""}`}
                        >
                          {week.day}
                        </Text>
                      ))}
                    </Text> */}
                  </Col>
                  <Col xs={4} sm={3} lg={3} xl={3} className="cls-time-date text-right">
                    <div className={`${isSmallScreen ? "fs-14" : "fs-18"} f-bold`}>
                      {item.overAllArrivalTime}
                      <Text className="cls-arrival-day">
                        {item.nextDayArrival}
                      </Text>
                    </div>
                    <div>
                      <Text className={`${isSmallScreen ? "fs-12 f-med" : "fs-16"} cls-grey`}>
                        {item.destinationAirportCode}
                      </Text>
                    </div>
                  </Col>
                  {
                    isSmallScreen
                      ? <></>
                      : (
                        <Col lg={5} xl={5} className="cls-seat text-right">
                        {/* <Text className="fs-11 f-reg" style={{ marginTop: "1px" }}>
                        {CFG.currency}
                      </Text>
                      &nbsp;
                      <Text className="fs-20 f-bold">
                        {item.price?.toFixed(2)}{" "}
                      </Text> */}
                        <Text className="fs-14 f-med pt-1 cls-dark-grey">
                          <Text className="fs-14 f-med cls-text-red">
                            {item.seatsLeft}{" "}
                          </Text>
                          {t("seats_left")}
                        </Text>
                        </Col>
                      )
                  }
                  <Col xs={5} lg={3} xl={3} className="d-flex cls-btn-col text-center">
                    <Button
                      type="default"
                      style={{ borderRadius: "3px", height: isSmallScreen ? 30 : 38, fontSize: isSmallScreen ? 12 : 14}}
                      className={`cls-secondary-btn ${item.isActive === true ? "active" : ""}`}
                      onClick={handleBooknow(item)}
                    >
                      {t(isSmallScreen ? "select" : "book_now")}
                    </Button>
                    { isSmallScreen 
                      ? (
                        <Text className="fs-12 pt-1 cls-seatLeft">
                          <Text className="fs-12 f-reg cls-text-red">
                            {item.seatsLeft} &nbsp;
                          </Text>
                          {t("seats_left")}
                        </Text>
                      )
                      : <></>
                    }
                  </Col>
                </Row>
                <Collapse className="cls-flight-collapse">
                  <Collapse.Panel
                    key="flightDetails"
                    header={
                      <Text className="cls-more-detail">
                        <Button type="link" onClick={toggleDetails}>
                          {t("flight_details")}
                          <Text className=" cls-arrow Infi-Fd_06_DownArrow"></Text>
                        </Button>
                      </Text>
                    }
                    showArrow={false}
                  >
                    {item?.viaFlightDetails?.map(
                      (flightData: any, fligthIndex: number) => (
                        <Row
                          align="middle"
                          className="cls-more-detail-div"
                          key={"flightListDetail" + fligthIndex}
                        >
                          <Col xs={4} xl={4}>
                          {SairlineCode === "GF" ? <FdGFFlightLogoIcon key={fligthIndex} /> : <FlightLogoIcon key={fligthIndex} />}
                            <Text className={`cls-flight-number d-block text-ellipsis f-med ${isSmallScreen ? "fs-12" : ""}`}>
                              {flightData.flightNumber}
                            </Text>
                          </Col>
                          <Col xs={3} xl={4} className={`${isSmallScreen ? "fs-13" : "fs-16"} f-bold`}>
                            {flightData.originAirportCode}
                          </Col>
                          <Col xs={5} xl={4}>
                            <Text className="cls-dep-time f-sbold">
                              {flightData.depart}
                            </Text>
                            <br />
                            <Text className="cls-grey fs-13 d-block">
                              {getDynamicDate(flightData.departDate) as string}
                            </Text>
                          </Col>
                          <Col xs={5} xl={4} className="cls-duration-stops">
                            <FdOriginDestination />
                            <Text className="d-block">
                              {flightData.duration}
                            </Text>
                          </Col>
                          <Col xs={4} xl={4} className={`${isSmallScreen ? "text-right" : ""}`}>
                            <Text className="cls-arr-time f-sbold d-block">
                              {flightData.arrival}
                            </Text>
                            <Text className="cls-grey fs-13 d-block">
                              {getDynamicDate(flightData.departDate) as string}
                            </Text>
                          </Col>
                          <Col xs={3} xl={4} className={`${isSmallScreen ? "fs-13" : "fs-16"} f-bold text-right`}>
                            {flightData.destinationAirportCode}
                          </Col>
                        </Row>
                      )
                    )}
                  </Collapse.Panel>
                </Collapse>
              </Card>
            </Col>
          ))}
        </Row>
      ) : (
        <BookTicketSkeleton />
      )}
    </>
  );
};

export default BookTicket;
