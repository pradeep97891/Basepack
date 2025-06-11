import {
  Button,
  Card,
  Checkbox,
  Col,
  Collapse,
  Divider,
  Flex,
  Form,
  Input,
  Modal,
  Popconfirm,
  Radio,
  Row,
  Select,
  Skeleton,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import "./Reaccommodation.scss";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useGetAvailableFlightMutation } from "@/services/reschedule/Reschedule";
import { ColumnType } from "antd/es/table";
import { useEffect, useRef, useState } from "react";
import TableDisplay from "@/components/Table/Table";
import {
  FdFlightSeatIcon,
  FdNoDataFound,
  FdOriginDestination
} from "@/components/Icons/Icons";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import UseInputValidation from "@/hooks/Validations.hook";
import ReaccommodationFlightSkeleton from "./Reaccommodation.skeleton";
import ConfirmModalPopup, {
  ConfirmModalPopupProps,
} from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import { useRedirect } from "@/hooks/Redirect.hook";
import type { SelectProps } from "antd";
import useGetPNRData from "@/hooks/GetPNRData.hook";
import { useGetScoreListMutation } from "@/services/reschedule/Reschedule";
import { getDynamicDate } from "@/Utils/general";
import PassengerDetails from "../ReviewFlight/PassengerDetails/PassengerDetails";
import PnrHistory from "../PnrHistory/PnrHistory";
import { useToggle } from "@/hooks/Toggle.hook";
import ReaccommodationModal from "@/pages/Auth/Reaccommodation/ReaccommodationModal/ReaccommodationModal";
import PersonalizedFilter, { CustomFiltersType } from "@/components/PersonalizedFilter/PersonalizedFilter";
import AdhocPnrList from "@/components/AdhocPNRList/AdhocPNRList";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { formatDate } from "@/Utils/date";
import ReaccommodationFilter from "@/pages/Auth/Reaccommodation/ReaccommodationFilter/ReaccommodationFilter";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import PrePlannedDisruptedPNRList from "../PrePlannedDisruption/PrePlannedDisruptedPNRList/PrePlannedDisruptedPNRList";
import { useResize } from "@/Utils/resize";

var localData = [
  { value: "New York City (JFK)" },
  { value: "Chennai (MAA)" },
  { value: "Delhi (DEL)" },
  { value: "Bengaluru (BLR)" },
  { value: "Kolkata (CCU)" },
  { value: "Mumbai (BOM)" },
  { value: "Hyderabad (HYD)" },
  { value: "Guwahati (GAU)" },
  { value: "Bangkok (BKK)" },
  { value: "London (LHR)" },
  { value: "Kuwait (KWI)" },
  { value: "Tokyo (NRT)" },
  { value: "Changi (SIN)" },
  { value: "Abu dhabi (AUH)" },
  { value: "Qatar (DOH)" },
];

/**
 * Reaccomodation component displays PNR(s), available flights to re-assign.
 * It allows users to reaccommodate PNR(s) to new flight.
 */
