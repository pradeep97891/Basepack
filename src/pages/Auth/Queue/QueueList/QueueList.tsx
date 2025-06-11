import { useEffect, useMemo, useState } from "react";
import "./QueueList.scss";
import TableDisplay from "@/components/Table/Table";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import TableTab from "@/components/TableTab/TableTab";
import {
  Button,
  Col,
  Flex,
  Popconfirm,
  Row,
  Tooltip,
  Typography,
  notification,
} from "antd";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import { ColumnType } from "antd/es/table";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import AdhocDisruptionListSkeleton from "../../AdhocDisruptionList/AdhocDisruptionList.skeleton";
import { useQueueSettings } from "@/hooks/Queue.hook";
import { useAppSelector } from "@/hooks/App.hook";
import { format } from "date-fns";
import { updateChangeInQueueList } from "@/stores/Queue.store";
import { useDispatch } from "react-redux";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import {
  useDeleteQueueMutation,
  useLazyGetQueueQuery,
} from "@/services/queue/Queue";
import {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";

const { Text } = Typography;

const QueueSettings = () => {
  const { t } = useTranslation();
  const { redirect } = useRedirect();
  const dispatch = useDispatch();
  const [filterTab, setFilterTab] = useState<string>("all");
  const [tableData, setTableData] = useState<any>([]);
  const [tabOptions, setTabOptions] = useState<any>([]);
  const SEARCH_FILTER_FIELDS = ["queue_number", "purpose_name"];
  const [, SsetEditQueueId, SremoveEditQueueId] =
    useSessionStorage<any>("editQueueId");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [, SsetQueueListData] = useSessionStorage<any>("queueListData");
  const [queueList, setQueueList] = useState([]);
  const { useGetQueueList } = useQueueSettings();
  const [loading, setLoading] = useState<any>(false);
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  const [deleteQueueId, setDeleteQueueId] = useState<any>();
  const { QueueList, totalCount } = useAppSelector(
    (state: any) => state.QueueReducer
  );
  const isResponsive = window.innerWidth < 768;
  const [deleteQueue, deleteQueueResponse] = useDeleteQueueMutation();

  const [deleteConfirmPopupId, setDeleteConfirmPopupId] = useState<
    number | null
  >(null);
  const [isDeletePopupLoading, setIsDeletePopupLoading] =
    useState<boolean>(false);

  // Service hook to get queue list
  useGetQueueList(pageNumber);

  // const [getQueues, queueListResponse] = useLazyGetQueueQuery();

  // useEffect(() => {
  //   getQueues({ pageNumber: pageNumber });
  // }, [isUpdated]);

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title: t("queue_list"),
    description: t("queue_list_subtitle"),
    breadcrumbProps: [
      {
        path: "/dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "/queueList",
        title: t("queue_list"),
        breadcrumbName: t("queue_list"),
        key: t("queue_list"),
      },
    ],
  };

  // To store the queue list from store to local state for furter process
  useEffect(() => {
    setQueueList(QueueList);
    // eslint-disable-next-line
  }, [QueueList]);

  /* Method to update the page number state to call API service with new page number */
  const getNextPaginationData = (pageNumber: number | string) => {
    setPageNumber(pageNumber);
    dispatch(updateChangeInQueueList(false));
  };

  const prepareTableData = useMemo(
    () => (queueList: any) => {
      return {
        id: queueList?.queue_id,
        key: queueList?.queue_id,
        queueNumber: queueList?.queue_number,
        purposeName: queueList?.purpose_name,
        createdBy: `${queueList?.created_user_name} - ${queueList?.created_at}`,
        modifiedBy: `${queueList?.modified_user_name} - ${queueList?.modified_at}`,
        status: queueList?.status_name,
        action: (
          <Row align="middle">
            <Col>
              <Tooltip title={t("edit") + " queue"}>
                <Text
                  style={{ cursor: "pointer" }}
                  onClick={() => {
                    SsetEditQueueId(queueList?.queue_id);
                    redirect("editQueue");
                  }}
                  className="ml-1"
                >
                  <Text className="Infi-Fd_12_Edit fs-16 p-clr" />
                </Text>
              </Tooltip>
            </Col>
            <Col>
              <Tooltip title={t("delete") + " " + " queue"}>
                <Popconfirm
                  title="Do you want to delete this queue?"
                  description=""
                  open={deleteConfirmPopupId === queueList.queue_id}
                  okText="Yes"
                  cancelText="No"
                  okButtonProps={{ loading: isDeletePopupLoading }}
                  onCancel={() => setDeleteConfirmPopupId(null)}
                  onConfirm={async () => {
                    setIsDeletePopupLoading(true);
                    try {
                      await new Promise((resolve) => setTimeout(resolve, 2000));
                      await deleteQueue(queueList.queue_id).then((response) => {
                        if ((response as any)?.data?.responseCode === 0) {
                          dispatch(updateChangeInQueueList(false));
                          notification.success({
                            message: `Queue deleted successfully`,
                          });
                          // getNextPaginationData(pageNumber);
                        }
                      });
                      setDeleteConfirmPopupId(null);
                    } catch (error) {
                      console.error(
                        `Error during deleting policy(${queueList.queue_id}):`,
                        error
                      );
                    } finally {
                      setIsDeletePopupLoading(false);
                    }
                  }}
                >
                  <Text
                    style={{ cursor: "pointer" }}
                    className="ml-2"
                    onClick={() => {
                      setDeleteConfirmPopupId(queueList?.queue_id);
                    }}
                  >
                    <Text
                      className="Infi-Fd_77_Garbage fs-17 p-clr"
                      style={{ color: "var(--t-form-input-error)" }}
                    />
                  </Text>
                </Popconfirm>
              </Tooltip>
            </Col>
          </Row>
        ),
      };
    },
    [deleteConfirmPopupId, isDeletePopupLoading]
  );

  // Prepares 'Tab' filter options
  const prepareTabOptions = useMemo(
    () => (queueList: any) => {
      const statusSet = new Set<string>(); // Use a Set to store unique values
      queueList.forEach(
        (
          queue: any // Add each status to the set
        ) => statusSet.add(queue?.status_name)
      );
      const options = [
        {
          label: (
            <>
              {t("all")}
              <Text className="cls-list-count">({queueList.length})</Text>
            </>
          ),
          value: "all",
        },
        ...Array.from(statusSet).map((status_name) => ({
          label: (
            <Text
              type={
                status_name === "Active"
                  ? "success"
                  : status_name === "Inactive"
                    ? "danger"
                    : "warning"
              }
            >
              {status_name}
              <Text className="cls-list-count">
                (
                {
                  queueList.filter(
                    (queue: any) => queue?.status_name === status_name
                  ).length
                }
                )
              </Text>
            </Text>
          ),
          value: status_name,
        })),
      ];
      setTabOptions(options);
    },
    []
  );

  useEffect(() => {
    if (queueList?.length) {
      prepareTabOptions(queueList);
      setTableData(queueList.map(prepareTableData));
      SsetQueueListData(queueList);
    }
  }, [queueList, prepareTableData, prepareTabOptions]);

  const initialColumns: ColumnType<any>[] = [
    {
      title: "Queue number",
      dataIndex: "queueNumber",
      key: "queue_number",
      render: (_: any, { queueNumber }: any) => (
        <>
          {/* <Text className="cls-arrow-bg Infi-Fd_80_BgArrow" /> */}
          <Text className="responsive">Queue number</Text>
          <Text className="f-med fs-13 cls-queue-number">{queueNumber}</Text>
        </>
      ),
    },
    {
      title: "Purpose name",
      dataIndex: "purposeName",
      key: "purpose_name",
      render: (_: any, { purposeName }: any) => (
        <>
          <Text className="responsive">Purpose name</Text>
          <Text className="f-med fs-13">{purposeName}</Text>
        </>
      ),
    },
    {
      title: "Created by",
      dataIndex: "createdBy",
      key: "created_user_name",
      render: (_: any, { createdBy }: any) => {
        var data = createdBy?.split(" - ");
        return (
          data && (
            <>
              <Text className="responsive">Created by</Text>
              <Text>
                <Text className="f-reg fs-13 d-block">
                  {data[0] !== "null" ? data[0] : "-"}
                </Text>
                {data[1] !== "null" ? (
                  <Text className="f-reg fs-12 cls-grey">
                    Created on:{" "}
                    {format(new Date(data[1]), "HH:mm, dd MMM, yyyy")}
                  </Text>
                ) : (
                  <></>
                )}
              </Text>
            </>
          )
        );
      },
    },
    {
      title: "Modified by",
      dataIndex: "modifiedBy",
      key: "modiified_user_name",
      render: (_: any, { modifiedBy }: any) => {
        var data = modifiedBy?.split(" - ");
        return (
          data && (
            <>
              <Text className="responsive">Modified by</Text>
              <Text>
                <Text className="f-reg fs-13 d-block">
                  {data[0] !== "null" ? data[0] : "-"}
                </Text>
                {data[1] !== "null" ? (
                  <Text className="f-reg fs-12 cls-grey">
                    Modified on:{" "}
                    {format(new Date(data[1]), "HH:mm, dd MMM, yyyy")}
                  </Text>
                ) : (
                  <></>
                )}
              </Text>
            </>
          )
        );
      },
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
      dataIndex: "action",
      key: "action",
      render: (_: any, { action }: any) => (
        <>
          <Text className="responsive">{t("action")}</Text>
          <Text>{action}</Text>
        </>
      ),
    },
  ];

  const popupData = {
    modalName: "deleteQueue",
    page: "queueList",
    header: "Delete queue confirmation",
    description:
      "Are you certain you want to delete this list? This action cannot be undone.",
    modalToggle: isModalOpen,
    modalClass: "cls-cancelpnr-modal",
    modalWidth: 540,
    primaryBtn: { text: "No", value: false },
    secondaryBtn: { text: "Yes, Delete", value: true },
    loading: loading,
  };

  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  useEffect(() => {
    if (!queueList?.length) return;

    setCustomFilterProps([
      {
        key: "purpose_name",
        label: "Purpose Name",
        option: { key: "purpose_name", type: "default" },
      },
      {
        key: "airline_name",
        label: "Airline Name",
        option: { key: "airline_name", type: "default" },
      },
      {
        key: "created_user_name",
        label: "Created User Name",
        option: { key: "created_user_name", type: "default" },
      },
      {
        key: "status_name",
        label: "Status",
        option: { key: "status_name", type: "default" },
      },
    ]);
  }, [queueList]);

  return (
    <div className="cls-view-queue px-6 pt-4 pb-8" data-testid="queueSettings">
      <Row>
        <Col span={24}>
          <Row align={"middle"}>
            <Col span={24}>
              <DescriptionHeader data={headerProps} />
            </Col>
          </Row>
          {queueList.length ? (
            <Row>
              <Col span={24} className="mt-1 mb-2">
                <Row className="rg-10" gutter={10}>
                  {/* {!!customFilterProps.length && (
                    <Col span={20}>
                      <CustomFilter
                        tableData={queueList}
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
                        tableData={queueList}
                        filters={customFilterProps}
                        visibleColumns={visibleColumns}
                        setTableData={setTableData}
                        tableDataPreparationHandler={prepareTableData}
                      />
                    </Col>
                  )}
                  <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                    <TableTabSearchFilter
                      tabDataKey="status_name"
                      data={queueList}
                      currentTab={filterTab}
                      searchFields={SEARCH_FILTER_FIELDS}
                      tableDataPreparationHandler={prepareTableData}
                      setTableData={setTableData}
                      placeholder={`${t("search")} queue id ${t("or")} purpose name`}
                    />
                  </Col>
                  <Col lg={3} xs={24} className="text-right">
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        SremoveEditQueueId();
                        redirect("createQueue");
                      }}
                      className="cls-primary-btn"
                    >
                      Create Queue
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
                  size="middle"
                  scroll={{ x: 1200 }}
                  isBackendPagination={true}
                  fetchNextPaginationData={getNextPaginationData}
                  pagination={{
                    totalCount: totalCount,
                    pageSize: tableData.length,
                    position: "bottomRight",
                  }}
                  loading={!tableData || !totalCount || !visibleColumns}
                />
              </Col>
            </Row>
          ) : (
            <AdhocDisruptionListSkeleton />
          )}
        </Col>
      </Row>
    </div>
  );
};

export default QueueSettings;
