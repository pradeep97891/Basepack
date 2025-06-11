// import { Col, Row } from "antd";
import "./BiDashboard.scss";

const BiDashboard: React.FC = () => {
  // const imagePath = require(
  //   `@/assets/images/Report/dashboard-report.png`
  // );
  // return (
  //   <Row data-testid="BiDashboard">
  //     <Col span={24}>
  //       <img src={imagePath} style={{width:'100%'}}></img>
  //     </Col>
  //   </Row>
  // );
  const location = window.location.origin;
  return (
    <div style={{ width: '100%', height: '100vh', border: 'none' }}>
      <iframe
        src={`${location}/59b4ba060b7339b26b7589c2c37ae49e/#/f90453ec712ce4505cc425e7e881e1d58ea274c3`}
        // src="http://localhost:4200/#/f90453ec712ce4505cc425e7e881e1d58ea274c3"
        style={{ width: '100%', height: '100%', border: 'none' }}
        title="External Application"
      />
    </div>
  );
};

export default BiDashboard;
