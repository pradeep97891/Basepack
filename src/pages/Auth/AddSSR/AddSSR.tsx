import { Col, RadioChangeEvent, Row, Typography } from "antd";
import "./AddSSR.scss";
import { useEffect, useState } from "react";
import AddSSRHeader from "../Flight/AddSSRHeader/AddSSRHeader";
import FlightSeatList from "../Flight/FlightSeatList/FlightSeatList";
import Flight from "../Flight/Flight";
import DescriptionHeader, { ItineraryHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import PassengersList from "../ReviewFlight/PassengersList/PassengersList";
import AddOnPopup from "@/components/AddOnPopup/AddOnPopup";
import { AddOnPopupProps } from "@/components/AddOnPopup/AddOnPopup";
import BaggageMealBox from "./BaggageMealBox/BaggageMealBox";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/App.hook";
import AddSSRSkeleton from "./AddSSR.skeleton";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

const AddSSR = () => {

  const { t } = useTranslation();
  const { isSmallScreen } = useResize(991);
  const [currentSSRTab, setCurrentSsrTab] = useState(t("seat") ? t("seat") : "Seat");
  const [tripIndex, setTripIndex] = useState(("0-0").split("-"));
  const [baggageDetails, setBaggageDetails] = useState([]);
  const [mealsDetails, setMealsDetails] = useState([]);
  const [SfinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  const [SsearchFlightPNRData] = useSessionStorage<any>("searchFlightPNRData");
  const [SssrPNRData] = useSessionStorage<any>("ssrPNRData");
  const { pnrData } = useAppSelector((state: any) => state.FlightSeatReducer);
  const [activePNR, setActivePNR] = useState(
    SssrPNRData
      ? SssrPNRData
      : SsearchFlightPNRData
        ? SsearchFlightPNRData
        : SfinalViewPnrData
  );
  const [initialSeatList, setInitialSeatList] = useState(
    SsearchFlightPNRData
      ? SsearchFlightPNRData[0]?.rebookOptionalFlightDetails?.[0]?.flightDetails[0]?.ssrData.seatList
      : SfinalViewPnrData[0]?.rebookOptionalFlightDetails?.[0]?.flightDetails[0]?.ssrData.seatList
  );

  useEffect(() => {
    window.scroll(0, 0); // eslint-disable-next-line
  }, []);

  useEffect(() => {
    setActivePNR(pnrData);
    setBaggageDetails(pnrData?.[0]?.rebookOptionalFlightDetails?.[tripIndex[0]]?.flightDetails[tripIndex[1]]?.ssrData?.baggageList);
    setMealsDetails(pnrData?.[0]?.rebookOptionalFlightDetails?.[tripIndex[0]]?.flightDetails[tripIndex[1]]?.ssrData?.mealsList[0])
  }, [pnrData])

  var addOnProps: AddOnPopupProps = {
    currentTab: currentSSRTab,
    pnrData: activePNR,
    tripIndex: tripIndex
  }

  const headerProps: ItineraryHeaderProps["data"] = {
    title: t("add_ssr")
  };

  const onChange = (value: any) => {
    setCurrentSsrTab(value);
  };

  const handleTripSelection = (e: RadioChangeEvent) => {
    var index = e.target.value.split("-");
    setTripIndex(index);
    // SsetTripIndex(index);
    setInitialSeatList(
      SsearchFlightPNRData
        ? SsearchFlightPNRData[0]?.rebookOptionalFlightDetails?.[index[0]]?.flightDetails[index[1]]?.ssrData.seatList
        : SfinalViewPnrData[0]?.rebookOptionalFlightDetails?.[index[0]]?.flightDetails[index[1]]?.ssrData.seatList
    );
  }

  return (
    <Row data-testid="addSSR" className="cls-addSSRMain">
      <>
        <Col xl={24}>
          <Text className="mr-3 mt-3 ml-3 d-block cls-addSSRHeader">
            <DescriptionHeader
              data={headerProps}
            />
          </Text>
          {currentSSRTab && activePNR && baggageDetails && mealsDetails && initialSeatList && tripIndex ?
            <Row className="cls-addSSROuter">
              { isSmallScreen ?
                <Col xl={24} className="mb-3 mr-2" order={isSmallScreen ? 1 : ""}>
                  <AddSSRHeader
                    pnrData={activePNR}
                    onChange={onChange}
                    handleTripSelection={handleTripSelection}
                  />
                </Col> :
                <></>
              }
              <Col xs={24} lg={15} xl={17} order={isSmallScreen ? 3 : ""}>
                <Row className="mr-5 ml-3 mt-3 cls-addSSRLayout">
                  {!isSmallScreen ?
                    <Col xl={24} className="mb-3 mr-2 cls-headerCol">
                      <AddSSRHeader
                        pnrData={activePNR}
                        onChange={onChange}
                        handleTripSelection={handleTripSelection}
                      />
                    </Col> :
                    <></>
                  }
                  <Col xl={24} className={`${currentSSRTab === t("seat") ? "d-block" : "hide"}`}>
                    { isSmallScreen ?
                      <Text className="fs-15 f-bold d-block cls-fv-Passengers px-2 py-2">
                        {currentSSRTab}
                      </Text>
                      : <></>
                    }
                    <Flight
                      tripIndex={tripIndex}
                      pnrData={activePNR}
                    />
                    <Col xl={24} className="mb-2">
                      <FlightSeatList
                        pnrData={activePNR}
                        tripIndex={tripIndex}
                      />
                    </Col>
                  </Col>
                  <Col xs={24} md={24} xl={24} className={`${currentSSRTab !== t("seat") ? "d-block" : "hide"}`}>
                    <BaggageMealBox
                      currentTab={currentSSRTab}
                      pnrData={activePNR}
                      tripIndex={tripIndex}
                    />
                  </Col>
                </Row>
              </Col>
              <Col xs={24} lg={9} xl={7} className="mt-3 cls-passengers" id="passengersList" order={isSmallScreen ? 2 : ""}>
                <PassengersList
                  currentTab={currentSSRTab}
                  tripIndex={tripIndex}
                  pnrData={activePNR}
                  baggageDetails={baggageDetails}
                  mealsDetails={mealsDetails}
                  initialSeatList={initialSeatList}
                />
              </Col>
            </Row>
            :
            <AddSSRSkeleton />
          }
        </Col>
        <AddOnPopup {...addOnProps} />
      </>
    </Row>
  );
};

export default AddSSR;