import {
  Col,
  Input,
  Modal,
  Row,
  Tabs,
  Typography,
  Button,
  Flex,
  Select,
  Form,
  notification,
  Popconfirm,
} from "antd";
import type { UploadProps } from "antd";
import { useAppDispatch } from "@/hooks/App.hook";
import { updateReloadPNRList } from "@/stores/PnrList.store";
import FormItem from "antd/lib/form/FormItem";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import "./SyncPnrModal.scss";
// import { useGetSyncQueueMutation } from "@/services/reschedule/Reschedule";
import useXLSXDownload from "@/hooks/XLSXDownload.hook";
import XLSXUploader from "@/components/XLSXUploader/XLSXUploader";
import { XlsxDownload } from "@/components/Icons/Icons";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useToggle } from "@/hooks/Toggle.hook";
const { Text, Title } = Typography;

/**
 * SyncPnrModal component allows user to sync PNR from Queues, XLSX files and via API.
 * It allows users to sync PNR information to handle PNR status and so.
 */
const SyncPnrModal = ({
  isModalOpen,
  toggleModal,
  syncData,
  queueData,
  page,
}: {
  isModalOpen: boolean;
  toggleModal: () => void;
  syncData: (data:any) => void;
  queueData:any;
  page: string;
}) => {
  const [form] = Form.useForm();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [queueInputValue, setQueueInputValue] = useState<string | undefined>(undefined);
  const [apiInputValue, setApiInputValue] = useState<string | undefined>(undefined);
  const [activeTab, setActiveTab] = useState("queue");
  const [formValue, setFormValue] = useState();
  const [loading, setLoading] = useState<any>(false);
  const [queuePNRListBodyData, setQueuePNRListBodyData] = useState<any[]>([]); /* Upload PNR list service from XLSX data */
  const [queueSelectValue, setQueueSelectValue] = useState("");
  const [apiSelectValue, setApiSelectValue] = useState(null);
  const [SPNRQueueOption, SsetPNRQueueOption] = useSessionStorage<any>("PNRQueueOption");
  const [SFlightQueueOption, SsetFlightQueueOption] = useSessionStorage<any>("FlightQueueOption");
  const [queues, setQueues] = useState([]);
  const [isConfirmModalOpen, toggleConfirmModal] = useToggle(false);

  /* Get PNR respective to the Queue ID */
  useEffect(() => {
    if(!isModalOpen) {
      setActiveTab("queue");
    }
    let selectedQueue:any;    
    if (queueData) {
      setQueues(queueData);
      selectedQueue = queueData.filter((queue:any) => 
          page === "prePlanned" 
          ? queue.purposeName === SPNRQueueOption
          : queue.purposeName === SFlightQueueOption
        );
      selectQueueOrAPIHandler(
        JSON.stringify(
          selectedQueue[0]), page === "prePlanned" 
            ? SPNRQueueOption 
            : SFlightQueueOption,
          "queue"
      );
    }
  }, [queueData, isModalOpen]);

  /* Method to update selected Queue ID or API to store */
  const selectQueueOrAPIHandler = (value: string, data:any, tab?:string) => {
    let tabSelected = tab ? tab : activeTab;
    tabSelected === "queue"
      ? setQueueSelectValue(data?.label ? data?.label : data)
      : setApiSelectValue(data);

    let dataParsed = tabSelected === "queue" && typeof value === "string" ? JSON.parse(value) : value;
    tabSelected === "queue"
      ? setQueueInputValue(dataParsed?.queueNumber)
      : setApiInputValue(value)
  };

  useEffect(() => {
    form.setFieldValue("selected_queue", queueSelectValue);
    form.setFieldValue("queue_number", queueInputValue);
    if(!isModalOpen) {
      form.setFieldsValue({selected_API: null});
      setApiInputValue("");
    }
  },[queueSelectValue, apiSelectValue, apiInputValue, queueInputValue, isModalOpen]);
  
  const getSelectedForm = (formType: string) => {
    return (
      <Row gutter={[0, 16]} data-testid="syncPnrModal">
        <Col span={24}>
          <Row justify="space-between">
            <Col span={24}>
              <Row gutter={20}>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <FormItem
                    label={t(`select_${formType}`)}
                    name={`selected_${formType}`}
                  >
                    <Select
                      placeholder={t(`select_${formType}`)}
                      disabled={loading}
                      options={
                        formType === "queue"
                          ? queues.map((queue: any) => {
                              return {
                                value: JSON.stringify(queue),
                                label: queue.purposeName,
                              };
                            })
                          : [
                              {
                                value:
                                  "https://aims.airline.com/api/reschedule/",
                                label: "AIMS System",
                              },
                            ]
                      }
                      className="cls-queue-input"
                      onChange={selectQueueOrAPIHandler}
                      suffixIcon={
                        <>
                          {!(activeTab === "queue" ? queueInputValue : apiInputValue)}
                          <Text className="Infi-Fd_04_DropdownArrow fs-10 cls-dropdown-arrow"></Text>
                        </>
                      }
                    />
                  </FormItem>
                </Col>
                <Col xs={24} sm={12} md={12} lg={12} xl={12}>
                  <FormItem
                    hidden={
                      !!(activeTab === "api" && form.getFieldValue("selected_API") === null)
                    }
                    label={t(formType === "queue" ? "queue_number" : "api_url")}
                  >
                    <Input type="hidden" value={activeTab === "queue" ? queueInputValue : apiInputValue}></Input>
                    <Input
                      className="cls-queue-input"
                      disabled={true}
                      value={activeTab === "queue" ? queueInputValue : apiInputValue}
                    />
                  </FormItem>
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    );
  };

  const uploadProps: UploadProps = {
    name: page === "adhoc" ? "syncFlights" : "syncPNR",
    multiple: false,
    maxCount: 1,
  };
  const [xlsxData, setXlsxData] = useState<any[]>([]);

  const prepareQueuePNRListData = async () => {
    let postBody = [];
    for (let i = 1; i <= xlsxData.length - 1; i++) {
      var scoreNumber = Number(xlsxData[i][8]);
      const sign = scoreNumber > 0 ? "+" : "";
      const syncData =
        page === "adhoc"
          ? {
              NewFlightNo: xlsxData[i][2],
              oldFlightNo: xlsxData[i][1],
              depDate: xlsxData[i][3],
              sector: xlsxData[i][0],
              stdDeparture: xlsxData[i][4],
              etdDeparture: xlsxData[i][5],
              totalPNR: xlsxData[i][6],
              addedPaxCount: xlsxData[i][7],
              reason: xlsxData[i][8],
              status: xlsxData[i][9],
            }
          : {
              PNR: xlsxData[i][0],
              active: true,
              totalPaxCount: xlsxData[i][1],
              totalAdultPaxCount: xlsxData[i][3],
              totalChildPaxCount: xlsxData[i][4],
              totalInfantPaxCount: xlsxData[i][5],
              emailId: xlsxData[i][2],
              readAt: xlsxData[i][6],
              policy: xlsxData[i][7],
              score: `${sign}${scoreNumber.toFixed(2)}`,
              status: xlsxData[i][9],
              reason: xlsxData[i][10],
              alertStatus: {
                whatsapp: "#",
                mail: "#",
                sms: "#",
              },
            };

      postBody.push(syncData);
    }

    if (postBody.length) setQueuePNRListBodyData(postBody);
  };

  useEffect(() => {
    if (!xlsxData.length) return;
    prepareQueuePNRListData(); // eslint-disable-next-line
  }, [xlsxData]);

  const items = [
    {
      label: t("upload_from_file"),
      key: "file",
      children: (
        <XLSXUploader
          uploadProps={uploadProps}
          setUploadedData={setXlsxData}
          nullifyOnDeleteHandler={setQueuePNRListBodyData}
        />
      ),
    },
    {
      label: t("sync_from_queue"),
      key: "queue",
      children: getSelectedForm("queue"),
    },
    {
      label: t("via_api"),
      key: "api",
      children: getSelectedForm("API"),
    },
  ];

  const syncPNRHandler = async (value: any) => {    
    setLoading(true);
    try {
      syncData(queueSelectValue);
      page !== "adhoc"
        ? SsetPNRQueueOption(queueSelectValue)
        : SsetFlightQueueOption(queueSelectValue);
      setTimeout(() => {
        dispatch(updateReloadPNRList());
        setLoading(false);
        toggleModal();
        notification.success({
          message: `Queue data synced successfully`,
        });
      }, 2000);
    } catch (error: any) {
      setLoading(false);
      // console.error("Error:", error);
      notification.success({
        message: error
      });
    }
  };

  const { setSheetData, setSheetName, downloadHandler } = useXLSXDownload();
  // eslint-disable-next-line
  const [sampleXlsxData, setSampleXLSXData] = useState<any[]>(
    page === "prePlanned"
      ? [
          [
            "PNR",
            "PASSENGERS",
            "EMAIL ID",
            "ADULT",
            "CHILD",
            "INFANT",
            "READ AT",
            "POLICY",
            "SCORE",
          ],
          [
            "ABC123",
            8,
            "abc@travel.com",
            4,
            2,
            2,
            "Feb 15, 2023 11:35 PM",
            "POLICY_NAME",
            1,
          ],
        ]
      : [
          [
            "SECTOR",
            "OLD FLIGHT NUMBER",
            "NEW FLIGHT NUMBER",
            "DEPARTURE DATE",
            "STANDARD DEPARTURE",
            "ESTIMATED DEPARTURE",
            "NO. OF PNR",
            "NO. OF PAX",
            "REASON",
            "STATUS",
          ],
          [
            "MAA-BOM",
            "VA-707",
            "VA-747",
            "August 12, 2024",
            "12:45",
            "05:15",
            10,
            54,
            "Due to whether conditions",
            "Reaccommodated",
          ],
        ]
  );

  const handleDownload = () => {
    // Set data and sheet name before downloading
    setSheetData(sampleXlsxData);
    setSheetName("sample");
    // Initiate download
    downloadHandler();
  };

  return (
    <>
      <Modal
        className="cls-pnr-sync-modal"
        open={isModalOpen}
        onCancel={() => {
          toggleModal();
        }}
        title={
          <Text className="fs-20 f-med">
            {t("sync")} {page === "adhoc" ? t("disruptions") : t("pnr")}{" "}
          </Text>
        }
        width={750}
        footer={false}
        closeIcon={[
          <Text className="Infi-Fd_09_CloseIcon cls-modal-close-icon"></Text>,
        ]}
        cancelText="Cancel"
        centered={true}
      >
        <Form 
          layout="vertical" 
          form={form} 
          onFinish={syncPNRHandler}
          initialValues={formValue}
        >
          <Tabs
            className={`Templates ${loading ? "cls-disabled no-events" : ""}`}
            defaultActiveKey="queue"
            size="large"
            tabBarGutter={60}
            activeKey={activeTab}
            items={items}
            onChange={(key) => setActiveTab(key)}
          ></Tabs>
          <Row align="middle" justify="space-between" className="mt-5">
            <Col xs={24} sm={12} md={8} lg={8} xl={8}>
              {activeTab === "file" && (
                <Button
                  type="default"
                  onClick={handleDownload}
                  className="cls-download-btn w-100 px-2 py-4 my-2"
                >
                  <XlsxDownload />{" "}
                  <Title level={5} style={{ fontWeight: "400" }}>
                    {t("download_sample")}
                  </Title>
                </Button>
              )}
            </Col>
            <Col>
              <Flex gap={20} justify="flex-end">
                <Button
                  className="cls-secondary-btn"
                  type="default"
                  key="back"
                  onClick={toggleModal}
                  disabled={loading}
                >
                  {t("cancel")}
                </Button>
                <Popconfirm
                    title="Would you like to sync now?"
                    okText="Yes"
                    cancelText="No"
                    open={isConfirmModalOpen}
                    onCancel={() => toggleConfirmModal()}
                    onConfirm={() => { toggleConfirmModal(); form.submit() }}
                  >
                    <Button
                      key="submit"
                      type="primary"
                      className={`cls-primary-btn fs-18`}
                      onClick={toggleConfirmModal}
                      disabled={
                        activeTab === "queue"
                          ? !queueInputValue
                          : activeTab === "file"
                            ? !queuePNRListBodyData?.length
                            : true
                      }
                      loading={loading}
                      title={activeTab === "api" ? "Under development" : ""}
                    >
                      {activeTab === "file" ? t("import") : t("sync")}
                    </Button>
                </Popconfirm>
              </Flex>
            </Col>
          </Row>
        </Form>
      </Modal>
    </>
  );
};

export default SyncPnrModal;
