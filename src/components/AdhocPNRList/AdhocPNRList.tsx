import React, { FC, useEffect, useState } from 'react';
import './AdhocPNRList.scss';
import { Card, Carousel, Col, Progress, Radio, Row, Typography } from 'antd';
import { t } from 'i18next';
import { FdPNRPending, FdFlightClosePending, FdPaxPending, FdFlightPending } from '../Icons/Icons';
const Text = Typography.Text;


const cardsData: any = [
  {
    status: t("pending"),
    icon: <FdPNRPending />,
    pendingCount: "6",
    reason: t("reaccommodation_pending"),
    percent: 30,
  },
  {
    status: t("critical"),
    icon: <FdFlightClosePending />,
    pendingCount: "22",
    reason: t("acknowledgement_pending"),
    percent: 32,
  },
  {
    status: t("action_required"),
    icon: <FdPaxPending />,
    pendingCount: "37",
    reason: t("reaccommodation_pending"),
    percent: 39,
  },
  {
    status: t("closure_required"),
    icon: <FdFlightPending />,
    pendingCount: "20",
    reason: t("awaiting_closure"),
    percent: 10,
  }
];


const AdhocPnrList = ({ clusterData, handlePNRData, clusterIndex, handleFilterData }: any) => {
  const [filterPNR, setFilterPNR] = useState("Y");

  useEffect(() => {
    handleFilterData(filterPNR);
  },[filterPNR])

  return (
    <Row className="cls-AdhocPNRList" data-testid="AdhocPNRList">
      <Col lg={24} xs={24}>
        <Carousel
          arrows
          variableWidth
          infinite={false}
          slidesToShow={4}
          slidesToScroll={4}
          draggable={true}
          dots={false}
          className="cls-carousel"
        >
          {cardsData?.map((card: any, index: number) => (
            <Text className={`cls-card-span d-block ${index === 0 ? "" : "pl-3"}`}>
              <Card key={index} bordered={false}>
                <Text
                  className="cls-status"
                  style={{
                    backgroundColor:
                      card?.status === t("pending")
                        ? "#FCED13"
                        : card?.status === t("critical")
                          ? "#FF7376"
                          : card?.status === t("action_required")
                            ? "#FAB913"
                            : "#4BE916",
                  }}
                >
                  {card?.status}
                </Text>
                <Row style={{ padding: 0 }}>
                  <Col lg={6} xs={7} className="d-flex align-center justify-center">
                    {card?.icon}
                  </Col>
                  <Col lg={18} xs={17}>
                    <Text className="cls-disrupted-total d-flex fs-14 f-reg">
                      {" "}
                      {card?.description}{" "}
                      <Text className="f-med pl-1 fs-14">
                        {card?.descriptionCount}
                      </Text>
                    </Text>
                    <Text className="cls-pending fs-24 pt-2 pr-1 d-iblock p-clr">
                      {card?.pendingCount}
                    </Text>
                    <Text className="cls-reason fs-13 f-reg" style={{ verticalAlign: "text-bottom" }}>
                      {card?.reason}
                    </Text>
                    <Progress
                      percent={card?.percent}
                      size="small"
                      showInfo={false}
                      strokeColor={
                        card?.status === "Pending"
                          ? "#FCED13"
                          : card?.status === "Critical"
                            ? "#FF7376"
                            : card?.status === "Action required"
                              ? "#FAB913"
                              : "#4BE916"
                      }
                    />
                  </Col>
                </Row>
              </Card>
            </Text>
          ))}
        </Carousel>
      </Col>
      <Col span={24} className="cls-cluster-div">
        <Text className="fs-17 f-med p-clr d-iblock pr-6 pb-1">Filter by cluster type</Text>
        <Radio.Group
          options={[
            { "label": "Yes", "value": "Y" },
            { "label": "No", "value": "N" }
          ]}
          defaultValue="Y"
          onChange={(e) => setFilterPNR(e.target.value)}
        />
        {filterPNR === "Y" &&
          <Row>
            <Radio.Group
              defaultValue="itinerary_0"
              value={"itinerary_"+clusterIndex}
              className="d-flex flex-wrap g-10 w-100 pt-2"
              onChange={(e) => {
                let data = (e.target.value).split("_");
                handlePNRData([data[1]]);
              }}
            >
              {clusterData?.map((data: any, index: number) => (
                <Col  xs={24} sm={10} md={10} lg={7} xl={6}  className="mr-4">
                  <Radio.Button value={"itinerary_" + index}>
                    <Card>
                      <Text className="d-block fs-15 f-reg"> {data.segment} <Text className="fs-13 f-reg cls-grey-lite pl-1"> {data.stops}{" "} stops</Text></Text>
                      <Text className="d-block fs-15 f-reg">
                        Pax {" "} {data.paxCount}
                        <Text className="cls-grey-lite fs-16"> | </Text>
                        {data?.info?.map((pax:any, paxIndex:number) => (
                          <Text 
                            className="fs-15 f-med pr-1" 
                            style={
                              { 
                                color: 
                                  pax?.type === "Senior citizen" 
                                  ? "#D99E08"
                                  : pax?.type === "VIP" 
                                    ? "#FE8834"
                                    : "#5FA8FA" 
                              }
                            }
                          >
                            {pax?.type}: {pax?.count}{data?.info?.length !== paxIndex+1 && ","}
                          </Text>
                        ))}
                        <Text className="d-block fs-15 f-reg">
                          Disrupted PNR:
                          <Text className="fs-14 f-med"> {" "}{data.pnrCount}</Text>
                        </Text>
                      </Text>
                    </Card>
                  </Radio.Button>
                </Col>
              ))}
            </Radio.Group>
          </Row>
        }
      </Col>
    </Row>
  )
};

export default AdhocPnrList;
