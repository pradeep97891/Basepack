import { Col, Row, Card, Timeline, Button, Table, Typography } from "antd";
import "./PnrHistory.scss";
import { useGetPnrDetailMutation } from "../../../services/reschedule/Reschedule";
import { useEffect, useState } from "react";
import TableDisplay from "@/components/Table/Table";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";
import { ColumnType } from "antd/es/table";
import { getDynamicDate } from "@/Utils/general";
import { FdOriginDestination } from "@/components/Icons/Icons";
import { useResize } from "@/Utils/resize";

const { Text } = Typography;

const PnrHistory = (props: any) => {
  const [PNRservice, PNRserviceStatus] = useGetPnrDetailMutation();
  const { t } = useTranslation();
  const {isSmallScreen}=useResize(575);

  const timeline_data = [
    {
      timeline_name: "Nov",
      timeline_date: "Nov 26, 2024",
      timeline_time: "12:30",
      queue_no: "420",
    },
    {
      timeline_name: "Nov",
      timeline_date: "Nov 27, 2024",
      timeline_time: "14:30",
      queue_no: "421",
    }
  ];

  const [SreaccommodateFlightDetails] = useSessionStorage<any>("flightDetail");
  const [tableData, setTableData] = useState<any>([]);
  const [pnrData, setPnrData] = useState(SreaccommodateFlightDetails?.pnrs[0]?.pnrs?.[0]);

  /* Table column data */
  const columns: ColumnType<any>[] = [
    {
      title: "PNR",
      dataIndex: "pnr",
      key: "pnr",
      render: (pnr) => {
        return <Text className="f-bold fs-13">{pnr}</Text>;
      },
    },
    {
      title: "Sector",
      dataIndex: "route",
      key: "route",
      render: (route) => {
        return route?.toUpperCase();
      },
    },
    {
      title: "Flight No",
      dataIndex: "flightNumber",
      key: "flight_number",
      render: (flightNumber) => {
        return <Text className="f-bold fs-13">{flightNumber?.toUpperCase()}</Text>;
      },
    },
    {
      title: "Re-accommodated flight",
      dataIndex: "reassignedFlightNo",
      key: "reassignedFlightNo",
    },
    {
      title: "Travel date",
      dataIndex: "etdDeparture",
      key: "etdDeparture",
    },
    {
      title: "Pax",
      dataIndex: "addedPaxCount",
      key: "pax_count",
    }
  ];

  const rebookOptionalFlightDetails = [
    {
      "trip": 1,
      "date": "0,0,31",
      "origin": "Delhi",
      "originAirportCode": "DEL",
      "destination": "London",
      "destinationAirportCode": "LHR",
      "stops": 1,
      "stopDetails": [
        {
          "airportName": "Bahrain",
          "airportCode": "BAH",
          "stopOverTime": "2h 25m"
        }
      ],
      "flightDetails": [
        {
          "id": 1,
          "origin": "Delhi",
          "originAirportCode": "DEL",
          "destination": "Bahrain",
          "destinationAirportCode": "BAH",
          "flightNumber": "VA-0135",
          "stops": 1,
          "paxCount": 10,
          "departDate": "0,1,2",
          "depart": "05:40",
          "arrivalDate": "0,1,2",
          "arrival": "08:00",
          "departTimezone": "UTC+05:30",
          "arrivalTimezone": "UTC+03:00",
          "nextDayArrival": "",
          "duration": "04h 50m",
          "status": "Schedule changed",
          "statusCode": "SC"
        },
        {
          "id": 2,
          "origin": "Bahrain",
          "originAirportCode": "BAH",
          "destination": "London",
          "destinationAirportCode": "LHR",
          "flightNumber": "VA-0003",
          "stops": 1,
          "paxCount": 10,
          "departDate": "0,1,2",
          "depart": "10:25",
          "arrivalDate": "0,1,2",
          "arrival": "14:45",
          "departTimezone": "UTC+03:00",
          "arrivalTimezone": "UTC+01:00",
          "nextDayArrival": "",
          "duration": "07h 20m",
          "status": "Confirmed",
          "statusCode": "HK"
        }
      ]
    }
  ];

  useEffect(() => {
    if (
      SreaccommodateFlightDetails &&
      Object.keys(SreaccommodateFlightDetails)?.length
    ) {
      let data = props?.tableData;
      data[0].pnr = "VAD001";
      data[0].reassignedFlightNo = "VA-0001";
      data[0].etdDeparture = "Nov 30, 2024";
      setTableData(data);
    }
  }, [props]);

  return (
    <Row className="cls-timeline" data-testid="pnrHistory">
      <Col span={24} className="mb-4">
        <Typography.Title level={4}>
          PNR History
        </Typography.Title>
      </Col>
      <Col span={24}>
        <Timeline>
          {timeline_data?.map((data) => (
            <Timeline.Item
              dot={
                <>
                  <Button
                    type="default"
                    className="fs-14 f-med"
                    shape="circle"
                    style={{ borderRadius: "50%" }}
                  >
                    {data.timeline_name ? data.timeline_name : <Text className="Infi-Fd_71_Robot"></Text>}
                  </Button>
                  <Col className="cls-dot-timeline-extra">
                    <Text className="f-reg fs-13 mt-1 py-1 d-iblock">
                      {data.timeline_date}
                      <Text className="d-block f-reg fs-13">{data.timeline_time}</Text>
                    </Text>
                  </Col>
                </>
              }
            >
              <Row className="cls-table-timeline cls-card-margin">
                <Col
                  span={24}
                >
                  <Card className="mt-2 ml-10 cls-history-card">
                    <Text className="Infi-Fd_04_DropdownArrow cls-card-arrow" />
                    <Row>
                      <Col span={24} className="cls-timeline-col">
                        <Col span={24} className="fs-15 mb-1">
                          Actioned by
                        </Col>
                        <Col span={24} className="fs-15 f-sbold mb-1">
                          andyjhonson@gmail.com
                        </Col>
                        <Col span={24} className="fs-13 mt-2">
                          <TableDisplay
                            data={tableData}
                            columns={columns}
                            pagination={{ pageSize: 5, position: "bottomRight" }}
                            size="middle"
                          />
                        </Col>
                        <Col span={24} className="mb-4">
                          <Row>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12} className={`${isSmallScreen? "":"pr-2"}`}>
                              <Text className="fs-12 f-reg p-clr d-iblock mb-1">Original flight</Text>
                              {pnrData?.originalFlightDetails?.map((data: any, mainIndex: number) => (
                                <Card key={`data-${mainIndex}`} className="cls-flight-card">
                                  {data?.flightDetails?.map((item: any, index: number) => (
                                    index === 0 &&                                    
                                    <Row
                                      justify="space-between"
                                      align="middle"
                                      className="px-2 py-2 rg-10"
                                    >
                                      <Col xs={6} sm={8} md={6} lg={6} xl={6} className="text-left cls-dep-left">
                                        <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                        <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                      </Col>
                                      <Col xs={12} sm={8} md={10} lg={10} xl={10} className="text-center cls-duration-stops">
                                        <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                        <Text className="w-100"> <FdOriginDestination /> </Text>
                                        <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                                      </Col>
                                      <Col  xs={6} sm={8} md={6} lg={6} xl={6} className="text-right cls-dep-right">
                                        <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                        <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                      </Col>
                                    </Row>
                                  ))}
                                </Card>
                              ))}
                            </Col>
                            <Col xs={24} sm={12} md={12} lg={12} xl={12} className={`${isSmallScreen? "":"pl-2"}`}>

                              <Text className="fs-12 f-reg p-clr d-iblock mb-1">Rescheduled flight</Text>
                              {rebookOptionalFlightDetails?.map((data: any, mainIndex: number) => (
                                <Card key={`data-${mainIndex}`} className="cls-flightres-card">
                                  {data?.flightDetails?.map((item: any, index: number) => (
                                    index === 0 &&
                                    <Row
                                      justify="space-between"
                                      align="middle"
                                      className="px-2 py-2 rg-10"
                                    >
                                      <Col xs={6} sm={8} md={6} lg={6} xl={6} className="text-left cls-dep-left">
                                        <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                        <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                      </Col>
                                      <Col xs={12} sm={8} md={10} lg={10} xl={10} className="text-center cls-duration-stops">
                                        <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                        <Text className="w-100"><FdOriginDestination /></Text>
                                        <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                                      </Col>
                                      <Col xs={6} sm={8} md={6} lg={6} xl={6} className="text-right cls-dep-right">
                                        <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                        <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                      </Col>
                                    </Row>
                                  ))}
                                </Card>
                              ))}
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            </Timeline.Item>
          ))}
        </Timeline>
      </Col>
    </Row>
  );
};

export default PnrHistory;
