import {
  Button,
  Col,
  Flex,
  Modal,
  Row,
  Form,
  Input,
  TableColumnsType,
  Typography,
  Tooltip,
  Select,
  Popconfirm,
  Alert,
} from "antd";
import { useEffect, useState } from "react";
import "./PrePlannedDisruptedPNRList.scss";
import { useTranslation } from "react-i18next";
import {
  FdMailIcon,
  FdMessageIcon,
  FdPlusIcon,
  FdWhatsappIcon,
} from "@/components/Icons/Icons";
import TableDisplay from "@/components/Table/Table";
// import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
// import TableTab from "@/components/TableTab/TableTab";
import SyncPnrModal from "../SyncPnrModal/SyncPnrModal";
import { useToggle } from "@/hooks/Toggle.hook";
import {
  useGetPreviewTemplateMutation,
  useLazyGetTemplateQuery,
  useSendEmailMutation,
} from "@/services/email/Email";
import { ToasterType, useToaster } from "@/hooks/Toaster.hook";
import { Link } from "react-router-dom";
import UseInputValidation from "@/hooks/Validations.hook";
import PrePlannedDisruptedPNRListSkeleton from "./PrePlannedDisruptedPNRList.skeleton";
import { updateQueuePnrs } from "@/stores/PnrList.store";
// import { useGetPreplannedPnrListMutation } from "@/services/reschedule/Reschedule";
import { useAppDispatch, useAppSelector } from "@/hooks/App.hook";
import { IssuesCloseOutlined } from "@ant-design/icons";
import { useRedirect } from "@/hooks/Redirect.hook";
// import { useLocation } from "react-router";
import EmailPreviewModal from "@/components/EmailPreviewModal/EmailPreviewModal";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { getDynamicDate } from "@/Utils/general";
import { encryptData } from "@/hooks/EncryptDecrypt.hook";
import {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import useGetPNRData from "@/hooks/GetPNRData.hook";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
const { Text, Title } = Typography;
// type FilterType = "all" | "tab" | "search";

/**
 * PrePlannedDisruptedPNRList component displays a list of disrupted PNRs with filtering and search functionalities.
 * It allows users to view, filter, search, and synchronize PNRs.
 */
const PrePlannedDisruptedPNRList = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentPath, redirect, getEncryptedPath, isCurrentPathEqual } =
    useRedirect();
  // const [, SsetFormData] = useSessionStorage<any>("formData");
  const { queuePnrs, reloadPnrList } = useAppSelector(
    (state: any) => state.PnrListReducer
  );
  // const [filterTab, setFilterTab] = useState<string>("all");
  const [tableData, setTableData] = useState<any>([]);
  const [tabOptions, setTabOptions] = useState<any>();

  /* Preview email modal states */
  const [isPreviewModalOpen, togglePreviewModal] = useToggle(false);
  const [previewData, setPreviewData] = useState<any>(null);

  /* Email service */
  const [getTemplateService, getTemplateResponse] = useLazyGetTemplateQuery();
  const [getTemplatePreviewService, getTemplatePreviewResponse] =
    useGetPreviewTemplateMutation();
  const [sendEmailService, sendEmailResponse] = useSendEmailMutation();
  const [errorPNR, setErrorPNR] = useState<any>();
  const [isPreviewEmailLoading, setIsPreviewEmailLoading] =
    useState<boolean>(false);
  // const [SadhocFlightPNRs, , SremoveAdhocFlightPNRs] =
  //   useSessionStorage<any>("adhocFlightPNRs");
  const [SPNRQueueOption, SsetPNRQueueOption] =
    useSessionStorage<any>("PNRQueueOption");
  const pnrQueue = useGetPNRData("pnrQueue");
  const [, SsetFinalViewPnrData] = useSessionStorage<any>("finalViewPNRData");
  const [, SsetPrevPath] = useSessionStorage("prevPath");
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle(false);
  const isResponsive = window.innerWidth < 768;

  /* Selected PNRs */
  const [selectedPnrs, setselectedPnrs] = useState<any[]>();

  /* Sync PNR modal states */
  const [isModalOpen, toggleModal] = useToggle(false);
  const [isPNRSelected, setIsPNRSelected] = useState<boolean>(false);
  const [isMailConfirmModalOpen, toggleMailConfirmModal] = useToggle();
  const [contactForm] = Form.useForm();
  const [contactModalOpen, setContactModalOpen] = useState<any>();
  const [isFormValid, setIsFormValid] = useState(false);

  useEffect(() => {
    dispatch(updateQueuePnrs([]));
    if (!isCurrentPathEqual("adhocPnrList")) {
      // SremoveAdhocFlightPNRs();
      if (pnrQueue) {
        tableDataChange();
      }
      // eslint-disable-next-line
    }
  }, [currentPath]);

  const tableDataChange = () => {
    pnrQueue?.forEach((pnrList: any) => {
      if (SPNRQueueOption === pnrList.purposeName) {
        dispatch(updateQueuePnrs(pnrList.data));
      }
    });
  };

  useEffect(() => {
    SsetPNRQueueOption(SPNRQueueOption ? SPNRQueueOption : "Disruption data");
    setTableData([]);
  }, []);

  const addContactHandler = (values: any, pnr: any) => {
    const element = document.querySelector(`.cls-${errorPNR}-email`);
    if (element) {
      const parent = element.parentElement;
      parent?.removeChild(element);
      const textNode = document.createTextNode(values.contact);
      parent?.appendChild(textNode);
    }
    contactForm.setFieldValue("contact", null);
    contactModalToggle(pnr, false);
    setErrorPNR(null);
  };

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

  /* Prepares 'Tab' filter options */
  const prepareTabOptions = (PNRs: any) => {
    const statusSet = new Set<string>(); // Use a Set to store unique values

    PNRs?.forEach((pnr: any) => statusSet.add(pnr.status)); // Add each status to the set

    const options = [
      {
        label: (
          <>
            {t("all")}{" "}
            <Text className="cls-list-count">
              (
              {!isCurrentPathEqual("prePlanned")
                ? props?.adhocPnrData?.length
                : queuePnrs.length}
              )
            </Text>
          </>
        ),
        value: "all",
      },
      ...Array.from(statusSet).map((status, index) => ({
        label: (
          <>
            <Text
              type={
                status === "Reaccommodated"
                  ? "success"
                  : status === "Email not sent" || status === "Cancelled"
                    ? "danger"
                    : "warning"
              }
              style={{
                color:
                  status === "Accepted" ? "var(--t-score-setting-best)" : "",
              }}
              className={`f-reg ${status === "Email sent" && "cls-primary-color"
                }`}
            >
              {status}{" "}
              <Text className="cls-list-count">
                (
                {!isCurrentPathEqual("prePlanned")
                  ? props?.adhocPnrData.filter((pnr: any) => pnr.status === status)
                    .length
                  : queuePnrs.filter((pnr: any) => pnr.status === status)
                    .length}
                )
              </Text>
            </Text>
          </>
        ),
        value: status,
      })),
    ];

    setTabOptions(options);
  };

  const [pageTableData, setPageTableData] = useState<any[]>([]);
  const user: any = localStorage.getItem(
    process.env.REACT_APP_STORAGE_PREFIX + "user"
  );
  let userRole: any;
  const decodedUser = atob(user);
  let user_local: any;
  try {
    user_local = JSON.parse(decodedUser);
    if (user_local?.groups?.length) {
      userRole = user_local.groups
        .find((group: string) => group.includes("fdms"))
        .split("_")
        .splice(1)
        .join(" "); // Split the string into an array of word
      userRole = userRole.charAt(0).toUpperCase() + userRole.substring(1);
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error, decodedUser);
  }

  /* Setting table data from API Queue PNR service */
  useEffect(() => {
    if (!queuePnrs?.length) return;
    var tempTableData = !isCurrentPathEqual("prePlanned")
      ? props?.adhocPnrData?.map(prepareTableData)
      : queuePnrs.map(prepareTableData);
    setPageTableData(tempTableData);
    var emailNotFoundPNR: any = [];
    setTableData(tempTableData);
    tempTableData?.forEach((data: any) => {
      if (typeof data?.emailId !== "string") {
        emailNotFoundPNR[data?.pnr] = { emailFound: false };
      }
    });
    setContactModalOpen(emailNotFoundPNR);
    prepareTabOptions(
      !isCurrentPathEqual("prePlanned") ? props?.adhocPnrData : queuePnrs
    );
    // eslint-disable-next-line
  }, [queuePnrs, errorPNR, props?.adhocPnrData]);

  const SEARCH_FILTER_FIELDS = ["PNR"];

  const viewPnr = (record: any) => {
    // SsetFormData({
    //   PNR: record?.PNR,
    //   emailId: record?.emailId,
    // });
    SsetPrevPath(currentPath);
    var pnr: any = [];
    pnr.push(record);
    SsetFinalViewPnrData(pnr);
    redirect("viewPnrInfo");
  };

  const constructWhatsAppMessage = (data: any, title: string) => {
    return data
      ?.map((flightData: any) => {
        const trip = "*" + flightData?.trip + "*" || "";
        const flightDetails = flightData?.flightDetails
          ?.map((item: any, index: number) => {
            const stopsInfo =
              flightData.flightDetails.length !== index + 1 &&
                flightData.stops !== ""
                ? `${flightData?.stops} stop(s) - ${flightData?.stopDetails[index]?.airportName} (${flightData?.stopDetails[index]?.airportCode})`
                : "";
            return `${"Origin: " + item?.originAirportCode} \n${"Destination: " + item?.destinationAirportCode} \n${"Flight number: " + item?.flightNumber} \n${"Depart date & time: " + item?.departDate} ${item?.depart} \n${"Arrival date & time: " + item?.duration} ${item?.arrival} \n${"Status: *" + item?.status} ${item?.statusCode + "*"} \n${stopsInfo ? "*" + stopsInfo + "*" : ""}`;
          })
          .join("\n");
        return `${trip.toUpperCase()} ${"*" + title + "*"}\n${flightDetails}\n`;
      })
      .join("\n");
  };

  const getURL = (pnr: any) => {
    const redirectUrl = `${process.env.REACT_APP_REDIRECT_URL}${getEncryptedPath("viewPnrInfo").slice(1)}?${encryptData(`${pnr.PNR}.${pnr.lastName}`)}`;
    return `*To process, click here:* \n ${redirectUrl}`;
  };

  const contactModalToggle = (pnr: string, bool: boolean) => {
    setContactModalOpen((prevState: any) => {
      // Create a new state object with all emailFound set to false
      const newState = Object.keys(prevState).reduce((acc: any, key: any) => {
        acc[key] = { emailFound: false };
        return acc;
      }, {});

      // Set the emailFound of the specified PNR to the provided status
      newState[pnr] = { emailFound: bool };
      return newState;
    });
  };

  /* Converts PNR data from API to table data format */
  const prepareTableData = (pnrData: any) => {
    return {
      key: pnrData.PNR,
      pnrData: pnrData,
      pnr: pnrData.PNR,
      passengers: `${pnrData.totalPaxCount} (${pnrData.totalAdultPaxCount}A / ${pnrData.totalChildPaxCount}C / ${pnrData.totalInfantPaxCount}I)`,
      emailId: pnrData.emailId ? (
        pnrData.emailId
      ) : (
        <Popconfirm
          title="Add primary contact info for this PNR"
          description={
            <Form
              style={{ width: "300px" }}
              className="mt-2 pr-4"
              name="contactForm"
              form={contactForm}
              onFinish={(value) => addContactHandler(value, pnrData.PNR)}
            >
              <Form.Item
                name="contact"
                style={{ marginBottom: 10 }}
                rules={[
                  {
                    validator: validateEmailOrPhoneNumber,
                  },
                ]}
              // rules={[
              //   {
              //     required: true,
              //     message:
              //       "Please enter a valid email ID or 10-digit phone number!",
              //   },
              // ]}
              >
                <Input
                  placeholder="Email ID / Mobile number"
                // onChange={validateEmailOrPhoneNumber}
                />
              </Form.Item>
            </Form>
          }
          okText="Add"
          cancelText="No"
          open={contactModalOpen?.[pnrData.PNR]?.emailFound}
          onCancel={() => {
            contactModalToggle(pnrData.PNR, false);
            setErrorPNR(null);
          }}
          onConfirm={() => contactForm.submit()}
        // okButtonProps={{
        //   disabled: !isFormValid,
        // }}
        >
          <Text
            className={`f-reg fs-13 cls-cancelled cls-${pnrData.PNR}-email d-flex space-between align-center`}
            style={{ cursor: "pointer" }}
            onClick={() => {
              contactModalToggle(pnrData.PNR, true);
              setErrorPNR(pnrData.PNR);
            }}
          >
            {t("no_contact_information")}
            <Tooltip
              title={
                !contactModalOpen?.[pnrData.PNR]?.emailFound
                  ? "Click here to add primary contact info for this PNR"
                  : ""
              }
              className="cls-cursor-pointer"
            >
              <FdPlusIcon />
            </Tooltip>
          </Text>
        </Popconfirm>
      ),
      readAt:
        pnrData.readAt !== "-"
          ? pnrData.readAt.split(" ")[1] +
          ", " +
          getDynamicDate(pnrData.readAt.split(" ")[0])
          : // <>
          //   <Text className="d-block"> {pnrData.readAt.split(" ")[1]}{", "}</Text>
          //   <Text className="d-block"> {getDynamicDate(pnrData.readAt.split(" ")[0]) as string} </Text>
          // </>
          pnrData.readAt,
      adhocPnrPolicy: pnrData.policy,
      score: pnrData.score,
      status: pnrData.status,
      pnrStatus: pnrData.status,
      notificationStatus: pnrData?.notificationStatus,
      flightNumber: pnrData?.flightNumber,
      reassignedFlightNo: pnrData?.reassignedFlightNo,
      reassignedDepartureDate: pnrData?.departureDate ? getDynamicDate(pnrData?.reassignedDepartureDate) : "-",
      stdDeparture: pnrData?.stdDeparture,
      etdDeparture: pnrData?.etdDeparture,
      route: pnrData?.sector,
      reassignedRoute: pnrData?.reassignedSector,
      departureDate: pnrData?.departureDate ? getDynamicDate(pnrData?.departureDate) : "-",
      remainingPax: pnrData?.remainingPax,
      policy: pnrData.policy,
      remarks: pnrData?.remarks,
      reason: pnrData.reason,
      alertStatus: (
        <Flex
          gap={10}
          align="center"
          className={`${pnrData.status === "Email not sent" || pnrData.status === "In progress" ? "cls-grayscale" : ""}`}
        >
          <Tooltip
            className={`cls-cursor-pointer ${pnrData?.emailId === "" ? "cls-disabled no-events" : ""}`}
            title={t("share_using_whatsapp")}
          >
            <Link
              type="link"
              to={`https://web.whatsapp.com/send?text=${encodeURIComponent(
                constructWhatsAppMessage(
                  pnrData?.originalFlightDetails,
                  "Original booked data"
                )
              ) +
                encodeURIComponent(
                  constructWhatsAppMessage(
                    pnrData?.rebookOptionalFlightDetails,
                    "Rebook optional data"
                  )
                ) +
                getURL(pnrData)
                }`}
              className="px-0 py-0 d-flex"
              target="_blank"
              data-action="share/whatsapp/share"
            >
              <FdWhatsappIcon />
            </Link>
          </Tooltip>
          <Tooltip
            className={`cls-cursor-pointer ${pnrData?.emailId === "" ? "cls-disabled no-events" : ""}`}
            title={t("share_using_mail")}
          >
            <Button
              type="link"
              onClick={() => previewTemplate(pnrData)}
              className="px-0 py-0 "
            >
              <FdMailIcon />
            </Button>
          </Tooltip>
          <Tooltip
            className={`cls-cursor-pointer ${pnrData?.emailId === "" ? "cls-disabled no-events" : ""}`}
            title={t("disbled_messages_description")}
          >
            <Button
              type="link"
              className="px-0 py-0 cls-disabled"
              // href={pnrData.alertStatus.sms}
              disabled
            >
              <FdMessageIcon />
            </Button>
          </Tooltip>
        </Flex>
      ),
      action: (
        <Tooltip
          title={
            userRole === "Service executive"
              ? t("process_on_behalf_of_customer")
              : t("process_on_behalf_of_agency")
          }
        >
          <Text
            className="fs-23 d-block w-100 text-center cursor cls-cursor-pointer"
            onClick={() => {
              if (
                isCurrentPathEqual("prePlanned") ||
                isCurrentPathEqual("adhocPnrList")
              ) {
                viewPnr(pnrData);
              }
            }}
            type="warning"
          >
            <IssuesCloseOutlined />
          </Text>
        </Tooltip>
      ),
    };
  };

  const formatDate = () => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const date = new Date();
    const dayName = days[date.getDay()];
    const monthName = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();
    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const ampm = hours >= 12 ? "PM" : "AM";
    hours = hours % 12 || 12; // Convert to 12-hour format

    return `${dayName}, ${monthName} ${day}, ${year} at ${hours}:${minutes} ${ampm}`;
  };

  const { showToaster, toasterContextHolder } = useToaster();

  const prepareEmailFlightData = (pnrData: any = {}) => {
    const getStatusColor = (statusCode: string) => {
      if (statusCode === "HK") return "#2E8540";
      if (statusCode === "TK") return "#B65B16";
      if (statusCode === "WK") return "#DA373E";
      return "#133769";
    };

    const mapFlightDetails = (originalFlightDetails = [], pnr = "") => {
      return originalFlightDetails.flatMap((originalFlightDetail: any) =>
        originalFlightDetail?.flightDetails?.map((flight: any) => ({
          pnr: flight.flightNumber,
          departure: flight.originAirportCode || "",
          arrival: flight.destinationAirportCode || "",
          "departure time": flight.depart || "",
          "travel hours": flight.duration || "",
          "dpt date": getDynamicDate(flight.departDate) || "",
          "avl date": getDynamicDate(flight.arrivalDate) || "",
          "avl time": flight.arrival || "",
          status: `${flight.status} (${flight.statusCode})` || "",
          "status color": getStatusColor(flight.statusCode) || "",
        }))
      );
    };

    const pnr = pnrData.PNR || "";

    return {
      pnr,
      originalFlight: mapFlightDetails(pnrData.originalFlightDetails, pnr),
      reBookedFlight: mapFlightDetails(
        pnrData.rebookOptionalFlightDetails,
        pnr
      ),
      "booked date": getDynamicDate(pnrData.dateOfBooking) || "",
      "current time": formatDate(),
      product_link: `${process.env.REACT_APP_REDIRECT_URL}${getEncryptedPath("viewPnrInfo").slice(1)}?${encryptData(`${pnr}.${pnrData.lastName}`)}`,
    };
  };

  const previewTemplate = async (pnrData: any) => {
    var temp: any = {};
    temp["pnr"] = pnrData?.PNR;
    temp["emailId"] = pnrData?.emailId;
    temp["pnrData"] = pnrData;
    setselectedPnrs([temp]);

    if (
      isPreviewEmailLoading ||
      getTemplateResponse?.status === "pending" ||
      getTemplatePreviewResponse?.status === "pending" ||
      getTemplateResponse?.isLoading ||
      getTemplatePreviewResponse?.isLoading
    )
      return;

    setIsPreviewEmailLoading(true);

    var temp: any = {};
    temp["pnr"] = pnrData?.PNR;
    temp["emailId"] = pnrData?.emailId;
    temp["pnrData"] = pnrData;
    setselectedPnrs([temp]);

    let response: any = await getTemplateService({});

    if (response?.isSuccess) {
      response = response?.data?.response?.data;
    } else {
      showToaster({
        type: "error",
        title: "Service Error",
        description: "Service error occurred while getting template",
      });
      setIsPreviewEmailLoading(false);
      return false;
    }

    if (
      Object.keys(response).length &&
      pnrData &&
      Object.keys(pnrData).length
    ) {
      const postData = {
        project: 31,
        template_content: response?.template_content,
        request_format_value: prepareEmailFlightData(pnrData),
        subject: response.subject,
      };

      getTemplatePreviewService(postData as any).then((response: any) => {
        if (response?.data?.response?.data) {
          setPreviewData(response.data.response.data);
        }
        setIsPreviewEmailLoading(false);
      });
    } else {
      setIsPreviewEmailLoading(false);
    }
  };

  /* To open the preview email modal when the response data is ready to be rendered */
  useEffect(() => {
    if (previewData && Object.keys(previewData)?.length) togglePreviewModal();
  }, [previewData]);

  /* Action menu selection handler */
  const selectAllShare = (value: string) => {
    value === "email" && toggleMailConfirmModal();
  };

  const downloadHtmlContent = () => {
    // Create a Blob containing the HTML content
    const blob = new Blob([previewData?.template_content_value], {
      type: "text/html",
    });

    // Create a URL for the Blob
    const url = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");
    link.href = url;

    // Set the download attribute to specify the filename
    link.download = "emailPreview.html";

    // Append the link to the document body
    document.body.appendChild(link);

    // Trigger a click event to initiate the download
    link.click();

    // Clean up by revoking the URL
    URL.revokeObjectURL(url);
  };

  /* Mail sending handler */
  const sendMail = () => {
    const postData: any = {
      setting_id: 173,
      globalData: prepareEmailFlightData(selectedPnrs?.[0]?.pnrData),
      reloadPnrList: [],
      attachments: [],
    };

    postData["recipientList"] = selectedPnrs
      ?.filter((pnrData: any) => pnrData?.pnrData?.emailId !== "")
      ?.map((pnr: any) => ({
        action_name: "rs_reschedule_flight_details",
        language_code: "EN",
        to: [pnr?.emailId],
        cc: ["sales@infinitisoftware.net", "aruna@infinitisoftware.net"],
        bcc: [],
        data: prepareEmailFlightData(pnr?.pnrData),
      }));

    sendEmailService(postData);
  };

  useEffect(() => {
    if (!sendEmailResponse?.isUninitialized && !sendEmailResponse?.isLoading) {
      let toasterSetting: ToasterType;
      if (sendEmailResponse?.isSuccess) {
        let pnrs: string = "";
        selectedPnrs
          ?.filter((pnrData: any) => pnrData?.pnrData?.emailId !== "")
          ?.forEach((pnr: any, index: number) => {
            pnrs += `${pnr.pnr}`;
            if (
              selectedPnrs?.filter(
                (pnrData: any) => pnrData?.pnrData?.emailId !== ""
              )?.length -
              1 >
              index
            )
              pnrs += ",";
          });
        toasterSetting = {
          type: "success",
          title: "Success",
          description: t("email_sent_successfully"),
          width: 450,
        };
      } else {
        toasterSetting = {
          type: "error",
          title: "Service Error",
          description: "Service error occurred while sending mail",
        };
      }
      isPNRSelected || togglePreviewModal();
      isMailConfirmModalOpen && toggleMailConfirmModal();
      showToaster(toasterSetting);
    }
    // eslint-disable-next-line
  }, [sendEmailResponse]);

  /* Fetch PNRs on component mount */
  useEffect(() => {
    !isCurrentPathEqual("prePlanned")
      ? dispatch(updateQueuePnrs(props?.adhocPnrData))
      : pnrQueue?.length && tableDataChange();
    // eslint-disable-next-line
  }, [reloadPnrList, pnrQueue]);

  const syncData = (data: any) => {
    SsetPNRQueueOption(data);
  };

  /* Columns configuration for table */
  const initialColumns: TableColumnsType<any> = [
    {
      title: t("pnr"),
      dataIndex: "pnr",
      key: "pnr",
      render: (_: any, { pnr }: any) => (
        <>
          <Text className="responsive">{t("pnr")}</Text>
          <Text className="f-med fs-13">{pnr}</Text>
        </>
      ),
    },
    ...(isCurrentPathEqual("prePlanned")
      ? []
      : [
        {
          title: "PNR status",
          dataIndex: "pnrStatus",
          key: "pnrStatus",
          render: (_: any, { pnrStatus }: any) => (
            <Text
              className={`fs-14 f-med 
            ${pnrStatus === "Open"
                  ? "cls-reaccommodate"
                  : pnrStatus === "Partially closed"
                    ? "cls-abort"
                    : undefined
                }`}
            >
              {pnrStatus}
            </Text>
          )
        },
        {
          title: "Remaining pax count",
          dataIndex: "remainingPax",
          key: "remainingPax",
          render: (remainingPax: any) => {
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
          render: (originalDetails: any, pnrData: any) => {
            return (
              <>
                <Text className="fs-13 f-reg d-block cls-dark-grey">{pnrData?.route?.toUpperCase()} {" | "} {pnrData?.flightNumber} </Text>
                <Text className="fs-13 f-reg d-block cls-dark-grey">{pnrData?.departureDate} </Text>
              </>
            )
          },
        },
        {
          title: "New flight details",
          dataIndex: "newFlightDetails",
          key: "newFlightDetails",
          render: (newFlightDetails: any, { reassignedRoute, reassignedFlightNo, reassignedDepartureDate }: any) => {
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
          render: (notificationStatus: any) => (
            <>
              <Text className="responsive">Notification status</Text>
              <Text className="f-reg fs-14">{notificationStatus}</Text>
            </>
          ),
        },
        {
          title: "Remarks",
          dataIndex: "remarks",
          key: "remarks",
        }]
    ),
    {
      title: t("passengers"),
      dataIndex: "passengers",
      key: "passengers",
      render: (_: any, { passengers }: any) => (
        <>
          <Text className="responsive">{t("passengers")}</Text>
          <Text className="f-reg fs-13">{passengers}</Text>
        </>
      ),
    },
    {
      title: t("email_id"),
      dataIndex: "emailId",
      key: "emailId",
      render: (_: any, { emailId }: any) => (
        <>
          <Text className="responsive">{t("email_id")}</Text>
          <Text className="f-reg fs-13">{emailId}</Text>
        </>
      ),
    },
    {
      title: t("read_at"),
      dataIndex: "readAt",
      key: "readAt",
      render: (_: any, { readAt }: any) => (
        <>
          <Text className="responsive">{t("read_at")}</Text>
          <Text className="f-reg fs-13">{readAt}</Text>
        </>
      ),
    },
    {
      title: t("policy"),
      dataIndex: "policy",
      key: "policy",
      render: (_: any, { policy }: any) => (
        <>
          <Text className="responsive">{t("policy")}</Text>
          <Text className="f-reg fs-13">{policy}</Text>
        </>
      ),
    },
    {
      title: t("score"),
      dataIndex: "score",
      key: "score",
      sorter: (a: any, b: any) => a.score - b.score,
      render: (_: any, { score }: any) => (
        <>
          <Text className="responsive">{t("score")}</Text>
          <Text className="f-reg fs-13">{score}</Text>
        </>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (_: any, { status }: any) => {
        return (
          <>
            <Text className="responsive">{t("status")}</Text>
            <Text
              type={
                status === "Reaccommodated"
                  ? "success"
                  : status === "Email not sent" || status === "Cancelled"
                    ? "danger"
                    : "warning"
              }
              style={{
                color: status === "Accepted" ? "var(--t-score-setting-best)" : "",
              }}
              className={`f-sbold fs-12 ${status === "Email sent" && "cls-primary-color"
                }`}
            >
              {status}
            </Text>
          </>
        );
      },
      onFilter: (value: any, record: any) => record.status.includes(value),
    },
    {
      title: t("reason"),
      dataIndex: "reason",
      key: "reason",
      render: (_: any, { reason }: any) => (
        <>
          <Text className="responsive">{t("reason")}</Text>
          <Text className="f-reg fs-13">{reason}</Text>
        </>
      ),
    },
    ...(!isCurrentPathEqual("prePlanned")
      ? [{
        title: () => (
          <Flex align="center" justify="space-between" gap={10}>
            {t("alert_status")}
            <CustomTableColumn
              setVisibleColumns={setVisibleColumns}
              initialColumns={initialColumns}
              hideableColumns={["pnr", "alertStatus", "action"]}
              selected={[
                "pnr",
                "pnrStatus",
                "remainingPax",
                "originalDetails",
                "newFlightDetails",
                "notificationStatus",
                "policy",
                "remarks",
              ]}
            />
          </Flex>
        ),
        dataIndex: "alertStatus",
        key: "alertStatus",
        render: (_: any, { alertStatus }: any) => (
          <>
            <Text className="responsive">{t("alert_status")}</Text>
            <Text className="f-reg fs-13">{alertStatus}</Text>
          </>
        ),
      }] :
      [
        {
          title: t("alert_status"),
          dataIndex: "alertStatus",
          key: "alertStatus",
          render: (_: any, { alertStatus }: any) => (
            <>
              <Text className="responsive">{t("alert_status")}</Text>
              <Text className="f-reg fs-13">{alertStatus}</Text>
            </>
          ),
        },
        {
          title: () => (
            <Flex align="center" justify="space-between" gap={10}>
              {t("action")}
              <CustomTableColumn
                setVisibleColumns={setVisibleColumns}
                initialColumns={initialColumns}
                hideableColumns={["pnr", "alertStatus", "action"]}
                selected={[
                  "pnr",
                  "emailId",
                  "readAt",
                  "policy",
                  "score",
                  "reason",
                  "status",
                ]}
              />
            </Flex>
          ),
          dataIndex: "action",
          key: "action",
          render: (_: any, { action }: any) => (
            <>
              <Text className="responsive">{t("action")}</Text>
              <Text>{action}</Text>
            </>
          ),
        }
      ]
    )
  ];

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  // Custom filter state
  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  useEffect(() => {
    if (!queuePnrs?.length) return;

    setCustomFilterProps([
      // {
      //   key: "PNR",
      //   label: "PNR",
      //   option: { key: "PNR", type: "default" },
      // },
      // {
      //   key: "emailId",
      //   label: "Email ID",
      //   option: { key: "emailId", type: "default" },
      // },
      {
        key: "policy",
        label: "Policy",
        option: { key: "policy", type: "default" },
      },
      {
        key: "status",
        label: "Status",
        option: { key: "status", type: "default" },
      },
      {
        key: "reason",
        label: "Reason",
        option: { key: "reason", type: "default" },
      },

      // {
      //   key: "score",
      //   label: "Score",
      //   option: { key: "score", type: "default" }
      // },
      // {
      //   key: "totalPaxCount",
      //   label: "Pax Count",
      //   option: { key: "totalPaxCount", type: "default" }
      // },
    ]);
  }, [queuePnrs]);

  const [filterTab, setFilterTab] = useState<string>("all");

  return (
    <>
      {queuePnrs?.length ? (
        <Row className="cls-disrupted-pnr-list">
          <Col span={24} className={"mb-2"}>
            <Row className="rg-10" justify="space-between" align="middle" gutter={10}>
              {/* <Col span={isPNRSelected ? 19 : 21}>
                {!!customFilterProps.length && (
                  <CustomFilter
                    tableData={queuePnrs}
                    filters={customFilterProps}
                    visibleColumns={visibleColumns}
                    setTableData={setTableData}
                    tableDataPreparationHandler={prepareTableData}
                  />
                )}
              </Col> */}
              {!isCurrentPathEqual("prePlanned") &&
                <Col lg={5} xs={24}>
                  <Text className="fs-20 pb-2 f-med d-block p-clr">PNR details list</Text>
                </Col>
              }
              {!!customFilterProps.length && (
                <Col lg={!isCurrentPathEqual("prePlanned") ? 15 : 18} xs={24} className={isResponsive ? "pb-2" : ""}>
                  <PersonalizedFilter
                    tableData={queuePnrs}
                    filters={customFilterProps}
                    visibleColumns={visibleColumns}
                    setTableData={setTableData}
                    tableDataPreparationHandler={prepareTableData}
                  />
                </Col>
              )}
              <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                <TableTabSearchFilter
                  data={queuePnrs}
                  tabDataKey="status"
                  currentTab={filterTab}
                  searchFields={SEARCH_FILTER_FIELDS}
                  tableDataPreparationHandler={prepareTableData}
                  setTableData={setTableData}
                  placeholder={t("search") + " " + t("pnr")}
                />
              </Col>
              {!isCurrentPathEqual("adhocPnrList") && (
                <Col className="text-right" lg={2} xs={24}>
                  <Button className="cls-primary-btn w-100" onClick={toggleModal}>
                    {t("sync_pnr")}
                  </Button>
                </Col>
              )}
              {isPNRSelected && (
                <Col span={2}>
                  <Select
                    value="Actions"
                    options={[
                      {
                        label: t("send_mail"),
                        value: "email",
                      },
                    ]}
                    style={{ width: "105px" }}
                    onChange={selectAllShare}
                    suffixIcon={
                      <Text className="Infi-Fd_04_DropdownArrow fs-10 cls-dropdown-arrow"></Text>
                    }
                  />
                </Col>
              )}

              {/* <Col span={24}>
                <Flex align="center"> */}
              {/* <TableTab
                    options={tabOptions}
                    changeHandler={setFilterTab}
                    currentTab={filterTab}
                  /> */}
              {/* </Flex>
              </Col> */}
            </Row>
          </Col>
          <Col span={24}>
            <TableDisplay
              data={tableData}
              columns={visibleColumns}
              selection={{
                type: "checkbox",
                handler: (pnrs) => {
                  setselectedPnrs(pnrs);
                  setIsPNRSelected(!!pnrs?.length);
                },
              }}
              pagination={{ pageSize: 6, position: "bottomRight" }}
              size="middle"
              loading={isPreviewEmailLoading}
            />
          </Col>
          {/* Sync PNR modal */}
          <SyncPnrModal
            isModalOpen={isModalOpen}
            toggleModal={toggleModal}
            syncData={syncData}
            queueData={pnrQueue}
            page="prePlanned"
          />
          {/* Email preview modal */}
          <EmailPreviewModal
            footer={
              <Button
                type="primary"
                onClick={sendMail}
                loading={sendEmailResponse?.isLoading}
              >
                {t("send_mail")}
              </Button>
            }
            isModalOpen={isPreviewModalOpen}
            onCancel={() => {
              togglePreviewModal();
              setPreviewData(null);
            }}
            confirmLoading={
              getTemplateResponse.isLoading ||
              getTemplatePreviewResponse.isLoading
            }
            loading={
              getTemplateResponse.isLoading ||
              getTemplatePreviewResponse.isLoading
            }
            header={
              <Row align="middle" justify="space-between">
                <Col>
                  <Title level={5}>{t("preview")}</Title>
                </Col>
                <Col>
                  <Button
                    type="link"
                    style={{
                      border: "none",
                      fontWeight: "500",
                    }}
                    onClick={downloadHtmlContent}
                    className="mr-3"
                  >
                    {t("download")}
                  </Button>
                </Col>
              </Row>
            }
            iFrameContent={previewData?.template_content_value}
          />
          <Modal
            title={false}
            open={isMailConfirmModalOpen}
            onOk={sendMail}
            confirmLoading={sendEmailResponse?.isLoading}
            onCancel={toggleMailConfirmModal}
            okText={t("send")}
          >
            <Title level={5}>{t("send_multiple_mail_confirmation")}</Title>
            {/* <Text className="mt-1 mb-2 d-iblock">
              {selectedPnrs?.filter((pnrData:any) => pnrData?.pnrData?.emailId !== "")?.map((pnr: any, index: number) => (
                <Text strong key={index}>
                  {pnr?.pnr}
                  {selectedPnrs?.filter((pnrData:any) => pnrData?.pnrData?.emailId !== "")?.length - 1 > index && ", "}
                </Text>
              ))}
            </Text> */}
            {selectedPnrs?.some(
              (pnrData: any) => pnrData?.pnrData?.emailId === ""
            ) ? (
              <Alert
                showIcon={true}
                className="cls-pnr-alert my-2"
                message={
                  <Text className="d-iblock">
                    The following PNR(s) don't have an email ID:{" "}
                    {selectedPnrs
                      ?.filter((pnr: any) => pnr?.pnrData?.emailId === "")
                      .map((item: any, index: any) => (
                        <>
                          {item?.pnr}
                          {selectedPnrs?.filter(
                            (pnr: any) => pnr?.pnrData?.emailId === ""
                          )?.length -
                            1 >
                            index && ", "}
                        </>
                      ))}
                  </Text>
                }
                type="warning"
              />
            ) : (
              <></>
            )}
          </Modal>
          {toasterContextHolder}
        </Row>
      ) : (
        <PrePlannedDisruptedPNRListSkeleton />
      )}
    </>
  );
};

export default PrePlannedDisruptedPNRList;
