import { JSXElementConstructor, ReactElement, ReactNode, ReactPortal, useEffect, useState } from "react";
import "./Dashboard.scss";
import { ReactI18NextChild, useTranslation } from "react-i18next";
import { formatDate } from "@/Utils/date";
import {
  useGetAttentionDataMutation,
  useGetBarChartDataMutation,
  useGetDashboardAdhocDataMutation,
  useGetDashboardPaxDataMutation,
  useGetLineChartDataMutation,
  useGetNotificationDataMutation,
  useGetTurnAroundTimeDataMutation,
} from "@/services/reschedule/Reschedule";
import {
  LineChart,
  Line,
  CartesianGrid,
  XAxis,
  YAxis,
  BarChart,
  Legend,
  Tooltip,
  Bar,
  ComposedChart,
  Area,
  AreaChart,
} from "recharts";
import {
  Badge,
  Button,
  Card,
  Col,
  Divider,
  Flex,
  Input,
  Progress,
  Row,
  Select,
  Switch,
  Table,
  Typography,
  Tooltip as AntdTooltip
} from "antd";
import { NotificationOutlined, UserOutlined } from "@ant-design/icons";
import type { TableProps } from "antd";
import DashboardSkeleton from "./Dashboard.skeleton";
import { getDynamicDate } from "@/Utils/general";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useResize } from "@/Utils/resize";
import TableDisplay from "@/components/Table/Table";

