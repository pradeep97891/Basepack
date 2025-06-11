import { Col, Row } from "antd";
import "./NoInternet.scss";

const NoInternet = () => {
  return (
    <>
      <Row data-testid="NoInternet" align="middle" justify="center" className="PageNotFound cls-NoInternet">
        <Col>
        <div className="image-con">
          <div className="image"></div>
        </div>
          {/* <img id="noInternetImg" src="" alt="" /> */}
          <div className="heading">Network disconnect</div>
          <div className="help-text mt-3">
            You are offline. Check your Connectivity.
          </div>
        </Col>
      </Row>
    </>
  );
};

export default NoInternet;
