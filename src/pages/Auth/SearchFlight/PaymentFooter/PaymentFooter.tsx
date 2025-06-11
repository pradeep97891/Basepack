import "./PaymentFooter.scss";
import { Col, Row, Card, Button, Typography } from "antd";
import flight_logo from "@/assets/images/Common/flight_logo.png";
import { useRedirect } from "@/hooks/Redirect.hook";

const { Text } = Typography;

interface IfirstChildProps {
  data: any;
}
const PaymentFooter: React.FC<IfirstChildProps> = ({ data }) => {
  const {redirect} = useRedirect();

  return (
    <>
      <Card data-testid="paymentFooter">
        <Row>
          <Col span={1} offset={4} className="cls-footer-center">
            <img src={flight_logo} alt="flight logo" />
          </Col>
          <Col span={2} className="cls-footer-center f-bold">
            {data?.ticket_id}
          </Col>
          <Col span={1}>
            <div className="fs-16 f-bold">{data?.from_time}</div>
            <div className="fs-16">{data?.from}</div>
          </Col>

          <Col span={1} className="cls-icon-center cls-line">
            ------
          </Col>
          <Col span={1} className="cls-icon-center">
            <Text className="Infi-Fd_47_FlightStart"></Text>
          </Col>
          <Col span={2}>
            <div className="fs-16 f-bold">{data?.to_time}</div>
            <div className="fs-16">{data?.to}</div>
          </Col>
          <Col span={3} className="cls-footer-center text-center" offset={4}>
            <div className="fs-20 f-bold">
              <span className="fs-12">INR </span>
              {data?.inr}
            </div>
          </Col>
          <Col span={2} className="cls-footer-center">
            <Button
              type="default"
              size="large"
              onClick={() => {
                redirect("addSSR");
              }}
            >
              Add SSR
            </Button>
          </Col>
          <Col span={2} className="cls-footer-center">
            <Button
              type="primary"
              size="large"
              onClick={() => {
                redirect("reviewflight");
              }}
            >
              Make Payment
            </Button>
          </Col>
        </Row>
      </Card>
    </>
  );
};

export default PaymentFooter;
