/**
 * Module : Component with mutiple purpose to show original , schedule changed and selected flight details in the searchFlight page
 * Date : Jun 2023
 **/

import "./SelectedFlight.scss";
import { useState, useEffect } from "react";
import { Card, Col, Divider, Row, Typography } from "antd";
import { useAppSelector } from "@/hooks/App.hook";
import { DateFormatForReschedule, getDifferenceInTime } from "@/Utils/date";
const { Text } = Typography;
interface SelectedFlightProps {
  type: string;
  tripId: number;
  tripIndexes: number[];
}

const SelectedFlight: React.FC<SelectedFlightProps> = ({
  tripId,
  tripIndexes,
  type,
}) => {
  const componentType = type;
  const { reviewFlightDetail } = useAppSelector(
    (state) => state.ReviewFlightReducer
  );
  const [selectedTripDetails, setSelectedTripDetails] = useState<any>();

  useEffect(() => {
    if (Object.keys(reviewFlightDetail).length) {
      if (componentType === "original") {
        setSelectedTripDetails(
          reviewFlightDetail?.flightData[tripIndexes[tripId]]?.flightData
        );
      } else if (componentType === "suggested") {
        setSelectedTripDetails(
          reviewFlightDetail?.flightData[tripIndexes[tripId]]?.flightData
            ?.suggestedFlight
        );
      } else if (componentType === "selected") {
        setSelectedTripDetails(
          reviewFlightDetail?.flightData[tripIndexes[tripId]]?.flightData
            ?.bookedFlight
        );
      }
    }
  }, [reviewFlightDetail, tripIndexes, tripId, componentType]);

  return (
    <>
      <Card
        data-testid="selectedFlight"
        className="cls-selected-flight"
        style={
          componentType === "original"
            ? { borderTopLeftRadius: "8px", borderTopRightRadius: "8px" }
            : {}
        }
      >
        <Row>
          <Col span={24} className="fs-12 f-sbold">
            {` ${
              componentType.charAt(0).toLocaleUpperCase() +
              componentType.slice(1)
            } flight`}
          </Col>
          {selectedTripDetails && Object.keys(selectedTripDetails).length && (
            <Col span={24}>
              <Row className="cls-destination-origin">
                <Col>
                  <Row gutter={8}>
                    <Col className="f-sbold">
                      {selectedTripDetails.originAirportCode}
                    </Col>
                    <Col className="f-sbold">
                      <Text className="Infi-Fd_41_OnwardTo"></Text>
                    </Col>
                    <Col className="f-sbold">
                      {selectedTripDetails.destinationAirportCode}
                    </Col>
                    <Col className="cls-date">
                      {DateFormatForReschedule(
                        selectedTripDetails.departure,
                        false
                      )}
                    </Col>
                  </Row>
                </Col>
                {componentType === "original" && (
                  <Col className="fs-13 cls-cancelled">Cancelled (WK)</Col>
                )}
              </Row>
              {componentType !== "original" && (
                <Row className="cls-flight-details">
                  <Col className="f-sbold fs-11 cls-flight-no" span={5}>
                    {selectedTripDetails.airlineCode}-
                    {selectedTripDetails.flightNumber}
                  </Col>
                  <Col className="f-bold fs-13 cls-hours" span={9}>
                    {selectedTripDetails.departureTime}
                    <span className="fs-8">
                      {selectedTripDetails.departureTimeFormat}
                    </span>{" "}
                    - {selectedTripDetails.arrivalTime}
                    <span className="fs-8">
                      {selectedTripDetails.arrivalTimeFormat}
                    </span>
                  </Col>
                  <Col className="f-sbold fs-12 cls-duration">
                    <Col>
                      {getDifferenceInTime(
                        selectedTripDetails.arrival,
                        selectedTripDetails.departure
                      )}
                    </Col>
                    <Divider dashed type="vertical" style={{ margin: "5px" }} />
                    {componentType === "selected" && (
                      <Col className="fs-12 cls-stop">
                        {selectedTripDetails.stops} stop(s)
                      </Col>
                    )}
                  </Col>
                </Row>
              )}
            </Col>
          )}
        </Row>
      </Card>
    </>
  );
};

export default SelectedFlight;
