// import { Col, Row } from "antd";
import "./CustomReport.scss";

const CustomReport: React.FC = () => {
  // const imagePath = require(`@/assets/images/Report/create-reports.png`);
  // return (
  // <Row>
  //   <Col span={24}>
  //      <img src={imagePath}></img>
  //   </Col>
  // </Row>
  // );
  const location = window.location.origin;
  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      <iframe
        src={`${location}/59b4ba060b7339b26b7589c2c37ae49e/#/63133c2bc31c5efa43f5b26d738a514fa829a998`}
        // src="http://localhost:4200/#/63133c2bc31c5efa43f5b26d738a514fa829a998"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="External Application"
      />
    </div>
  );
  
};

export default CustomReport;
