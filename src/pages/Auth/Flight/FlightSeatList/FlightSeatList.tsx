import { Col, Row, Typography } from 'antd';
import './FlightSeatList.scss';
import { Icons } from '@/components/Icons/Icons';
import Icon from '@ant-design/icons';
const Text = Typography.Text;

const FlightSeatList = (props:any) => {

  return (
    <>
      <Row className="mr-3 ml-3 cls-flightSeatList" data-testid="flightSeatList">
        {props.pnrData[0]?.rebookOptionalFlightDetails[props.tripIndex[0]].flightDetails[props.tripIndex[1]].ssrData.seatData?.map((value:any, index:number) => (
          <Col
            className="cls-seat-list"
            span={value.item === 'Baby Bassinets' ? 4 : value.item === 'Free' ? 2 : 3}
            key={"flightSeatList"+index}
          >
            <span className="cls-seatlist_icon">
              { 
                value.icon ? 
                <Text>
                  <Icon component={Icons.get(value.icon)} />
                </Text>
                :
                <Text className={value.fontIcon}></Text>
              }
              
            </span>
            <span>{value.item}</span>
          </Col>
        ))}
      </Row>
    </>
  );
};

export default FlightSeatList;
