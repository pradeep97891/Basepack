import { Row, Col, Typography, Button, Popover, Flex, Divider } from "antd";
import "./AddOnPopup.scss";
import { useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/App.hook";
import CFG from "@/config/config.json";
import { FlightLogoIcon } from "../Icons/Icons";
import { useDispatch } from "react-redux";
import { setNextPage } from "@/stores/ReviewFlight.store";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import React from "react";
import { useTranslation } from "react-i18next";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

export interface AddOnPopupProps {
  currentTab: string;
  pnrData?: any;
  tripIndex?: any;
  selectedFlights?: any;
  // tripSelect?: () => void;
}

const AddOnPopup = (props: AddOnPopupProps) => {
  const dispatch = useDispatch();
  const {redirect} = useRedirect();
  const { t } = useTranslation();
  const { isSmallScreen } = useResize(991);
  const { original_flight_data, nextPage } = useAppSelector((state) => state.ReviewFlightReducer);
  const [seatSelectionPrice, setSeatSelectionPrice] = useState<number>(0);
  const [baggageSelectionPrice, setBaggageSelectionPrice] = useState<number>(0);
  const [mealsSelectionPrice, setMealsSelectionPrice] = useState<number>(0);
  const [seatTotalPrice, setSeatTotalPrice] = useState<number>(0);
  const [baggageTotalPrice, setBaggageTotalPrice] = useState<number>(0);
  const [mealsTotalPrice, setMealsTotalPrice] = useState<number>(0);
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [selectedSeatsCount, setSelectedSeatsCount] = useState<number>();
  const [selectedBaggageCount, setSelectedBaggageCount] = useState<number>();
  const [selectedBaggageWeight, setSelectedBaggageWeight] = useState<number>();
  const [selectedMealsCount, setSelectedMealsCount] = useState<number>();
  const [enableNext, setEnableNext] = useState(true);
  const [, SsetSsrPrice] = useSessionStorage<any>("ssrPrice");
  var baggageWeight: number = 0;

  useEffect(() => {
    if (nextPage === "") {
      dispatch(setNextPage("reviewflight"));
    } // eslint-disable-next-line
  }, []);

  useEffect(() => {
   
    var adultSeatPrice = 0;
    var childSeatPrice = 0;
    var infantSeatPrice = 0;
    var adultBaggagePrice = 0;
    var childBaggagePrice = 0;
    var infantBaggagePrice = 0;
    var adultMealsPrice = 0;
    var childMealsPrice = 0;
    var infantMealsPrice = 0;
    let seatsCount = 0;
    let baggageCount = 0;
    let mealsCount = 0;
    let tabSeatPrice = 0;
    let tabBaggagePrice = 0;
    let tabMealsPrice = 0;

    let pnrData = JSON.parse(JSON.stringify(props.pnrData ? props.pnrData : []));
    let paxInfo = pnrData[0]?.paxInfo ? pnrData[0]?.paxInfo : [];
    // Iterate over paxInfo and update seatCount, baggageCount and mealCount
    paxInfo?.forEach((paxItem: any) => {
      const rebookSsrData = paxItem?.rebookSsrData;
      if (rebookSsrData) {
        rebookSsrData.forEach((trip: any, index: number) => {
          trip?.ssrData?.forEach((data: any, subIndex: number) => {
            if (paxItem.type === "Adult") {
              adultSeatPrice += Number(data.seatDetail?.price);
              adultBaggagePrice += Number(data.baggageDetail?.price);
              adultMealsPrice += Number(data.mealsDetail?.price);
            } else if (paxItem.type === "Child") {
              childSeatPrice += Number(data.seatDetail?.price);
              childBaggagePrice += Number(data.baggageDetail?.price);
              childMealsPrice += Number(data.mealsDetail?.price);
            } else {
              infantSeatPrice += Number(data.seatDetail?.price);
              infantBaggagePrice += Number(data.baggageDetail?.price);
              infantMealsPrice += Number(data.mealsDetail?.price);
            }

            if (index === Number(props.tripIndex[0]) && subIndex === Number(props.tripIndex[1])) {
              tabSeatPrice += Number(data.seatDetail?.price);
              tabBaggagePrice += Number(data.baggageDetail?.price);
              tabMealsPrice += Number(data.mealsDetail?.price);
            }

            baggageWeight = (Number(data?.baggageDetail?.item.match(/\d+/g)) || 0) + baggageWeight;
          });

          seatsCount = seatsCount + trip?.ssrData.filter((ssrData: any) =>
            ssrData?.isSeatChecked === true &&
            ssrData?.seatDetail?.selected === true
          ).length;

          baggageCount += trip?.ssrData.filter((ssrData: any) =>
            ssrData?.isBaggageChecked === true &&
            ssrData?.baggageDetail?.selected === true
          ).length;

          mealsCount = mealsCount + trip?.ssrData.filter((ssrData: any) =>
            ssrData?.isMealsChecked === true &&
            ssrData?.mealsDetail?.selected === true
          ).length;

        });
      }
    });

    setSelectedSeatsCount(seatsCount);
    setSelectedBaggageCount(baggageCount);
    setSelectedMealsCount(mealsCount);

    var ssrPrice = {
      seat: adultSeatPrice + childSeatPrice + infantSeatPrice,
      baggage: adultBaggagePrice + childBaggagePrice + infantBaggagePrice,
      meals: adultMealsPrice + childMealsPrice + infantMealsPrice
    }

    SsetSsrPrice(ssrPrice);
    setSelectedBaggageWeight(baggageWeight);
    setSeatTotalPrice(ssrPrice.seat);
    setBaggageTotalPrice(ssrPrice.baggage);
    setMealsTotalPrice(ssrPrice.meals);
    setSeatSelectionPrice(tabSeatPrice);
    setBaggageSelectionPrice(tabBaggagePrice);
    setMealsSelectionPrice(tabMealsPrice);
    setTotalAmount(ssrPrice.seat + ssrPrice.baggage + ssrPrice.meals);

  }, [props.pnrData, props.tripIndex]);

  const handleClick = () => {
    if (nextPage === "") {
      dispatch(setNextPage("reviewflight"));
    } else {
      redirect(nextPage);
      dispatch(setNextPage(""));
    }
  };

  const content = (
    <Text className="cls-price-info-popup">
      <Flex justify="space-between" className="pt-2">
        <Text>
          <Text className="d-block f-reg">{t("seats")}</Text>
          <Text className="fs-12 cls-count">
            {selectedSeatsCount} {t("seat")}{t("(s)")}
          </Text>
        </Text>
        <Text className="fs-16 f-med">
          {CFG.currency} {seatTotalPrice.toFixed(2)}
        </Text>
      </Flex>
      <Flex justify="space-between" className="pt-2">
        <Text>
          <Text className="d-block f-reg">
            {t("baggage")} {"("}{selectedBaggageWeight} {"kg)"}
          </Text>
          <Text className="fs-12 cls-count">
            {selectedBaggageCount} {t("baggage")}{"(s)"}
          </Text>
        </Text>
        <Text className="fs-16 f-med">
          {CFG.currency} {baggageTotalPrice.toFixed(2)}
        </Text>
      </Flex>
      <Flex justify="space-between" className="py-2 cls-bdr-btm">
        <Text>
          <Text className="d-block f-reg">{t("meals")}</Text>
          <Text className="fs-12 cls-count">
            {selectedMealsCount} {t("meals")}{"(s)"}
          </Text>
        </Text>
        <Text className="fs-16 f-med">
          {CFG.currency} {mealsTotalPrice.toFixed(2)}
        </Text>
      </Flex>
      <Flex justify="space-between" className="pt-2 pb-1 cls-bdr-btm">
        <Text>
          <Text className="d-block f-med">{t("total_addon_amount")}</Text>
        </Text>
        <Text className="fs-17 f-med">
          {CFG.currency} {totalAmount.toFixed(2)}
        </Text>
      </Flex>
    </Text>
  );

  return props.currentTab === "modify" ? (
    <div data-testid="AddOnPopup">
      {props?.selectedFlights?.length ? (
        <Row
          className="cls-float-popup"
          align="middle"
          justify="space-between"
        >
          <Col xs={4} lg={16} xl={19} className="cls-selected-data d-flex" style={{ overflowX: "auto" }}>
            {props?.selectedFlights?.map((flight: any, itemIndex: number) =>
              <React.Fragment key={"modifyPopup" + itemIndex}>
                <Col className="cls-float-body text-center mr-3 d-flex">
                  <Text>
                    {[...Array(flight.stops + 1)].map((_, logoIndex) => (
                      <FlightLogoIcon key={logoIndex} />
                    ))}
                    <Text className="d-block fs-12 f-med">
                      {flight?.flightNumber}
                    </Text>
                  </Text>
                  <Text className="d-flex">
                    <Text className="fs-16 f-bold mr-2">
                      {flight?.originAirportCode}
                    </Text>
                    <Text className="cls-icon-center cls-line mx-1">
                      ------<Text className="Infi-Fd_47_FlightStart"></Text>
                    </Text>
                    <Text className="fs-16 f-bold ml-2">
                      {flight?.destinationAirportCode}
                    </Text>
                  </Text>
                  {props.selectedFlights.length !== itemIndex + 1 && (
                    <Divider
                      className="ml-2 mr-2"
                      dashed
                      type="vertical"
                      style={{
                        height: "40px",
                        borderColor: "var(--t-common-grey-color-md)"
                      }}
                    />
                  )}
                </Col>
              </React.Fragment>
            )}
          </Col>
          <Col xs={20} lg={8} xl={5} className="cls-float-popup-price">
            <Button
              type="default"
              size="large"
              className={`ml-3 fs-18 f-med ${props.selectedFlights.length === original_flight_data.length
                  ? ""
                  : "cls-disabled no-events"
                }`}
              onClick={() => {
                redirect("addSSR");
              }}
            >
              {t("add_ssr")}
            </Button>
            {/* {enableNext && props.selectedFlights.length !== original_flight_data.length ?
              <Button
                type="primary"
                size="large"
                className={`px-5 ml-3 fs-18 f-med`}
                onClick={() => {
                  setEnableNext(false);
                  if (props.tripSelect) {
                    props.tripSelect(); // Call the function only if it is defined
                  }
                }}
              >
                {t("next")}
              </Button>
              : */}
              <Button
                type="primary"
                size="large"
                className={`px-5 ml-3 fs-18 f-med ${isSmallScreen ? "cls-primary-btn" : ""} ${props.selectedFlights.length === original_flight_data.length ? "" : "cls-disabled no-events"}`}
                onClick={() => { redirect("reviewflight") }}
              >
                {t("submit")}
              </Button>
            {/* } */}
          </Col>
        </Row>
      ) : (
        <></>
      )}
    </div>
  ) : (
    <Row data-testid="AddOnPopup" className="cls-float-popup" align="middle" justify="space-between">
      <Col>
        <Row>
          {/* <Col className="pr-6 cls-dashed">
            <Text className="d-block fs-13 f-reg">Selected {props.currentTab}</Text>
            <Text className="fs-16 f-med">
              <Text className="fs-16 f-med">
                {props.currentTab === "Seat"
                  ? selectedSeatsCount
                  : props.currentTab === "Baggage"
                  ? selectedBaggageCount
                  : props.currentTab === "Meals"
                  ? selectedMealsCount
                  : ""}
              </Text>{" "}
              / <Text className="fs-16 f-med">{paxInfo}</Text> Selected
            </Text>
          </Col> */}
          { !isSmallScreen ?
            <Col className="">
              <Text className="d-block fs-13 f-reg">
                {
                  props.currentTab === t("seat") 
                    ? t("seats") 
                    : props.currentTab === t("baggage") 
                      ? t("baggage") 
                      : props.currentTab === t("meals") 
                        ? t("meals") 
                        : ""
                }
              </Text>
              <Text className="fs-18 f-med">
                {CFG.currency} &nbsp;
                {
                  props.currentTab === t("seat")
                    ? seatSelectionPrice.toFixed(2)
                    : props.currentTab === t("baggage")
                      ? baggageSelectionPrice.toFixed(2)
                      : props.currentTab === t("meals")
                        ? mealsSelectionPrice.toFixed(2)
                        : ""
                }
              </Text>
            </Col> :
            <></>
          }
        </Row>
      </Col>
      <Col>
        <Row>
          <Col className="pr-6 cls-dashed">
            <Text className="d-block fs-13 f-reg">{t("total_addon_amount")}</Text>
            <Text>
              <Text className={`${isSmallScreen ? "fs-16 f-sbold" : "fs-18 f-reg"}`}>
                {CFG.currency} &nbsp;{totalAmount.toFixed(2)}
              </Text>
              <Popover content={content}>
                <Text className="Infi-Fd_15_Info cls-infoIcon"></Text>
              </Popover>
            </Text>
          </Col>
          <Col className="ml-6">
            <Button
              style={{ minWidth: isSmallScreen ? "max-content" : 140, height: "43px" }}
              type="primary"
              onClick={handleClick}
              className={`${isSmallScreen ? "cls-primary-btn" : ""}`}
            >
              {nextPage === "reviewflight" ? t("next") : t("submit")}
            </Button>
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default AddOnPopup;