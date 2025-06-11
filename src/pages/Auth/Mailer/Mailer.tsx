import { useEffect, useState } from "react";
import "./Mailer.scss";
import {
  useGetPreviewTemplateMutation,
  useLazyGetTemplateQuery,
  useLazyGetTemplatesListQuery,
} from "@/services/email/Email";
import { useToaster } from "@/hooks/Toaster.hook";
import { Button, Col, Flex, Row, Tooltip, Typography } from "antd";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import MailerTemplatesListSkeleton from "./Mailer.skeleton";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import TableTab from "@/components/TableTab/TableTab";
import TableDisplay from "@/components/Table/Table";
import { FdMailIcon, FdReassignPNR, FdViewPNR } from "@/components/Icons/Icons";
import { ColumnType } from "antd/es/table";
import { formatDate, formatDateString } from "@/Utils/date";
import { useToggle } from "@/hooks/Toggle.hook";
import EmailPreviewModal from "@/components/EmailPreviewModal/EmailPreviewModal";
import CustomFilter, {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { getDynamicDate } from "@/Utils/general";
import { useRedirect } from "@/hooks/Redirect.hook";
import { encryptData } from "@/hooks/EncryptDecrypt.hook";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";

const Mailer: React.FC = () => {
  const { showToaster, toasterContextHolder } = useToaster();
  const { t } = useTranslation();
  const { Text, Title } = Typography;
  const { redirect, getEncryptedPath } = useRedirect();
  // Service states
  const [getTemplatesListService, getTemplatesListResponse] =
    useLazyGetTemplatesListQuery();

  /* Preview email modal states */
  const [isPreviewModalOpen, togglePreviewModal] = useToggle(false);
  const [previewData, setPreviewData] = useState<any>(null);

  // Component states
  const [templates, setTemplates] = useState<any[]>([]);
  const [filterTab, setFilterTab] = useState<string>("all");
  const SEARCH_FILTER_FIELDS = ["template_name", "created_by"];
  const [tableData, setTableData] = useState<any>([]);
  const isResponsive = window.innerWidth < 768;
  const [getTemplatePreviewService, getTemplatePreviewResponse] = useGetPreviewTemplateMutation();
  const [isPreviewEmailLoading, setIsPreviewEmailLoading] = useState<boolean>(false);
  const [getTemplateService, getTemplateResponse] = useLazyGetTemplateQuery();
  // const [getSampleMailerData, sampleMailerDataResponse] = useGetSampleMailerDataMutation();
  // const [samplePnrData, setSamplePnrData] = useState();

  // useEffect(() => {
  //   getSampleMailerData([]);
  // }, []);

  // useEffect(() => {
  //   if(sampleMailerDataResponse?.isSuccess) {   
  //     console.log((sampleMailerDataResponse?.data as any).response?.data);
  //     setSamplePnrData((sampleMailerDataResponse?.data as any).response?.data)
  //   }
  // }, [sampleMailerDataResponse?.isSuccess]);

  /* To open the preview email modal when the response data is ready to be rendered */
  useEffect(() => {
    if (previewData && Object.keys(previewData)?.length) togglePreviewModal();
  }, [previewData]);

  const previewTemplate = async (pnrData: any) => {
    var temp: any = {};
    temp["pnr"] = pnrData?.PNR;
    temp["emailId"] = pnrData?.emailId;
    temp["pnrData"] = pnrData;
    // setselectedPnrs([temp]);

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
    // setselectedPnrs([temp]);

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

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title: "Mailer templates list",
    description:
      "This list provides a centralized repository of pre-designed email templates for various communication needs. It offers a streamlined approach to creating consistent and professional email communications, saving time and effort while maintaining brand identity.",
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "mailer",
        title: "Mailer templates list",
        breadcrumbName: "Mailer templates list",
        key: "MailerTemplatesList",
      },
    ],
  };

  useEffect(() => {
    getTemplatesListService([]).then((response: any) => {
      /* Update queue PNRs and close import modal on successful response */
      if (response?.data?.responseCode === 0) {
        setTemplates([(response?.data as any)?.response?.data?.results[0]]);
      } else {
        showToaster({
          type: "error",
          title: "Service Error",
          description: "Service error occurred while getting templates",
        });
      }
    });
  }, [getTemplatesListService]);

  /* Converts templates list data from API to table data format */
  const prepareTableData = (template: any) => ({
    templateName: template.template_name,
    subject: template.subject,
    languageName: template.language_name,
    status: template.status_name,
    createdAt: template.created_at,
    createdBy: template.created_by,
    preview: template.preview,
  });

  const [tabOptions, setTabOptions] = useState<any>();

  useEffect(() => {
    if (!templates?.length) return;
    prepareTabOptions(templates);
  }, [templates]);

  /* Prepares 'Tab' filter options */
  const prepareTabOptions = (templates: any) => {
    const statusSet = new Set<string>(); // Use a Set to store unique values

    templates.forEach((template: any) => statusSet.add(template.status_name)); // Add each status to the set

    const options = [
      {
        label: (
          <>
            {t("all")}{" "}
            <Text className="cls-list-count">({templates.length})</Text>
          </>
        ),
        value: "all",
      },
      ...Array.from(statusSet).map((status) => ({
        label: (
          <Text>
            {status}{" "}
            <Text className="cls-list-count">
              (
              {
                templates.filter(
                  (template: any) => template.status_name === status
                ).length
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

  const samplePnrData = {
    id: 1,
    flightNumber: "VA-231",
    PNR: "VAD999",
    active: true,
    readAt: "0,0,1 11:35",
    policy: "Time change_23",
    score: "+20.00",
    scoreStatus: "moderate",
    status: "Email sent",
    reason: "Due to weather conditions",
    alertStatus: {
      whatsapp: "#",
      mail: "#",
      sms: "#",
    },
    firstName: "Ashwin",
    lastName: "Balaji",
    emailId: "ashwinbalaji@infinitisoftware.net",
    dateOfBooking: "0,0,1, 07:07 (UTC)",
    totalPaxCount: 8,
    totalAdultPaxCount: 5,
    totalChildPaxCount: 2,
    totalInfantPaxCount: 1,
    totalAmount: 8800,
    paidAmount: 8800,
    balanceAmount: 0,
    scorePolicyName: "Voyager pax",
    originalFlightDetails: [
      {
        trip: 1,
        date: "0,0,30",
        origin: "Chennai",
        originAirportCode: "MAA",
        destination: "Delhi",
        destinationAirportCode: "DEL",
        stops: 0,
        stopDetails: "",
        flightDetails: [
          {
            id: 1,
            origin: "Chennai",
            originAirportCode: "MAA",
            destination: "Delhi",
            destinationAirportCode: "DEL",
            flightNumber: "VA-000",
            stops: 0,
            paxCount: 10,
            departDate: "0,0,30",
            arrivalDate: "0,0,30",
            depart: "09:40",
            arrival: "11:50",
            nextDayArrival: "",
            duration: "02h 10m",
            status: "Time change",
            statusCode: "TK",
          },
        ],
      },
    ],
    rebookOptionalFlightDetails: [
      {
        trip: 1,
        date: "0,0,30",
        origin: "Chennai",
        originAirportCode: "MAA",
        destination: "Delhi",
        destinationAirportCode: "DEL",
        stops: 0,
        stopDetails: "",
        flightDetails: [
          {
            id: 1,
            origin: "Chennai",
            originAirportCode: "MAA",
            destination: "Delhi",
            destinationAirportCode: "DEL",
            flightNumber: "VA-000",
            stops: 0,
            paxCount: 10,
            departDate: "0,0,30",
            depart: "23:40",
            arrivalDate: "0,1,1",
            arrival: "01:45",
            nextDayArrival: "+1",
            duration: "02h 05m",
            status: "Schedule changed",
            statusCode: "SC",
          },
        ],
      },
    ],
  };

  const [isMailTemplateModalOpen, toggleMailTemplateModal] = useToggle();

  const initialColumns: ColumnType<any>[] = [
    {
      title: t("template_name"),
      dataIndex: "templateName",
      key: "template_name",
      render: (_: any, { templateName }: any) => (
        <>
          <Text className="responsive">{t("template_name")}</Text>
          <Text className="f-med fs-13">{templateName}</Text>
        </>
      ),
    },
    {
      title: t("subject"),
      dataIndex: "subject",
      key: "subject",
      render: (_: any, { subject }: any) => (
        <>
          <Text className="responsive">{t("subject")}</Text>
          <Text className="f-reg fs-13">{subject}</Text>
        </>
      ),
    },
    {
      title: t("created_by"),
      dataIndex: "createdBy",
      key: "created_by",
      render: (_: any, { createdBy }: any) => (
        <>
          <Text className="responsive">{t("created_by")}</Text>
          <Text className="f-reg fs-13">{createdBy}</Text>
        </>
      ),
    },
    {
      title: t("created_at"),
      dataIndex: "createdAt",
      key: "created_at",
      render: (text) => (
        <>
          <Text className="responsive">{t("created_at")}</Text>
          <Text className="f-reg fs-13">{formatDateString(text)}</Text>
        </>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status_name",
      render: (_: any, { status }: any) => (
        <>
          <Text className="responsive">{t("status")}</Text>
          <Text
            style={{
              color:
                status === "Active"
                  ? "var(--t-view-user-active-color)"
                  : "var(--t-form-input-error)",
            }}
            className={`f-sbold fs-12`}
          >
            {status}
          </Text>
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
            hideableColumns={["action"]}
          />
        </Flex>
      ),
      dataIndex: "",
      key: "action",
      render: (_: any, template: any) => {
        return (
          <>
            <Text className="responsive">{t("action")}</Text>
            {/* <Flex gap={"10px"} align="center"> */}
              <Tooltip className="cls-cursor-pointer" title={"Preview Template"}>
                <Button
                  type="link"
                  onClick={() => previewTemplate(samplePnrData)}
                  className="px-0 py-0 "
                >
                  <FdMailIcon />
                </Button>
                {/* <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    setTemplateContent(template.preview);
                    toggleMailTemplateModal();
                  }}
                >
                  <FdViewPNR />
                </Text> */}
              </Tooltip>
            {/* </Flex> */}
          </>
        );
      },
    },
  ];

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  // Will contain the template to show preview modal
  const [templateContent, setTemplateContent] = useState<string>("");

  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  useEffect(() => {
    if (!templates?.length) return;

    setCustomFilterProps([
      {
        key: "created_by",
        label: "Created by",
        option: { key: "created_by", type: "default" },
      },
      {
        key: "status_name",
        label: "Status",
        option: { key: "status_name", type: "default" },
      },
    ]);
  }, [templates]);

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

  useEffect(() => {
    if (!templates?.length) return;

    setTableData(templates.map(prepareTableData));
  }, [templates]);

  return (
    // <iframe
    //   data-testid="mailer"
    //   title="Mailer Template"
    //   width="100%"
    //   height="800px"
    //   src="https://mail-v2.grouprm.net/mailer/templates/new/default"
    //   style={{ border: 0 }}
    // ></iframe>
    <Row className="cls-mailer-template-list-container">
      <Col span={24}>
        <Row align={"middle"}>
          <Col span={24}>
            <DescriptionHeader data={headerProps} />
          </Col>
        </Row>
        {!templates.length ? (
          <MailerTemplatesListSkeleton />
        ) : (
          <Row>
            <Col span={24} className="mt-1 mb-2">
              <Row className="rg-10" justify="space-between" gutter={10}>
                {/* {!!customFilterProps.length && (
                  <Col lg={20} xs={3}>
                    <CustomFilter
                      tableData={templates}
                      filters={customFilterProps}
                      visibleColumns={visibleColumns}
                      setTableData={setTableData}
                      tableDataPreparationHandler={prepareTableData}
                    />
                  </Col>
                )} */}
                {!!customFilterProps.length && (
                  <Col lg={17} xs={24} className={isResponsive ? "pb-2" : ""}>
                    <PersonalizedFilter
                      tableData={templates}
                      filters={customFilterProps}
                      visibleColumns={visibleColumns}
                      setTableData={setTableData}
                      tableDataPreparationHandler={prepareTableData}
                    />
                  </Col>
                )}
                <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                  <TableTabSearchFilter
                    data={templates}
                    tabDataKey="status"
                    currentTab={filterTab}
                    searchFields={SEARCH_FILTER_FIELDS}
                    tableDataPreparationHandler={prepareTableData}
                    setTableData={setTableData}
                    placeholder={t("search") + " " + t("pnr")}
                  />
                </Col>
                <Col lg={3} xs={24} className="text-right">
                  <Button
                    disabled
                    className="cls-primary-btn px-2 h-32"
                    style={{ width: "max-content" }}
                    // onClick={toggleModal}
                  >
                    {t("create")} {t("template")}
                  </Button>
                </Col>
              </Row>
            </Col>
            {/* <Col span={24}>
                 <TableTab
                options={tabOptions}
                changeHandler={setFilterTab}
                currentTab={filterTab}
              />
              </Col> */}
            <Col span={24}>
              <TableDisplay
                data={tableData}
                columns={visibleColumns}
                pagination={{ pageSize: 10, position: "bottomRight" }}
                size="middle"
                scroll={{ x: 1200 }}
                loading={isPreviewEmailLoading}
              />
            </Col>
          </Row>
        )}
      </Col>
      {/* Email preview modal */}
      <EmailPreviewModal
        footer={null}
        isModalOpen={isPreviewModalOpen}
        onCancel={() => {
          togglePreviewModal();
          setPreviewData(null);
        }}
        confirmLoading={
          getTemplateResponse.isLoading || getTemplatePreviewResponse.isLoading
        }
        loading={
          getTemplateResponse.isLoading || getTemplatePreviewResponse.isLoading
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
      {/* <EmailPreviewModal
        footer={() => <></>}
        isModalOpen={isMailTemplateModalOpen}
        onCancel={() => {
          toggleMailTemplateModal();
        }}
        confirmLoading={getTemplatesListResponse.isLoading}
        loading={getTemplatesListResponse.isLoading}
        header={
          <Row align="middle" justify="space-between">
            <Col>
              <Title level={5}>{t("preview")}</Title>
            </Col>
          </Row>
        }
        iFrameContent={`<img src='${templateContent}' style='width:100%' />`}
      /> */}
      {toasterContextHolder}
    </Row>
  );
};

export default Mailer;
