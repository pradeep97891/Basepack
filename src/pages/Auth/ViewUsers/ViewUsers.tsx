import { useEffect, useMemo, useState } from "react";
import "./ViewUsers.scss";
import TableDisplay from "@/components/Table/Table";
import TableTabSearchFilter from "@/components/TableTabSearchFilter/TableTabSearchFilter";
import TableTab from "@/components/TableTab/TableTab";
import { MenuProps, RadioChangeEvent, Switch, TableProps } from "antd";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Flex,
  Menu,
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
import { useToaster } from "@/hooks/Toaster.hook";
import { ColumnType } from "antd/es/table";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import {
  useDeleteUserDataMutation,
  useGetUsersListMutation,
  // useLazyGetUsersListByPageQuery,
  usePutUserDataMutation,
} from "@/services/usersList/usersList.service";
import AdhocDisruptionListSkeleton from "../AdhocDisruptionList/AdhocDisruptionList.skeleton";
import {
  CustomFiltersType,
  generateOptions,
} from "@/components/PersonalizedFilter/PersonalizedFilter";
import { getGroupLabel } from "@/Utils/general";
import { formatDate } from "@/Utils/date";
import CustomTableColumn from "@/components/CustomTableColumn/CustomTableColumn";
import { useRedirect } from "@/hooks/Redirect.hook";
import PersonalizedFilter from "@/components/PersonalizedFilter/PersonalizedFilter";
const { Text } = Typography;