const Dashboard = () => {
  const { t } = useTranslation(); // Used for translation
  const { Title, Text } = Typography;
  const [currentDateTime, setCurrentDateTime] = useState<string>("");
  const [linechartData, setLineChartData] = useState([]);
  const [bar_chart_data, setBar_chart_data] = useState([]);
  const [dashbaord_pax_data, setDashboard_pax_data] = useState([]);
  const [dashbaord_adhoc_data, setDashboard_adhoc_data] = useState([]);
  const [attentionRowData, setAttentionRow] = useState([]);
  const [turnAroundTimeTableData, setTurnAroundTimeTableData] = useState([]);
  const [notificatio_row_Data, setNotification_row_data] = useState([]);
  const [getBarChartData, BarChartDataResponse] = useGetBarChartDataMutation();
  const [chart_type, setchartType] = useState("line_chart");
  const [turaround_type, setTuraround_type] = useState(true);
  const { redirect } = useRedirect();
  const [getDashboardAdhocData, DashboardAdhocDataResponse] =
    useGetDashboardAdhocDataMutation();
  const [getDashboardPaxData, DashboardPaxDataResponse] =
    useGetDashboardPaxDataMutation();
  const [getLineChartData, LineChartDataResponse] =
    useGetLineChartDataMutation();
  const [getNotificationData, NotificationDataResponse] =
    useGetNotificationDataMutation();
  const [getAttentionData, AttentionDataResponse] =
    useGetAttentionDataMutation();
  const [getTurnAroundTimeData, TurnAroundTimeDataResponse] =
    useGetTurnAroundTimeDataMutation()

  const { isSmallScreen } = useResize(1199);

  useEffect(() => {
    const now = new Date();
    setCurrentDateTime(formatDate(now));
    getAttentionData([]);
    getBarChartData([]);
    getDashboardAdhocData([]);
    getDashboardPaxData([]);
    getLineChartData([]);
    getNotificationData([]);
    getTurnAroundTimeData([]);
    // eslint-disable-next-line
  }, []);

  useEffect(() => {
    if (
      BarChartDataResponse?.isSuccess &&
      (BarChartDataResponse?.data as any).response?.data?.adhoc?.length > 0
    ) {
      setBar_chart_data(
        (BarChartDataResponse?.data as any).response?.data?.adhoc
      );
    }
    if (
      DashboardAdhocDataResponse?.isSuccess &&
      (DashboardAdhocDataResponse?.data as any).response?.data.length > 0
    ) {
      setDashboard_adhoc_data(
        (DashboardAdhocDataResponse?.data as any).response?.data
      );
    }
    if (
      DashboardPaxDataResponse?.isSuccess &&
      (DashboardPaxDataResponse?.data as any).response?.data.length > 0
    ) {
      setDashboard_pax_data(
        (DashboardPaxDataResponse?.data as any).response?.data
      );
    }
    if (
      LineChartDataResponse?.isSuccess &&
      (LineChartDataResponse?.data as any).response?.data.length > 0
    ) {
      setLineChartData((LineChartDataResponse?.data as any).response?.data);
    }
    if (
      NotificationDataResponse?.isSuccess &&
      (NotificationDataResponse?.data as any).response?.data.length > 0
    ) {
      setNotification_row_data(
        (NotificationDataResponse?.data as any).response?.data
      );
    }
    if (
      AttentionDataResponse?.isSuccess &&
      (AttentionDataResponse?.data as any).response?.data?.adhoc.length > 0
    ) {
      setAttentionRow(
        (AttentionDataResponse?.data as any).response?.data?.adhoc
      );
    }
    if (TurnAroundTimeDataResponse?.isSuccess &&
      (TurnAroundTimeDataResponse?.data as any).response?.data?.length > 0
    ) {
      setTurnAroundTimeTableData((TurnAroundTimeDataResponse?.data as any).response?.data)
    }
    // eslint-disable-next-line
  }, [
    BarChartDataResponse?.isSuccess,
    DashboardAdhocDataResponse?.isSuccess,
    DashboardPaxDataResponse?.isSuccess,
    LineChartDataResponse?.isSuccess,
    NotificationDataResponse?.isSuccess,
    AttentionDataResponse?.isSuccess,
    TurnAroundTimeDataResponse?.isSuccess
  ]);
  // eslint-disable-next-line
  const [attention_header_col, setAttention_header_col] = useState([
    "Flight no",
    "Sector",
    "Std departure",
    "Etd departure",
    "PNR",
    "Passengers",
    "Status",
    "Action",
    // t("flight_no"),
    // t("sector"),
    // t("std_departure"),
    // t("etd_departure"),
    // "PNR",
    // t("passengers"),
    // t("status"),
    // t("action"),
  ]);

  const handleBarChart = (e: any) => {
    setBar_chart_data(
      e === "adhoc"
        ? (BarChartDataResponse?.data as any).response?.data?.adhoc
        : (BarChartDataResponse?.data as any).response?.data?.preplanned
    );
  };

  const split_pnr = (pnr: any) => {
    const parts = pnr.split(" ");
    const remaining = parts.slice(1).join(" ");
    return remaining;
  };
  const columns: TableProps<any>["columns"] = [
    {
      title: "Response name",
      dataIndex: "name",
      key: "name",
      className: "f-reg fs-12",
      render: (text: string) => (
        <>
          <Text className="responsive">Response name:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Flight no",
      dataIndex: "flight_no",
      key: "flight_no",
      render: (text: string) => (
        <>
          <Text className="responsive">Flight no:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Schedule received",
      dataIndex: "schedule_received",
      key: "schedule_received",
      render: (text: string) => (
        <>
          <Text className="responsive">Schedule received:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Actioned time",
      key: "actioned_time",
      dataIndex: "actioned_time",
      render: (text: string) => (
        <>
          <Text className="responsive">Actioned time:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Turnaround time",
      key: "turnaround_time",
      dataIndex: "turnaround_time",
      render: (text: string) => (
        <>
          <Text className="responsive">Turnaround time:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
  ];

  const handleChart = (e: any) => {
    setchartType(e);
  };

  const handleTrip = (e: any) => {
    setAttentionRow(
      e === "adhoc"
        ? (AttentionDataResponse?.data as any).response?.data?.adhoc
        : (AttentionDataResponse?.data as any).response?.data?.preplanned
    );
  };

  const handleSwitch = (e: any) => {
    setTuraround_type(e);
  };

  const dataSource = [
    {
      key: '1',
      name: 'Mike',
      age: 32,
      address: '10 Downing Street',
    },
    {
      key: '2',
      name: 'John',
      age: 42,
      address: '10 Downing Street',
    },
  ];

  // const columnsData: any[] = [
  //   {
  //     title: 'Flight no',
  //     dataIndex: 'flightNumber',
  //     key: 'flightNumber',
  //     className: "cls-flightNumber"
  //   },
  //   {
  //     title: 'Sector',
  //     dataIndex: 'sector',
  //     key: 'sector',
  //     className: "cls-sector"

  //   },
  //   {
  //     title: 'Std departure',
  //     dataIndex: 'stdDeparture',
  //     key: 'stdDeparture',
  //     className: "cls-stdDeparture",
  //   },
  //   {
  //     title: 'Etd departure',
  //     dataIndex: 'etdDeparture',
  //     key: 'etdDeparture',
  //     className: "cls-etdDeparture"
  //   },
  //   {
  //     title: 'PNR',
  //     dataIndex: 'pnr',
  //     key: 'pnr',
  //     className: "cls-pnr"

  //   },
  //   {
  //     title: 'Passengers',
  //     dataIndex: 'passenger',
  //     key: 'passenger',
  //     className: "cls-passenger"

  //   },
  //   {
  //     title: 'Status',
  //     dataIndex: 'status',
  //     key: 'status',
  //     className: "cls-status"

  //   },
  //   {
  //     title: 'Action',
  //     dataIndex: 'action',
  //     key: 'action',
  //     className: "cls-action"

  //   },
  //   {
  //     dataIndex: 'duration',
  //     key: 'duration',
  //     className: "cls-duration",
  //     render: (text: string | number | boolean | ReactElement<any, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Iterable<ReactI18NextChild> | null | undefined) => (
  //       <span className="fs-10 cls-duration">
  //         {text}
  //       </span>
  //     ),
  //   },
  // ];

  const columnsData: any[] = [
    {
      title: 'Flight no',
      dataIndex: 'flightNumber',
      key: 'flightNumber',
      className: "cls-flightNumber",
      render: (text: string) => (
        <>
          <Text className="responsive">Flight no:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Sector',
      dataIndex: 'sector',
      key: 'sector',
      className: "cls-sector",
      render: (text: string) => (
        <>
          <Text className="responsive">Sector:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Std departure',
      dataIndex: 'stdDeparture',
      key: 'stdDeparture',
      className: "cls-stdDeparture",
      render: (text: string) => (
        <>
          <Text className="responsive">Std departure:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Etd departure',
      dataIndex: 'etdDeparture',
      key: 'etdDeparture',
      className: "cls-etdDeparture",
      render: (text: string) => (
        <>
          <Text className="responsive">Etd departure:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'PNR',
      dataIndex: 'pnr',
      key: 'pnr',
      className: "cls-pnr",
      render: (text: string) => (
        <>
          <Text className="responsive">PNR:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Passengers',
      dataIndex: 'passenger',
      key: 'passenger',
      className: "cls-passenger",
      render: (text: string) => (
        <>
          <Text className="responsive">Passengers:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      className: "cls-status",
      render: (text: string) => (
        <>
          <Text className="responsive">Status:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      className: "cls-action",
      render: (text: string) => (
        <>
          <Text className="responsive">Action:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      dataIndex: 'duration',
      key: 'duration',
      className: "cls-duration",
      render: (text: string) => (
        <>
          <span className="fs-10 cls-duration">{text}</span>
        </>
      ),
    },
  ];
  
  
  return (
    <div className="cls-FdDashboard" data-testid="dashboard">
      {dashbaord_pax_data.length &&
        dashbaord_adhoc_data.length &&
        attentionRowData.length &&
        notificatio_row_Data.length &&
        linechartData.length &&
        turnAroundTimeTableData?.length &&
        bar_chart_data.length ? (
        <>
          <Row align="middle" justify="space-between" className="rg-5">
            <Col xs={24} sm={14} md={14} lg={14} xl={14}>
              <Flex className="f-med rg-0" wrap="wrap" align="center" gap="10px">
                <Text
                  className={`${isSmallScreen ? "fs-18 mb-1" : "fs-28"} f-sbold`}
                  style={{ color: "var(--ant-color-text-heading)",lineHeight : "normal" }}
                >
                  {t("dashboard")}
                </Text>
                <Text>
                <Text
                  className="fs-12 f-reg cls-refresh-text"
                  style={{ verticalAlign: "middle" }}
                >
                  {t("last_refreshed")} : {currentDateTime}
                </Text>
                <Text
                  className="fs-15 Infi-Fd_79_Refresh cls-refresh-icon"
                  style={{
                    cursor: "pointer",
                    color: "var(--ant-color-text-heading)",
                  }}
                  onClick={() => {
                    window.location.reload();
                  }}
                ></Text>
                </Text>
              </Flex>
            </Col>

            <Col xs={11} sm={10} md={10} lg={9} xl={10} className="cls-sort cls-pnrSearch">
              <Row
                // gutter={[16, 16]}
                justify="end"
                className="cls-flex-flow mt-1 cls-calendar-filter "
              >
                <Col className="d-flex justify-end" xs={15} md={10} sm={11} lg={7} xl={6}>
                  <Select
                    className="fs-12 w-100"
                    defaultValue={t("today")}
                    options={[
                      { value: "today", label: t("today") },
                      { value: "week", label: t("this_week") },
                      { value: "month", label: t("this_month") },
                    ]}
                  />
                </Col>
                {/* <Col xs={24} md={12} sm={12} offset={1}>
                  <Input
                    className="cls-pnrInput"
                    placeholder={`${t("search")} ${t("flight")}`}
                    suffix={<Text className="Infi-Fd_07_Search" />}
                  ></Input>
                </Col> */}
              </Row>
            </Col>
          </Row>
          <Row gutter={[16, 16]} className="cls-row rg-8">
            {dashbaord_pax_data?.map((item: any, index: any) => (
              <Col xs={24} sm={12} md={12} lg={6} xl={6} className="cls-gap">
                <Card className="cls-pax-card">
                  <Row justify="space-between">
                    <Col span={16}>
                      {" "}
                      <Text className="f-sbold">{item?.name}</Text>
                      <Col className="mt-2 cls-affect-btn">
                        <UserOutlined />
                        <Text>
                          {t("affected")}{" "}
                          {item?.name === "Adhoc disruption"
                            ? t("pnr") + t("s")
                            : t("pax").toLowerCase() + t("s")}{" "}
                          {item?.affected_pax}/{item?.total_pax}{" "}
                        </Text>
                      </Col>
                    </Col>
                    <Col span={8}>
                      {" "}
                      <Text className="cls-lightgray fs-18">
                        <span
                          className={`f-sbold fs-30 ${item?.name === "Adhoc disruption"
                            ? "cls-blue"
                            : "cls-green"
                            }`}
                        >
                          {item?.Pending}
                        </span>
                        /{item?.total}
                      </Text>
                      <Col span={24}>
                        {" "}
                        <Text className=" cls-Pendingflights cls-lightgray fs-13">
                          {t("pending")} {item?.type}
                        </Text>
                      </Col>
                    </Col>
                  </Row>
                  <Row>
                    <Col
                      span={24}
                      className={`${item?.name === "Adhoc disruption"
                        ? "cls-Adhoc"
                        : "cls-Pre-planned"
                        }`}
                    >
                      {" "}
                      <Progress percent={45} showInfo={false} />
                    </Col>
                  </Row>
                </Card>
              </Col>
            ))}

            {dashbaord_adhoc_data?.map((item: any, index: any) => (
              <Col xs={24} sm={12} md={12} lg={6} xl={6} className="cls-gap">
                <Card className="cls-adhoc-card">
                  <Row>
                    <Col span={24}>
                      {" "}
                      <Text className="f-sbold" style={{ lineHeight: "18px" }}>
                        {item?.name}
                      </Text>
                    </Col>
                    <Col span={10}>
                      {" "}
                      <Text className="cls-lightgray fs-18">
                        <span className="f-sbold fs-30 cls-blue">
                          {item?.affected_adhoc}
                        </span>
                        /{item?.total_adhoc}
                      </Text>
                      <Col
                        className="cls-lightgray fs-13 cls-Adhoc"
                        style={{ lineHeight: "10px" }}
                      >
                        {t("adhoc")}
                      </Col>
                      <Progress
                        percent={item?.adhoc_progress}
                        showInfo={false}
                      />
                    </Col>
                    <Col span={10} offset={4} className="cls-Pre-planned">
                      {" "}
                      <Text className="cls-lightgray fs-18">
                        <span className="f-sbold fs-30 cls-green">
                          {item?.affected_pre_planned}
                        </span>
                        /{item?.total_pre_planned}
                      </Text>
                      <Col
                        className="cls-lightgray fs-13 "
                        style={{ lineHeight: "10px" }}
                      >
                        {t("pre_planned")}
                      </Col>
                      <Progress
                        percent={item?.pre_planned_progress}
                        showInfo={false}
                      />
                    </Col>
                  </Row>
                  <Row></Row>
                </Card>
              </Col>
            ))}
          </Row>
          <Row className="mb-3" gutter={[16, 16]}>
            <Col
              xs={24}
              md={24}
              lg={24}
              xl={15}
              className="cls-attention-gap cls-attention-col"
            >
              <Card className="cls-tabel-container">
                <Row className="mb-1 rg-5" justify="space-between" align="middle">
                  <Col>
                    <Title
                      level={5}
                      style={{ color: "var(--t-common-primary)" }}
                    >
                      {t("attention_text")} <NotificationOutlined />
                    </Title>
                  </Col>
                  <Col>
                    <Select
                      defaultValue="adhoc"
                      style={{ width: 120 }}
                      className="fs-12 cls-trip-select"
                      onChange={(e) => {
                        handleTrip(e);
                      }}
                      options={[
                        { value: "adhoc", label: t("adhoc") },
                        { value: "Preplanned", label: t("pre_planned") },
                      ]}
                    />
                  </Col>
                </Row>
                {/* <Row className="cls-attention-header mt-2" align="middle">
                  {attention_header_col?.map((item) => (
                    <Col
                      className="fs-12"
                      span={
                        item === "Std departure" ? 4 : item === "Status" ? 2 : 3
                      }
                    >
                      {item}
                    </Col>
                  ))}
                </Row>
                {attentionRowData?.map((item: any, index: any) => (
                  <>
                    <Row className="mt-4 mb-6 cls-attention-row">

                      <Col className="fs-12 cls-bg-arrow f-sbold" span={3}>
                        <Text className="cls-blue">{item?.flightNumber}</Text>
                      </Col>
                      <Col className="fs-12" span={3}>
                        {item?.sector}
                      </Col>
                      <Col className="fs-12" span={4}>
                        {item?.stdDeparture?.split(" ")[1] as string},{" "}
                        {getDynamicDate(item?.stdDeparture?.split(" ")[0]) as string}
                      </Col>
                      <Col className="fs-12" span={3}>
                        {item?.etdDeparture}
                        {item?.nextDayArrival && <Text className="cls-next-day fs-11 f-reg">{item?.nextDayArrival}</Text>}
                      </Col>
                      <Col className="fs-12" span={3}>
                        {item?.pnr.split(" ")[0]}
                        <span className="cls-lightgray">
                          {" "}
                          {split_pnr(item?.pnr) as any}
                        </span>
                      </Col>
                      <Col className="fs-12" span={3}>
                        {item?.passenger.split(" ")[0]}
                        <span className="cls-lightgray">
                          {" "}
                          {split_pnr(item?.passenger) as any}
                        </span>
                      </Col>
                      <Col className="fs-12 cls-green" span={2}>
                        {item?.status}
                      </Col>
                      <Col className="fs-12 cls-blue cls-action" span={3}>
                        <span className="fs-10 cls-duration">
                          {item?.duration}
                        </span>
                        <AntdTooltip
                          title={t("click_reassign")}
                        >
                          <Text 
                            className="cls-cursor-pointer cls-blue cls-action fs-12 f-reg"
                            onClick={() => redirect("adhoc")}
                          >
                            {item?.action}
                          </Text>
                        </AntdTooltip>
                      </Col>
                    </Row>
                  </>
                ))} */}

                <TableDisplay
                  data={attentionRowData.map((data: any) => {
                    if (data?.stdDeparture) {                      
                      const [datePart, timePart] = data?.stdDeparture.split(" ");            
                      return {
                        ...data,
                        stdDeparture: timePart + ' ' + getDynamicDate(datePart as string),
                      };
                    }
                    return data
                  })}
                  scroll={{x : 100}}
                  columns={columnsData}
                />

              </Card>
            </Col>
            <Col xs={24} md={24} lg={24} xl={9} className="cls-gap ">
              <Card className="cls-attention-gap">
                <Row>
                  <Col span={23}>
                    <Title
                      level={5}
                      style={{ color: "var(--t-common-primary)" }}
                    >
                      {t("alerts")}
                    </Title>
                  </Col>
                </Row>
                <Row className="cls-notification-header mt-1 mb-1">
                  <Col className=" fs-12" span={4}>
                    {t("flight_no")}
                  </Col>
                  <Col className=" fs-12" span={4} offset={1}>
                    {t("message")}
                  </Col>
                </Row>
                {notificatio_row_Data?.map((item: any, index: any) => (
                  <>
                    <Row className=" cls-notification-row">
                      <Col className="fs-12  f-sbold" xs={9} sm={5} md={5} lg={5} xl={5}>
                        <Badge
                          color={
                            item?.badge_color === "#F82828"
                              ? "var(--ant-color-error-active)"
                              : item?.badge_color === "#F5AE24"
                                ? "var(--ant-color-warning-text)"
                                : item?.badge_color === "#63C834"
                                  ? "var(--ant-color-success-text)"
                                  : "var(--t-common-primary)"
                          }
                          text={item?.flightNumber}
                        />
                      </Col>
                      <Col className="fs-10"  xs={8} sm={4} md={4} lg={4} xl={4} >
                        <span className="cls-notification-msg">
                          {" "}
                          {item?.message}
                        </span>
                      </Col>
                      <Col className="fs-12"  xs={24} sm={15} md={15} lg={15} xl={15} >
                        {item?.message_description}
                      </Col>
                      <Col className="fs-12" xs={0} sm={9} md={9} lg={9} xl={9} ></Col>
                      <Col className="fs-12 f-reg pb-1 cls-grey" xs={24} sm={15} md={15} lg={15} xl={15}>
                        {item?.time.split(" ")[1] as string},{" "}
                        {getDynamicDate(item?.time.split(" ")[0]) as string}
                      </Col>
                    </Row>
                    {notificatio_row_Data.length !== index + 1 &&
                      <Divider style={{ marginBlock: "0px 5px" }} />
                    }
                  </>
                ))}
              </Card>
            </Col>
          </Row>
          <Row gutter={[16, 16]}>
            <Col
              xs={24}
              lg={15}
              md={15}
              span={15}
              className={`cls-chart-gap cls-chart-col ${!turaround_type ? "cls-scroll-list" : ""}`}
            >
              <Card>
                <Row className="cg-10">
                  <Col xs={24} sm={14} md={11} lg={14} xl={16}>
                    <Title
                      level={5}
                      style={{ color: "var(--t-common-primary)" }}
                    >
                      {t("turnaround_time")}
                    </Title>
                  </Col>
                  <Col xs={12} sm={4} md={5} lg={4} xl={3} className="a-self-center">
                    <span
                      className="mr-2 fs-12"
                      style={{ color: "var(--t-common-grey-color-md)" }}
                    >
                      {turaround_type ? "Chart" : "Table"}
                    </span>

                    <Switch
                      defaultChecked
                      onChange={(e) => {
                        handleSwitch(e);
                      }}
                    />
                  </Col>
                  {turaround_type ? (
                    <Col xs={4} sm={4} md={4} lg={4} xl={4} className="cls-sort">
                      <Select
                        defaultValue="line_chart"
                        style={{ width: 120 }}
                        className="fs-12"
                        onChange={(e) => {
                          handleChart(e);
                        }}
                        options={[
                          { value: "line_chart", label: t("line_chart") },
                          {
                            value: "composed_chart",
                            label: t("composed_chart"),
                          },
                          { value: "area_chart", label: t("area_chart") },
                        ]}
                      />
                    </Col>
                  ) : (
                    ""
                  )}
                </Row>
                <Row className="cls-chart-header mt-2">
                  <Col span={24} className="cls-turnaround-table">
                    {!turaround_type ? (
                      <TableDisplay
                        columns={columns}
                        data={turnAroundTimeTableData}
                       
                      />
                    ) : chart_type && chart_type === "line_chart" ? (
                      <LineChart width={700} height={300} data={linechartData}>
                        <Line type="monotone" dataKey="pv" stroke="#FFA84A" />
                        <CartesianGrid stroke="#ccc" />
                        <XAxis dataKey="name" />
                        <YAxis />
                      </LineChart>
                    ) : chart_type && chart_type === "composed_chart" ? (
                      <ComposedChart
                        width={700}
                        height={300}
                        data={linechartData}
                      >
                        <XAxis dataKey="name" />
                        <YAxis />
                        <Tooltip />
                        <Legend />
                        <CartesianGrid stroke="#f5f5f5" />
                        <Area
                          type="monotone"
                          dataKey="amt"
                          fill="#8884d8"
                          stroke="#8884d8"
                        />
                        <Bar dataKey="pv" barSize={20} fill="#413ea0" />
                        <Line type="monotone" dataKey="uv" stroke="#ff7300" />
                      </ComposedChart>
                    ) : chart_type && chart_type === "area_chart" ? (
                      <AreaChart
                        width={700}
                        height={300}
                        data={linechartData}
                        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
                      >
                        <defs>
                          <linearGradient
                            id="colorUv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#8884d8"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#8884d8"
                              stopOpacity={0}
                            />
                          </linearGradient>
                          <linearGradient
                            id="colorPv"
                            x1="0"
                            y1="0"
                            x2="0"
                            y2="1"
                          >
                            <stop
                              offset="5%"
                              stopColor="#82ca9d"
                              stopOpacity={0.8}
                            />
                            <stop
                              offset="95%"
                              stopColor="#82ca9d"
                              stopOpacity={0}
                            />
                          </linearGradient>
                        </defs>
                        <XAxis dataKey="name" />
                        <YAxis />
                        <CartesianGrid strokeDasharray="3 3" />
                        <Tooltip />
                        <Area
                          type="monotone"
                          dataKey="uv"
                          stroke="#8884d8"
                          fillOpacity={1}
                          fill="url(#colorUv)"
                        />
                        <Area
                          type="monotone"
                          dataKey="pv"
                          stroke="#82ca9d"
                          fillOpacity={1}
                          fill="url(#colorPv)"
                        />
                      </AreaChart>
                    ) : (
                      ""
                    )}
                  </Col>
                </Row>
              </Card>
            </Col>
            <Col xs={24} lg={9} md={9} className="cls-gap ">
              <Card className="cls-customer-chart-gap">
                <Row className="rg-10">
                  <Col xs={24} sm={10} md={14} lg={15} xl={14}>
                    <Title
                      level={5}
                      style={{ color: "var(--t-common-primary)" }}
                    >
                      {" "}
                      {t("customer_response")}
                    </Title>
                  </Col>
                  <Col xs={4} sm={14} md={5} lg={9} xl={10} className="cls-sort text-right">
                    <Select
                      className="fs-12 text-left"
                      defaultValue="adhoc"
                      style={{ width: 115 }}
                      options={[
                        { value: "adhoc", label: t("adhoc") },
                        { value: "prePlanned", label: t("pre_planned") },
                      ]}
                      onChange={(e) => {
                        handleBarChart(e);
                      }}
                    />
                  </Col>
                </Row>
                <Row className=" mt-4 mb-1">
                  <Col span={24}>
                    <BarChart width={405} height={300} data={bar_chart_data}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="Accept" fill="#35B057" />
                      <Bar dataKey="Modify" fill="#4375EB" />
                      <Bar dataKey="Decline" fill="#FF274E" />
                      <Bar dataKey="Pending" fill="#FFAA2B" />
                    </BarChart>
                  </Col>
                </Row>
              </Card>
            </Col>
          </Row>
        </>
      ) : (
        <DashboardSkeleton />
      )}
    </div>
  );
};

export default Dashboard;