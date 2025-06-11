import {
  Button,
  Col,
  Flex,
  Popconfirm,
  Row,
  TableColumnsType,
  Tooltip,
  Typography,
  message,
  notification,
} from "antd";
import { useEffect, useMemo, useRef, useState } from "react";
import "./Policy.scss";
import { useAppDispatch, useAppSelector } from "@/hooks/App.hook";
import { useTranslation } from "react-i18next";
import {
  useDeletePolicyMutation,
  useLazyGetPoliciesQuery,
} from "@/services/policy/Policy";
import {
  FdMailIcon,
  FdMessageIcon,
  FdWhatsappIcon,
} from "@/components/Icons/Icons";
import TableDisplay from "@/components/Table/Table";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import PolicyConditionModal from "./PolicyConditionModal/PolicyConditionModal";
import PolicySkeleton from "./Policy.skeleton";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import TableTab from "@/components/TableTab/TableTab";
import { NotificationType, useToaster } from "@/hooks/Toaster.hook";
import { cleanUpMessageApi } from "@/stores/General.store";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { getDynamicDate, getGroupLabel } from "@/Utils/general";
import CustomFilter, {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { useRedirect } from "@/hooks/Redirect.hook";
import {
  useDeleteAutoReassignPolicyMutation,
  useLazyGetAutoReassignPoliciesQuery,
} from "@/services/autoReaccommodation/Policy";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";
// eslint-disable-next-line
type FilterType = "all" | "tab" | "search";
const { Text } = Typography;
const SEARCH_FILTER_FIELDS = ["policyName", "createdBy"];

/**
 * Policy component displays a list of policies with filtering and search functionalities.
 * It allows users to view, filter, search, and create policies.
 */
const Policy: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { currentPath, isCurrentPathEqual, redirect } = useRedirect();
  const [getPolicies, policiesDataResponse] = useLazyGetPoliciesQuery();
  const [deletePolicy, deletePolicyResponse] = useDeletePolicyMutation();
  const [getAutoReassignPolicies, autoReassignpoliciesDataResponse] =
    useLazyGetAutoReassignPoliciesQuery();
  const [deleteAutoReassignPolicy, deleteAutoReassignPolicyResponse] =
    useDeleteAutoReassignPolicyMutation();
  const [tabOptions, setTabOptions] = useState<any>();
  const { reloadPolicyList, editablePolicy } = useAppSelector(
    (state) => state.PolicyReducer
  );
  const isResponsive = window.innerWidth < 768;
  /* Auto reaccommodation states */
  const isAutoReaccommodation: boolean = isCurrentPathEqual(
    "autoReaccommodationPolicyList"
  );

  const [policies, setPolicies] = useState<any>(undefined);
  const [messageApi, contextHolder] = message.useMessage();
  const [filterTab, setFilterTab] = useState<string>("all");
  const [tableData, setTableData] = useState<any>([]);

  const [SeditPolicy, SsetEditPolicy, SremoveEditPolicy] =
    useSessionStorage("editPolicy");

  const [deleteConfirmPopupId, setDeleteConfirmPopupId] = useState<
    number | null
  >(null);
  const [isDeletePopupLoading, setIsDeletePopupLoading] =
    useState<boolean>(false);

  useEffect(() => {
    if (isAutoReaccommodation) getAutoReassignPolicies([]);
    else getPolicies([]);

    SremoveEditPolicy();
    // eslint-disable-next-line
  }, [
    getPolicies,
    getAutoReassignPolicies,
    reloadPolicyList,
    deletePolicyResponse,
    currentPath,
  ]);

  useEffect(() => {
    if (
      isAutoReaccommodation &&
      autoReassignpoliciesDataResponse.isSuccess &&
      autoReassignpoliciesDataResponse.data?.responseCode === 0
    ) {
      setPolicies(
        [...autoReassignpoliciesDataResponse.data.response.data].reverse()
      );
    } else if (
      policiesDataResponse.isSuccess &&
      policiesDataResponse.data?.responseCode === 0
    )
      setPolicies([...policiesDataResponse.data.response.data].reverse());
    // eslint-disable-next-line
  }, [policiesDataResponse, autoReassignpoliciesDataResponse]);

  const { messageApiValue } = useAppSelector((state) => state.GeneralReducer);
  const { showToaster, toasterContextHolder } = useToaster();

  /* To show notification if the policy the created */
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

  /* Prepares 'Tab' filter options */
  const prepareTabOptions = useMemo(
    () => (policies: any) => {
      const statusSet = new Set<string>(); // Use a Set to store unique values

      policies.forEach((policy: any) => statusSet.add(policy.status)); // Add each status to the set

      const options = [
        {
          label: (
            <>
              {t("all")}{" "}
              <Text className="cls-list-count">({policies?.length})</Text>
            </>
          ),
          value: "all",
        },
        ...Array.from(statusSet).map((status) => ({
          label: (
            <>
              {status}{" "}
              <Text className="cls-list-count">
                ({policies.filter((pnr: any) => pnr.status === status)?.length})
              </Text>
            </>
          ),
          value: status,
        })),
      ];

      setTabOptions(options);
    }, // eslint-disable-next-line
    []
  );

  const deletePolicyHandler = async (policyId: number | string) => {
    const deleteHandler = isAutoReaccommodation
      ? deleteAutoReassignPolicy
      : deletePolicy;

    deleteHandler(policyId).then((response: any) => {
      if (response?.data?.responseCode === 0) {
        notification.success({
          message: `Policy deleted successfully`,
        });
      } else {
        messageApi.error("Error occurred while deleting!");
      }
    });
  };

  useEffect(() => {
    Object.keys(editablePolicy)?.length && redirect("createPolicy");
  }, [editablePolicy]);

  const navigateRef = useRef(false);

  const editPolicy = (policy: any) => {
    SsetEditPolicy(policy);
    navigateRef.current = true;
  };

  useEffect(() => {
    if (navigateRef.current)
      redirect(
        isAutoReaccommodation
          ? "createAutoReaccommodationPolicy"
          : "/createPolicy"
      );
  }, [SeditPolicy]);

  /* Converts PNR data from API to table data format */
  const prepareTableData = useMemo(
    () => (policy: any) => {
      return {
        key: policy.id,
        policyName: policy.policyName,
        effectiveDate: getDynamicDate(policy.effectiveDate),
        discontinueDate: getDynamicDate(policy.discontinueDate),
        createdInfo: `${policy.createdBy}`,
        createdTime: `${policy.createdAt}, ${getDynamicDate(policy.createdOn)}`,
        lastUpdatedInfo: `${policy.lastUpdatedBy}`,
        lastUpdatedTime: `${policy.lastUpdatedAt}, ${getDynamicDate(policy.lastUpdatedOn)}`,
        priority: policy.priority,
        status: t(policy.status.toLowerCase()),
        // action: (
        //   <Flex gap={10}>
        //     <Button type="link" className="px-0 py-0" href={"#"}>
        //       <FdWhatsappIcon />
        //     </Button>
        //     <Button type="link" className="px-0 py-0" href={"#"}>
        //       <FdMailIcon />
        //     </Button>
        //     <Button type="link" className="px-0 py-0" href={"#"}>
        //       <FdMessageIcon />
        //     </Button>
        //   </Flex>
        // )

        action: (
          <Flex>
            <Tooltip title={t("edit") + " " + t("policy").toLowerCase()}>
              <Text
                style={{ cursor: "pointer" }}
                onClick={() => {
                  editPolicy(policy);
                }}
              >
                <Text className="Infi-Fd_12_Edit fs-16 p-clr" />
              </Text>
            </Tooltip>
            <Tooltip title={t("delete") + " " + t("policy").toLowerCase()}>
              <Popconfirm
                title="Do you want to delete this policy?"
                description=""
                open={deleteConfirmPopupId === policy.id}
                okText="Yes"
                cancelText="No"
                okButtonProps={{ loading: isDeletePopupLoading }}
                onCancel={() => setDeleteConfirmPopupId(null)}
                onConfirm={async () => {
                  setIsDeletePopupLoading(true);
                  try {
                    await new Promise((resolve) => setTimeout(resolve, 2000));
                    await deletePolicyHandler(policy.id);

                    // .then((response) => {
                    //   if ((response as any)?.data?.responseCode === 0) {

                    //   }
                    // });
                    setDeleteConfirmPopupId(null);
                  } catch (error) {
                    console.error(
                      `Error during deleting policy(${policy.id}):`,
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
                    setDeleteConfirmPopupId(policy?.id);
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
    },
    [deleteConfirmPopupId, isDeletePopupLoading, getDynamicDate]
  );

  /* Setting table data from API policy service */
  useEffect(() => {
    if (policies?.length) {
      setTableData(policies.map(prepareTableData));
      prepareTabOptions(policies);
    }
  }, [policies, prepareTableData, prepareTabOptions]);

  /*  Setting header props to pass to the header component */
  let headerProps: ItineraryHeaderProps["data"] = {
    title: t(
      isAutoReaccommodation ? "auto_reaccommodation_policy_list" : "policy_list"
    ),
    description: t(
      isAutoReaccommodation
        ? "auto_reassign_policy_list_description"
        : "policy_list_description"
    ),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: isAutoReaccommodation
          ? "autoReaccommodationPolicyList"
          : "policy",
        title: t(
          isAutoReaccommodation
            ? "auto_reaccommodation_policy_list"
            : "policy_list"
        ),
        breadcrumbName: "Settings",
        key: "Rules & Policy",
      },
    ],
  };

  const initialColumns: TableColumnsType<any> = [
    {
      title: t("policy_name"),
      dataIndex: "policyName",
      key: "policyName",
      render: (_: any, { policyName }: any) => (
        <>
          <Text className="responsive">{t("policy_name")}</Text>
          <Text className="f-med fs-13">{policyName}</Text>
        </>
      ),
    },
    {
      title: t("effective_date"),
      dataIndex: "effectiveDate",
      key: "effectiveDate",
      render: (_: any, { effectiveDate }: any) => (
        <>
          <Text className="responsive">{t("effective_date")}</Text>
          <Text className="f-reg fs-13">{effectiveDate}</Text>
        </>
      ),
    },
    {
      title: t("discontinue_date"),
      dataIndex: "discontinueDate",
      key: "discontinueDate",
      render: (_: any, { discontinueDate }: any) => (
        <>
          <Text className="responsive">{t("discontinue_date")}</Text>
          <Text className="f-reg fs-13">{discontinueDate}</Text>
        </>
      ),
    },
    {
      title: t("created_info"),
      dataIndex: "createdInfo",
      key: "createdBy",
      render: (createdInfo: any, tableData: any) => (
        <>
          <Text className="responsive">{t("created_info")}</Text>
          <Text>
            {tableData.createdInfo}
            <Text className={`d-block fs-11 f-reg`}> {tableData.createdTime}</Text>
          </Text>
        </>
      ),
    },
    {
      title: t("last_updated_info"),
      dataIndex: "lastUpdatedInfo",
      key: "lastUpdatedBy",
      render: (lastUpdatedInfo: any, tableData: any) => (
        <>
          <Text className="responsive">{t("last_updated_info")}</Text>
          <Text>
            {tableData.lastUpdatedInfo}
            <Text className={`d-block fs-11 f-reg`}>
              {tableData.lastUpdatedTime}
            </Text>
          </Text>
        </>
      ),
    },
    {
      title: t("priority"),
      dataIndex: "priority",
      key: "priority",
      sorter: (a: any, b: any) => a.priority - b.priority,
      render: (_: any, { priority }: any) => (
        <>
          <Text className="responsive">{t("priority")}</Text>
          <Text className="f-reg fs-13">{priority}</Text>
        </>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
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

  // Custom filter state
  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  /* Custom filter */
  useEffect(() => {
    if (!policies?.length) return;

    setCustomFilterProps([
      {
        key: "status",
        label: "Status",
        option: { key: "status", type: "default" },
      },
    ]);
  }, [policies]);

  return (
    <Row className="cls-policy-container px-6 pt-3 pb-8" data-testid="policy">
      <Col span={24}>
        <Row>
          <Col span={24}>
            <DescriptionHeader data={headerProps} />
          </Col>
        </Row>
        {typeof policies !== "undefined" ? (
          <Row>
            <Col span={24} className="mt-1 mb-2">
              <Row className="rg-10" gutter={10}>
                {/* <Col span={20}>
                  {!!customFilterProps.length && (
                    <CustomFilter
                      tableData={policies}
                      filters={customFilterProps}
                      visibleColumns={visibleColumns}
                      setTableData={setTableData}
                      tableDataPreparationHandler={prepareTableData}
                    />
                  )}
                </Col> */}
                {!!customFilterProps.length && (
                  <Col lg={17} xs={24} className={isResponsive ? "pb-2" : ""}>
                    <PersonalizedFilter
                      tableData={policies}
                      filters={customFilterProps}
                      visibleColumns={visibleColumns}
                      setTableData={setTableData}
                      tableDataPreparationHandler={prepareTableData}
                    />
                  </Col>
                )}
                <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                  <TableTabSearchFilter
                    data={policies}
                    tabDataKey="status"
                    currentTab={filterTab}
                    searchFields={SEARCH_FILTER_FIELDS}
                    tableDataPreparationHandler={prepareTableData}
                    setTableData={setTableData}
                    placeholder={
                      t("search") + " " + t("policy_name").toLowerCase()
                    }
                  />
                </Col>
                <Col lg={3} xs={24} className="text-right">
                  <Button
                    className="cls-primary-btn"
                    // onClick={() => dispatch(updateOpenConditionModal(true))}
                    onClick={() =>
                      redirect(
                        isAutoReaccommodation
                          ? "createAutoReaccommodationPolicy"
                          : "createPolicy"
                      )
                    }
                  >
                    {t("create_policy")}
                  </Button>
                </Col>
              </Row>
            </Col>
            {/* <Col xs={{ order: 2 }} md={{ order: 1 }}>
                    <Flex align="center">
                        <TableTab
                          options={tabOptions}
                          changeHandler={setFilterTab}
                          currentTab={filterTab}
                        />
                    </Flex>
                  </Col> */}
            <Col span={24}>
              <TableDisplay
                data={tableData}
                columns={visibleColumns}
                pagination={{ pageSize: 5, position: "bottomRight" }}
                size="middle"
              />
            </Col>
          </Row>
        ) : (
          <PolicySkeleton />
        )}
      </Col>
      {/* Policy Condition check Modal */}
      <PolicyConditionModal />
      {contextHolder}
      {toasterContextHolder}
    </Row>
  );
};

export default Policy;