const Reaccommodation: React.FC = () => {
  /* General states */
  const { t } = useTranslation();
  const { Text } = Typography;
  dayjs.locale("en");
  dayjs.extend(customParseFormat);
  const dateFormat = "MMM DD, YYYY";
  const { redirect, isCurrentPathEqual } = useRedirect();
  const [messageApi, contextHolder] = message.useMessage();

  /* Storage states */
  const [SreaccommodateFlightDetails] = useSessionStorage<any>("flightDetail");
  const [getAvailableFlightService] = useGetAvailableFlightMutation();
  /* Component states */
  const [flightPnrs, setFlightPnrs] = useState<any>([]);
  const [availableFlights, setAvailableFlights] = useState<any>([]);
  const [allAvailableFlights, setAllAvailableFlights] = useState<any>([]);
  const [tableData, setTableData] = useState<any>([]);
  const [isFormValid, setIsFormValid] = useState(false);
  const [selectedPnrs, setSelectedPnrs] = useState<any[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<any>(null);
  const [reaccommodatedDetails, setReaccommodatedDetails] = useState<any>([]);
  // const [mappedDetails, setMappedDetails] = useState<any>([]);
  const [reaccommodatedFlightSeatDetails, setReaccommodatedFlightSeatDetails] =
    useState<any>([]);
  const [isContactFormLoading, setIsContactFormLoading] =
    useState<boolean>(false);
  const [seatsSelected, setSeatsSelected] = useState<number>(0);
  const [openContactPopConfirmId, setOpenContactPopConfirmId] = useState<
    number | null
  >(null);
  const [availableFlightSector, setAvailableFlightSector] = useState<any>();
  const [partnerFlightShow, setPartnerFlightShow] = useState(false);
  const [btnEnable, setBtnEnable] = useState<any>(false);
  const [collapseOpen, setCollapseOpen] = useState<any>([]);
  const [scoreListService, scoreListResponse] = useGetScoreListMutation();
  const [tableFightData, setTableFlightData] = useState<any>([]);
  const [tablePNRData, setTablePNRData] = useState<any>([]);
  const [tablePNRListData, setTablePNRListData] = useState<any>([]);
  const [tablePNRDataIndex, setTablePNRDataIndex] = useState<number>(0);
  const [scoreList, setScoreList] = useState<any>();
  const [clusterData, setClusterData] = useState<any>();
  const [clusterIndex, setClusterIndex] = useState<any>();
  const [contactForm] = Form.useForm();
  const [baseDate, setBaseDate] = useState<dayjs.Dayjs | null>(null);
  const dayAfterBaseDate = baseDate?.add(1, "day");
  const twoDaysAfterBaseDate = baseDate?.add(2, "day");
  const pnrList = useGetPNRData("pnr");
  const [showHeader, setShowHeader] = useState(false);
  const [showModalFooter, setShowModalFooter] = useState(false);
  const [activeModalTab, setActiveModalTab] = useState("1");
  const [loading, setLoading] = useState(false);
  const [allCheck, setAllCheck] = useState(false);

  /* Available flight's departure date value to set through out the page */
  let staticDate = SreaccommodateFlightDetails?.departureDate ? getDynamicDate(SreaccommodateFlightDetails?.departureDate) : "";
  const [staticDepartureDate, setStaticDepartureDate] = useState<any>(staticDate);

  /* Auto reaccommodation states */
  const isAutoReaccommodation = !!SreaccommodateFlightDetails?.autoReaccommodation;
  const autoReaccommodated = useRef(false);
  const { isSmallScreen } = useResize();
  const { isMediumScreen } = useResize();


  
  /* Temp auto reaccommodation logic */
  useEffect(() => {
    if (
      autoReaccommodated.current ||
      !isAutoReaccommodation ||
      !flightPnrs?.length ||
      !availableFlights?.length
    )
      return;

    setSelectedPnrs(flightPnrs);
    /* Find the appropriate flight to auto reaccommodate */
    const flight = availableFlights.find(
      (f: any) => f.seatLeft > seatsSelected
    );

    setSelectedFlight(flight);
    // selectAvailableFlightHandler(flight)
    reaccommodateHandler(flight, flightPnrs);

    autoReaccommodated.current = true;
  }, [isAutoReaccommodation, flightPnrs, availableFlights]);

  /* Confirm modal popup data */
  const [popupData, setPopupData] = useState<ConfirmModalPopupProps["props"]>({
    modalName: "reset",
    page: "reaccommodation",
    header: t("sure?"),
    description: "",
    modalToggle: false,
    modalClass: "",
    modalWidth: 540,
    primaryBtn: { text: t("cancel"), value: false },
    secondaryBtn: { text: t("sure"), value: true },
    type: "default",
  });

  useEffect(() => {
    scoreListService([]);
    setClusterData(SreaccommodateFlightDetails?.pnrs);
    setClusterIndex(0);
  }, []);

  useEffect(() => {
    if (scoreListResponse?.isSuccess) {
      setScoreList((scoreListResponse?.data as any)?.response?.data);
    }
  }, [scoreListResponse?.isSuccess]);

  /* Retrieve flight details from session & get all its PNRs */
  useEffect(() => {
    if (
      SreaccommodateFlightDetails &&
      Object.keys(SreaccommodateFlightDetails)?.length
    ) {
      /* Get available flights */
      getAvailableFlightService([]).then((response: any) => {
        /* Update queue PNRs and close import modal on successful response */
        if (response?.data?.responseCode === 0) {
          setAllAvailableFlights(response.data?.response?.data);
          setAvailableFlights(() => {
            let flightData = [...response.data?.response?.data[0].data];
            return flightData.sort(
              (a: any, b: any) => b.scoreRating - a.scoreRating
            );
          });
        }
      });
      setBaseDate(
        dayjs(getDynamicDate(SreaccommodateFlightDetails?.departureDate), dateFormat)
      );
      setTableData(prepareTableData);
    }
  }, [pnrList]);

  /* Count selected seats from selected PNR(s) */
  useEffect(() => {
    setSeatsSelected(
      selectedPnrs?.reduce(
        (totalSeat: string | number, pnr: any) =>
          totalSeat + pnr?.totalPaxCount,
        0
      )
    );
    const hasMatchingPnr = flightPnrs?.some((pnr: any) =>
      selectedPnrs?.some((selectedPnr: any) => pnr?.PNR === selectedPnr?.PNR)
    );
    setAllCheck((selectedPnrs.length === flightPnrs?.length) && hasMatchingPnr ? true : false);
  }, [selectedPnrs]);

  // Define header props for the itinerary
  let headerProps: ItineraryHeaderProps["data"] = {
    title: !isCurrentPathEqual("adhocPnrList") ? t("reaccommodation_flight") : "Disruption flight details",
    description: t("reaccommodate_flight_description"),
    breadcrumbProps: [
      {
        path: "/adhoc",
        title: t("adhoc") + " " + t("disruption_list").toLowerCase(),
        breadcrumbName: "Adhoc Disruption list",
        key: "Disruption list"
      },
      {
        path: isCurrentPathEqual("adhocPnrList")
          ? "/adhocPnrList"
          : "/reaccommodation",
        title:
          isCurrentPathEqual("adhocPnrList")
            ? "PNR details list"
            : t("reaccommodation"),
        breadcrumbName: isCurrentPathEqual("adhocPnrList")
          ? "Adhoc PNR disruption list"
          : "Re-accommodation",
        key: "Reaccommodation"
      },
    ],
  };

  /* Converts flight data from session to table data format */
  const prepareTableData = () => {
    const status = SreaccommodateFlightDetails?.status;
    return [
      {
        dId: SreaccommodateFlightDetails?.disruptionId,
        flightNumber: SreaccommodateFlightDetails?.flightNumber,
        reassignedFlightNo: SreaccommodateFlightDetails?.reassignedFlightNo,
        stdDeparture: SreaccommodateFlightDetails?.stdDeparture,
        etdDeparture: SreaccommodateFlightDetails?.etdDeparture,
        stdArrival: SreaccommodateFlightDetails?.stdArrival,
        etdArrival: SreaccommodateFlightDetails?.etdArrival,
        route: SreaccommodateFlightDetails?.sector,
        departureDate: SreaccommodateFlightDetails?.departureDate ? getDynamicDate(SreaccommodateFlightDetails?.departureDate) : "",
        totalPNR: SreaccommodateFlightDetails?.totalPNR || 0,
        policy: SreaccommodateFlightDetails?.autoReaccommodation?.policy,
        autoReassignPolicy: "test",
        addedPaxCount: SreaccommodateFlightDetails?.addedPaxCount,
        reason: SreaccommodateFlightDetails?.reason,
        status: (
          <Text
            className={`${status === "Open"
              ? "cls-reaccommodate"
              : status === ""
                ? "cls-change"
                : status === "Diverted"
                  ? "cls-abort"
                  : status === "Sending notification"
                    ? "cls-notification"
                    : status === "Awaiting"
                      ? "cls-awaiting"
                      : status === "Reaccommodated"
                        ? "cls-primary-color"
                        : status === "Flight cancelled"
                          ? "cls-cancelled"
                          : ""
              } fs-12 f-med`}
          >
            {SreaccommodateFlightDetails?.status}
          </Text>
        ),
      },
    ];
  };

  /* Table column data */
  const columns: ColumnType<any>[] = [
    {
      title: "Disrupted ID",
      dataIndex: "dId",
      key: "dId",
      render: (text: string) => (
        <>
          <Text className="responsive">Response name:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Flight number",
      dataIndex: "flightNumber",
      key: "flight_number",
      render: (text: string) => (
        <>
          <Text className="responsive">Flight number:</Text>
          <Text className="">{text?.toUpperCase()}</Text>
        </>
      ),
    },
    {
      title: "Route",
      dataIndex: "route",
      key: "route",
      render: (text: string) => (
        <>
          <Text className="responsive">Route:</Text>
          <Text className="">{text?.toUpperCase()}</Text>
        </>
      ),
    },
    {
      title: t("departure_date"),
      dataIndex: "departureDate",
      key: "departure_date",
      render: (text: string) => (
        <>
          <Text className="responsive">Departure date:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "STD",
      dataIndex: "stdDeparture",
      key: "stdDeparture",
      render: (text: string) => (
        <>
          <Text className="responsive">STD:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "STA",
      dataIndex: "stdArrival",
      key: "stdArrival",
      render: (text: string) => (
        <>
          <Text className="responsive">STA:</Text>
          <Text className="cls-cancelled">{text}</Text>
        </>
      ),
    },
    {
      title: "ETD",
      dataIndex: "etdDeparture",
      key: "etdDeparture",
      render: (text: string) => (
        <>
          <Text className="responsive">ETD:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "ETA",
      dataIndex: "etdArrival",
      key: "etdArrival",
      render: (text: string) => (
        <>
          <Text className="responsive">ETA:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Re-accommodated flight",
      dataIndex: "reassignedFlightNo",
      key: "reassignedFlightNo",
      render: (text: string) => (
        <>
          <Text className="responsive">Re-accommodated flight:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "PNR count",
      dataIndex: "totalPNR",
      key: "pnr_count",
      render: (text: string) => (
        <>
          <Text className="responsive">PNR count:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: "Pax count",
      dataIndex: "addedPaxCount",
      key: "pax_count",
      render: (text: string) => (
        <>
          <Text className="responsive">Pax count:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    {
      title: t("reason"),
      dataIndex: "reason",
      key: "reason",
      render: (text: string) => (
        <>
          <Text className="responsive">Reason:</Text>
          <Text className="">{text}</Text>
        </>
      ),
    },
    // {
    //   title: t("policy"),
    //   dataIndex: "policy",
    //   key: "policy",
    //   render: (_: any, { policy }: any) => {
    //     return policy ? (
    //       <Text type="warning" className="f-bold" style={{ textTransform: "uppercase" }}>
    //         {policy}
    //       </Text>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    // {
    //   title: "Auto reassign policy",
    //   dataIndex: "autoReassignPolicy",
    //   key: "autoReassignPolicy",
    //   render: (_: any, { autoReassignPolicy }: any) => {
    //     return autoReassignPolicy ? (
    //       <Text type="warning" className="f-bold" style={{ textTransform: "uppercase" }}>
    //         {autoReassignPolicy}
    //       </Text>
    //     ) : (
    //       "-"
    //     );
    //   },
    // },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (_: any, { status }: any) => {
        return <>
          <Text className="responsive">Status:</Text>
          <Text
            type={(status === "Reaccommodated" && "success") ||
              (status === "Flight Cancelled" && "danger") ||
              undefined}
            className={`f-sbold fs-12 ${status === "Email sent"
              ? "cls-primary-color"
              : status === "Flight change initiated"
                ? "cls-change"
                : status === "Diverted"
                  ? "cls-abort"
                  : status === "Sending notification"
                    ? "cls-notification"
                    : status === "Awaiting"
                      ? "cls-awaiting"
                      : ""}`}
          >
            {status}
          </Text>
        </>;
      },
    },
  ];

  // Table columns
  const PNRcolumns = [
    {
      title: "",
      dataIndex: "pnrLevel",
      key: "pnrLevel",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === 0) {
          return {
            children: <Text strong>{text}</Text>,
            props: { rowSpan: 4 },
          };
        } else if (index === 1 || index === 2 || index === 3) {
          return {
            props: { colSpan: 0 },
          };
        } else if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: (
              <Text className="d-block w-100 text-center" strong>
                {text}
              </Text>
            ),
            props: { colSpan: 5 },
          };
        }
        return {
          children: (
            <Text strong className="fs-12">
              {text}
            </Text>
          ),
        };
      },
    },
    {
      title: "PNR TYPE",
      dataIndex: "pnrType",
      key: "pnrType",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return <Text className="fs-12 f-reg"> {text} </Text>;
      },
    },
    {
      title: "Weightage",
      dataIndex: "weightage",
      key: "weightage",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Total Score",
      dataIndex: "totalScore",
      key: "totalScore",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tablePNRData[tablePNRDataIndex]?.length - 1) {
          return {
            children: (
              <Text className="fs-12 f-reg text-center d-block" strong>
                {text}
              </Text>
            ),
            props: {
              colSpan: 5,
            },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
  ];

  // Table columns
  const FlightColumns = [
    {
      title: "",
      dataIndex: "flightLevel",
      key: "flightLevel",
      width: "max-content",
      render: (text: any, record: any, index: any) => {
        if (index === 0) {
          return {
            children: <Text strong>{text}</Text>,
            props: { rowSpan: 6 },
          };
        } else if (index === tableFightData[0]?.length - 1) {
          return {
            children: (
              <Text className="d-block w-100 text-center" strong>
                {text}
              </Text>
            ),
            props: { colSpan: 5 },
          };
        }
        return {
          children: null,
          props: { rowSpan: 0 },
        };
      },
    },
    {
      title: "FLIGHT TYPE",
      dataIndex: "flightType",
      key: "flightType",
      width: "max-content",
      render: (text: any, record: any, index: any) => {
        if (index === tableFightData[0]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return <Text className="fs-12 f-reg"> {text} </Text>;
      },
    },
    {
      title: "Weightage",
      dataIndex: "weightage",
      key: "weightage",
      width: "max-content",
      render: (text: any, record: any, index: any) => {
        if (index === tableFightData[0]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Value",
      dataIndex: "value",
      key: "value",
      width: "max-content",
      render: (text: any, record: any, index: any) => {
        if (index === tableFightData[0]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Score",
      dataIndex: "score",
      key: "score",
      width: "max-content",
      render: (text: any, record: any, index: any) => {
        if (index === tableFightData[0]?.length - 1) {
          return {
            children: null,
            props: { colSpan: 0 },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
    {
      title: "Total Score",
      dataIndex: "totalScore",
      key: "totalScore",
      width: "max-content",
      render: (text: any, record: any, index: number) => {
        if (index === tableFightData[0]?.length - 1) {
          return {
            children: (
              <Text className="fs-12 f-reg text-center d-block" strong>
                {" "}
                {text}{" "}
              </Text>
            ),
            props: {
              colSpan: 5,
            },
          };
        }
        return (
          <Text className="fs-12 f-reg text-center d-block"> {text} </Text>
        );
      },
    },
  ];

  // const preparePnrListTableData = (pnr: any) => {
  //   let pnrData = pnr;
  //   return [
  //     {
  //       PNR: pnrData?.PNR,
  //       flightNumber: pnrData?.flightNumber,
  //       reassignedFlightNo: pnrData?.reassignedFlightNo,
  //       reassignedDepartureDate: formatDate(getDynamicDate(pnrData?.reassignedDepartureDate) as string),
  //       stdDeparture: pnrData?.stdDeparture,
  //       etdDeparture: pnrData?.etdDeparture,
  //       route: pnrData?.sector,
  //       reassignedRoute: pnrData?.reassignedSector,
  //       departureDate: pnrData?.departureDate ? formatDate(getDynamicDate(pnrData?.departureDate) as string) : "",
  //       remainingPax: pnrData?.remainingPax,
  //       totalPNR: flightPnrs?.length || 0,
  //       policy: pnrData?.autoReaccommodation?.policy,
  //       notificationStatus: pnrData?.notificationStatus,
  //       remarks: pnrData?.remarks,
  //       autoReassignPolicy: "test",
  //       // addedPaxCount: SreaccommodateFlightDetails?.addedPaxCount,
  //       status: (
  //         <Text
  //           className={`fs-14 f-med 
  //             ${pnrData?.status === "Open"
  //               ? "cls-reaccommodate"
  //               : pnrData?.status === "Partially closed"
  //                 ? "cls-abort"
  //                 : undefined
  //             }`}
  //         >
  //           {pnrData?.status}
  //         </Text>
  //       ),
  //     },
  //   ];
  // };

  useEffect(() => {
    if (clusterIndex !== undefined) {
      setSortFlightSelectValue(undefined);
      setSortPNRSelectValue(undefined);
      setAllCheck(false);
      setTablePNRListData(clusterData?.[clusterIndex]?.pnrs)
      // const tempArr = clusterData[clusterIndex]?.pnrs.map((pnrData: any) => preparePnrListTableData(pnrData));
      // setTablePNRListData(tempArr)
      setAvailableFlightSector(
        SreaccommodateFlightDetails?.diverted
          ? SreaccommodateFlightDetails?.divertion?.to + "-" + clusterData?.[clusterIndex]?.segment?.split("-")[1]
          : clusterData?.[clusterIndex]?.segment
      );
      setAvailableFlights((prevAvailableFlights: any) =>
        shuffleArray([...prevAvailableFlights])
      );
    }
  }, [clusterIndex]);


  /* Table column data */
  const pnrListColumns: ColumnType<any>[] = [
    {
      title: "PNR No",
      dataIndex: "PNR",
      key: "PNR",
      render: (pnr) => {
        return <Text className="f-medium fs-13">{pnr}</Text>;
      },
    },
    {
      title: "PNR status",
      dataIndex: "status",
      key: "status"
    },
    {
      title: "Remaining pax count",
      dataIndex: "remainingPax",
      key: "remainingPax",
      render: (remainingPax) => {
        return <Text className="f-reg fs-13">
          {remainingPax}
          <Text className="pl-1 fs-11 f-reg">Pax remaining</Text>
        </Text>;
      },
    },
    {
      title: "Original details",
      dataIndex: "originalDetails",
      key: "originalDetails",
      render: (originalDetails, data) => {
        return (
          <>
            <Text className="fs-13 f-reg d-block cls-dark-grey">{data?.route?.toUpperCase()} {" | "} {data?.flightNumber} </Text>
            <Text className="fs-13 f-reg d-block cls-dark-grey">{data?.departureDate} </Text>
          </>
        )
      },
    },
    {
      title: "New flight details",
      dataIndex: "newFlightDetails",
      key: "newFlightDetails",
      render: (newFlightDetails, { reassignedRoute, reassignedFlightNo, reassignedDepartureDate }: any) => {
        return (
          <>
            <Text className="fs-13 f-reg d-block cls-dark-grey">{reassignedRoute?.toUpperCase()} {" | "} {reassignedFlightNo} </Text>
            <Text className="fs-13 f-reg d-block cls-dark-grey">{reassignedDepartureDate} </Text>
          </>
        )
      },
    },
    {
      title: "Notification status",
      dataIndex: "notificationStatus",
      key: "notificationStatus",
    },
    {
      title: () => (
        <Flex align="center" justify="space-between" gap={10}>
          Remarks
          <CustomTableColumn
            setVisibleColumns={setVisibleColumns}
            initialColumns={pnrListColumns}
            hideableColumns={[]}
            selected={[
              "pnr",
              "status",
              "remainingPax",
              "originalDetails",
              "newFlightDetails",
              "notificationStatus",
              "remarks",
            ]}
          />
        </Flex>
      ),
      dataIndex: "remarks",
      key: "remarks",
      render: (_: any, { remarks }: any) => (
        <Text className="fs-13 f-reg">{remarks}</Text>
      ),
    },
  ];

  const [visibleColumns, setVisibleColumns] = useState(pnrListColumns);

  /* Method to handle operations on selecting a flight PNRflightData */
  const selectPnrHandler = (pnr: any) => {
    if (pnr?.pnrCheck) {
      const data = {
        ...popupData,
        modalName: "confirm",
        modalToggle: true,
        header: "Itinerary adjustment required",
        list: pnr.pnrCheck?.alert?.split("\n"),
        secondaryBtn: { text: t("ok"), value: "pnrCheck" },
        loading: false,
      };

      delete data.primaryBtn;
      setPopupData(data);
      return;
    }

    // Check if email exists and if PNR is already selected
    const hasEmail = !!pnr?.emailId; // Concise check for email existence
    const isSelected = selectedPnrs.includes(pnr);
    let flightPnrsTemp = JSON.parse(JSON.stringify(flightPnrs));

    if (isSelected) {
      setSelectedPnrs((prevState) =>
        prevState.filter((item) => item !== pnr)
      );
      flightPnrsTemp?.forEach((item: any) => {
        if (item.PNR === pnr.PNR) {
          item.reassigned = false;
        }
      });
      setFlightPnrs(flightPnrsTemp);

    } else if (hasEmail) {
      setSelectedPnrs((prevState) =>
        [...prevState, pnr]
      );
    } else {
      setOpenContactPopConfirmId(pnr.PNR);
      flightPnrsTemp?.forEach((item: any) => {
        if (item.PNR === pnr.PNR) {
          item.reassigned = true;
        }
      });
      setFlightPnrs(flightPnrsTemp);
    }
  };

  /* Method to handle operations on selecting an available flight */
  const selectAvailableFlightHandler = (flight: any) => {
    if (selectedPnrs?.length) {
      setSelectedFlight((prevState: any) =>
        prevState && prevState.flightNumber === flight.Number
          ? prevState
          : flight
      );

      reaccommodateHandler(flight);
    } else if (reaccommodatedDetails?.length !== flightPnrs?.length) {
      messageApi.open({
        type: 'info',
        content: <Text className="cls-reassign-message f-med fs-14 pl-1 pr-2 py-4">Select a PNR to reaccommodate</Text>,
        className: 'custom-class',
        style: {
          marginTop: '12.5vh',
        },
      });
    } else {
      messageApi.open({
        type: 'info',
        content: <Text className="cls-reassign-message f-med fs-14 pl-1 pr-2 py-4">All the PNR(s) are reaccommodated</Text>,
        className: 'custom-class',
        style: {
          marginTop: '12.5vh',
        },
      });
    }
  };

  /* Method to handle reaccommodation after selecting PNR(s) & a flight */
  const reaccommodateHandler = (flight: any, pnrs: any = undefined) => {
    let pnrsData: any = [];
    /* Temp logic for auto reaccommodation */
    if (!pnrs) pnrs = selectedPnrs;
    if (pnrs?.length && flight && Object.keys(flight)?.length) {
      let flightData = JSON.parse(JSON.stringify(flight));
      flightData.reassignedSecor = availableFlightSector;
      setReaccommodatedDetails((prevState: any) => [
        ...pnrs.map((pnr: any) => ({
          ...pnr,
          reAccommodatedFlight: flightData,
        })),
        ...prevState,
      ]);

      pnrs?.forEach((pnr: any) => {
        pnrsData.push(pnr.PNR);
      });

      const initalvalue =
        reaccommodatedFlightSeatDetails?.[flight?.flightNumber] ||
        flight?.seatLeft;

      const totalSeatOccupied = pnrs.reduce((totalSeat: number, pnr: any) => {
        return totalSeat - pnr.totalPaxCount;
      }, initalvalue);

      setReaccommodatedFlightSeatDetails((prevState: any) => ({
        ...prevState,
        [flight.flightNumber]: totalSeatOccupied,
      }));

      setSelectedPnrs([]);
      setSelectedFlight(null);
    }
    // messageApi.open({
    //   type: 'success',
    //   content:  <Text className="cls-reassign-message f-med fs-14 pl-1 pr-2 py-4">
    //               {pnrsData?.length > 1 ? pnrsData?.join(", ") + " are" : pnrsData[0] + " is"} mapped to flight {flight?.flightNumber}
    //             </Text>,
    //   className: 'custom-class',
    //   style: {
    //     marginTop: '12.5vh',
    //   },
    // });
  };

  /* Handler to open more flight details */
  const toggleReaccommodatedFlightDetails = (
    event: React.MouseEvent<HTMLElement>
  ) => {
    const target = event.target as HTMLElement;
    const container = target.closest(".cls-more-detail") as HTMLElement;
    container.classList.toggle("open");
    container?.parentElement?.nextElementSibling?.classList.toggle("open");
    let check = container.classList.contains("open");
    // container.classList.contains("open")
    //   ? updateTextContent(container, t("hide_details"))
    //   : updateTextContent(container, t("more_details"));

    const moreDetailDiv = container?.parentElement?.nextElementSibling as HTMLElement;
    if (check) {
      moreDetailDiv.style.height = `${moreDetailDiv.scrollHeight}px`;
    } else {
      moreDetailDiv.style.height = "0";
    }

  };

  /* Handler to update 'more details' to 'hide details' on toggling */
  const updateTextContent = (container: HTMLElement, text: string) => {
    const firstChild = container?.firstElementChild?.firstElementChild;
    if (firstChild instanceof HTMLElement) {
      firstChild.textContent = text;
    }
  };

  useEffect(() => {
    if (scoreListResponse?.isSuccess) {
      var mainFlightArray: any = [];
      var mainPNRArray: any = [];

      availableFlights?.forEach((flight: any, index: number) => {
        var scoreData: any;
        var getValue: any;
        var array: any = [];

        scoreList?.forEach((score: any) => {
          if (score.scoreTitle === flight.scorePolicyName) {
            scoreData = score;
          }
        });

        var flightAttr = flight.scoreAttributes;

        scoreData?.score[0]?.cardData?.forEach(
          (scoreAttr: any, scoreIndex: number) => {
            var filteredFlightAttr = JSON.parse(
              JSON.stringify(
                flightAttr?.filter(
                  (score: any) => score?.type === scoreAttr?.typeTitle
                )
              )
            );

            var scoreVal = scoreAttr?.scoreData?.attributes?.filter(
              (data: any) => data.value === filteredFlightAttr[0]?.value
            );

            if (filteredFlightAttr?.length) {
              if (filteredFlightAttr[0].value === "-") {
                filteredFlightAttr[0].score = 0;
              } else {
                filteredFlightAttr[0].score = scoreVal[0]?.score;
              }
            } else {
              return;
            }

            array.push({
              key: index,
              ...(scoreIndex === 0 ? { flightLevel: "FLIGHT LEVEL" } : {}),
              flightType: scoreAttr?.typeTitle,
              weightage: Number(scoreAttr?.typeScore),
              value: !isNaN(Number(filteredFlightAttr[0]?.label))
                ? Number(filteredFlightAttr[0]?.label)
                : filteredFlightAttr[0]?.label,
              score:
                filteredFlightAttr[0]?.score !== "-"
                  ? Number(filteredFlightAttr[0]?.score)
                  : 0,
              totalScore:
                Number(scoreAttr?.typeScore) *
                (filteredFlightAttr[0]?.score !== "-"
                  ? Number(filteredFlightAttr[0]?.score)
                  : 0),
            });
          }
        );
        // Calculate total score
        const totalFlightScore = array.reduce(
          (sum: any, record: any) => sum + record.score * record.weightage,
          0
        );

        // Add total score row
        const FlightTotalScoreRow = {
          key: "total",
          flightLevel: "Total score",
          flightType: "",
          weightage: "",
          value: "",
          score: "",
          totalScore: totalFlightScore,
        };

        const updatedFlightData = [...array, FlightTotalScoreRow];
        mainFlightArray.push(updatedFlightData);
        setTableFlightData(mainFlightArray);
      });

      flightPnrs?.forEach((pnr: any, index: number) => {
        var scoreData: any;
        var getValue: any;
        var array: any = [];
        var paxScoreData: any = [];

        scoreList?.forEach((score: any) => {
          if (score.scoreTitle === pnr.scorePolicyName) {
            scoreData = score;
          }
        });

        var pnrAttr = pnr.scoreAttributes;
        scoreData?.score[0]?.cardData?.forEach(
          (scoreAttr: any, scoreIndex: number) => {
            var filteredPNRAttr = JSON.parse(
              JSON.stringify(
                pnrAttr?.filter(
                  (score: any) => score?.type === scoreAttr?.typeTitle
                )
              )
            );

            var scoreVal = scoreAttr?.scoreData?.attributes?.filter(
              (data: any) => data.value === filteredPNRAttr[0]?.value
            );

            if (filteredPNRAttr?.length) {
              if (filteredPNRAttr[0].value === "-") {
                filteredPNRAttr[0].score = 0;
              } else {
                filteredPNRAttr[0].score = scoreVal[0]?.score;
              }
            } else {
              return;
            }

            array.push({
              key: index,
              ...(scoreIndex === 0 ? { pnrLevel: "PNR LEVEL" } : {}),
              // pnrLevel: "PNR LEVEL",
              pnrType: scoreAttr?.typeTitle,
              weightage: Number(scoreAttr?.typeScore),
              value: !isNaN(Number(filteredPNRAttr[0]?.label))
                ? Number(filteredPNRAttr[0]?.label)
                : filteredPNRAttr[0]?.label,
              score:
                filteredPNRAttr[0]?.score !== "-"
                  ? Number(filteredPNRAttr[0]?.score)
                  : 0,
              totalScore:
                Number(scoreAttr?.typeScore) *
                (filteredPNRAttr[0]?.score !== "-"
                  ? Number(filteredPNRAttr[0]?.score)
                  : 0),
            });
          }
        );

        // Calculate total score
        const totalPNRScore = array.reduce(
          (sum: any, record: any) => sum + record.score * record.weightage,
          0
        );
        paxScoreData = scoreData?.score[0]?.cardData?.filter(
          (data: any) => data.typeTitle === "Passenger type"
        );
        if (paxScoreData?.length) {
          pnr?.paxInfo?.forEach((pax: any, subIndex: number) => {
            getValue = paxScoreData[0]?.scoreData?.attributes?.filter(
              (data: any) => {
                return data.value === pax?.type;
              }
            );
            getValue = getValue[0];

            var data = {
              key: "pax" + subIndex,
              pnrLevel:
                "Pax " +
                (subIndex + 1) +
                " : " +
                pax?.passengerDetail?.firstName +
                " " +
                pax?.passengerDetail?.lastName,
              pnrType: "Passenger type",
              weightage: Number(paxScoreData[0]?.typeScore),
              value: pax?.type,
              score: getValue !== undefined ? Number(getValue?.score) : 0,
              totalScore:
                Number(paxScoreData[0]?.typeScore) *
                (getValue !== undefined ? Number(getValue?.score) : 0),
            };
            array.push(data);
          });
        }

        // Add total score row
        const PNRTotalScoreRow = {
          key: "total",
          pnrLevel: "Total score",
          pnrType: "",
          weightage: "",
          value: "",
          score: "",
          totalScore: totalPNRScore,
        };

        const updatedPNRData = [...array, PNRTotalScoreRow];
        mainPNRArray.push(updatedPNRData);
        setTablePNRData(mainPNRArray);
      });
    }
  }, [availableFlights, flightPnrs]);

  /* Reset handler */
  const resetHandler = () => {
    setSelectedFlight(null);
    setSelectedPnrs([]);
    setReaccommodatedDetails([]);
    setReaccommodatedFlightSeatDetails([]);
  };

  /* Reset single PNR */
  const resetPNRHandler = (pnr: any) => {
    setReaccommodatedDetails((prevState: any) =>
      prevState.filter(
        (reaccommodatedDetail: any) => reaccommodatedDetail.PNR !== pnr.PNR
      )
    );

    const tempReaccommodatedFlightSeatDetails = {
      ...reaccommodatedFlightSeatDetails,
    };

    // Total seat available on the reaccommodated flight.
    const totalSeat = pnr?.["reAccommodatedFlight"]?.["seatLeft"];
    // Available seat available on the reaccommodated flight now.
    const currentFlightPax =
      tempReaccommodatedFlightSeatDetails[
      pnr?.["reAccommodatedFlight"]?.["flightNumber"]
      ];

    /* Delete the flight seat count from reaccommodatedFlightSeatDetails if only one PNR is reaccommodated for that flight. 
    Since we don't have to calculate other PNR's accommodated seats.*/
    if (totalSeat === pnr?.["totalPaxCount"] + currentFlightPax) {
      delete tempReaccommodatedFlightSeatDetails[
        pnr?.["reAccommodatedFlight"]?.["flightNumber"]
      ];
    } else {
      tempReaccommodatedFlightSeatDetails[
        pnr?.["reAccommodatedFlight"]?.["flightNumber"]
      ] = pnr?.["totalPaxCount"] + currentFlightPax;
    }

    setReaccommodatedFlightSeatDetails(tempReaccommodatedFlightSeatDetails);
  };

  /* Flight filter handler on date change */
  const handleDateChange = (date: dayjs.Dayjs | null) => {
    if (allAvailableFlights?.length && date) {
      setStaticDepartureDate(date.format("MMM DD, YYYY"));
      const shortForm = getShortForm(date);
      setAvailableFlights(
        [
          ...allAvailableFlights.find(
            (availableFlight: any) => availableFlight.day === shortForm
          )?.data,
        ].sort((a: any, b: any) => b.scoreRating - a.scoreRating)
      );
    }
  };

  /* Method to handler operation on adding contact to a particular PNR */
  const addContactHandler = (values: any, selectedPnr: any) => {
    setFlightPnrs((prevState: any) => {
      return prevState.map((pnr: any) => {
        if (selectedPnr && pnr.PNR === selectedPnr?.PNR) {
          return {
            ...pnr,
            emailId: values.contact,
          };
        }
        return pnr;
      });
    });

    contactForm.setFieldValue("contact", null);
  };

  /* Open confirmation modal before reaccommodating */
  const completeReaccomdationHandler = () => {
    if (isCurrentPathEqual("adhocPnrList")) {
      redirect("reaccommodation");
    } else {
      // setReaccommodatedDetails(mappedDetails);
      // setShowHeader(false);
      setShowModalFooter(true);
      setIsModalOpen(true);
      setActiveModalTab("1");
    }
  };

  /* Handler to get data from confirm popup */
  const popupHandler = (value: any) => {
    setPopupData({ ...popupData, modalToggle: false });
    if (value == "pnrCheck") return;
  };


  /* Method to sort PNR */
  const sortPNRHandler = (filter: any) => {
    setSortPNRSelectValue(filter);
    setFlightPnrs((prevState: any) => {
      const filterKey = filter === "score"
        ? "score"
        : filter === "paxCount"
          ? "totalPaxCount"
          : filter === "reassignPending"
            ? "reassigned"
            : "";
      const sortedArray = [...prevState].sort((a: any, b: any) => {
        return parseFloat(b[filterKey]) - parseFloat(a[filterKey]);
      });
      return sortedArray;
    });
  };

  const sortFlightHandler = (filter: any) => {
    setSortFlightSelectValue(filter);
    setAvailableFlights((prevState: any) => {
      const filterKey = filter === "score"
        ? "scoreRating"
        : filter === "seatsLeft"
          ? "seatLeft"
          : "";
      const sortedArray = [...prevState].sort((a: any, b: any) => {
        return parseFloat(b[filterKey]) - parseFloat(a[filterKey]);
      });
      return sortedArray;
    });
  };

  /* Helper functions */
  const getShortForm = (date: dayjs.Dayjs): string => {
    if (date.isSame(baseDate, "day")) {
      return "T";
    } else if (date.isSame(dayAfterBaseDate, "day")) {
      return "TMRW";
    } else if (date.isSame(twoDaysAfterBaseDate, "day")) {
      return "DAT";
    }
    return "";
  };

  const validateEmail = (
    rule: any,
    value: string,
    callback: (error?: string) => void
  ) => {
    const isValid = UseInputValidation({ type: "email", value });

    if (isValid) {
      setIsFormValid(true);
      callback();
    } else {
      setIsFormValid(false);
      callback("Please enter a valid email ID!");
    }
  };

  /* Email / phone number validation method for contact form */
  const validateEmailOrPhoneNumber = (
    rule: any,
    value: string,
    callback: (error?: string) => void
  ) => {
    const isValid =
      UseInputValidation({ type: "email", value }) ||
      UseInputValidation({ type: "mobileNumber", value });

    if (isValid) {
      setIsFormValid(true);
      callback();
    } else {
      setIsFormValid(false);
      callback("Please enter a valid email ID or 10-digit phone number!");
    }
  };

  const SearchSelect: React.FC<{
    placeholder: string;
    style?: React.CSSProperties;
    value?: string;
    onChange?: (value: string) => void;
  }> = (props) => {
    const [data, setData] = useState<SelectProps["options"]>([]);

    const handleSearch = (newValue: string) => {
      fetchLocalData(newValue, setData);
    };

    return (
      <Select
        showSearch
        value={props.value}
        placeholder={props.placeholder}
        style={props.style}
        defaultActiveFirstOption={false}
        filterOption={false}
        suffixIcon={null}
        onSearch={handleSearch}
        onChange={props.onChange}
        notFoundContent={null}
        options={(data || []).map((d) => ({
          value: d.value,
          label: d.text,
        }))}
      />
    );
  };

  const [form] = Form.useForm();

  const handleFinish = (values: any) => {
    var origin =
      values.origin?.length > 3
        ? values.origin.match(/\(([^)]+)\)/)[1]
        : values.origin;
    var destination =
      values.destination?.length > 3
        ? values.destination.match(/\(([^)]+)\)/)[1]
        : values.destination;
    setAvailableFlights((prevAvailableFlights: any) =>
      shuffleArray([...prevAvailableFlights])
    );
    setAvailableFlightSector(origin + "-" + destination);
    setBtnEnable(false);
    setTimeout(() => {
      setCollapseOpen([]);
    }, 1000);
  };

  const shuffleArray = (array: any) => {
    for (let i = array?.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  const fetchLocalData = (
    value: string,
    callback: (data: { value: string; text: string }[]) => void
  ) => {
    var origin = form.getFieldValue("origin");
    var destination = form.getFieldValue("destination");
    const filteredData: any = localData.filter(
      (item) =>
        item.value.toLowerCase().includes(value.toLowerCase()) &&
        item.value !== origin &&
        item.value !== destination
    );
    callback(filteredData);
  };

  useEffect(() => {
    if (SreaccommodateFlightDetails) {
      var origin =
        SreaccommodateFlightDetails?.origin +
        " (" +
        SreaccommodateFlightDetails?.sector?.split("-")[0] +
        ")";
      var destination =
        SreaccommodateFlightDetails?.destination +
        " (" +
        SreaccommodateFlightDetails?.sector?.split("-")[1] +
        ")";
      form.setFieldsValue({ origin, destination });
      /* Temp logic to show sectors from diverted arrival airport */
      if (SreaccommodateFlightDetails?.divertion) {
        const destination = SreaccommodateFlightDetails?.sector.split("-")[1];
        setAvailableFlightSector(
          `${SreaccommodateFlightDetails?.divertion?.to}-${destination}`
        );
      } else setAvailableFlightSector(SreaccommodateFlightDetails?.sector);
    }
  }, []);

  /* Returns array of PNR value from array of PNR objects */
  const getPNRs = (reaccomodationData: any) =>
    reaccomodationData.map((pnr: any) => pnr.PNR);


  useEffect(() => {
    if (!flightPnrs?.length) {
      setFlightPnrs(clusterData?.[clusterIndex]?.pnrs);
    }
  }, [clusterData])

  const [isModalOpen, setIsModalOpen] = useState(false);

  const showModal = () => {
    // setReaccommodatedDetails([]);
    // setShowHeader(true);
    setShowModalFooter(false);
    setIsModalOpen(true);
    setActiveModalTab("1");
  };

  const handleOk = () => {
    setLoading(true);
    setTimeout(() => {
      messageApi.open({
        type: 'success',
        content: <Text className="f-med fs-15 pr-2 py-4">The Reaccommodated Flight option has been Notified to the Passenger</Text>,
        className: 'custom-class',
        style: {
          marginTop: '12.5vh',
        },
      });
      resetHandler();
      setLoading(false);
      setIsModalOpen(false);
      setClusterIndex(0);
      redirect("adhocPnrList");
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const onCheckAllChange = (e: any) => {
    flightPnrs?.forEach((pnr: any) => {
      if (e.target.checked) {
        setAllCheck(true);
        resetPNRHandler(pnr);
        selectPnrHandler(pnr);
      } else {
        setAllCheck(false);
        setSelectedPnrs([]);
        resetPNRHandler(pnr);
      }
    });
  };

  const [isHistoryModalOpen, toggleHistoryModal] = useToggle(false);
  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>([
    {
      key: "byDeparture",
      label: "By departure",
      option: { key: "byDeparture", type: "default" },
    },
    {
      key: "byLoadFactor",
      label: "By load factor",
      option: { key: "loadFactor", type: "default" },
    },
    {
      key: "nearByAirport",
      label: "Near by Airport",
      option: { key: "nearByAirport", type: "default" },
    },
    {
      key: "status",
      label: "Status",
      option: { key: "status", type: "default" },
    },

  ]);

  const [availableFlightFilterProps, setAvailableFlightFilterProps] = useState([
    {
      key: "byDeparture",
      label: "By departure",
      option: [
        { value: "T", label: "Today" },
        { value: "TMRW", label: "Next 48 hrs" },
        { value: "DAT", label: "Next 72 hrs" }
      ]
    },
    {
      key: "byLoadFactor",
      label: "By load factor",
      option: [
        { value: "<30", label: "Normal load (<30%)" },
        { value: "31-60", label: "Moderate load (31% - 60%)" },
        { value: ">60", label: "High load (>60%)" }
      ]
    },
    {
      key: "nearByAirport",
      label: "Near by Airport",
      option: [
        { value: "KWI", label: "Kuwait(KWI)" },
        { value: "BAH", label: "Bahrain(BAH)" },
        { value: "LHR", label: "London(LHR)" }
      ]
    }
  ]);

  const handlePNRData = (data: any) => {
    setFlightPnrs(clusterData?.[data]?.pnrs);
    setClusterIndex(data);
  };

  const handleFilterData = (data: any) => {
    let tempArr: any = [];
    if (data === "N") {
      tempArr = clusterData?.flatMap((cluster: any) => cluster?.pnrs.map((pnrData: any) => pnrData));
    } else {
      tempArr = clusterData[clusterIndex]?.pnrs.map((pnrData: any) => pnrData);
    }
    setTablePNRListData(tempArr)
  };

  const [filterTab, setFilterTab] = useState<string>("all");
  const SEARCH_FILTER_FIELDS = ["PNR"];

  const [sortPNRSelectValue, setSortPNRSelectValue] = useState<any>(undefined);
  const [sortSortFlightSelectValue, setSortFlightSelectValue] = useState<any>(undefined);

  const availableFilterHandler = (filterData: any) => {
    setSortFlightSelectValue(undefined);
    let tempAvailableFlights: any;
    if (filterData?.filter?.byDeparture !== undefined) {
      allAvailableFlights?.forEach((flightData: any) => {
        if (flightData?.day === filterData?.filter?.byDeparture)
          tempAvailableFlights = flightData?.data;
      })
    } else {
      tempAvailableFlights = allAvailableFlights[0]?.data;
    }
    if (filterData?.filter?.nearByAirport !== undefined) {
      let sector = filterData?.filter?.nearByAirport + "-" + availableFlightSector?.split("-")[1];
      setAvailableFlightSector(sector);
    } else {
      let sector = SreaccommodateFlightDetails?.sector?.split("-")[0] + "-" + availableFlightSector?.split("-")[1];
      setAvailableFlightSector(sector);
    }

    if (filterData?.filter?.byLoadFactor) {
      // Define the range mapping
      const loadFactorRanges = parseRange(filterData?.filter?.byLoadFactor);

      // Get the range for the selected filter
      const { min, max } = loadFactorRanges;

      // Filter flights based on load factor
      tempAvailableFlights = tempAvailableFlights.filter((flight: any) => {
        const { seatLeft, totalFlightSeatCapacity } = flight;
        const loadFactor = ((totalFlightSeatCapacity - seatLeft) / totalFlightSeatCapacity) * 100;
        return loadFactor >= min && loadFactor <= max;
      });

    }

    setPartnerFlightShow(filterData?.partnerFlights ? true : false)
    setAvailableFlights(tempAvailableFlights?.length ? tempAvailableFlights : ["No data found"]);

  }

  const parseRange = (range: string) => {
    if (range.startsWith("<")) {
      const max = parseInt(range.slice(1), 10);
      return { min: 0, max };
    } else if (range.startsWith(">")) {
      const min = parseInt(range.slice(1), 10);
      return { min, max: 100 };
    } else if (range.includes("-")) {
      const [min, max] = range.split("-").map(Number);
      return { min, max };
    }
    throw new Error("Invalid range format");
  };

  // const searchTabData = (item:any) => {
  //   let tempArr = item?.flatMap((data: any) => data?.map((pnrData: any) => pnrData));
  //   // setTablePNRListData(tempArr);
  // }

  return flightPnrs?.length && clusterData.length ? (
    <Row
      className="cls-reaccommodation-container"
      data-testId="reaccommodation"
    >
      <Col span={24} className={isSmallScreen ? "mb-2" : ""}>
        <DescriptionHeader data={headerProps} />
      </Col>
      { isCurrentPathEqual("adhocPnrList") && 
        <Text className="fs-13 f-reg cls-back cls-cursor-pointer" onClick={()=>redirect("adhoc")}>Back to list</Text>
      }
      {isAutoReaccommodation && (
        <Col span={24}>
          <Flex align="center">
            <Text type="secondary" className="Infi-Fd_15_Info fs-22"></Text>
            <Text className="fs-14" type="secondary">
              This flight has been automatically rescheduled in accordance with a policy.
            </Text>
          </Flex>
        </Col>
      )}
      <Col span={24} className="cls-disrupted-card mb-3">
        <Card bordered={false}>
          <Flex wrap="wrap" align={"center"} justify="space-between">
            <Text className="fs-16 f-med d-iblock cls-grey-lite">{!isCurrentPathEqual("adhocPnrList") ? "Disrupted flight details" : "Flight details"} </Text>
            {isCurrentPathEqual("adhocPnrList") &&
            <Text>
              <Text className="cls-grey fs-13 f-reg d-iblock pr-1">Action by:</Text>
              <Text className="cls-grey fs-14 f-reg d-iblock">John anderson</Text>
              {" | "}
              <Text className="cls-grey fs-14 f-reg d-iblock">12:25, 26 Oct, 2024</Text>
              <Button
                type="link"
                className="p-clr underline px-2 fs-14 f-med"
                onClick={toggleHistoryModal}
              >
                History
              </Button>
              <Modal
                width="75%"
                open={isHistoryModalOpen}
                onCancel={() => {
                  toggleHistoryModal()
                }}
                closeIcon={<Text className="Infi-Fd_09_CloseIcon cls-close-modal-icon"></Text>}
                footer={false}
                className={`cls-history-popup`}
              >
                <PnrHistory tableData={tableData} />
              </Modal>
            </Text>
            }
          </Flex>
          <TableDisplay
            data={tableData}
            columns={columns}
            pagination={{ pageSize: 5, position: "bottomRight" }}
            size="middle"
          />
          {/* {SreaccommodateFlightDetails?.divertion &&
            <Alert
              className="mt-2"
              message={
                <Flex gap={10} align='center'>
                  <Text type="secondary" className="Infi-Fd_27_FlightType fs-22"></Text>
                  <Text>Diverted to </Text>
                  <Text type='warning' className="fs-16 f-med">{SreaccommodateFlightDetails?.divertion?.to}</Text>
                  <Text>{SreaccommodateFlightDetails?.divertion?.reason} at</Text>
                  <Text type="warning" className="fs-16 f-med">{SreaccommodateFlightDetails?.divertion?.stdArrival}</Text>
                </Flex>
              }
              type="info"
            />
          } */}
        </Card>
      </Col>
      {isCurrentPathEqual("adhocPnrList") ?
        <AdhocPnrList
          clusterData={clusterData}
          clusterIndex={clusterIndex}
          handlePNRData={handlePNRData}
          handleFilterData={handleFilterData}
        />
        :
        <Col span={24} className="cls-cluster-div">
          <Text className="fs-17 f-med d-block p-clr">Select itinerary cluster</Text>
          {/* <Flex className="pt-3 mb-3">
            <Text className="fs-13 f-med pr-2">Select clustering type</Text>
            <Radio.Group options={clusterData?.clusterOptions} defaultValue="itinerary" onChange={(e)=>setCluster(e.target.value)}/>
          </Flex> */}
          <Row>
            <Radio.Group
              defaultValue="itinerary_0"
              value={"itinerary_" + clusterIndex}
              className="d-flex w-100 pt-2 flex-wrap rg-10"
              onChange={(e) => {
                let data = (e.target.value).split("_");
                setFlightPnrs(clusterData?.[data[1]]?.pnrs);
                setClusterIndex(data[1]);
                setSelectedPnrs([]);
              }}
            >
              {clusterData?.map((data: any, index: number) => (
                <Col xs={24} sm={11} md={8} lg={7} xl={6} className="mr-4">
                  <Radio.Button value={"itinerary_" + index}>
                    <Card>
                      <Text className="d-block fs-15 f-reg">
                        {data.segment}
                        <Text className="fs-13 f-reg cls-grey-lite pl-1"> {data.stops}{" "} stops</Text>
                      </Text>
                      <Text className="d-block fs-15 f-reg">
                        Pax {" "} {data.paxCount}
                        {data?.info?.length &&
                          <Text className="fs-14 cls-grey-lite px-1">|</Text>
                        }
                        {data?.info?.map((pax: any, paxIndex: number) => (
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
                            {pax?.type}: {pax?.count}{data?.info?.length !== paxIndex + 1 && ","}
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
        </Col>
      }
      {isCurrentPathEqual("adhocPnrList") ?
        <>
          <Col span={24} className="mt-4 mb-3 cls-pnr-table-card">
            <Card bordered={false}>
              {/* <Row justify="space-between" align="middle">
                <Col span={3}>
                  <Text className="fs-20 pb-2 f-med d-block p-clr">PNR details list</Text>
                </Col>
                <Col span={17} className="pr-2">
                  {!!customFilterProps.length && (
                    <PersonalizedFilter
                    tableData={tablePNRListData}
                    filters={customFilterProps}
                    visibleColumns={visibleColumns}
                    setTableData={searchTabData}
                    tableDataPreparationHandler={preparePnrListTableData}
                    />
                    )}
                  </Col>
                  <Col span={4}>
                    <TableTabSearchFilter
                      data={tablePNRListData}
                      tabDataKey="status"
                      currentTab={filterTab}
                      searchFields={SEARCH_FILTER_FIELDS}
                      tableDataPreparationHandler={preparePnrListTableData}
                      // setTableData={setTablePNRListData}
                      setTableData={searchTabData}
                      placeholder={t("search")}
                    />
                </Col>
              </Row>
              <TableDisplay
                data={tablePNRListData}
                columns={visibleColumns}
                pagination={{ pageSize: 5, position: "bottomRight" }}
                size="middle"
              /> */}
              <PrePlannedDisruptedPNRList adhocPnrData={tablePNRListData} />
            </Card>
          </Col>
        </>
        :
        <>
          <Col span={24} className="text-right mt-2">
            <Button type="link" className={`p-clr f-med fs-14 ${!reaccommodatedDetails?.length ? "cls-disabled" : ""}`} onClick={showModal}>
              {t("reaccommodation_list")} ({reaccommodatedDetails?.length})
            </Button>
          </Col>
          <Col span={24} className="mt-2">
            <Row justify="space-between" className="cls-list-row">
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="cls-list">
                <Row justify="space-between">
                  <Col span={24}>
                    <Text className="cls-list-title">{t("select_pnr")}</Text>
                  </Col>
                  <Col span={4} className="cls-first-row">
                    <Checkbox
                      checked={allCheck}
                      onChange={onCheckAllChange}
                      className="cls-check-box fs-16 f-reg"
                    >
                      All
                    </Checkbox>
                  </Col>
                  <Col span={20} className="text-right">
                    <Select
                      className="ml-2 cls-sort-select text-left h-27"
                      placeholder={t("sort_by")}
                      value={sortPNRSelectValue}
                      style={{ minWidth: 120 }}
                      onChange={sortPNRHandler}
                      options={[
                        { value: "score", label: "Score" },
                        { value: "paxCount", label: "Pax count" },
                        // { value: "reassignPending", label: "Reassignment pending" }
                      ]}
                    />
                  </Col>
                </Row>

                {flightPnrs?.length ? (
                  flightPnrs?.map((pnr: any, flightIndex: number) => {
                    const isSelected = selectedPnrs?.includes(pnr);
                    const isReAccommodated = reaccommodatedDetails?.some(
                      (pnrData: any) => pnrData.PNR === pnr.PNR
                    );
                    const isEmailIdNotUpdated = !pnr.emailId;

                    // Check seat availability & the PNR is selected or not
                    let isSeatAvailable: boolean = true;
                    let isPnrReaccommodated: boolean = false;
                    isPnrReaccommodated = reaccommodatedDetails?.some(
                      (pnrData: any) =>
                        pnrData.id === pnr.id && pnrData.PNR === pnr.PNR
                    );
                    const availableSeats =
                      reaccommodatedFlightSeatDetails?.[
                      selectedFlight?.flightNumber
                      ] || selectedFlight?.seatLeft;
                    if (
                      !isPnrReaccommodated &&
                      availableSeats &&
                      !selectedPnrs.some(
                        (pnrData: any) =>
                          pnrData.id === pnr.id && pnrData.PNR === pnr.PNR
                      )
                    ) {
                      isSeatAvailable =
                        availableSeats - seatsSelected >= pnr?.totalPaxCount;
                    }

                    return (
                      <Popconfirm
                        title={t("add_contact_info")}
                        description={
                          <Form
                            style={{ width: "300px" }}
                            className="mt-2 pr-4"
                            name="contactForm"
                            form={contactForm}
                            onFinish={(values: { contact: string }) =>
                              addContactHandler(values, pnr)
                            }
                          >
                            <Form.Item
                              className="mb-1"
                              name="contact"
                              style={{ marginBottom: 10 }}
                              rules={[
                                {
                                  validator: validateEmail,
                                },
                              ]}
                            >
                              <Input placeholder="Email ID" />
                            </Form.Item>
                          </Form>
                        }
                        okText="Add"
                        cancelText="No"
                        open={openContactPopConfirmId === pnr.PNR}
                        onOpenChange={(visible) => {
                          visible && isEmailIdNotUpdated
                            ? setOpenContactPopConfirmId(pnr.PNR)
                            : setOpenContactPopConfirmId(null);
                        }}
                        onCancel={() => {
                          setOpenContactPopConfirmId(null);
                          contactForm.resetFields();
                        }}
                        onConfirm={async () => {
                          setIsContactFormLoading(true);
                          try {
                            await new Promise((resolve) =>
                              setTimeout(resolve, 2000)
                            );
                            await contactForm.submit();
                            setOpenContactPopConfirmId(null);
                          } catch (error) {
                            console.error("Error during form submission:", error);
                          } finally {
                            setIsContactFormLoading(false);
                          }
                        }}
                        okButtonProps={{
                          loading: isContactFormLoading,
                          disabled: !isFormValid,
                        }}
                      >
                        <Card
                          className={`cls-pnr-card default mt-2 ${isSelected ? "active" : ""} ${isReAccommodated ? "assigned"
                            // : isSelected ? "active" 
                            : ""} ${isSeatAvailable || "cls-disable"}`}
                          onClick={() => {
                            !isReAccommodated
                              ? selectPnrHandler(pnr)
                              : resetPNRHandler(pnr);
                          }}
                        >
                          <Row justify="space-between" align="middle">
                            <Col span={24}>
                              <Row justify="space-between">
                                <Col className="text-ellipsis" xs={10} sm={24} md={24} lg={24} xl={24}>
                                  <Checkbox checked={isSelected || isReAccommodated} className="pr-2 cls-check-box" />
                                  <Text className="fs-16 f-sbold">{pnr.PNR}</Text>
                                </Col>
                                <Col xs={14} sm={24} md={24} lg={24} xl={24} style={{lineHeight: 2}} className="text-ellipsis text-right">
                                  <Tooltip
                                    title={
                                      <Text
                                        className="cls-table-tooltip"
                                        onMouseEnter={() =>
                                          setTablePNRDataIndex(flightIndex)
                                        }
                                      >
                                        <TableDisplay
                                          data={tablePNRData[flightIndex]}
                                          columns={PNRcolumns}
                                          pagination={{
                                            pageSize: 30,
                                            position: "bottomRight",
                                          }}
                                          border={true}
                                        />
                                      </Text>
                                    }
                                  >
                                    <Text
                                      className={`cls-reaccommodate-score ${pnr?.scoreStatus}`}
                                    >
                                      Score:{" "}
                                      <Text className="fs-12 f-med">
                                        {pnr.score} /{" "}
                                        {/* {scoreStatus.charAt(0).toUpperCase() +
                                        scoreStatus.slice(1)} */}
                                        {pnr?.scoreStatus
                                          ?.charAt(0)
                                          ?.toUpperCase() +
                                          pnr?.scoreStatus?.slice(1)}
                                      </Text>
                                    </Text>
                                  </Tooltip>
                                </Col>
                              </Row>
                              <Row className="rg-10" justify="space-between" align="middle">
                                <Col>
                                  <Text type="secondary" className="fs-12">
                                    {/* {t("pax_count")} :{" "} */}
                                  </Text>
                                  <Text className="fs-13 f-reg">
                                    {pnr.totalPaxCount} Pax ( {pnr.totalAdultPaxCount}A,
                                    {pnr.totalChildPaxCount}C, {" "}
                                    {pnr.totalInfantPaxCount}I )
                                  </Text>
                                </Col>
                                {isEmailIdNotUpdated && (
                                  <Col>
                                    <Tooltip
                                      title={
                                        openContactPopConfirmId !== pnr.PNR
                                          ? "Click to add contact info for this PNR"
                                          : ""
                                      }
                                    >
                                      <Flex align="center" gap={3}>
                                        <Text
                                          type="danger"
                                          className="Infi-Fd_15_Info fs-18"
                                        ></Text>

                                        <Text type="danger">
                                          {t("no_contact_information")}
                                        </Text>
                                      </Flex>
                                    </Tooltip>
                                  </Col>
                                )}
                                <Col span={24}>
                                  {pnr?.originalFlightDetails?.map((data: any, mainIndex: number) => (
                                    <div key={`data-${mainIndex}`} className="cls-accept">
                                      {/* <Text className="d-iblock pt-3 p-clr cls-trip f-sbold" key={`trip-${mainIndex}`}>
                                      Trip {data.trip}
                                    </Text> */}
                                      {data.flightDetails.map((item: any, index: number) => (
                                        (index === 0) &&
                                        <>
                                          <Row
                                            justify="space-between"
                                            align="middle"
                                            className="rg-5"
                                          >
                                            <Col xs={24} sm={6} md={24} lg={4} xl={4}>
                                              <Text className="cls-availableflight-no fs-14 f-reg d-block">
                                                {item.flightNumber}
                                              </Text>
                                              {data?.delayed === "Y" &&
                                                <Text className="fs-12 f-reg">
                                                  {index === 0 ? "Scheduled time" : "Estimated time"}
                                                </Text>
                                              }
                                            </Col>
                                            <Col xs={8} sm={6} md={8} lg={6} xl={data?.delayed === "Y" ? 6 : 6} className={`${isMediumScreen || isSmallScreen  ? "text-left" : "text-right"}`}>
                                              {data?.originChanged === "Y" &&
                                                <Text className="cls-dep-time fs-15 f-med pr-1">
                                                  {data?.originChangedAirportCode}
                                                </Text>
                                              }
                                              <Text
                                                className="cls-dep-time fs-15 f-med"
                                                type={data?.originChanged === "Y" ? "danger" : undefined}
                                                style={{ textDecoration: data?.originChanged === "Y" ? "line-through" : "none" }}
                                              >
                                                {item.originAirportCode}
                                              </Text>
                                              {data?.delayed === "Y" ?
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block" type={index === 0 ? "danger" : undefined}>
                                                    <Text className="cls-dep-date fs-13 f-reg" type={index === 0 ? "danger" : undefined}>{getDynamicDate(item?.departDate) as string} {", "}</Text>
                                                    {item.depart}
                                                  </Text>
                                                </> :
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                                  <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                                </>
                                              }
                                            </Col>
                                            <Col xs={6} sm={6} md={8} lg={4} xl={data?.delayed === "Y" ? 6 : 8}  className="text-center cls-duration-stops">
                                              <Text className="cls-stops w-100 fs-12 f-reg">{item?.stops} Stop(s)</Text>
                                              <Text className="w-100"><FdOriginDestination /></Text>
                                              <Text className="cls-duration w-100 fs-12 f-reg">{item?.duration}</Text>
                                            </Col>
                                            <Col className={`${isMediumScreen || isSmallScreen ? "text-right" : "text-left"}`} xs={8} sm={6} md={8} lg={6} xl={6}>
                                              <Text
                                                className="cls-dep-time fs-15 f-med"
                                                type={data?.diverted === "Y" ? "danger" : undefined}
                                                style={{ textDecoration: data?.diverted === "Y" ? "line-through" : "none" }}
                                              >
                                                {item.destinationAirportCode}
                                              </Text>
                                              {data?.diverted === "Y" &&
                                                <Text
                                                  className="cls-dep-time fs-15 f-med pl-1"
                                                >
                                                  {data?.divertedAirportCode}
                                                </Text>
                                              }
                                              {data?.delayed === "Y" ?
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block" type={index === 0 ? "danger" : undefined}>
                                                    {item.arrival}{", "}
                                                    <Text className="cls-dep-date fs-13 f-reg" type={index === 0 ? "danger" : undefined}>{getDynamicDate(item?.arrivalDate) as string}</Text>
                                                  </Text>
                                                </> :
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                                  <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                                </>
                                              }
                                            </Col>
                                          </Row>
                                          {(index === 0 && data?.delayed === "Y") && <Divider className="my-2" />}
                                        </>
                                      ))}
                                    </div>
                                  ))}
                                  {pnr?.rebookOptionalFlightDetails?.map((data: any, mainIndex: number) => (
                                    <div key={`data-${mainIndex}`} className="cls-accept">
                                      {data.flightDetails.map((item: any, index: number) => (
                                        (index === 0 && data?.delayed === "Y") &&
                                        <>
                                          <Row
                                            justify="space-between"
                                            align="middle"
                                          >
                                            <Col xs={24} sm={6} md={24} lg={4} xl={4}>
                                              <Text className="cls-availableflight-no fs-14 f-reg d-block">
                                                {item.flightNumber}
                                              </Text>
                                              {data?.delayed === "Y" && <Text className="fs-12 f-reg">Estimated time</Text>}
                                            </Col>
                                            <Col xs={8} sm={6} md={8} lg={6} xl={data?.delayed === "Y" ? 6 : 4} className={`${isMediumScreen || isSmallScreen ? "text-left" : "text-right"}`}>
                                              {data?.originChanged === "Y" &&
                                                <Text className="cls-dep-time fs-15 f-med pr-1">
                                                  {data?.originChangedAirportCode}
                                                </Text>
                                              }
                                              <Text
                                                className="cls-dep-time fs-15 f-med"
                                                type={data?.originChanged === "Y" ? "danger" : undefined}
                                                style={{ textDecoration: data?.originChanged === "Y" ? "line-through" : "none" }}
                                              >
                                                {item.originAirportCode}
                                              </Text>
                                              {data?.delayed === "Y" ?
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block" type={index === 0 ? "danger" : undefined}>
                                                    <Text className="cls-dep-date fs-13 f-reg" type={index === 0 ? "danger" : undefined}>{getDynamicDate(item?.departDate) as string} {", "}</Text>
                                                    {item.depart}
                                                  </Text>
                                                </> :
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block">{item.depart}</Text>
                                                  <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.departDate) as string}</Text>
                                                </>
                                              }
                                            </Col>
                                            {/* span={data?.delayed === "Y" ? 6 : 10}  */}
                                            <Col xs={8} sm={6} md={8} lg={6} xl={data?.delayed === "Y" ? 6 : 10} className="text-center cls-duration-stops">
                                              <Text className="cls-stops w-100 fs-12 f-reg">{item?.stops} Stop(s)</Text>
                                              <Text className="w-100"><FdOriginDestination /></Text>
                                              <Text className="cls-duration w-100 fs-12 f-reg">{item?.duration}</Text>
                                            </Col>
                                            <Col className={`${isMediumScreen || isSmallScreen ? "text-right" : "text-left"}`} xs={8} sm={6} md={8} lg={6} xl={6}>
                                              <Text
                                                className="cls-dep-time fs-15 f-med"
                                                type={data?.diverted === "Y" ? "danger" : undefined}
                                                style={{ textDecoration: data?.diverted === "Y" ? "line-through" : "none" }}
                                              >
                                                {item.destinationAirportCode}
                                              </Text>
                                              {data?.diverted === "Y" &&
                                                <Text
                                                  className="cls-dep-time fs-15 f-med pl-1"
                                                >
                                                  {data?.divertedAirportCode}
                                                </Text>
                                              }
                                              {data?.delayed === "Y" ?
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block" type={index === 0 ? "danger" : undefined}>
                                                    {item.arrival}{", "}
                                                    <Text className="cls-dep-date fs-13 f-reg" type={index === 0 ? "danger" : undefined}>{getDynamicDate(item?.arrivalDate) as string}</Text>
                                                  </Text>
                                                </> :
                                                <>
                                                  <Text className="cls-dep-time fs-14 f-med d-block">{item.arrival}</Text>
                                                  <Text className="cls-dep-date fs-13 f-reg">{getDynamicDate(item?.arrivalDate) as string}</Text>
                                                </>
                                              }
                                            </Col>
                                          </Row>
                                        </>
                                      ))}
                                    </div>
                                  ))}
                                </Col>
                              </Row>
                              <Flex justify="space-between" align="middle">
                                <Text
                                  className="cls-more-detail fs-13 f-med"
                                  onClick={toggleReaccommodatedFlightDetails}
                                >
                                  <Button
                                    type="link"
                                  >
                                    {/* {t("more_details")} */}
                                    Passenger details
                                  </Button>
                                  <Text className="pl-1 fs-10 bold cls-arrow Infi-Fd_06_DownArrow" style={{ verticalAlign: "middle" }}></Text>
                                </Text>
                                <Text className="d-block text-right fs-14 f-reg pt-1">
                                  {/* Pax {pnr?.totalPaxCount} */}
                                  {/* {pnr?.impPaxInfo?.length &&
                                    <Text className="fs-14 cls-grey-lite px-1">|</Text>
                                  } */}
                                  {pnr?.impPaxInfo?.map((pax: any, paxIndex: number) => (
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
                                      {pax?.type}: {pax?.count}{pnr?.impPaxInfo?.length !== paxIndex + 1 && ","}
                                    </Text>
                                  ))}
                                </Text>
                              </Flex>
                              <Row className="cls-more-detail-div">
                                <PassengerDetails pnrData={[pnr]} />
                              </Row>
                            </Col>
                          </Row>
                        </Card>
                      </Popconfirm>
                    );
                  })
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
              </Col>
              <Col xs={24} sm={24} md={12} lg={12} xl={12} className="cls-list cls-alternative">
                <Row justify="space-between" className="rg-10">
                  <Col xs={24} sm={12} md={24} lg={12} xl={8}>
                    <Text className="cls-list-title">
                      {/* {t("available_flights")} */}
                      Alternate flight
                    </Text>
                  </Col>
                  <Col xs={24} sm={12} md={24} lg={12} xl={24} className="d-flex justify-end">
                    <Text className="d-iblock mr-5">
                      {availableFlights &&
                        <ReaccommodationFilter
                          filterData={availableFlightFilterProps}
                          sendFilterHandler={availableFilterHandler}
                        />
                      }
                    </Text>
                    <Select
                      className="ml-2 cls-sort-select text-left h-27"
                      placeholder={t("sort_by")}
                      value={sortSortFlightSelectValue}
                      style={{ minWidth: 120 }}
                      onChange={sortFlightHandler}
                      options={[
                        { value: "score", label: "Score" },
                        { value: "seatsLeft", label: "Seats left" }
                      ]}
                    />
                  </Col>
                </Row>
                <Row>
                  <Col span={24}>
                    <Collapse
                      size="small"
                      bordered={false}
                      activeKey={collapseOpen}
                      onChange={(key) => setCollapseOpen(key)}
                      items={[
                        {
                          key: "1",
                          label: (
                            <Tooltip title="Click to toggle sector change form">
                              <Text
                                className="Infi-Fd_83_Trip fs-22 p-clr"
                              // onClick={() => setCollapseOpen(["1"])}
                              >
                                {/* Change sector  */}
                              </Text>
                            </Tooltip>
                          ),
                          children: (
                            <Form
                              form={form}
                              className="text-left"
                              onFinish={handleFinish}
                              layout="horizontal"
                            >
                              <Col xs={24} sm={12} md={24} lg={15} xl={12}>
                              <Form.Item
                                name="origin"
                                label="Origin"
                                rules={[
                                  {
                                    required: true,
                                    message: "Please select an origin!",
                                  },
                                ]}
                              >

                                <SearchSelect
                                  placeholder="Search origin"
                                  onChange={(value) => {
                                    form.setFieldsValue({ origin: value });
                                    setBtnEnable(true);
                                  }}
                                />
                              </Form.Item>
                              </Col>

                              <Col xs={24} sm={12} md={24} lg={15} xl={12}>
                                <Form.Item
                                  name="destination"
                                  label="Destination"
                                  rules={[
                                    {
                                      required: true,
                                      message: "Please select a destination!",
                                    },
                                  ]}
                                >
                                  <SearchSelect
                                    placeholder="Search destination"
                                    onChange={(value) => {
                                      form.setFieldsValue({ destination: value });
                                      setBtnEnable(true);
                                    }}
                                  />
                                </Form.Item>
                              </Col>
                              <Form.Item className="text-center">
                                <Button
                                  type="primary"
                                  htmlType="submit"
                                  className={`${!btnEnable ? "cls-disabled no-events" : ""}`}
                                >
                                  {t("submit")}
                                </Button>
                              </Form.Item>
                            </Form>
                          ),
                        },
                      ]}
                    />
                  </Col>
                </Row>
                {!!availableFlights?.length ?
                  availableFlights?.map((flight: any, index: number) => {
                    const isSelected = selectedFlight?.flightNumber === flight.flightNumber;
                    const availableSeats =
                      reaccommodatedFlightSeatDetails?.[flight.flightNumber] ||
                      (reaccommodatedFlightSeatDetails?.[flight.flightNumber] === 0
                        ? 0
                        : flight.seatLeft);
                    const seatShortage: boolean = availableSeats < 1 || availableSeats < seatsSelected;

                    return (
                      flight === "No data found" ?
                        <Row className="text-center cls-no-data">
                          <Col lg={24}>
                            <FdNoDataFound />
                          </Col>
                          <Col lg={24}>
                            <Text className="d-block pt-1 fs-17 cls-grey-lite">No flights are available</Text>
                          </Col>
                        </Row> :
                        (!flight?.partnerFlight || partnerFlightShow) &&
                        <Card
                          className={`cls-pnr-card mt-2 ${isSelected && "active"} ${seatShortage && "cls-disable"}`}
                          id={`availableFlight` + flight.id}
                          onClick={() => selectAvailableFlightHandler(flight)}
                        >
                          <Row justify="space-between" align="middle">
                            <Row className="w-100" justify="space-between" align="bottom">
                              <Col className="cls-org-den mb-2">
                                <Text className="fs-16 f-sbold">
                                  {availableFlightSector}
                                </Text>
                              </Col>
                              <Col className="mb-2 text-right">
                                <Tooltip
                                  title={
                                    <Text
                                      className="cls-table-tooltip d-block"
                                      style={{ width: "600px" }}
                                    >
                                      <TableDisplay
                                        data={tableFightData[index]}
                                        columns={FlightColumns}
                                        border={true}
                                      />
                                    </Text>
                                  }
                                  overlayStyle={{
                                    maxWidth: "750px",
                                    whiteSpace: "normal",
                                    overflowWrap: "break-word",
                                  }}

                                >
                                  <Text
                                    className={`cls-reaccommodate-score ${flight.status}`}
                                  >
                                    Score:
                                    <Text>
                                      {flight.scoreRating} / {flight.scoreStatus}
                                    </Text>
                                  </Text>
                                </Tooltip>
                              </Col>
                            </Row>
                            <Col xs={24} sm={4} md={24} lg={3} xl={4}>
                              {(partnerFlightShow && flight?.partnerFlight) &&
                                <Text className="d-block">
                                  <svg width="60" height="10" viewBox="0 0 60 10" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <path d="M0 9.33835C0.129978 9.26836 0.189968 9.10839 0.189968 8.97841V5.6289C0.189968 5.48892 0.129978 5.32895 0 5.25896H1.59973C2.30961 5.25896 3.0095 5.54891 3.0095 6.35879C3.0095 6.78873 2.63956 7.12868 2.22963 7.19867C2.80953 7.18867 3.36944 7.54862 3.36944 8.18852C3.36944 9.10839 2.4096 9.33835 1.72971 9.33835H0ZM1.28978 5.59891C1.2198 5.59891 1.15981 5.5989 1.02983 5.6189V7.04869H1.1898C1.67972 7.04869 2.14964 6.89871 2.14964 6.3288C2.14964 5.76888 1.7797 5.59891 1.28978 5.59891ZM1.38977 7.41864C1.26979 7.41864 1.16981 7.41864 1.02983 7.42863V8.93841C1.2098 8.96841 1.39977 8.98841 1.57974 8.98841C1.98967 8.98841 2.4096 8.80843 2.4096 8.17852C2.3996 7.55862 1.90968 7.41864 1.38977 7.41864ZM4.94917 5.59891C4.87919 5.59891 4.8092 5.6089 4.73921 5.6189V7.02869C4.8092 7.02869 4.86919 7.03869 4.92918 7.03869C5.3891 7.03869 5.72904 6.78873 5.72904 6.2888C5.72904 5.77888 5.3991 5.59891 4.94917 5.59891ZM7.00883 9.35835C6.84886 9.35835 6.67889 9.36835 6.52891 9.31836C6.24896 9.23837 5.86902 8.60846 5.71905 8.3685C5.47909 7.96855 5.27912 7.41864 4.73921 7.40864V8.96841C4.73921 9.10839 4.7992 9.26836 4.92918 9.32835H3.70938C3.83936 9.25837 3.89935 9.10839 3.89935 8.96841V5.6189C3.89935 5.47892 3.83936 5.31895 3.70938 5.24896H5.18913C5.82903 5.24896 6.63889 5.49892 6.63889 6.2688C6.63889 6.91871 6.09898 7.24866 5.50908 7.24866C6.35894 7.24866 6.85886 9.24837 7.7987 9.25837C7.53874 9.32836 7.26879 9.35835 7.00883 9.35835ZM7.84869 9.33835C7.94867 9.28836 8.05866 9.15838 8.05866 8.97841V5.6289C8.05866 5.43893 7.94867 5.30895 7.84869 5.25896H9.10848C8.9985 5.30895 8.89852 5.43893 8.89852 5.6289V8.97841C8.89852 9.15838 8.9985 9.29836 9.10848 9.33835H7.84869ZM10.5782 9.33835C10.7082 9.27836 10.7782 9.11839 10.7782 8.97841V5.72888H9.87835C9.66839 5.72888 9.41843 5.75888 9.23846 5.85887L9.51841 5.25896H12.5179C12.7579 5.25896 13.0078 5.24896 13.2478 5.19896C13.1378 5.50892 12.7979 5.73888 12.5979 5.73888C12.3579 5.72889 11.968 5.71889 11.6281 5.71889V8.97841C11.6281 9.11839 11.698 9.27836 11.828 9.33835H10.5782ZM13.3878 9.33835C13.4878 9.28836 13.5977 9.15838 13.5977 8.97841V5.6289C13.5977 5.43893 13.4878 5.30895 13.3878 5.25896H14.6476C14.5376 5.30895 14.4376 5.43893 14.4376 5.6289V8.97841C14.4376 9.15838 14.5376 9.29836 14.6476 9.33835H13.3878ZM17.0971 8.40849C17.0971 7.62861 15.2675 7.45863 15.2675 6.20882C15.2675 5.43893 15.9973 5.18896 16.6372 5.18896C16.9272 5.18896 17.3371 5.22896 17.6071 5.34894L17.6571 6.10883C17.4971 5.76888 17.0872 5.52891 16.7172 5.52891C16.4173 5.52891 16.1073 5.67889 16.1073 6.01884C16.1073 6.82872 17.967 7.0187 17.967 8.19852C17.967 9.0484 17.2171 9.40834 16.4673 9.40834C16.0773 9.40834 15.5374 9.32836 15.2075 9.10839C15.1875 8.96841 15.1775 8.82843 15.1775 8.68845C15.1775 8.51847 15.1875 8.3585 15.2175 8.18852C15.4274 8.65845 15.8574 9.0284 16.3873 9.0284C16.7972 9.0284 17.0971 8.85843 17.0971 8.40849ZM21.0265 9.33835C21.1165 9.29836 21.2065 9.15838 21.2065 8.97841V7.45863C20.9865 7.43863 20.6866 7.41864 20.3366 7.41864C19.9867 7.41864 19.6767 7.42864 19.4568 7.45863V8.97841C19.4568 9.15838 19.5467 9.29836 19.6367 9.33835H18.4269C18.5169 9.29836 18.6169 9.15838 18.6169 8.97841V5.6289C18.6169 5.43893 18.5169 5.30895 18.4269 5.25896H19.6367C19.5467 5.30895 19.4568 5.43893 19.4568 5.6289V6.9887C19.6767 7.0087 19.9867 7.02869 20.3366 7.02869C20.6766 7.02869 20.9865 7.0187 21.2065 6.9887V5.6189C21.2065 5.42893 21.1165 5.29895 21.0265 5.24896H22.2363C22.1463 5.29895 22.0563 5.42893 22.0563 5.6189V8.96841C22.0563 9.14838 22.1463 9.28836 22.2363 9.32835H21.0265V9.33835Z" fill="#2E5C99" />
                                    <path d="M26.7155 9.33835C26.7555 9.29836 26.7855 9.26836 26.7855 9.19838C26.7855 9.17838 26.7755 9.12839 26.7455 9.0584C26.7455 9.0584 26.4056 8.14853 26.3756 8.03855C26.1256 8.00855 25.8657 8.00855 25.6057 8.00855C25.3658 8.00855 25.1158 8.01855 24.8758 8.03855C24.8458 8.12853 24.4859 9.0384 24.4859 9.0384C24.4359 9.15838 24.4159 9.19837 24.4159 9.22837C24.4159 9.28836 24.4659 9.31836 24.5159 9.33835H23.686C23.806 9.27836 23.916 9.14838 23.966 9.0284L25.3158 5.53891C25.3258 5.52891 25.3258 5.50892 25.3258 5.48892C25.3258 5.38894 25.2658 5.29895 25.1758 5.25896H26.2356L27.6054 9.0284C27.6654 9.17838 27.7854 9.28836 27.8853 9.34835L26.7155 9.33835ZM25.6557 6.02884L25.0358 7.61861C25.2158 7.6386 25.4157 7.6486 25.5957 7.6486C25.8057 7.6486 26.0256 7.6486 26.2256 7.61861L25.6557 6.02884ZM28.0953 9.33835C28.1953 9.28836 28.3053 9.15838 28.3053 8.97841V5.6289C28.3053 5.43893 28.2053 5.30895 28.0953 5.25896H29.3551C29.2451 5.30895 29.1451 5.43893 29.1451 5.6289V8.97841C29.1451 9.15838 29.2451 9.29836 29.3551 9.33835H28.0953ZM31.2648 5.59891C31.1948 5.59891 31.1348 5.6089 31.0648 5.6189V7.02869C31.1348 7.02869 31.1948 7.03869 31.2548 7.03869C31.7147 7.03869 32.0546 6.78873 32.0546 6.2888C32.0546 5.77888 31.7147 5.59891 31.2648 5.59891ZM33.4244 9.35835C33.2644 9.35835 33.0945 9.36835 32.9445 9.31836C32.6645 9.23837 32.2846 8.60846 32.1346 8.3685C31.8947 7.96855 31.5947 7.40864 31.0648 7.40864V8.96841C31.0648 9.10839 31.1248 9.26836 31.2548 9.32835H30.025C30.155 9.25837 30.2149 9.10839 30.2149 8.96841V5.6189C30.2149 5.47892 30.155 5.31895 30.025 5.24896H31.5047C32.1446 5.24896 32.9445 5.49892 32.9445 6.2688C32.9445 6.91871 32.3546 7.24866 31.9147 7.24866C32.7945 7.29865 33.3244 9.25837 34.2043 9.25837C33.9543 9.32836 33.6944 9.35835 33.4244 9.35835ZM38.5236 5.6489L37.2838 9.33835C37.1838 9.33835 37.0838 9.29836 37.0238 9.25837C36.9038 9.13838 36.7039 8.64845 36.6339 8.46848L36.074 7.04869L35.2641 9.33835H34.8842L33.4944 5.6389C33.4344 5.47892 33.3344 5.32894 33.1845 5.24896H34.3843C34.3343 5.28895 34.2943 5.32894 34.2943 5.41893C34.2943 5.45892 34.3143 5.51892 34.3343 5.55891L35.2441 8.00855L36.2039 5.24896L37.2638 7.90857L38.0636 5.49892C38.0836 5.42893 38.0936 5.40893 38.0936 5.36894C38.0936 5.31894 38.0736 5.28895 38.0236 5.24896H38.8235C38.6835 5.32894 38.5736 5.49892 38.5236 5.6489ZM40.0133 6.02884L39.3934 7.61861C39.5834 7.6386 39.7734 7.6486 39.9533 7.6486C40.1633 7.6486 40.3833 7.6486 40.5832 7.61861L40.0133 6.02884ZM41.0731 9.33835C41.1131 9.29836 41.1431 9.26836 41.1431 9.19838C41.1431 9.17838 41.1331 9.12839 41.1031 9.0584C41.1031 9.0584 40.7732 8.14853 40.7332 8.03855C40.4832 8.00855 40.2133 8.00855 39.9633 8.00855C39.7234 8.00855 39.4734 8.01855 39.2334 8.03855C39.1934 8.12853 38.8435 9.0384 38.8435 9.0384C38.7935 9.15838 38.7735 9.19837 38.7735 9.22837C38.7735 9.28836 38.8235 9.31836 38.8635 9.33835H38.0436C38.1636 9.27836 38.2736 9.14838 38.3236 9.0284L39.6834 5.53891C39.6834 5.52891 39.6934 5.50892 39.6934 5.48892C39.6934 5.38894 39.6334 5.29895 39.5434 5.25896H40.6032L41.973 9.0284C42.033 9.17838 42.153 9.28836 42.2529 9.34835L41.0731 9.33835ZM44.7725 5.67889L43.8027 7.37864V8.97841C43.8027 9.10839 43.8527 9.27836 43.9827 9.33835H42.7829C42.9028 9.26836 42.9628 9.09839 42.9628 8.97841V7.37864L42.123 6.02884C42.043 5.89886 41.693 5.31894 41.2731 5.31894C41.3931 5.27895 41.743 5.20896 41.983 5.20896C42.3829 5.20896 42.5729 5.24896 42.8128 5.6289L43.5927 6.85872C43.6627 6.73874 44.2726 5.66889 44.2726 5.66889C44.3426 5.53891 44.4026 5.44893 44.4026 5.39893C44.4026 5.33894 44.3726 5.29895 44.3126 5.25896H45.1825C45.0025 5.32895 44.8625 5.51892 44.7725 5.67889ZM47.0321 8.40849C47.0321 7.62861 45.2024 7.45863 45.2024 6.20882C45.2024 5.43893 45.9323 5.18896 46.5722 5.18896C46.8622 5.18896 47.2721 5.22896 47.5321 5.34894L47.5821 6.10883C47.4221 5.76888 47.0121 5.52891 46.6422 5.52891C46.3423 5.52891 46.0323 5.67889 46.0323 6.01884C46.0323 6.82872 47.892 7.0187 47.892 8.19852C47.892 9.0484 47.1521 9.40834 46.3923 9.40834C46.0023 9.40834 45.4624 9.32836 45.1325 9.10839C45.1125 8.96841 45.1025 8.82843 45.1025 8.68845C45.1025 8.51847 45.1225 8.3585 45.1425 8.18852C45.3524 8.65845 45.7824 9.0284 46.3123 9.0284C46.7322 9.0284 47.0321 8.85843 47.0321 8.40849Z" fill="#2E5C99" />
                                    <path d="M58.3103 2.39008C57.6204 3.06998 56.1307 3.65989 55.4008 3.92985C54.401 4.3098 53.9611 4.43978 53.4011 4.61975C52.7713 4.82972 51.5015 5.20967 51.5015 5.20967C54.131 5.98955 55.9807 6.22951 55.9807 6.22951C55.9807 6.22951 56.8406 5.95955 58.2103 5.22966C58.9502 4.84972 59.3102 4.59976 59.5701 4.35979C59.6701 4.2698 59.9101 4.01984 59.9801 3.68989C59.9801 3.66989 60 3.5999 60 3.53991C60 3.53991 60 3.49992 60 3.45992C60 3.41993 59.99 3.38993 59.99 3.38993C59.99 3.38993 59.98 3.30995 59.9601 3.25995C59.9401 3.20996 59.8601 3.03998 59.7201 2.93C59.6301 2.86001 59.4701 2.67004 58.9002 2.47007C58.7103 2.40008 58.3903 2.34009 58.3903 2.34009L58.3103 2.39008Z" fill="url(#paint0_linear_821_95723)" />
                                    <path d="M59.99 3.53012C59.99 3.53012 59.99 3.46013 59.97 3.40014C59.96 3.34014 59.93 3.29015 59.89 3.24016C59.85 3.17017 59.78 3.10018 59.7001 3.01019C59.6301 2.9502 59.5601 2.89021 59.4701 2.83022C59.1102 2.60025 58.6502 2.46028 58.2403 2.41028C57.6104 2.33029 56.8805 2.34029 56.8105 2.34029C56.5806 2.34029 55.0608 2.35029 54.6809 2.36029C52.9512 2.40028 50.8415 2.40028 50.2916 2.40028C44.5826 2.43028 42.093 2.3003 39.3235 1.75038C36.9738 1.28045 35.6641 0.840512 35.6641 0.840512C37.7437 0.770523 49.8517 0.270598 52.0613 0.210606C53.5111 0.170612 54.5309 0.160614 55.3608 0.210606C55.7807 0.230603 56.1706 0.270597 56.6706 0.350585C57.1105 0.430573 57.5104 0.550555 57.7504 0.640542C58.2403 0.820515 58.6602 1.09048 58.8602 1.36044C58.8602 1.36044 58.9202 1.42043 59.0002 1.53041C59.0902 1.66039 59.2001 1.82037 59.2401 1.88036C59.5401 2.33029 59.6801 2.62025 59.7301 2.72023C59.78 2.82022 59.83 2.9302 59.88 3.04019C59.92 3.15017 59.94 3.21016 59.96 3.25016C59.99 3.36014 60 3.46013 60 3.49012L59.99 3.53012Z" fill="#CE210F" />
                                    <defs>
                                      <linearGradient id="paint0_linear_821_95723" x1="57.4368" y1="1.56121" x2="54.3707" y2="6.87167" gradientUnits="userSpaceOnUse">
                                        <stop stop-color="#E6EBEF" />
                                        <stop offset="0.0764" stop-color="#BBCEE5" />
                                        <stop offset="0.1854" stop-color="#85A9D8" />
                                        <stop offset="0.2796" stop-color="#5D8FCF" />
                                        <stop offset="0.3543" stop-color="#457EC9" />
                                        <stop offset="0.4" stop-color="#3C78C7" />
                                        <stop offset="0.9" stop-color="#2E5C99" />
                                      </linearGradient>
                                    </defs>
                                  </svg>
                                </Text>
                              }
                              <Text className="cls-availableflight-no fs-12 f-reg cls-dark-grey">
                                {flight.flightNumber}
                              </Text>
                            </Col>
                            <Col xs={8} sm={4} md={8} lg={6} xl={5} className={`${isSmallScreen || isMediumScreen ? "text-left" : "text-right"}`}>
                              <Text className="cls-dep-time fs-13 f-med">{flight.depTime}</Text>{" "}
                              <br />
                              {/* <Text className="cls-dep-date">{flight.departureDate}</Text> */}
                              <Text className="cls-dep-date fs-13 f-med">
                                {staticDepartureDate}
                              </Text>
                            </Col>
                            <Col xs={6} sm={6} md={6} lg={5} xl={7} className={`cls-duration-stops text-center`}>
                              <Text className="cls-stops w-100 fs-12 f-reg">0 Stop(s)</Text>
                              <Text className="w-100"><FdOriginDestination /></Text>
                              <Text className="cls-duration w-100 fs-12 f-reg">2h 00m</Text>
                            </Col>
                            <Col xs={8} sm={4} md={8} lg={6} xl={5} className={`${isSmallScreen || isMediumScreen ? "text-right" : "text-left"}`}>
                              <Text className="cls-arr-time d-block fs-13 f-med">{flight.arrTime}</Text>
                              <Text className="cls-arr-date fs-13 f-med">{staticDepartureDate}</Text>
                            </Col>
                            <Col xs={24} sm={3} md={24} lg={4} xl={3} className="text-right">
                              <FdFlightSeatIcon />
                              <Text className="fs-12 f-reg">{availableSeats} left</Text>
                            </Col>
                          </Row>
                        </Card>
                    );
                  }) : (
                    <>
                      {[...Array(6)].map((_, col) => (
                        <Skeleton.Input
                          active
                          size="default"
                          block
                          style={{ height: "85px", marginTop: "20px" }}
                        />
                      ))}
                    </>
                  )}
              </Col>
            </Row>
          </Col>
        </>
      }
      <ReaccommodationModal
        isModalOpen={isModalOpen}
        handleOk={handleOk}
        handleCancel={handleCancel}
        reaccommodatedDetails={reaccommodatedDetails}
        // mappedDetails={mappedDetails}
        showHeader={showHeader}
        showModalFooter={showModalFooter}
        activeModalTab={activeModalTab}
        loading={loading}
      />
      <Col xs={24} sm={24} md={24} lg={24} xl={24}>
        <Row justify={"center"} className="my-4 cls-btn-row">
          {/* <Button
            type="default"
            size="large"
            className="cls-default"
            onClick={resetHandler}
          >
            {t("reset")}
          </Button> */}
          <Button
            type="primary"
            size="large"
            className={`cls-primary-btn cls-reassign-btn mb-6 ${(!reaccommodatedDetails?.length && !isCurrentPathEqual("adhocPnrList")) && "cls-disabled"} ${isCurrentPathEqual("adhocPnrList") ? "mt-8" : ""}`}
            onClick={completeReaccomdationHandler}
          >
            {!isCurrentPathEqual("adhocPnrList") ? t("re_accommodate") : "Continue to Re-accommodation"}
          </Button>
        </Row>
      </Col>
      <ConfirmModalPopup onData={popupHandler} props={popupData} />
      {contextHolder}
    </Row>
  ) : (
    <ReaccommodationFlightSkeleton />
  );
};

export default Reaccommodation;
