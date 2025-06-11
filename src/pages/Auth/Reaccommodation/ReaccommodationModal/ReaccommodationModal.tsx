import React, { useEffect, useState } from "react";
import { Modal, Typography, Tabs, Row, Col, Card, Button, Flex} from "antd";
import './ReaccommodationModal.scss';
import { getDynamicDate } from "@/Utils/general";
import { FdNoDataFound, FdOriginDestination } from "../../../../components/Icons/Icons";
import { useTranslation } from "react-i18next";
import TableDisplay from "../../../../components/Table/Table";
import { ColumnType } from "antd/es/table";
const Text = Typography.Text;
const { TabPane } = Tabs;

const ReaccommodationModal = (
  { 
    isModalOpen, 
    handleOk, 
    handleCancel, 
    reaccommodatedDetails, 
    mappedDetails, 
    showHeader, 
    activeModalTab,
    showModalFooter,
    loading
  }: any) => {
  // State to track the active tab
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState("1");

  const onTabChange = (key: string) => {
    setActiveTab(key);
  };

  useEffect(() => {
    setActiveTab(activeModalTab)
  }, activeModalTab)
  

  const prepareReaccommodatedTableData = (pnr:any) => {
    const status = pnr?.status;
    return [
      {
        dId: pnr?.disruptionId,
        pnr: pnr?.PNR,
        flightNumber: pnr?.flightNumber,
        reassignedFlightNo: pnr?.reassignedFlightNo,
        stdDeparture: pnr?.stdDeparture,
        etdDeparture: pnr?.etdDeparture,
        route: pnr?.sector,
        travelDate: pnr?.departureDate ? getDynamicDate(pnr?.departureDate) : "",
        totalPNR: pnr?.length || 0,
        policy: pnr?.autoReaccommodation?.policy,
        autoReassignPolicy: "test",
        addedPaxCount: pnr?.totalPaxCount,
        pnrData: pnr,
        status: (
          <Text
            className={`${status === "Email sent"
              ? "cls-primary-color"
              : status === "Flight change initiated"
                ? "cls-change"
                : status === "Diverted"
                  ? "cls-abort"
                  : status === "Sending notification"
                    ? "cls-notification"
                    : status === "Awaiting"
                      ? "cls-awaiting"
                      : status === "Reaccommodated"
                        ? "cls-reaccommodate"
                        : status === "Flight cancelled"
                          ? "cls-cancelled"
                          : ""
              } fs-12`}
          >
            {pnr?.status}
          </Text>
        ),
      },
    ];
  };

  const reaccommodationTableColumns: ColumnType<any>[] = [
    {
      title: "PNR",
      dataIndex: "pnr",
      key: "pnr",
      render: (pnr) => {
        return <Text className="f-med fs-13">{pnr}</Text>;
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
        return <Text className="f-med fs-13">{flightNumber?.toUpperCase()}</Text>;
      },
    },
    {
      title: "Re-accommodated flight",
      dataIndex: "reassignedFlightNo",
      key: "reassignedFlightNo",
      render: (reassignedFlightNo) => {
        return <Text className="f-med fs-13 cls-cancelled">{reassignedFlightNo?.toUpperCase()}</Text>;
      },
    },
    {
      title: "Travel date",
      dataIndex: "travelDate",
      key: "travelDate",
      render: (travelDate) => {
        const date = travelDate?.split(" ")?.slice(0, 3)?.join(" ");
        return date || "-";
      },
    },
    {
      title: "Pax",
      dataIndex: "addedPaxCount",
      key: "addedPaxCount"
    } 
  ];

  return (
    
    <Modal
      className="cls-reaccommodation-modal" 
      data-testid="ReaccommodationModal"
      title={
        showHeader ? 
          <Tabs 
            activeKey={activeTab} 
            onChange={onTabChange}
          >
            <TabPane 
              key="1" 
              tab={
                <Typography.Title level={5} className="cls-list-title"> 
                  {`${t("re-accommodation_list")} (${reaccommodatedDetails?.length})`} 
                </Typography.Title>
              }
            />
            <TabPane 
              key="2" 
              tab={
                <Typography.Title level={5} className="cls-list-title"> 
                  {`Mapped list (${mappedDetails?.length})`}
                </Typography.Title>
              }
            />
          </Tabs> :
          <Typography.Title level={4} className="cls-list-title mt-1"> 
            {t("re-accommodation_list")} ({reaccommodatedDetails?.length})
          </Typography.Title>

      }
      closeIcon={<Text className="Infi-Fd_09_CloseIcon fs-20 cls-grey-lite cls-close-modal-icon"></Text>}
      open={isModalOpen}
      onOk={handleOk}
      footer={
          (!showHeader && showModalFooter) && 
          <Flex wrap={"wrap"} align="middle" justify="center" gap={20}>
            <Col xs={24} sm={11} md={11} lg={5} xl={5}>
              <Button type="default" className="w-100 px-10 py-5" onClick={handleCancel}>
                Cancel
              </Button>
            </Col>
            <Col xs={24} sm={11} md={11} lg={5} xl={5}>
              <Button type="primary" className="w-100 px-10 py-5" onClick={handleOk} loading={loading}>
                Confirm
              </Button>
            </Col>
          </Flex>
      }
      onCancel={handleCancel}
      width="68%"
      okText="Confirm"
    > 
      {/* Modal Body: Render Content Based on Active Tab */}
      {activeTab === "1" && (
        <>
          { !showHeader &&
            <Text className="fs-17 f-reg cls-grey-lite d-iblock pb-3">Review and confirm re-accommodation details</Text>
          }
          {reaccommodatedDetails?.length ? (
            reaccommodatedDetails.map((pnr: any, index: number) => (
              <Row className="cls-reaccommodation-modal mb-3" key={index}>
                <Col span={24}>
                  <Card className="cls-history-card">
                    <Row>
                      <Col span={24} className="cls-timeline-col">
                        <Col span={24} className="fs-13 mt-2">
                          <TableDisplay
                            data={() => prepareReaccommodatedTableData(pnr)}
                            columns={reaccommodationTableColumns}
                            pagination={{ pageSize: 5, position: "bottomRight" }}
                            size="middle"
                          />
                        </Col>
                        <Col span={24} className="mb-4">
                          <Row className="g-10 justify-center">
                            <Col xs={24} sm={24} md={11} lg={11} xl={11} >
                              <Text className="fs-12 f-reg p-clr d-iblock mb-1">Original flight</Text>
                              {pnr?.originalFlightDetails?.map((data: any, mainIndex: number) => (
                                <Card key={`data-${mainIndex}`} className="cls-flight-card">
                                  {data?.flightDetails?.map((item: any, index: number) => (
                                    index === 0 && (
                                      <Row
                                        justify="space-between"
                                        align="middle"
                                        className="px-2 py-2"
                                      >
                                        <Col xs={6} sm={8} md={6} lg={6} xl={6} className="text-left">
                                          <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                          <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                        </Col>
                                        <Col xs={10} sm={8} md={10} lg={10} xl={10} className="text-center cls-duration-stops">
                                          <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                          <Text className="w-100"> <FdOriginDestination /> </Text>
                                          <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                                        </Col>
                                        <Col xs={6} sm={8} md={6} lg={6} xl={6} className="text-right">
                                          <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                          <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                        </Col>
                                      </Row>
                                    )
                                  ))}
                                </Card>
                              ))}
                            </Col>
                            <Col xs={24} sm={24} md={11} lg={11} xl={11} className="">
                              <Text className="fs-12 f-reg p-clr d-iblock mb-1">Rescheduled flight</Text>
                              <Card className="cls-flightres-card">
                                <Row
                                  justify="space-between"
                                  align="middle"
                                  className="px-2 py-2"
                                >
                                  <Col span={6} className="text-left">
                                    <Text className="cls-dep-time fs-14 f-med d-block">{pnr?.reAccommodatedFlight?.depTime}</Text>
                                    <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(pnr?.reAccommodatedFlight?.departureDate) as string}</Text>
                                  </Col>
                                  <Col span={10} className="text-center cls-duration-stops">
                                    <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                    <Text className="w-100"><FdOriginDestination /></Text>
                                    <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                                  </Col>
                                  <Col span={6} className="text-right">
                                    <Text className="cls-dep-time fs-14 f-med d-block">{pnr?.reAccommodatedFlight?.arrTime}</Text>
                                    <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(pnr?.reAccommodatedFlight?.arrDate) as string}</Text>
                                  </Col>
                                </Row>
                              </Card>
                            </Col>
                          </Row>
                        </Col>
                      </Col>
                    </Row>
                  </Card>
                </Col>
              </Row>
            ))
          ) : (
            <Row className="text-center cls-no-data">
              <Col lg={24}>
                <FdNoDataFound />
              </Col>
              <Col lg={24}>
                <Text className="d-block">No Data Found</Text>
              </Col>
            </Row>
          )}
        </>
      )}
      {activeTab === "2" && (
        <>
        {mappedDetails?.length ? (
          mappedDetails.map((pnr: any, index: number) => (
            <Row className="cls-reaccommodation-modal mb-3" key={index}>
              <Col span={24}>
                <Card className="cls-history-card">
                <Row>
                  <Col span={24} className="cls-timeline-col">
                    <Col span={24} className="fs-13 mt-2">
                      <TableDisplay
                        data={() => prepareReaccommodatedTableData(pnr)}
                        columns={reaccommodationTableColumns}
                        pagination={{ pageSize: 5, position: "bottomRight" }}
                        size="middle"
                      />
                    </Col>
                    <Col span={24} className="mb-4">
                      <Row>
                        <Col span={12} className="pr-2">
                          <Text className="fs-12 f-reg p-clr d-iblock mb-1">Original flight</Text>
                          {pnr?.originalFlightDetails?.map((data: any, mainIndex: number) => (
                            <Card key={`data-${mainIndex}`} className="cls-flight-card">
                              {data?.flightDetails?.map((item: any, index: number) => (
                                index === 0 && (
                                  <Row
                                    justify="space-between"
                                    align="middle"
                                    className="px-2 py-2"
                                  >
                                    <Col span={6} className="text-left">
                                      <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                      <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                    </Col>
                                    <Col span={10} className="text-center cls-duration-stops">
                                      <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                      <Text className="w-100"> <FdOriginDestination /> </Text>
                                      <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                                    </Col>
                                    <Col span={6} className="text-right">
                                      <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                      <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                    </Col>
                                  </Row>
                                )
                              ))}
                            </Card>
                          ))}
                        </Col>
                        <Col span={12} className="pl-2">
                          <Text className="fs-12 f-reg p-clr d-iblock mb-1">Rescheduled flight</Text>
                          <Card className="cls-flightres-card">
                            <Row
                              justify="space-between"
                              align="middle"
                              className="px-2 py-2"
                            >
                              <Col span={6} className="text-left">
                                <Text className="cls-dep-time fs-14 f-med d-block">{pnr?.reAccommodatedFlight?.depTime}</Text>
                                <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(pnr?.reAccommodatedFlight?.departureDate) as string}</Text>
                              </Col>
                              <Col span={10} className="text-center cls-duration-stops">
                                <Text className="cls-stops w-100 fs-11 f-reg d-block cls-grey">0 Stop(s)</Text>
                                <Text className="w-100"><FdOriginDestination /></Text>
                                <Text className="cls-duration w-100 fs-11 f-reg d-block cls-grey">2h 00m</Text>
                              </Col>
                              <Col span={6} className="text-right">
                                <Text className="cls-dep-time fs-14 f-med d-block">{pnr?.reAccommodatedFlight?.arrTime}</Text>
                                <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(pnr?.reAccommodatedFlight?.arrDate) as string}</Text>
                              </Col>
                            </Row>
                          </Card>
                        </Col>
                      </Row>
                    </Col>
                  </Col>
                </Row>
                </Card>
              </Col>
            </Row>
          ))
        ) : (
          <Row className="text-center cls-no-data">
            <Col lg={24}>
              <FdNoDataFound />
            </Col>
            <Col lg={24}>
              <Text className="d-block">No Data Found</Text>
            </Col>
          </Row>
        )}
      </>
      )}
    </Modal>
  );
};

export default ReaccommodationModal;
