import {
  Card,
  Col,
  Row,
  Button,
  Form,
  Input,
  Select,
  Switch,
  Typography,
  notification,
  Checkbox,
} from "antd";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import DescriptionHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import "./AddUser.scss";
import {
  useGetUsersGroupListMutation,
  usePutUserDataMutation,
  useGetUserDataMutation,
  usePostUserDataIntoListMutation,
} from "@/services/usersList/usersList.service";
import { useRedirect } from "@/hooks/Redirect.hook";
import AddUserSkeleton from "./AddUser.skeleton";
import { useDispatch } from "react-redux";
import { updateMessageApi } from "@/stores/General.store";
import { useResize } from "@/Utils/resize";

const AddUser = () => {
  const { t } = useTranslation();
  const {redirect} = useRedirect();
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const form_values = Form.useWatch([], form);
  const [btnDisable, setBtnDisable] = useState(false);
  const {isCurrentPathEqual, currentPath} = useRedirect();
  const [loading, setLoading] = useState<any>(false);
  const [SeditUserId, , SremoveEditUserId] =
    useSessionStorage<any>("editUserId");
  const [userDataService, userDataResponse] = useGetUserDataMutation();
  const [usersGroupListService, usersGroupListResponse] =
    useGetUsersGroupListMutation();
  const [userDataUpdateService] = usePutUserDataMutation();
  const [userCreateService] = usePostUserDataIntoListMutation();
  const [isChangePassword, setIsChangePassword] = useState<boolean>(false);
  const [groupList, setGroupList] = useState<any>(false);
  const [initialValue, setInitialValue] = useState<any>(false);

  useEffect(() => {
    usersGroupListService([]);
    SeditUserId && userDataService(SeditUserId);
  }, []);

  const headerProps: ItineraryHeaderProps["data"] = {
    title: t( isCurrentPathEqual('editUser') ? "edit_user" : "add_user"),
    description: t(
      isCurrentPathEqual('editUser')
        ? "edit_user_description"
        : "add_user_description"
    ),
    breadcrumbProps: [
      {
        path: "dashboard",
        title: t("dashboard"),
        breadcrumbName: "Dashboard",
        key: "Dashboard",
      },
      {
        path: "users",
        title: t("view_users"),
        breadcrumbName: t("view_users"),
        key: t("view_users"),
      },
      {
        path: currentPath,
        title: t(isCurrentPathEqual('editUser') ? "edit_user" : "add_user"),
        breadcrumbName: t(isCurrentPathEqual('editUser') ? "edit_user" : "add_user"),
        key: currentPath,
      },
    ],
  };

  const areObjectsEqual = (obj1: any, obj2: any) => {
    const keys1 = Object.keys(obj1).sort();
    const keys2 = Object.keys(obj2).sort();
    if (keys1.length !== keys2.length) return false;
    for (let i = 0; i < keys1.length; i++) {
      if (obj1[keys1[i]] !== obj2[keys1[i]]) return false;
    }
    return true;
  };

  useEffect(() => {
    if (usersGroupListResponse?.isSuccess) {
      setGroupList(
        (usersGroupListResponse?.data as any)?.response?.data?.results
      );
    }
    if (userDataResponse?.isSuccess) {
      var values = JSON.parse(
        JSON.stringify((userDataResponse?.data as any)?.response?.data)
      );
      values.country = values.country_code;
      setInitialValue(values);
    }
  }, [usersGroupListResponse?.isSuccess, userDataResponse?.isSuccess]);

  useEffect(() => {
    const formValues = form.getFieldsValue();
    if (formValues) {
      if (initialValue) {
        setBtnDisable(areObjectsEqual(formValues, initialValue));
      }
    }
  }, [form_values]);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      var updateValue = values;
      var response: any;
      delete updateValue.confirmPassword;
      delete updateValue.country;
      delete updateValue.group;
      delete updateValue.emailVerificationStatus;
      updateValue.is_active = !!updateValue.is_active;
      updateValue.group_id = updateValue.group_id;
      updateValue.corporate_id = 1;
      updateValue.user_type_id = 1;
      if (updateValue.title === undefined) {
        updateValue.title = "Mr";
      }
      if (updateValue.password === undefined) {
        updateValue.password = "";
      }
      
      if (initialValue) {
        // delete updateValue.password;
        response = await userDataUpdateService({
          id: initialValue.id,
          value: updateValue,
        }).unwrap();
      } else {
        updateValue.status_id = updateValue.is_active ? 1 : 2;
        response = await userCreateService(updateValue).unwrap();
      }
      var intervalSet = setInterval(() => {
        if (response?.responseCode === 0) {
          setLoading(false);
          SremoveEditUserId();
          clearInterval(intervalSet);
          dispatch(
            updateMessageApi({
              open: true,
              type: "success",
              title: t("success"),
              description: `User ${isCurrentPathEqual('editUser') ? "created" : "updated"} successfully`,
            })
          );
          redirect("users");
        }
      }, 1000);
    } catch (error: any) {
      setLoading(false);
        notification.error({
          key: 1,
          message: error?.data?.response?.errors?.email_id[0],
          duration: 5,
        });
      console.error("Error:", error, error?.data?.response?.errors?.email_id[0]);
    }
  };

  const countryData: { [key: string]: { code: string; timeZone: string } } = {
    IN: { code: "IN", timeZone: "Asia/Kolkata" },
    US: { code: "US", timeZone: "America/NewYork" },
    UK: { code: "UK", timeZone: "Europe/London" },
  };

  const handleCountryChange = (value: string) => {
    const countryInfo = countryData[value];
    if (countryInfo) {
      form.setFieldsValue({
        country_code: countryInfo.code,
        timezone: countryInfo.timeZone,
      });
    }
  };

  const handleCountryCodeChange = (value: string) => {
    const country = Object.keys(countryData).find(
      (key) => countryData[key].code === value
    );
    if (country) {
      form.setFieldsValue({
        country,
        timezone: countryData[country].timeZone,
      });
    }
  };

  const handleTimeZoneChange = (value: string) => {
    const country = Object.keys(countryData).find(
      (key) => countryData[key].timeZone === value
    );
    if (country) {
      form.setFieldsValue({
        country,
        country_code: countryData[country].code,
      });
    }
  };

  const { isSmallScreen } = useResize();
  const { isMediumScreen } = useResize(990);

  return (
    <div className={`cls-AddUser ${isSmallScreen  ? "px-0 pt-0 pb-3" : "px-6 pt-4 pb-3"}`} data-testid="AddUser">
      <DescriptionHeader data={headerProps} />
      {(
        isCurrentPathEqual('editUser')
          ? userDataResponse?.isSuccess && initialValue
          : true
      ) ? (
        <Form
          form={form}
          labelCol={{ span: 4 }}
          wrapperCol={{ span: 14 }}
          initialValues={initialValue}
          layout="horizontal"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Card>
            <Row>
              <Col span={24}>
                <Row>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item
                      label={t("user_type")}
                      name="group_id"
                      rules={[
                        {
                          required: true,
                          message: t("select_user_type") + "!",
                        },
                      ]}
                    >
                      <Select placeholder={t("select_user_type")}>
                        {groupList ? (
                          groupList?.map((groupName: any) => (
                            (groupName.name !== "fdms_retail_customer" && 
                            groupName.name !== "fdms_travel_agent") && 
                            <Select.Option value={groupName.id}>
                              { 
                                groupName.name
                                .split("_")
                                .slice(1) // Remove the first element
                                .map(
                                  (word: string, index: number) =>
                                    index === 0
                                      ? word.charAt(0).toUpperCase() +
                                        word.slice(1).toLowerCase() // Capitalize the first word
                                      : word.toLowerCase() // Lowercase for other words
                                )
                                .join(" ")
                              }
                            </Select.Option>
                          ))
                        ) : (
                          <> </>
                        )}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={4} xl={2}>
                    <Form.Item
                      className="cls-title"
                      labelCol={{ span: 24 }}
                      wrapperCol={{ span: 18 }}
                      label="Title"
                      name="title"
                    >
                      <Select defaultValue="Mr">
                        <Select.Option value="Mr">Mr</Select.Option>
                        <Select.Option value="Ms">Ms</Select.Option>
                        <Select.Option value="Mrs">Mrs</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={6}>
                    <Form.Item
                      label={t("first_name")}
                      name="first_name"
                      rules={[
                        {
                          required: true,
                          message: t("enter_first_name") + "!",
                        },
                        {
                          pattern: /^[A-Za-z]+$/,
                          message: t("only_alphabets_msg"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t("enter_first_name")}
                        maxLength={30}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item
                      label={t("last_name")}
                      name="last_name"
                      rules={[
                        { required: true, message: t("enter_last_name") + "!" },
                        {
                          pattern: /^[A-Za-z]+$/,
                          message: t("only_alphabets_msg"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t("enter_last_name")}
                        maxLength={30}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item
                      label={t("email_id")}
                      name="email_id"
                      rules={[
                        {
                          required: true,
                          message: t("email_id_placeholder") + "!",
                        },
                        { type: "email", message: t("invalid_email_msg") },
                      ]}
                    >
                      <Input
                        placeholder={t("email_id_placeholder")}
                        maxLength={40}
                      />
                    </Form.Item>
                  </Col>
                  {
                    !isCurrentPathEqual('editUser') &&
                    <>
                      <Col span={8}>
                        <Form.Item
                          label={t("password")}
                          name="password"
                          rules={[
                            {
                              required: isCurrentPathEqual('editUser') ? false : true,
                              message: t("enter_password") + "!",
                            },
                            {
                              pattern:
                                /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                              message: t("invalid_password_msg"),
                            },
                          ]}
                        >
                          <Input.Password
                            placeholder={t("enter_password")}
                            maxLength={8}
                          />
                        </Form.Item>
                      </Col>
                      <Col span={8}>
                        <Form.Item
                          label={t("confirm_password")}
                          name="confirmPassword"
                          dependencies={["password"]}
                          rules={[
                            {
                              required: isCurrentPathEqual('editUser') ? false : true,
                              message: t("enter_confirm_password") + "!",
                            },
                            ({ getFieldValue }) => ({
                              validator(_, value) {
                                if (!value || getFieldValue("password") === value)
                                  return Promise.resolve();
                                return Promise.reject(
                                  new Error("Passwords do not match!")
                                );
                              },
                            }),
                          ]}
                        >
                          <Input.Password
                            placeholder={t("enter_confirm_password")}
                            maxLength={8}
                          />
                        </Form.Item>
                      </Col>
                    </>
                  }
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item
                      label={t("city")}
                      name="city"
                      rules={[
                        { required: true, message: t("enter_city") + "!" },
                        {
                          pattern: /^[A-Za-z]+$/,
                          message: t("only_alphabets_msg"),
                        },
                      ]}
                    >
                      <Input placeholder={t("enter_city")} maxLength={30} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item
                      label={t("country")}
                      name="country"
                      rules={[
                        { required: true, message: t("select_country") + "!" },
                      ]}
                    >
                      <Select
                        placeholder={t("select_country")}
                        onChange={handleCountryChange}
                      >
                        <Select.Option value="IN">India</Select.Option>
                        <Select.Option value="US">USA</Select.Option>
                        <Select.Option value="UK">UK</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={4} xl={2}>
                    <Form.Item
                      label={t("country_code")}
                      name="country_code"
                      className="cls-country-code"
                    >
                      <Select
                        placeholder={t("select")}
                        className="text-ellipsis"
                        onChange={handleCountryCodeChange}
                      >
                        <Select.Option value="IN">+91</Select.Option>
                        <Select.Option value="US">+1</Select.Option>
                        <Select.Option value="UK">+44</Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={12} xl={6} className={`${isSmallScreen || isMediumScreen ? "" :"pl-3"}`}>
                    <Form.Item
                      label={t("phone_number")}
                      name="phone_number"
                      className={`${isSmallScreen || isMediumScreen ? "" :"pl-2"} cls-phone`}
                      rules={[
                        {
                          pattern: /^\d+$/,
                          message: t("only_numeric_msg"),
                        },
                      ]}
                    >
                      <Input
                        placeholder={t("enter_phone_number")}
                        maxLength={15}
                      />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                    <Form.Item label={t("time_zone")} name="timezone">
                      <Select
                        placeholder={t("select_time_zone")}
                        onChange={handleTimeZoneChange}
                      >
                        <Select.Option value="Asia/Kolkata">
                          {" "}
                          Asia/Kolkata (GMT+05:30){" "}
                        </Select.Option>
                        <Select.Option value="America/NewYork">
                          {" "}
                          America/New york (GMT-05:00){" "}
                        </Select.Option>
                        <Select.Option value="Europe/London">
                          {" "}
                          Europe/London (GMT+00:00){" "}
                        </Select.Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  {
                    isCurrentPathEqual('editUser') &&
                    <Col xs={24} sm={12} md={12} lg={8} xl={8}>
                      <Form.Item
                        label={t("password")}
                        name="password"
                        rules={[
                          {
                            required: isChangePassword || isCurrentPathEqual('editUser') ? false : true,
                            message: t("enter_password") + "!",
                          },
                          {
                            pattern:
                              /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
                            message: t("invalid_password_msg"),
                          },
                        ]}
                      >
                        {isChangePassword || !isCurrentPathEqual('editUser') ?
                        <Input.Password
                          placeholder={t("enter_password")}
                          maxLength={8}
                        />
                        : <label
                            style={{
                              border: "var(--ant-line-width) var(--ant-line-type) var(--ant-color-border)",
                              display: "flex",
                              alignItems: "center",
                              height: 42,
                              borderRadius: 6,
                              padding: 10,
                              fontSize: 19,
                              paddingTop: 15,
                            }}
                          >
                            ********
                          </label>
                        }
                      </Form.Item>
                      {!isCurrentPathEqual('editUser') ? (
                          <></>
                        ) : (
                          <Row className="cls-form-hide-psw" style={{ marginTop: '0px' }}>
                            <Col xs={24} sm={24} md={24} lg={24} xl={24}>
                              <Checkbox
                                onChange={(value) => {
                                  setIsChangePassword(value.target.checked);
                                }}
                              >
                                Change password
                              </Checkbox>
                            </Col>
                          </Row>
                        )}
                    </Col>
                  }
                  <Col xs={24} sm={12} md={12} lg={20} xl={20} className="cls-switch-row mt-2">
                    <Form.Item
                      className={`${isSmallScreen || isMediumScreen ? "" :"w-30"} cls-status`}

                      label={t("activation_status")}
                      name="is_active"
                    >
                      <Switch 
                        checkedChildren="Active" 
                        unCheckedChildren="In-active" 
                      />
                    </Form.Item>
                    {/* <Form.Item
                      label={t("email_verification_status")}
                      name="emailVerificationStatus"
                      className="w-36"
                    >
                      <Switch 
                        checkedChildren="Yes" 
                        unCheckedChildren="No" 
                      />
                    </Form.Item> */}
                  </Col>
                </Row>
              </Col>
            </Row>
          </Card>
          <Row justify="center" className="w-100 mt-6 cls-submit-row">
            <Form.Item className="text-center w-100">
              <Button
                type="default"
                className={`mr-3 px-8 p-clr fs-14 h-43 f-med ${btnDisable ? "cls-disabled no-events" : ""}`}
                onClick={() => form.resetFields()}
              >
                {isCurrentPathEqual('editUser') ? t("reset") : t("clear")}
              </Button>
              <Button
                htmlType="submit"
                className={`cls-primary-btn px-8 py-2 mr-2 fs-15 f-med ${btnDisable ? "cls-disabled no-events" : ""}`}
                loading={loading}
              >
                {isCurrentPathEqual('editUser') ? t("update") : t("create")}
              </Button>
            </Form.Item>
          </Row>
        </Form>
      ) : (
        <AddUserSkeleton />
      )}
    </div>
  );
};

export default AddUser;
