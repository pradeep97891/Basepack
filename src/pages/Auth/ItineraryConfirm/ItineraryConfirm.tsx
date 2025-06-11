import { Button, Card, Col, Modal, QRCode, Row, Tooltip, Typography } from "antd";
import { useTranslation } from "react-i18next";
import "./ItineraryConfirm.scss";
import ItineraryReviewList from "@/components/ItineraryReviewList/ItineraryReviewList";
import PassengerDetails from "../ReviewFlight/PassengerDetails/PassengerDetails";
import { FdNoDataFound, PrintIcon } from "@/components/Icons/Icons";
import { useAppSelector } from "@/hooks/App.hook";
import CFG from "@/config/config.json";
// import BreadcrumbComponent from "@/components/Breadcrumb/Breadcrumb";
import { useEffect, useRef, useState } from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import ItineraryConfirmSkeleton from "./ItineraryConfirm.skeleton";
import { MailOutlined, WhatsAppOutlined } from "@ant-design/icons";
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { Link } from "react-router-dom";
import { useSendEmailMutation } from "@/services/email/Email";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

interface SlideUpSlideDownProps {
  children: React.ReactNode;
  className?: string;
}

const ItineraryConfirm = () => {
  const { t } = useTranslation();
  const { Title } = Typography;
  const { isSmallScreen } = useResize(1200);
  const { activePNR } = useAppSelector((state: any) => state.PNRReducer);
  const [SfinalReviewPnrData] = useSessionStorage<any>("finalReviewPNRData");
  var activePNRData = activePNR.length ? activePNR : SfinalReviewPnrData;
  const [sendEmailService, sendEmailResponse] = useSendEmailMutation();
  const { reviewStatus } = useAppSelector(
    (state: any) => state.ReviewFlightReducer
  );
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [text, setText] = useState("https://reschedule.grouprm.net/");
  const [SreviewStatus] = useSessionStorage<string>("reviewStatus");
  var reviewOption = reviewStatus ? reviewStatus : SreviewStatus;

  const [visible, setVisible] = useState(false);

  const toggleVisibility = () => {
    setVisible(!visible);
  };

  // const [WhatsappData, setWhatsappData] = useState<any>();

  // const breadcrumbProps = [
  //   {
  //     path: "planB",
  //     title: t("planb"),
  //     breadcrumbName: "planB",
  //     key: "planB",
  //   },
  //   {
  //     path: "viewPnrInfo",
  //     title: t("itinerary_details"),
  //     breadcrumbName: "viewPnrInfo",
  //     key: "viewPnrInfo",
  //   },
  //   ...(reviewOption !== "cancelled"
  //     ? [{
  //         path: "reviewflight",
  //         title: t("review_itinerary_changes"),
  //         breadcrumbName: "reviewflight",
  //         key: "reviewflight",
  //       }]
  //     : []),
  //   {
  //     path: "itineraryConfirm",
  //     title: t("itinerary_confirm"),
  //     breadcrumbName: "itineraryConfirm",
  //     key: "itineraryConfirm",
  //   },
  // ];
  const dynamicImagePath = require(`@/assets/images/itineraryConfirm.gif`);
  const [SfinalPaymentAmount] = useSessionStorage<any>("finalPaymentAmount");
  var finalAmount = SfinalPaymentAmount ? Number(SfinalPaymentAmount) : 0;
  var ItineraryDeclineStatus;
  if (activePNRData) {
    ItineraryDeclineStatus =
      activePNRData[0]?.rebookOptionalFlightDetails?.some(
        (trip: any) =>
          trip.itinerary_status && trip.itinerary_status === "decline"
      );
  }

  useEffect(() => {
    window.scroll(0, 0);
  });

  // const printPage = () => {
  //   const printContent = document.getElementById("printable");
  //   if (printContent) {
  //     // Convert canvas elements to images
  //     const canvasElements = printContent.getElementsByTagName("canvas");
  //     Array.from(canvasElements).forEach((canvas) => {
  //       const dataURL = canvas.toDataURL();
  //       const img = document.createElement("img");
  //       img.src = dataURL;
  //       img.style.width = canvas.style.width;
  //       img.style.height = canvas.style.height;
  //       canvas.parentNode?.replaceChild(img, canvas);
  //     });

  //     const printIframe = document.createElement("iframe");
  //     printIframe.style.position = "absolute";
  //     printIframe.style.width = "0";
  //     printIframe.style.height = "0";
  //     printIframe.style.border = "none";

  //     document.body.appendChild(printIframe);
  //     const printWindow = printIframe.contentWindow;

  //     if (printWindow) {
  //       printWindow.document.open();
  //       // // Extract SASS variables from the main document
  //       // const htmlElement = document.documentElement;
  //       // const sassVariables = htmlElement.getAttribute('style');

  //       printWindow.document.write(`
  //         <html>
  //           <head>
  //             <title>Print Preview</title>
  //             <style>
  //               :root { 
  //                 --t-viewPnr-decline-color: #D0434A;
  //                 --t-common-primary: #133769;
  //                 --t-viewPnr-accept-color: #2E8540;
  //               }
  //               body {
  //                 font-family: 'InfiFdIcons';
  //               }
  //             </style>
  //           </head>
  //           <body class="mt-10">${printContent.innerHTML}</body>
  //         </html>
  //       `);

  //       const newDocument = printWindow.document;
  //       // Copy all stylesheets from the original document to the new document
  //       const stylesheets = Array.from(document.styleSheets);
  //       stylesheets.forEach((stylesheet: CSSStyleSheet) => {
  //         try {
  //           if (stylesheet.href) {
  //             // External stylesheet
  //             const linkElement = newDocument.createElement("link");
  //             linkElement.rel = "stylesheet";
  //             linkElement.href = stylesheet.href;
  //             newDocument.head.appendChild(linkElement);
  //           } else if (stylesheet.cssRules) {
  //             // Inline styles
  //             const styleElement = newDocument.createElement("style");
  //             Array.from(stylesheet.cssRules).forEach((rule) => {
  //               styleElement.appendChild(
  //                 newDocument.createTextNode(rule.cssText)
  //               );
  //             });
  //             newDocument.head.appendChild(styleElement);
  //           }
  //         } catch (e) {
  //           console.error("Error copying styles:", e);
  //         }
  //       });

  //       printWindow.document.close();
  //       printWindow.focus();
  //       printWindow.print();
  //       // Delay to ensure the print dialog has been opened before removing the iframe
  //       setTimeout(() => {
  //         document.body.removeChild(printIframe);
  //       }, 1000);
  //     }
  //   }
  // };

  const printableRef = useRef<HTMLDivElement>(null);

  // FINAL PDF DOWNLOAD
  const shareFile = async () => {
    const printContent = printableRef.current;
    var printContentWidth = (printContent as HTMLElement).style.width;
    (printContent as HTMLElement).style.width = '1300px';

    if (printContent) {
      const canvas = await html2canvas(printContent, { scale: 2});
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const imgProps = pdf.getImageProperties(imgData);
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();
      const imgWidth = pdfWidth;
      const imgHeight = (imgProps.height * imgWidth) / imgProps.width;

      const topMargin = 20; // Adjust this value to add more space at the top
      let heightLeft = imgHeight;
      let position = topMargin;

      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, 'someAlias', 'FAST');
      heightLeft -= pdfHeight - topMargin;

      while (heightLeft > 0) {
        pdf.addPage();
        position = heightLeft - imgHeight + topMargin;
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight, 'someAlias', 'FAST');
        heightLeft -= pdfHeight - topMargin;
      }
      // Trigger download
      pdf.save('document.pdf');
      (printContent as HTMLElement).style.width = printContentWidth;
    }
  };

  const generateEmail = () => {
    if (printableRef.current) {
      const doc = new jsPDF();

      // Convert HTML to PDF
      doc.html(printableRef.current, {
        callback: function (doc) {
          // Get the PDF document as a blob
          const pdfBlob = doc.output('blob');

          // Convert blob to base64 string
          const reader = new FileReader();
          reader.readAsDataURL(pdfBlob);
          reader.onloadend = () => {
            const pdfBase64 = reader.result as string;
            // Send email with attachment as base64 string
            // setWhatsappData(pdfBase64);
            sendEmail(pdfBase64);
          };
        }
      });
    }
  };

  const sendEmail = (pdfBase64: string) => {
    const postData: any = {
      setting_id: 173,
      // globalData: pdfBase64,
      globalData: "hiiiii",
      regards: "Anandh",
      attachments: []
    };

    postData["recipientList"] = {
      action_name: "rs_reschedule_flight_details",
      language_code: "EN",
      to: "anandhkumar.m@infinitisoftware.net",
      cc: [],
      bcc: [],
      // data: pdfBase64
      data: "hiiiii"
    };

    sendEmailService(postData);
  };

  // FINAL PRINT
  const printPage = async () => {
    const printContent = printableRef.current;
    if (printContent) {
      const canvas = await html2canvas(printContent, { scale: 2 });
      const imgData = canvas.toDataURL('image/png');
  
      const newWindow = window.open('', '_blank');
      if (newWindow) {
        newWindow.document.write(`
          <html>
            <head>
            <title> Voyager Aid </title>
            </head>
            <style>
              @media print {
                .hide-on-print {
                  display: none;
                }
              }
            </style>
            <body style="margin-top: 40px;">
              <img src="${imgData}" style="width: 100%;"/>
            </body>
          </html>
        `);
        newWindow.document.close();
        newWindow.addEventListener('load', () => {
          newWindow.print();
          newWindow.close();
        });
      } else {
        alert('Please allow popups for this website');
      }
    }
  };

  return (
    <div className="cls-itinerary-confirm" data-testId='itineraryConfirm'>
      <div className="cls-confirm-page">
        {activePNRData?.length ? (
          <>
            {/* <BreadcrumbComponent props={breadcrumbProps} /> */}
            <Row>
              <Col xs={24} xl={24} className="cls-share-col d-flex align-center text-right">
                <Button 
                  type="text" 
                  className="cls-disabled no-events"
                >
                  <MailOutlined /> 
                  <Text className="p-clr fs-14 f-med" style={{color:"var(--ant-color-text-heading)"}} onClick={generateEmail}>Email</Text>
                </Button>
                <Button 
                  type="text" 
                  className="cls-disabled no-events"
                >
                  <WhatsAppOutlined /> 
                  <Text className="p-clr fs-14 f-med" style={{color:"var(--ant-color-text-heading)"}} onClick={shareFile}>Whatsapp</Text>
                </Button>
                {/* <Link
                  type="link"
                  to={`https://web.whatsapp.com/send??phone=9444331425&text=${encodeURIComponent(dynamicImagePath)}`}
                  className="px-0 py-0 d-flex"
                  target="_blank"
                  rel="noopener noreferrer"
                  data-action="share/whatsapp/share"
                >
                  send
                </Link> */}
                <Button onClick={() => printPage()} type="text" className="cls-print-card">
                  <PrintIcon /> 
                  <Text className="p-clr fs-14 f-med" style={{color:"var(--ant-color-text-heading)"}}>Print</Text>
                </Button>
              </Col>
            </Row>
            <Row 
              justify="center" 
            >
              <img src={dynamicImagePath} alt="ConfirmGif" width={150}></img>
            </Row>
            <Row justify="center" style={{ marginTop: "-20px" }}>
              <Col className="text-center" xs={24} lg={20} xl={14} >
                <Title level={isSmallScreen ? 5 : 3} className="p-clr f-sbold">
                  {reviewOption === "Decline" ||
                  ItineraryDeclineStatus 
                    ? t("itinerary_decline_header")
                    : (reviewOption === "cancelled")
                      ? t("itinerary_cancelled_header")
                      : t("itinerary_confirm_header")}
                </Title>
                <Text
                  className={`${isSmallScreen ? "fs-13" : "fs-16"} d-block py-1`}
                  style={{ lineHeight: isSmallScreen ? "16px" : "22px", color: "var(--t-descriptionHeader-description)" }}
                >
                  {reviewOption === "Decline" ||
                  ItineraryDeclineStatus 
                  ? t("itinerary_decline_description")
                  : reviewOption === "cancelled" ? (
                    <>
                      {t("itinerary_cancelled_description")}
                      {t("itinerary_voucher")}
                      <Text className={`${isSmallScreen ? "fs-15" : "fs-20"} f-sbold`}>
                        {CFG.currency}{" "}
                        {Number(activePNRData[0]?.paidAmount)?.toFixed(2)}
                      </Text>
                      {t("itinerary_decline_check_description")}
                    </>
                    ) : (
                      <>
                        {t("itinerary_confirm_description")}
                        {(reviewOption === "Modify" ||
                          reviewOption === "Custom") &&
                        finalAmount &&
                        finalAmount < 0 ? (
                          <Text
                            className="fs-16 py-1 pl-1"
                            style={{ lineHeight: "22px" }}
                          >
                            {t("itinerary_voucher")}
                            <Text className={`${isSmallScreen ? "fs-15" : "fs-20"} f-sbold`}>
                              {CFG.currency}{" "}
                              {Number(finalAmount * -1)?.toFixed(2)}
                            </Text>
                            .
                          </Text>
                        ) : (
                          <></>
                        )}
                      </>
                    )}
                </Text>
              </Col>
            </Row>
            <Row
              justify="space-between"
              className="cls-pnr-info mt-5"
              id="printable"
              ref={printableRef}
            >
              <Col xs={24} xl={24}>
                <Row>
                  <Col xs={10} xl={10} className="text-left">
                    <Text className={`${isSmallScreen ? "fs-12" : "fs-13"} f-reg`} style={{ color: "var(--t-descriptionHeader-description)" }}>
                      {t("pnr_no")} :&nbsp;
                    </Text>
                    <Text className={`${isSmallScreen ? "fs-14" : "fs-18"} f-bold`} style={{color: "var(--ant-color-text-heading)"}}>
                      {activePNRData[0]?.PNR}
                    </Text>
                  </Col>
                  <Col xs={14} xl={14} className="text-right">
                    <Text className="fs-13" style={{ color: "var(--t-descriptionHeader-description)" }}>
                      {t(isSmallScreen ? "status" : "pnr_status")} :&nbsp;
                    </Text>
                    <Text
                      className={`fs-14 p-clr f-bold`}
                      style={{
                        color:
                          reviewOption === "Decline" ||
                          ItineraryDeclineStatus ||
                          reviewOption === "cancelled"
                            ? "var(--t-score-setting-worst)"
                            : "var(--t-score-setting-best)",
                      }}
                    >
                      {" "}
                      { reviewOption === "Decline" || ItineraryDeclineStatus 
                        ? t("cancelled")
                        : reviewOption === "cancelled"
                        ? t("cancelled")
                        : t("confirmed_cnf")}
                    </Text>
                  </Col>
                </Row>
              </Col>
              <Col xs={24} xl={24} className="mt-3">
                <Card className="cls-main-card">
                  <Title level={5} className={`d-flex f-sbold p-clr ${isSmallScreen ? "fs-14" : "fs-17"}`}>
                    {t("itinerary_details")}
                    {isSmallScreen 
                      ? <Text 
                          className="fs-14 f-reg p-clr ml-auto d-block"
                          onClick={() => setIsModalOpen(true)}
                        >
                          {t("scan_qr")} 
                        </Text>
                      : ""
                    }
                  </Title>
                  <ItineraryReviewList isConfirmpage={true} />
                  <PassengerDetails isConfirmpage={true} />
                </Card>
              </Col>
            </Row>
            {
              isSmallScreen 
              ? 
              <Modal
                width="max-content"
                open={isModalOpen}
                onCancel={() => setIsModalOpen(false)}
                closeIcon={ <Text className="Infi-Fd_09_CloseIcon cls-close-modal-icon" /> }
                footer={false}
                className={`cls-qrCodePopup`}
              >
                <Row justify="center">
                  <Col span={24} className="fs-17 f-med pb-2 p-clr text-center"> {t("scan_qr")}</Col>
                  <Col span={24} className="text-center">
                    <Text className="cls-qrContainer d-iblock">
                      <QRCode value={text || "-"} size={110} />
                      <Text className="cls-bdrBtmLeft" />
                      <Text className="cls-bdrBtmRight" />
                    </Text>
                  </Col>
                  <Col span={24} className="text-center mt-4">
                    <Button type="default" size="large" className="fs-14 f-reg px-8">
                      <Text className="Infi-Fd_84_QRCode p-clr fs-17" />
                      {t('scan_qr')} {t('code')}
                    </Button>
                  </Col>
                </Row>
              </Modal>
              : <></>
            }
            {/* <Row justify="center" className="mt-5 cls-itinerary-card">
              <Col xs={3} xl={3} className="cls-cursor-pointer">
                <Card onClick={() => printPage()} className="cls-print-card">
                  <Col className="text-center">
                    <PrintIcon />
                  </Col>
                  <Col className="f-sbold fs-18 text-center p-clr">
                    {t("print")}
                  </Col>
                </Card>
              </Col>
              <Col xs={3} xl={3}  offset={1} className="cls-cursor-pointer">
                <Card>
                  <Col className="text-center">
                    <SpecialserviceSSRIcon />
                  </Col>
                  <Col className="f-sbold fs-18 text-center p-clr">Add SSR</Col>
                </Card>
              </Col>
              <Col xs={3} xl={3}  offset={1} className="cls-cursor-pointer">
                <Card>
                  <Col className="text-center">
                    <SpecialserviceSeatIcon />
                  </Col>
                  <Col className="f-sbold fs-18 text-center p-clr">Add Seat</Col>
                </Card>
              </Col>
            </Row>
            <Row justify="center" className="mt-5 cls-itinerary-btn mb-4">
              <Col xs={3} xl={3}>
                  <Button type="default" size="large" onClick={()=>{redirect('viewpnrinfo')}}>{t('go_back')}</Button>
              </Col>
              <Col xs={3} xl={3} className="ml-3">
                  <Button type="primary" size="large" onClick={()=>{redirect('dashboard')}}>{t('dashboard')}</Button>
              </Col>
            </Row> */}
          </>
        ) : (
          <ItineraryConfirmSkeleton />
        )}
      </div>
    </div>
  );
};

export default ItineraryConfirm;