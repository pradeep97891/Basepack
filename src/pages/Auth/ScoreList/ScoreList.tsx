import "./ScoreList.scss";
import { useEffect, useState } from "react";
import TableDisplay from "@/components/Table/Table";
import {
  Button,
  Col,
  Flex,
  Popconfirm,
  Row,
  Select,
  Tooltip,
  Typography,
  notification,
} from "antd";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import { ColumnType } from "antd/es/table";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import ConfirmModalPopup from "@/components/ConfirmModalPopup/ConfirmModalPopup";
import AdhocDisruptionListSkeleton from "../AdhocDisruptionList/AdhocDisruptionList.skeleton";
import { getDynamicDate } from "@/Utils/general";
import {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { NotificationType, useToaster } from "@/hooks/Toaster.hook";
import {
  useDeleteScoreListDataMutation,
  useGetScoreListMutation,
  usePutScoreListDataMutation,
} from "@/services/score/score.service";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useAppSelector } from "@/hooks/App.hook";
import { useDispatch } from "react-redux";
import { cleanUpMessageApi, updateMessageApi } from "@/stores/General.store";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";

const { Text } = Typography;

const ScoreList = () => {
  const { t } = useTranslation();
  const { redirect } = useRedirect();
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState<any>([]);
  const [scoreList, setScoreList] = useState<any>();
  const [scoreListService, scoreListResponse] = useGetScoreListMutation();
  const [SeditPolicy, SsetEditPolicy, SremoveEditPolicy] =
    useSessionStorage<any>("editPolicy");
  const [, SsetScoreOption] = useSessionStorage<any>("scoreListOption");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState<any>(false); // eslint-disable-next-line
  const [putScoreListService] = usePutScoreListDataMutation();
  const [deleteScore] = useDeleteScoreListDataMutation();
  const [deleteConfirmPopupId, setDeleteConfirmPopupId] = useState<
    number | null
  >(null);
  const [isDeletePopupLoading, setIsDeletePopupLoading] =
    useState<boolean>(false);
  const { messageApiValue } = useAppSelector(
    (state: any) => state.GeneralReducer
  );
  const isResponsive = window.innerWidth < 768;

  // Setting data object for the cancel pnr popup
  const popupData = {
    modalName: "deleteScore",
    page: "scoreList",
    header: "Delete score confirmation",
    description:
      "Are you certain you want to delete this score? This action cannot be undone.",
    modalToggle: isModalOpen,
    modalClass: "cls-cancelpnr-modal",
    modalWidth: 540,
    primaryBtn: { text: "No", value: false },
    secondaryBtn: { text: "Yes, Delete", value: true },
    loading: loading,
  };

  useEffect(() => {
    scoreListService([]);
  }, []);

  const { showToaster, toasterContextHolder } = useToaster();

  /* To show notification after create score policy */
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

  // Function to get data from cancel pnr popup
  const handlePopupData = async (data: boolean) => {
    setLoading(data);
    setIsModalOpen(false);
    if (data) {
      try {
        await deleteScore(SeditPolicy.id).then((response) => {
          if ((response as any)?.data?.responseCode === 0) {
            setIsModalOpen(false);
            setLoading(false);
            scoreListService([]);
            notification.success({
              message: `Score deleted successfully`,
            });
          }
        });
      } catch (error: any) {
        setIsModalOpen(false);
        setLoading(false);
      }
    }
  };

  const prepareTableData = (scoreList: any) => {
    // const actionsKey = scoreList?.trigger === 1 ? "flightActions" : "paxActions";
    return {
      key: scoreList?.id,
      id: scoreList?.id,
      policyName: scoreList?.policyName,
      effectiveDate: getDynamicDate(scoreList?.effectiveDate),
      discontinueDate: getDynamicDate(scoreList?.discontinueDate),
      createdInfo: scoreList?.createdBy,
      createdTime:
        getDynamicDate(scoreList.createdOn) ||
        getDynamicDate(scoreList.CreatedAt),
      lastUpdatedInfo: scoreList?.lastUpdatedBy,
      lastUpdatedTime:
        getDynamicDate(scoreList.lastUpdatedOn) ||
        getDynamicDate(scoreList.lastUpdatedAt),
      priority: scoreList.priority,
      status: t(scoreList.status?.toLowerCase()),
      trigger: scoreList?.trigger,
      scoreType: scoreList?.trigger === 1 ? "Flight" : "Passenger",
      conditions: scoreList?.conditions,
      // [actionsKey]: scoreList?.trigger === 1 ? scoreList?.flightActions : scoreList?.paxActions
      action: (
        <Flex>
          <Tooltip title={t("edit") + " " + t("policy")?.toLowerCase()}>
            <Text
              style={{ cursor: "pointer" }}
              onClick={() => {
                SsetEditPolicy(scoreList);
                redirect("editScorePolicy");
              }}
            >
              <Text className="Infi-Fd_12_Edit fs-16 p-clr" />
            </Text>
          </Tooltip>
          <Tooltip title={t("delete") + " " + t("policy")?.toLowerCase()}>
            <Popconfirm
              title="Do you want to delete this policy?"
              description=""
              open={deleteConfirmPopupId === scoreList?.id}
              okText="Yes"
              cancelText="No"
              okButtonProps={{ loading: isDeletePopupLoading }}
              onCancel={() => setDeleteConfirmPopupId(null)}
              onConfirm={async () => {
                setIsDeletePopupLoading(true);

                try {
                  await new Promise((resolve) => setTimeout(resolve, 2000));
                  await deleteScore(scoreList.id).then((response) => {
                    if ((response as any)?.data?.responseCode === 0) {
                      setDeleteConfirmPopupId(null);
                      scoreListService([]);
                      dispatch(
                        updateMessageApi({
                          open: true,
                          type: "success",
                          title: t("success"),
                          description: `Score deleted successfully`,
                        })
                      );
                    }
                  });
                } catch (error) {
                  console.error(
                    `Error during deleting policy(${scoreList?.policyName}):`,
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
                  setDeleteConfirmPopupId(scoreList?.id);
                }}
              >
                <Text
                  className={`Infi-Fd_77_Garbage fs-17 p-clr`}
                  type="danger"
                ></Text>
              </Text>
            </Popconfirm>
          </Tooltip>
        </Flex>
      ),
    };
  };

  useEffect(() => {
    setTableData(scoreList?.map(prepareTableData));
  }, [deleteConfirmPopupId]);

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title: "Score list",
    description:
      "The Score List Page, where you can view the scores assigned to passengers and flights based on various conditions and criteria. This page provides a comprehensive overview of how different factors affect the scoring, ensuring transparency and clarity in our evaluation process.",
    breadcrumbProps: [
      {
        path: "/dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "/scoreList",
        title: "Score list",
        breadcrumbName: "Score list",
        key: "Score list",
      },
    ],
  };

  useEffect(() => {
    if (scoreListResponse?.isSuccess) {
      let data = JSON.parse(
        JSON.stringify((scoreListResponse?.data as any)?.response?.data)
      );
      data = data.sort((a: any, b: any) => b.id - a.id);
      setScoreList(data);
    }
  }, [scoreListResponse?.isSuccess]);

  useEffect(() => {
    if (scoreList?.length) {
      prepareTabOptions(scoreList);
      setTableData(scoreList.map(prepareTableData));
    } else {
      prepareTabOptions([]);
      setTableData([]);
    }
    // eslint-disable-next-line
  }, [scoreList]);

  /* Prepares 'Tab' filter options */
  const prepareTabOptions = (ScoreData: any) => {
    // Use a Set to store unique values
    const statusSet = new Set<string>();
    // Add each status to the set
    ScoreData.forEach((score: any) =>
      statusSet.add(score?.trigger === 1 ? "Flight" : "Passenger")
    );
    // const options = [
    //   {
    //     label: (
    //       <>
    //         {t("all")}{" "}
    //         <Text className="cls-list-count">({ScoreData.length})</Text>
    //       </>
    //     ),
    //     value: "all",
    //   },
    //   ...Array.from(statusSet).map((status) => ({
    //     label: (
    //       <Text
    //         type={
    //           status === "Passenger"
    //             ? "success"
    //             : status === "Flight"
    //               ? "danger"
    //               : "warning"
    //         }
    //       >
    //         {status}{" "}
    //         <Text className="cls-list-count">
    //           (
    //           {
    //             ScoreData.filter((score: any) => (score?.trigger === 1 ? "Flight" : "Passenger") === status)
    //               .length
    //           }
    //           )
    //         </Text>
    //       </Text>
    //     ),
    //     value: status,
    //   })),
    // ];
    // setTabOptions(options);
  };

  const initialColumns: ColumnType<any>[] = [
    {
      title: "Title",
      dataIndex: "policyName",
      key: "policyName",
      render: (_: any, { policyName }: any) => (
        <>
          <Text className="responsive">Title</Text>
          <Text className="f-med fs-13">{policyName}</Text>
        </>
      ),
    },
    {
      title: "Start date",
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (_: any, { effectiveDate }: any) => (
        <>
          <Text className="responsive">Start date</Text>
          <Text className="f-reg fs-13">{effectiveDate}</Text>
        </>
      ),
    },
    {
      title: "End date",
      dataIndex: "discontinueDate",
      key: "discontinueDate",
      render: (_: any, { discontinueDate }: any) => (
        <>
          <Text className="responsive">End date</Text>
          <Text className="f-reg fs-13">{discontinueDate}</Text>
        </>
      ),
    },
    {
      title: "Score type",
      dataIndex: "scoreType",
      key: "scoreType",
      render: (_: any, { scoreType }: any) => (
        <>
          <Text className="responsive">Score type</Text>
          <Text
            style={{
              color:
                scoreType === "Passenger"
                  ? "var(--t-view-user-active-color)"
                  : "var(--t-form-input-error)",
            }}
            className={`f-sbold fs-12`}
          >
            {scoreType}
          </Text>
        </>
      ),
    },
    {
      title: () => (
        <Flex align="center" justify="space-between" gap={10}>
          {t("alert_status")}
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
          <Text className="responsive">{t("alert_status")}</Text>
          <Text>{action}</Text>
        </>
      ),
    },
  ];

  const [enableSelectLoader, setEnableSelectLoader] = useState(false);

  // Custom filter state
  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  useEffect(() => {
    if (!scoreList?.length) return;

    setCustomFilterProps([
      {
        key: "scoreType",
        label: "Score set",
        option: { key: "scoreType", type: "default" },
      },
    ]);
  }, [scoreList]);

  const SEARCH_FILTER_FIELDS = ["createdBy", "lastUpdatedBy", "policyName"];

  return (
    <div className="px-6 pt-3 pb-8 cls-ScoreList" data-testid="scoreList">
      <Row>
        <Col span={24}>
          <Row align={"middle"}>
            <Col span={24}>
              <DescriptionHeader data={headerProps} />
            </Col>
          </Row>
          {scoreList ? (
            <Row>
              <Col span={24} className="mt-1 mb-2">
                <Row className="rg-10" gutter={10}>
                  {!!customFilterProps.length && (
                    <Col lg={17} xs={24} className={isResponsive ? "pb-2" : ""}>
                      <PersonalizedFilter
                        tableData={scoreList}
                        filters={customFilterProps}
                        visibleColumns={visibleColumns}
                        setTableData={setTableData}
                        tableDataPreparationHandler={prepareTableData}
                      />
                    </Col>
                  )}
                  <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                    <TableTabSearchFilter
                      data={scoreList}
                      tabDataKey="scoreType"
                      currentTab={"all"}
                      searchFields={SEARCH_FILTER_FIELDS}
                      tableDataPreparationHandler={prepareTableData}
                      setTableData={setTableData}
                      placeholder={`${t("search")} score title or type`}
                    />
                  </Col>
                  <Col lg={3} xs={24} className="text-right">
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        setEnableSelectLoader(true);
                        SremoveEditPolicy();
                        redirect("createScorePolicy");
                      }}
                      loading={enableSelectLoader}
                      className="cls-primary-btn"
                    >
                      {t("Create score")}
                    </Button>
                    {/* <Select
                      placeholder={t("Create score")}
                      style={{ cursor: "pointer" }}
                      className="cls-score-select"
                      loading={enableSelectLoader}
                      onChange={(value) => {
                        setEnableSelectLoader(true);
                        SsetScoreOption(value);
                        SremoveEditPolicy();
                        redirect("createScorePolicy");
                      }}
                    >
                      <Select.Option value="Passenger">Passenger</Select.Option>
                      <Select.Option value="Flight">Flight</Select.Option>
                    </Select> */}
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
                  pagination={{ pageSize: 6, position: "bottomRight" }}
                  size="middle"
                  scroll={{ x: 1200 }}
                />
              </Col>
            </Row>
          ) : (
            <AdhocDisruptionListSkeleton />
          )}
        </Col>
        {toasterContextHolder}
        <ConfirmModalPopup onData={handlePopupData} props={popupData} />
      </Row>
    </div>
  );
};

export default ScoreList;