const ViewUsers = () => {
  const { t } = useTranslation();
  const { redirect } = useRedirect();
  const { showToaster, toasterContextHolder } = useToaster();
  const [filterTab, setFilterTab] = useState<string>("all");
  const [tableData, setTableData] = useState<any>([]);
  const [tabOptions, setTabOptions] = useState<any>([]);
  const [userServiceData, setUserServiceData] = useState<any>([]);
  const SEARCH_FILTER_FIELDS = ["email_id", "userName"];
  const [usersList, setUsersList] = useState<any>();
  const [usersListService, usersListResponse] = useGetUsersListMutation();
  // const [usersListService, usersListResponse] = useLazyGetUsersListByPageQuery();
  const [deleteUserService, deleteUserResponse] = useDeleteUserDataMutation();
  const [, SsetEditUserId, SremoveEditUserId] =
    useSessionStorage<any>("editUserId");
  const [, SsetUserListData] = useSessionStorage<any>("userListData");
  // const [deleteConfirmPopupId, setDeleteConfirmPopupId] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number | string>(1);
  // const [isDeletePopupLoading, setIsDeletePopupLoading] = useState<boolean>(false);
  const [userDataUpdateService] = usePutUserDataMutation();
  const isResponsive = window.innerWidth < 768;

  useEffect(() => {
    // usersListService([]);
    usersListService({ pageNumber: pageNumber });
  }, [deleteUserResponse, pageNumber]);

  const prepareTableData = (usersList: any) => {
    return {
      id: usersList?.id,
      key: usersList?.key,
      userName: `${usersList?.title}. ${usersList?.first_name} ${usersList?.last_name}`,
      first_name: usersList?.first_name,
      last_name: usersList?.last_name,
      email_id: usersList?.email_id,
      group: usersList?.group
        ?.split("_")
        ?.slice(1)
        ?.join(" ")
        ?.replace(/^\w/, (char: any) => char.toUpperCase()),
      userType: usersList?.group,
      airportCode: usersList?.airportCode,
      country_code: usersList?.country_code,
      phone_number: usersList?.phone_number,
      password: usersList?.password,
      confirmPassword: usersList?.confirmPassword,
      address: usersList?.address,
      city: usersList?.city,
      country: usersList?.country,
      timezone: usersList?.timezone,
      emailVerification: usersList?.emailVerificationStatus
        ? "Completed"
        : "In-progress",
      createdOn: formatDate(usersList?.date_joined),
      is_active: usersList?.is_active,
      emailVerificationStatus: usersList?.emailVerificationStatus,
      status: usersList?.status,
    };
  };

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title: t("view_users"),
    description: t("view_users_description"),
    breadcrumbProps: [
      {
        path: "/dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "/users",
        title: t("view_users"),
        breadcrumbName: t("view_users"),
        key: t("view_users"),
      },
    ],
  };

  useEffect(() => {
    if (usersListResponse?.isSuccess) {
      let userList = [
        ...(usersListResponse?.data as any)?.response?.data?.results,
      ];
      userList && setUsersList(userList.reverse());
      setUserServiceData((usersListResponse?.data as any)?.response?.data);
    }
  }, [usersListResponse?.isSuccess]);

  useEffect(() => {
    if (usersList?.length) {
      prepareTabOptions(usersList);
      setTableData(usersList.map(prepareTableData));
      SsetUserListData(usersList);
    } else {
      prepareTabOptions([]);
      setTableData([]);
      SsetUserListData([]);
    }
    // eslint-disable-next-line
  }, [usersList]);

  // Prepares 'Tab' filter options
  const prepareTabOptions = (usersList: any) => {
    const statusSet = new Set<string>(); // Use a Set to store unique values
    usersList.forEach(
      (
        users: any // Add each status to the set
      ) => statusSet.add(users?.status)
    );
    const options = [
      {
        label: (
          <>
            {t("all")}{" "}
            <Text className="cls-list-count">({usersList.length})</Text>
          </>
        ),
        value: "all",
      },
      ...Array.from(statusSet).map((status) => ({
        label: (
          <Text
            type={
              status === "Active"
                ? "success"
                : status === "In-Active"
                  ? "danger"
                  : "warning"
            }
          >
            {status}{" "}
            <Text className="cls-list-count">
              ({usersList.filter((user: any) => user?.status === status).length}
              )
            </Text>
          </Text>
        ),
        value: status,
      })),
    ];
    setTabOptions(options);
  };

  const [customFilterProps, setCustomFilterProps] = useState<CustomFiltersType>(
    []
  );

  const updateUserActiveData = async (userData: any, state: boolean) => {
    userData.is_active = state;
    await userDataUpdateService({
      id: userData?.id,
      value: userData,
    }).then((response) => {
      if ((response as any)?.data?.responseCode === 0) {
        notification.success({
          message: `User data updated successfully`,
        });
      }
    });
  };

  const initialColumns: ColumnType<any>[] = [
    {
      title: t("user_name"),
      dataIndex: "userName",
      key: "first_name__last_name",
      render: (_: any, { userName }: any) => (
        <>
          <Text className="responsive">{t("user_name")}</Text>
          <Text className="f-med fs-13">{userName}</Text>
        </>
      ),
    },
    {
      title: t("email_id"),
      dataIndex: "email_id",
      key: "email_id",
      render: (_: any, { email_id }: any) => (
        <>
          <Text className="responsive">{t("email_id")}</Text>
          <Text className="f-reg fs-13">{email_id}</Text>
        </>
      ),
    },
    {
      title: t("user_type"),
      dataIndex: "group",
      key: "group",
      render: (_: any, { group }: any) => (
        <>
          <Text className="responsive">{t("user_type")}</Text>
          <Text className="f-reg fs-13">{group}</Text>
        </>
      ),
    },
    // {
    //   title: t("email_verification"),
    //   dataIndex: "emailVerification",
    //   key: "emailVerification",
    //   render: (_: any, { emailVerification }: any) => (
    //     <Text
    //       style={{
    //         color:
    //           emailVerification === "Completed"
    //             ? "var(--t-view-user-active-color)"
    //             : "var(--ant-color-warning)",
    //       }}
    //       className={`f-med fs-12`}
    //     >
    //       {emailVerification}
    //     </Text>
    //   ),
    // },
    {
      title: t("created_on"),
      dataIndex: "createdOn",
      key: "date_joined",
      render: (_: any, { createdOn }: any) => (
        <>
          <Text className="responsive">{t("created_on")}</Text>
          <Text className="f-reg fs-13">{createdOn}</Text>
        </>
      ),
    },
    {
      title: t("status"),
      dataIndex: "status",
      key: "status",
      render: (_: any, user: any) => (
        <>
          <Text className="responsive">{t("status")}</Text>
          <Text>
            <Switch 
              checkedChildren="Active" 
              unCheckedChildren="In-active" 
              defaultChecked={user?.status === "Active" ? true : false} 
              onChange={(value) => {
                updateUserActiveData(user, value)
              }}
            />
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
      dataIndex: "buttons",
      key: "action",
    },
  ];

  /* Table custom column functionality */
  const [visibleColumns, setVisibleColumns] = useState(initialColumns);

  useEffect(() => {
    if (!usersList?.length) return;

    let customFilterProps = [
      {
        key: "group",
        label: "User Type",
        option: { key: "group", type: "default" },
      },
      {
        key: "status",
        label: "Status",
        option: { key: "status", type: "default" },
      },
    ];

    setCustomFilterProps(customFilterProps as CustomFiltersType);
  }, [usersList, visibleColumns]);

  /* Table size change functionality */
  type SizeType = TableProps["size"];
  const [size, setSize] = useState<SizeType>("middle");

  const tableSizeChangeHandler = () => {
    const sizes: SizeType[] = ["large", "middle", "small"];
    const currentIndex = sizes.indexOf(size);
    const nextSize = sizes[(currentIndex + 1) % sizes.length];
    setSize(nextSize);
  };

  const getNextPaginationData = (pageNumber: number | string) => {
    setPageNumber(pageNumber);
  };

  const columns = visibleColumns.map((col) => {
    if (col.dataIndex === "buttons") {
      return {
        ...col,
        render: (_: any, user: any) => (
          <>
            <Text className="responsive">{t("created_on")}</Text>
            <Text>
              <Row align="middle">
                <Col>
                  <Tooltip title={t("edit") + " " + t("user").toLowerCase()}>
                    <Text
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        SsetEditUserId(user?.id);
                        redirect('editUser')
                      }}
                      className="ml-1"
                    >
                      <Text className="Infi-Fd_12_Edit fs-16 p-clr" />
                    </Text>
                  </Tooltip>
                </Col>
                {/* <Col>
                  <Tooltip title={t("delete") + " " + t("user").toLowerCase()}>
                    <Popconfirm
                      title="Do you want to delete this user?"
                      open={deleteConfirmPopupId === user.id}
                      okText="Yes"
                      cancelText="No"
                      okButtonProps={{ loading: isDeletePopupLoading }}
                      onCancel={() => setDeleteConfirmPopupId(null)}
                      onConfirm={async () => {
                        setIsDeletePopupLoading(true);
                        try {
                          await new Promise((resolve) => setTimeout(resolve, 2000));
                          await deleteUserService(user.id).then((response) => {
                            if ((response as any)?.data?.responseCode === 0) {
                              notification.success({
                                message: `User deleted successfully`,
                              });
                            }
                          });
                          setDeleteConfirmPopupId(null);
                        } catch (error) {
                          console.error(
                            `Error during deleting policy(${user.id}):`,
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
                          setDeleteConfirmPopupId(user?.id);
                        }}
                      >
                        <Text
                          className="Infi-Fd_77_Garbage fs-17 p-clr"
                          style={{ color: "var(--t-form-input-error)" }}
                        />
                      </Text>
                    </Popconfirm>
                  </Tooltip>
                </Col> */}
              </Row>
            </Text>
          </>
        ),
      };
    }
    return col;
  });

  return (
    <div className="cls-view-users px-6 pt-3 pb-8">
      <Row>
        <Col span={24}>
          <Row align={"middle"}>
            <Col span={24}>
              <DescriptionHeader data={headerProps} />
            </Col>
          </Row>
          {usersList ? (
            <Row>
              <Col span={24} className="mt-1 mb-2">
                <Row className="rg-10" align="middle" gutter={10}>
                  {/* {!!customFilterProps.length && (
                    <Col span={22}>
                      <CustomFilter
                        tableData={usersList}
                        filters={customFilterProps}
                        visibleColumns={visibleColumns}
                        setTableData={setTableData}
                        tableDataPreparationHandler={prepareTableData}
                      />
                    </Col>
                  )} */}
                  {!!customFilterProps.length && (
                    <Col lg={18} xs={24} className={isResponsive ? "pb-2" : ""}>
                      <PersonalizedFilter
                        tableData={usersList}
                        filters={customFilterProps}
                        visibleColumns={visibleColumns}
                        setTableData={setTableData}
                        tableDataPreparationHandler={prepareTableData}
                      />
                    </Col>
                  )}
                  <Col lg={4} xs={24} className={isResponsive ? "pb-2" : ""}>
                    <TableTabSearchFilter
                      data={usersList}
                      tabDataKey="status"
                      currentTab={filterTab}
                      searchFields={SEARCH_FILTER_FIELDS}
                      tableDataPreparationHandler={prepareTableData}
                      setTableData={setTableData}
                      placeholder={`${t("search")} ${t("email_id").toLowerCase()} ${t("or")} ${t("user_name")}`}
                    />
                  </Col>
                  <Col lg={2} xs={24} className="text-right">
                    <Button
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        SremoveEditUserId();
                        redirect("addUser");
                      }}
                      className="cls-primary-btn"
                    >
                      {t("add_user")}
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
                  columns={columns}
                  // pagination={{ pageSize: 10, position: "bottomRight" }}
                  isBackendPagination={true}
                  fetchNextPaginationData={getNextPaginationData}
                  pagination={{
                    totalCount: userServiceData?.count,
                    pageSize: userServiceData?.results?.length,
                    position: "bottomRight",
                  }}
                  size={size}
                  scroll={{ x: 1200 }}
                />
              </Col>
            </Row>
          ) : (
            <AdhocDisruptionListSkeleton />
          )}
        </Col>
        {toasterContextHolder}
      </Row>
    </div>
  );
};

export default ViewUsers;
