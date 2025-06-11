import "./FlightDisruption.scss";
import { Col, Row } from "antd";
import FlightDisruptionFilter from "./FlightDisruptionFilter/FlightDisruptionFilter";

const FlightDisruption: React.FC = () => {
  return (
    <Row className="cls-flight-disruption-container" data-testid='flightDisruption'>
      <Col span={24}>
        <FlightDisruptionFilter />
      </Col>
    </Row>
  );
};

export default FlightDisruption;
