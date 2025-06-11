import React, { useEffect, useState } from "react";
import {
  Col,
  Row,
  Button,
  Typography,
  Flex,
  Card,
  Carousel,
  Progress,
  Dropdown,
  Menu,
  Select,
  Tooltip,
} from "antd";
import { ColumnType } from "antd/es/table";
import AdhocDisruptionListSkeleton from "./AdhocDisruptionList.skeleton";
import "./AdhocDisruptionList.scss";
// import { useGetAdhocFlightListMutation } from "../../../services/reschedule/Reschedule";
import { useTranslation } from "react-i18next";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import TableDisplay from "@/components/Table/Table";
import TableTab from "@/components/TableTab/TableTab";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useDispatch } from "react-redux";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import {
  FdAutoReaccommated,
  FdFlightClosePending,
  FdFlightPending,
  FdMenuDots,
  FdPNRPending,
  FdPaxPending,
  FdReassignPNR,
  FdViewPNR,
} from "@/components/Icons/Icons";
import { useToggle } from "@/hooks/Toggle.hook";
import SyncPnrModal from "../PrePlannedDisruption/SyncPnrModal/SyncPnrModal";
import { useAppSelector } from "@/hooks/App.hook";
import { NotificationType, useToaster } from "@/hooks/Toaster.hook";
import { cleanUpMessageApi } from "@/stores/General.store";
import { getDynamicDate } from "@/Utils/general";
import useGetPNRData from "@/hooks/GetPNRData.hook";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { useRedirect } from "@/hooks/Redirect.hook";
import {
  CustomFiltersType,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import dayjs, { Dayjs } from "dayjs";
const Text = Typography.Text;

/**
 * Adhoc disruption list component displays a list of disrupted flights and its details for reaccommodation
 * It allows users to view status of the flights before reaccommodation.
 */
const AdhocDisruptionList: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { redirect } = useRedirect();
  const [tableData, setTableData] = useState<any>([]);

  // interface AdhocTableDataProps {
  //   key: number;
  //   id: number;
  //   flightNumber: string;
  //   reassignedFlightNo: string;
  //   departureDate: any;
  //   PNRCount: number | string;
  //   stdDeparture: string;
  //   etdDeparture: string;
  //   sector: string;
  //   totalPNR: number,
  //   addedPaxCount: number,
  //   reason: string,
  //   status: string;
  // }
  const isResponsive = window.innerWidth < 768;
  const { reloadPnrList } = useAppSelector((state) => state.PnrListReducer);
  const [adhocList, setAdhocList] = useState<any>(); // eslint-disable-next-line
  // const [activeAdhocList, setActiveAdhocList] = useState<any>();
  const [, SsetFlightDetail] = useSessionStorage<any>("flightDetail");
  const { messageApiValue } = useAppSelector((state) => state.GeneralReducer);
  // Sync Adhoc modal states
  const [isModalOpen, toggleModal] = useToggle(false);
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle(false);
  // const [getAdhocFlightListResponse, AdhocFlightListResponse] = useGetAdhocFlightListMutation();
  const [, SsetAdhocFlightPNRs] = useSessionStorage("adhocFlightPNRs");
  const [SFlightQueueOption, SsetFlightQueueOption] =
    useSessionStorage<any>("FlightQueueOption");
  const flightQueue = useGetPNRData("flightQueue");

  useEffect(() => {
    SsetFlightQueueOption(
      SFlightQueueOption ? SFlightQueueOption : "rescheduled"
    );
  }, []);

  useEffect(() => {
    flightQueue?.forEach((flightList: any) => {
      if (SFlightQueueOption === flightList.purposeName) {
        setAdhocList(flightList?.data);
      }
    });
    // eslint-disable-next-line
  }, [reloadPnrList, flightQueue]);

  const { showToaster, toasterContextHolder } = useToaster();

  /* To show notification after reaccommodation */
  useEffect(() => {
    if (messageApiValue?.open) {
      showToaster({
        type: messageApiValue.type as NotificationType,
        title: messageApiValue.title as string,
        description: messageApiValue.description,
      });
      setTimeout(() => dispatch(cleanUpMessageApi()), 3000);
    }
  }, [messageApiValue]);

  const [tabOptions, setTabOptions] = useState<any>();

  useEffect(() => {
    if (adhocList?.length) {
      // setActiveAdhocList(adhocList.map(prepareTableData));
      // prepareTabOptions(adhocList);
      setTableData(adhocList);
    } // eslint-disable-next-line
  }, [adhocList]);
  
  /* Converts adhoc flight list data from API to table data format */
  const prepareTableData = (flight: any) => {
    return {
      disruptionId: flight.disruptionId,
      flightNumber: flight.flightNumber,
      reassignedFlightNo: flight.reassignedFlightNo,
      stdDeparture: flight.stdDeparture,
      etdDeparture: flight.etdDeparture,
      stdArrival: flight.stdArrival,
      etdArrival: flight.etdArrival,
      route: flight.sector,
      origin: flight.origin,
      destination: flight.destination,
      departureDate: flight.departureDate,
      totalPNR: flight.totalPNR,
      pnrLeft: flight.pnrLeft,
      addedPaxCount: flight.addedPaxCount,
      paxLeft: flight.paxLeft,
      reason: flight.reason,
      cause: flight?.cause,
      status: flight?.status,
      pnrs: flight.pnrs,
      autoReaccommodation: flight?.autoReaccommodation,
      divertion: flight?.divertion,
      timeLeft: flight?.timeLeft,
      flightData: flight,
    };
  };

  /* Prepares 'Tab' filter options */
  const prepareTabOptions = (adhocList: any) => {
    const statusSet = new Set<string>(); // Use a Set to store unique values

    adhocList.forEach((policy: any) => statusSet.add(policy.status)); // Add each status to the set

    const options = [
      {
        label: (
          <>
            {t("all")}{" "}
            <Text className="cls-list-count">({adhocList.length})</Text>
          </>
        ),
        value: "all",
      },
      ...Array.from(statusSet).map((status) => ({
        label: (
          <Text
            className={`${status === "Email sent"
                ? "cls-primary-color"
                : status === "Flight change initiated"
                  ? "cls-change"
                  : status === "Flight diverted"
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
              }`}
          >
            {status}{" "}
            <Text className="cls-list-count">
              (
              {
                adhocList.filter((flight: any) => flight.status === status)
                  .length
              }
              )
            </Text>
          </Text>
        ),
        value: status,
      })),
    ];

    setTabOptions(options);
  };

  const initialColumns: ColumnType<any>[] = [
    {
      title: "Disruption ID",
      key: "disruptionId",
      render: (_, { disruptionId }: any) => {
        return (
          <>
            <Text className="responsive">Disruption ID:</Text>
            <Text className="fs-13 f-reg">{disruptionId}</Text>
          </>
        )
      },
    },
    {
      title: t("flight_no"),
      key: "flightNumber",
      render: (_, { flightNumber, flightData }: any) => {
        return (
          <>
            <Text className="responsive">{t("flight_no")}:</Text>
            <Text className="cls-flight-number">
              <Text className={`fs-13 f-reg ${flightData?.cancelled ? "cls-cancelled" : ""}`}>{flightNumber?.toUpperCase()}</Text>
            </Text>
          </>
        );
      },
    },
    {
      title: t("route"),
      key: "route",
      render: (_, { route, flightData }: any) => {
        return (
          <>
            <Text className="responsive">{t("route")}:</Text>
            <Text className={`fs-13 f-reg ${flightData?.diverted ? "cls-cancelled" : ""}`}>{route?.toUpperCase()}</Text>
          </>
        )
      },
    },
    {
      title: t("departure_date"),
      key: "departureDate",
      render: (_, { departureDate }: any) => {
        return (
          <>
            <Text className="responsive">{t("departure_date")}:</Text>
            <Text className="fs-13 f-reg">{getDynamicDate(departureDate) as string}</Text>
          </>
        );
      },
    },
    {
      title: "STD",
      key: "stdDeparture",
      render: (_, { stdDeparture, flightData }: any) => {
        return (
          <>
            <Text className="responsive">STD: </Text>
            <Text className={`fs-13 f-reg ${flightData?.delayed ? "cls-cancelled" : ""}`}>{stdDeparture}</Text>
            
          </>
        );
      },
    },
    {
      title: "STA",
      key: "stdArrival",
      render: (_, { stdArrival, flightData }: any) => {
        return (
          <>
            <Text className="responsive">STA: </Text>
            <Text className={`fs-13 f-reg ${flightData?.delayed ? "cls-cancelled" : ""}`}>{stdArrival}</Text>
          </>
        );
      },
    },
    {
      title: "ETD",
      key: "etdDeparture",
      render: (_, { etdDeparture }: any) => {
        return (
          <>
            <Text className="responsive">ETD: </Text>
            <Text className="fs-13 f-reg">{etdDeparture}</Text>
          </>
        );
      },
    },
    {
      title: "ETA",
      key: "etdArrival",
      render: (_, { etdArrival }: any) => {
        return (
          <>
            <Text className="responsive">ETA: </Text>
            <Text className="fs-13 f-reg">{etdArrival}</Text>
          </>
        );
      },
    },
    {
      title: "Reaccommodated flight",
      key: "reaccommodated_flight",
      render: (_, { reassignedFlightNo }: any) => {
        return (
          <>
            <Text className="responsive">Reaccommodated flight: </Text>
            <Text className="fs-13 f-reg">{reassignedFlightNo?.toUpperCase()}</Text>
          </>
        );
      },
    },
    {
      title: "PNR count",
      key: "totalPNR",
      render: (_, { totalPNR, pnrLeft }: any) => {
        return (
          <>
            <Text className="responsive">{t("pnr_count")}:</Text>
            {totalPNR}
            {pnrLeft !== 0 && (
              <Text
                className="cls-lightgrey f-reg fs-12"
                style={{ color: "#999" }}
              >
                {" (" + pnrLeft + " left)"}
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: "Pax count",
      key: "addedPaxCount",
      render: (_, { addedPaxCount, paxLeft }: any) => {
        return (
          <>
            <Text className="responsive">{t("pax_count")}:</Text>
            {addedPaxCount}
            {paxLeft !== 0 && (
              <Text
                className="cls-lightgrey f-reg fs-12"
                style={{ color: "#999" }}
              >
                {" (" + paxLeft + " left)"}
              </Text>
            )}
          </>
        );
      },
    },
    {
      title: t("policy"),
      key: "policy",
      render: (_, { policy }: any) => {
        return (
          <>
            <Text className="responsive">{t("reassigned")}:</Text>
            <Text className="fs-13 f-reg">{policy}</Text>
          </>
        );
      },
    },
    {
      title: t("reason"),
      key: "reason",
      render: (_, { reason, cause }: any) => {
        return (
          <>
            <Text className="responsive">{t("reason")}:</Text>
            <Text className="fs-13 f-reg">{reason}</Text>
            {/* <Text className="fs-11 f-reg d-block" style={{ color: "#999" }}>
              {cause}
            </Text> */}
          </>
        );
      },
    },
    // {
    //   title: t("status"),
    //   key: "status",
    //   render: (_: any, { status }: any) => {
    //     return (
    //       <Text
    //         type={
    //           (status === "Reaccommodated" && "success") ||
    //           (status === "Flight cancelled" && "danger") ||
    //           undefined
    //         }
    //         className={`f-sbold fs-12 ${status === "Email sent"
    //           ? "cls-primary-color"
    //           : status === "Flight change initiated"
    //             ? "cls-change"
    //             : status === "Flight diverted"
    //               ? "cls-abort"
    //               : status === "Sending notification"
    //                 ? "cls-notification"
    //                 : status === "Awaiting"
    //                   ? "cls-awaiting"
    //                   : ""
    //           }`}
    //       >
    //         {status}
    //       </Text>
    //     );
    //   },
    // },
    {
      title: () => (
        <Flex align="center" justify="space-between" gap={10}>
          {t("status")}
          <CustomTableColumn
            setVisibleColumns={setVisibleColumns}
            initialColumns={initialColumns}
            hideableColumns={["flightNumber", "status"]}
            selected={[
              "disruptionId",
              "route",
              "flightNumber",
              "departureDate",
              "stdDeparture",
              "stdArrival",
              "etdDeparture",
              "etdArrival",
              "reaccommodated_flight",
              "addedPaxCount",
              "totalPNR",
              "reason",
              "status",
            ]}
          />
        </Flex>
      ),
      key: "status",
      render: (
        _: any,
        {
          status,
          timeLeft,
          pnrs,
          flightData
        }: any
      ) => {
        return (
          <>
            <Text className="responsive">{t("status")}:</Text>
            <Flex justify="space-between" className="cls-status">
              <Text className="d-flex align-center fs-13 f-reg">
                <Text className="cls-duration-left"> {timeLeft} </Text>
                <Text
                  style={{
                    color:
                      status === "Fully re-accommodated"
                        ? "#C49FFE"
                        : status === "Partially re-accommodated"
                          ? "#2543D9"
                          : status === "Open"
                            ? "#5EBB1B"
                            : status === "Fully acknowledged"
                              ? "#1A98D3"
                              : status === "Flight reassigned"
                                ? "#3CBD19"
                                : "",
                  }}
                  className="fs-12 f-med"
                >
                  {status}
                </Text>
              </Text>
              <Dropdown
                overlay={
                  <Menu>
                    <Menu.Item
                      key="1"
                      onClick={() => {
                        redirect("adhocPnrList");
                        SsetFlightDetail(flightData);
                        SsetAdhocFlightPNRs(pnrs);
                      }}
                    >
                      {t("view_pnr")}
                    </Menu.Item>
                    <Menu.Item
                      key="2"
                      onClick={() => {
                        SsetFlightDetail(flightData);
                        redirect("reaccommodation");
                      }}
                    >
                      {t("reaccommodation")}
                    </Menu.Item>
                    <Menu.Item key="3" disabled>
                      {t("notify")}
                    </Menu.Item>
                  </Menu>
                }
                trigger={["click"]}
              >
                <Tooltip
                  title={t("actions")}
                >
                  <Button
                    icon={
                      // <Text
                      //   className="Infi-Fd_88_MenuDots"
                      //   style={{ color: "#BBC1D2", width: 15 }}
                      // />
                      <FdMenuDots />
                    }
                    style={{ border: "unset", boxShadow: "unset" }}
                  />
                </Tooltip>
              </Dropdown>
            </Flex>
          </>
        );
      },
    },
  ];

  const [filterTab, setFilterTab] = useState<string>("all");

  const SEARCH_FILTER_FIELDS = ["flightNumber", "sector"];

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title: t("adhoc") + " " + t("disruption_list").toLowerCase(),
    description: t("adhoc_disruption_list_description"),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "adhoc",
        title: t("adhoc") + " " + t("disruption_list").toLowerCase(),
        breadcrumbName: "Disruption list",
        key: "Disruption list",
      },
    ],
  };

  // Custom filter state
  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  /* Custom filter */
  useEffect(() => {
    if (!adhocList?.length) return;

    setCustomFilterProps([
      {
        key: "origin__destination",
        label: "Airport",
        option: { key: "origin__destination", type: "split" },
      },
      {
        key: "departureDate",
        label: "Departure",
        option: { key: "departureDate", type: "date" },
      },
      {
        key: "status",
        label: "Status",
        option: { key: "status", type: "default" },
      },
      {
        key: "sector",
        label: "Sector",
        option: { key: "sector", type: "default" },
      },
      {
        key: "origin",
        label: "Origin",
        option: { key: "origin", type: "default" },
      },
      {
        key: "destination",
        label: "Destination",
        option: { key: "destination", type: "default" },
      },
    ]);
  }, [adhocList]);

  const syncData = (data: any) => {
    SsetFlightQueueOption(data);
  };

  const cardsData: any = [
    {
      status: t("pending"),
      icon: <FdFlightPending />,
      description: t("total_disrupted_flights"),
      descriptionCount: "20",
      pendingCount: "6",
      reason: t("reaccommodation_pending"),
      percent: 30,
    },
    {
      status: t("critical"),
      icon: <FdPNRPending />,
      description: t("total_disrupted_pnrs"),
      descriptionCount: "64",
      pendingCount: "22",
      reason: t("acknowledgement_pending"),
      percent: 32,
    },
    {
      status: t("action_required"),
      icon: <FdPaxPending />,
      description: t("total_passengers"),
      descriptionCount: "540",
      pendingCount: "220",
      reason: t("reaccommodation_pending"),
      percent: 39,
    },
    {
      status: t("closure_required"),
      icon: <FdFlightClosePending />,
      description: t("total_closed_flights"),
      descriptionCount: "2",
      pendingCount: "20",
      reason: t("awaiting_closure"),
      percent: 10,
    }
  ];

  const handleSortChange = (condition: string) => {
    const sortedData = JSON.parse(JSON.stringify(adhocList)).sort(
      (a: any, b: any) => {
        let dateA: any, dateB: any;

        const dynamicDateA = getDynamicDate(a.departureDate);
        const dynamicDateB = getDynamicDate(b.departureDate);

        if (condition === "depTime") {
          if (dynamicDateA && dynamicDateB) {
            dateA = dayjs(dynamicDateA, "MMM DD, YYYY");
            dateB = dayjs(dynamicDateB, "MMM DD, YYYY");

            if (!dateA?.isValid() || !dateB?.isValid()) {
              console.error("Invalid dates:", dynamicDateA, dynamicDateB);
              return 0; // Skip sorting for invalid dates
            }

            return dateA?.isBefore(dateB) ? -1 : 1;
          } else {
            return 0; // Skip sorting if dates are not valid
          }
        }

        if (condition === "paxCount") {
          return a.addedPaxCount - b.addedPaxCount;
        } else if (condition === "reassignPendingPNR") {
          return a.totalPNR - b.totalPNR;
        }

        return 0; // No sorting
      }
    );

    setAdhocList(sortedData);
  };

  return (
    <>
      <Row className="cls-adhocList" data-testid="AdhocDisruptionList">
        <Col lg={24} xs={24}>
          <Row align={"middle"}>
            <Col lg={24} xs={24}>
              <DescriptionHeader data={headerProps} />
            </Col>
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
                  <Text className={`cls-card-span d-block ${index !== 0 ? "pl-3" : ""}`}>
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
          </Row>
          {!adhocList?.length ? (
            <AdhocDisruptionListSkeleton />
          ) : (
            <Card bordered={false}>
              <Row>
                <Col xs={24} sm={24} md={24} lg={24} xl={24} className="mt-1 mb-2">
                  <Row className="rg-10" align="middle">
                    {/* <Col lg={4} xs={24} className="fs-18 f-med cls-grey">
                      {t("reaccommodation_list")}{" "}
                    </Col> */}
                    {/* {!!customFilterProps.length && (
                      <Col span={20}>
                        <CustomFilter
                          tableData={adhocList}
                          filters={customFilterProps}
                          visibleColumns={visibleColumns}
                          setTableData={setTableData}
                          tableDataPreparationHandler={prepareTableData}
                        />
                      </Col>
                    )} */}
                    <Col xs={20} sm={14} md={23} lg={8} xl={6} className="cls-grey fs-13 f-reg">
                      {t("sort_by")} :
                      <Select
                        placeholder={t("select_sorting_option")}
                        onChange={handleSortChange}
                        style={{ width: 180 }}
                        className="pl-1 cls-sort-select"
                        allowClear
                      >
                        <Select.Option value="depTime">{t("travel_date")}</Select.Option>
                        <Select.Option value="paxCount">No. of passengers</Select.Option>
                        <Select.Option value="reassignPendingPNR">No. of PNR</Select.Option>
                      </Select>
                    </Col>
                    {!!customFilterProps.length && (
                      <Col xs={4} sm={10} md={1} lg={8} xl={10} className={`${isResponsive ? "pb-2" : "pl-2"}`}>
                        <PersonalizedFilter
                          tableData={adhocList}
                          filters={customFilterProps}
                          visibleColumns={visibleColumns}
                          setTableData={setTableData}
                          tableDataPreparationHandler={prepareTableData}
                        />
                      </Col>
                    )}
                    <Col xs={24} sm={24} md={24} lg={5} xl={5} className={`${isResponsive ? "pb-2" : "pr-3"}`}>
                      <TableTabSearchFilter
                        data={adhocList}
                        tabDataKey="status"
                        currentTab={filterTab}
                        searchFields={SEARCH_FILTER_FIELDS}
                        tableDataPreparationHandler={prepareTableData}
                        setTableData={setTableData}
                        placeholder={t("search")}
                      />
                    </Col>
                    <Col xs={24} sm={24} md={24} lg={3} xl={3}>
                      <Button
                        className="cls-primary-btn px-1 h-32 w-100"
                        onClick={toggleModal}
                      >
                        {t("sync")} {t("disruptions")}
                      </Button>
                    </Col>
                  </Row>
                </Col>
                {/* <Col lg={24}>
                  <TableTab
                    options={tabOptions}
                    changeHandler={setFilterTab}
                    currentTab={filterTab}
                  />
                </Col> */}
                <Col lg={24}>
                  <TableDisplay
                    data={tableData}
                    columns={visibleColumns}
                    pagination={{ pageSize: 6, position: "bottomRight" }}
                    size="middle"
                  />
                </Col>
              </Row>
            </Card>
          )}
        </Col>
        {toasterContextHolder}
      </Row>
      {/* Sync PNR modal */}
      <SyncPnrModal
        isModalOpen={isModalOpen}
        toggleModal={toggleModal}
        syncData={syncData}
        page="adhoc"
        queueData={flightQueue}
      />
    </>
  );
};

export default AdhocDisruptionList;
