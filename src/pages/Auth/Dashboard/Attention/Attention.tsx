import React, { useState, useMemo } from "react";
import {
  Col,
  Row,
  Button,
  Divider,
  Drawer,
  List,
  Typography
} from "antd";
import {
  Adult,
  InfantBlue,
  Child,
} from "@/components/Icons/Icons";
import "../Dashboard.scss";

interface PassengerInfo {
  name: string;
  age: number;
  gender: string;
  type: string;
}

interface AttentionProps {
  dataInfo: {
    days_left?: string;
    flight_number?: string;
    pnr_count?: number;
    pax_count?: number | string;
    info?: number | string;
    user?: string;
    pnr?: string;
    pnr_values?: string[] | any;
    sector: string;
    Action_status: string;
    total_passenger?: string | number;
    passenger_info?: PassengerInfo[];
  };
}

interface PassengerIconMappingInterface {
  [key: string]: JSX.Element;
}

const PassengerIconMapping: PassengerIconMappingInterface = {
  A: <Adult />,
  C: <Child />,
  I: <InfantBlue />,
};

const Attention: React.FC<AttentionProps> = ({ dataInfo }) => {
  const [drawerVisible, setDrawerVisible] = useState(false);
  // const [open, setOpen] = useState(false);

  const { Text, Title } = Typography;

  const groupedPassengers = useMemo(() => {
    const groups: { [key: string]: PassengerInfo[] } = {};
    dataInfo.passenger_info?.forEach((passenger) => {
      const { type } = passenger;
      if (!groups[type]) {
        groups[type] = [];
      }
      groups[type].push(passenger);
    });
    return groups;
  }, [dataInfo.passenger_info]);

  const showDrawer = () => {
    setDrawerVisible(true);
  };

  const closeDrawer = () => {
    setDrawerVisible(false);
  };

  // const onClose = () => {
  //   setOpen(false);
  // };

  // const handleClick = () => {
  //   redirect("flightChange");
  // };

  const getPassengerIcon = (type: string) => {
    return PassengerIconMapping[type] || null;
  };

  const getPassengerTypeLabel = (type: string) => {
    switch (type) {
      case "A":
        return "Adult";
      case "C":
        return "Child";
      case "I":
        return "Infant";
      default:
        return "";
    }
  };

  return (
    <>
      <Row
        data-testid="attention"
        className="cls-attention-container"
        style={{ cursor: "pointer" }}
        align="middle"
        justify="space-between"
      >
        <Col span={19}>
          <Row>
            <Text type="danger" className="fs-10 f-bold">{dataInfo.days_left}</Text>
          </Row>
          <Row className="mt-1 cls-pnr-details">
            <Title level={1} className="fs-18 f-sbold cls-card-heading">{dataInfo.flight_number}
              {dataInfo.pnr}</Title>
            <Col span={6} className="fs-12 f-sbold mt-1 pl-3">
              {dataInfo.sector}
            </Col>
            {/* <Col 
              span={4}
              style={{ display: "flex", justifyContent: "center",border:'1px solid red' }}
              className="fs-12 f-sbold mt-1"
            >
              <Tooltip placement="top" title="PNR123, PNR098, PNR876">
                <span>{dataInfo.pnr_count}</span>
              </Tooltip>
              <span>{dataInfo.user}</span>
            </Col> */}

            <Col span={9} className="fs-12 f-bold mt-1 pl-1 cls-attention-text">
              <p onClick={showDrawer}>
                {/* <Text className="Infi-Fd_08_User"></Text> */}
                {dataInfo.total_passenger}
                {dataInfo.pax_count}
              </p>
            </Col>
            <Col span={3} className="fs-12 f-sbold mt-1 cls-attention-tablePnr"  style={{color:'#1576C0'}}>
              <p>
                {dataInfo.info}
              </p>
            </Col>
          </Row>
          <Drawer
            title={
              <div>
                <span style={{ fontWeight: "bold" }}>Passenger </span>
                <span
                  style={{ fontSize: "10px" }}
                >{` ${dataInfo.total_passenger}`}</span>
              </div>
            }
            placement="right"
            onClose={closeDrawer}
            open={drawerVisible}
          >
            {Object.keys(groupedPassengers).map((type) => (
              <div key={type}>
                <Typography.Title level={4}>
                  {getPassengerIcon(type)} {getPassengerTypeLabel(type)}
                </Typography.Title>
                <List
                  grid={{ gutter: 16, column: 2 }}
                  dataSource={groupedPassengers[type]}
                  renderItem={(passenger, index) => (
                    <List.Item>
                      <Col>
                        <Row>
                          <Text strong>{passenger.name}</Text>
                        </Row>
                        <Text className="fs-11">
                          {passenger.age} yrs, {passenger.gender}
                        </Text>
                      </Col>
                    </List.Item>
                  )}
                />
              </div>
            ))}
          </Drawer>
        </Col>
        <Col span={4} className="cls-btn-container">
          <Button
            style={{
              display: "flex",
              alignItems: "center",
            }}
            className={`cls-status ${
              dataInfo.Action_status.toLowerCase() === "emailed"
                ? "cls-reschedule"
                : dataInfo.Action_status.toLowerCase() === "accepted"
                ? "cls-accepted"
                : "cls-cancel"
            }`}
            // onClick={handleClick}
          >
            <Text className="Infi-Fd_08_User mt-10" style={{color:'#fff'}}></Text>
            {dataInfo.Action_status}
          </Button>
        </Col>
      </Row>
      <Divider className="mt-2 mb-2" />
    </>
  );
};

export default Attention;