import { Col, Row , Typography} from 'antd';
const { Text, Link } = Typography;
const UpcomingEvent = ({ dataInfo }: any) => {
  return (
    <>
      <Row data-testid="upcomingEvent" className="pt-1 pb-5 pl-3 cls-db-event-ele mt-3">
        <Col span={24}>
          <h1 className="fs-30 f-sbold cls-db-date">{dataInfo.day}</h1>
        </Col>
        <Col span={24}>
          <p className="fs-12 pb-4">{dataInfo.month}</p>
        </Col>
        <Col span={24}>
          <p className=" mt-1 fs-13">{dataInfo.text}</p>
        </Col>
        <Col span={24} className='cls-time'>
          <Text className='fs-12 f-sbold'>{dataInfo.time}</Text>
        </Col>
      </Row>
    </>
  );
};

export default UpcomingEvent;