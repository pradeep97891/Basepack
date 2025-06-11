import {
  Button,
  Card,
  Col,
  Divider,
  Dropdown,
  Form,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
  FormProps,
  Flex,
  Modal,
  Input,
  message,
  Collapse,
} from "antd";
import { useEffect, useMemo, useState } from "react";
import type { CollapseProps } from "antd";
import "./PersonalizedFilter.scss";
import { MenuProps } from "antd/lib";
import React from "react";
import { hydrateUserFromLocalStorage } from "@/Utils/user";
import {
  useLazyGetSavedFiltersQuery,
  useSaveFilterMutation,
} from "@/services/common/Common";
import { filterItemsByDateRange } from "@/Utils/general";
import { useToggle } from "@/hooks/Toggle.hook";
import { FdFilter } from "../Icons/Icons";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useAppSelector } from "@/hooks/App.hook";
import { resetAppliedFilter } from "@/stores/General.store";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useResize } from "@/Utils/resize";

type OptionType = { label: string; value: string };

type DynamicOptionsType = {
  key: string;
  type: "default" | "split" | "date";
  labelFunc?: (value: string) => string;
  valueFunc?: (value: string) => string;
};

type CustomFilterType = {
  key: string;
  label: string;
  option: DynamicOptionsType;
};

export type CustomFiltersType = CustomFilterType[];

type CustomFilterCompType = {
  tableData: any[];
  filters: CustomFiltersType;
  visibleColumns?: any[];
  setTableData: any;
  tableDataPreparationHandler?: any;
};

const PersonalizedFilter: React.FC<CustomFilterCompType> = ({
  tableData,
  filters,
  visibleColumns,
  setTableData,
  tableDataPreparationHandler,
}) => {
  /**
   * Used to split nested keys when the filter is applied to nested properties.
   */
  const KEY_DELIMETER = "__";
  const { Text } = Typography;
  const [open, setOpen] = useState(false);
  const { isSmallScreen } = useResize();
  const dispatch = useDispatch();
  const {t} = useTranslation()
  const [filterForm] = Form.useForm();
  const [getFilters, getFiltersResponse] = useLazyGetSavedFiltersQuery();
  const [saveFilter, saveFilterResponse] = useSaveFilterMutation();
  const userDetail: any = hydrateUserFromLocalStorage();
  const { currentPath } = useRedirect();
  const { appliedFilters } = useAppSelector((state) => state.GeneralReducer);

  useEffect(() => {
    dispatch(resetAppliedFilter([]));
  }, [])

  /**
   * Toggles the dropdown's open state when a user interacts with it.
   *
   * @param {boolean} flag - Represents whether the dropdown should be opened or closed.
   */
  const handleOpenChange = (flag: boolean) => {
    if (flag !== open) setOpen(flag);
  };

  // const formValues = Form.useWatch([], filterForm);
  // const [appliedFilters, setAppliedFilters] = useState({});

  const collapseItems = useMemo<CollapseProps["items"]>(
    () => [
      {
        key: "moreFilters",
        label: "More Filter",
        children: (
          <>
            {filters.slice(3).map((filter: CustomFilterType) => {
              const options: OptionType[] = generateOptions(
                tableData,
                filter.option
              );
              return (
                <Form.Item
                  name={["filters", filter.key]}
                  key={filter.key}
                  label={filter.label}
                  className="cls-more-filter"
                >
                  <Select options={options} placeholder="Select" />
                </Form.Item>
              );
            })}
          </>
        ),
      },
    ],
    [filters, tableData]
  );

  const filterHandler: FormProps<any>["onFinish"] = (
    values: Record<string, any>
  ) => {
        const formValues = filterForm.getFieldsValue();
    const isValid =
      formValues &&
      !!Object.values(formValues["filters"]).filter((v: any) => v)?.length;
    if (isValid) {
      dispatch(
        resetAppliedFilter(
          Object.entries(formValues["filters"])
            .filter(([, value]) => value !== undefined)
            .reduce(
              (acc, [key, value]) => {
                acc[key] = value;
                return acc;
              },
              {} as Record<string, any>
            )
        )
      );
    }
    // else {
    //   message.error("Add filter before applying!");
    // }

    let filteredItems = [...tableData];

    for (let [key, value] of Object.entries(values["filters"])) {
      if (!value || value == "" || (Array.isArray(value) && !value.length))
        continue;

      const searchValue = Array.isArray(value)
        ? value.map((v: string) => v?.trim()?.toLowerCase())
        : [(value as string)?.trim()?.toLowerCase()];

      const splitKeys = key.split(KEY_DELIMETER);

      // key1__key2 functionality
      if (splitKeys.length > 1) {
        filteredItems = filteredItems.filter((item: any) => {
          return splitKeys.some((splitKey) => {
            return searchValue.some((sv) => {
              const itemValue = item[splitKey]?.trim()?.toLowerCase();
              return itemValue === sv;
            });
          });
        });
      } else {
        /* Date range filter */
        if (key.toLowerCase().includes("date")) {
          filteredItems = filterItemsByDateRange(
            filteredItems,
            key as string,
            (value as string).toLowerCase()
          );
        } else {
          // basic search case
          filteredItems = filteredItems?.filter((item: any) => {
            return searchValue?.some((sv) => {
              const itemValue = item[key]?.trim()?.toLowerCase();
              return itemValue === sv;
            });
          });
        }
      }
    }

    setTableData(tableDataPreparationHandler ? filteredItems.map(tableDataPreparationHandler): filteredItems);
    setOpen(false);
  };

  const [allFilters, setAllFilters] = useState<any>();
  const [savedFilters, setSavedFilters] = useState<any>({});
  const [messageApi, contextHolder] = message.useMessage();

  useEffect(() => {
    getFilters([]);
  }, [saveFilterResponse]);

  useEffect(() => {
    if (
      getFiltersResponse?.isSuccess &&
      getFiltersResponse?.data?.responseCode == 0
    ) {
      setAllFilters(getFiltersResponse.data?.response?.data);
    }
  }, [getFiltersResponse]);  

  useEffect(() => {
    if (allFilters && Object.keys(allFilters).length) {
      setSavedFilters(allFilters?.[userDetail.email]?.[currentPath]);
    }
  }, [allFilters]);

  const [loading, setLoading] = useState<boolean>(false);

  const saveFilterhandler = (values: any, newFilter: boolean = false) => {
    const { name } = values;
    const { email } = userDetail;
    const formValues = filterForm.getFieldsValue();

    const updatedFilters = JSON.parse(JSON.stringify(allFilters));
    // Add a new user if not present, then assign new filter
    if (!updatedFilters[email]) {
      updatedFilters[email] = {};
    }
    // Add the current page path if not present, then assign new filter
    if (!updatedFilters[email][currentPath]) {
      updatedFilters[email][currentPath] = {};
    }

    if (newFilter) {
      // Add the new filter if filter name is unique
      if (!updatedFilters[email][currentPath][name]) {
        updatedFilters[email][currentPath][name] = formValues["filters"];
      } else {
        messageApi.error("Filter name already exists!");
        return;
      }
    } else {
      // Check if user and filter exist; if so, update it
      if (
        updatedFilters[email] &&
        updatedFilters[email][currentPath] &&
        updatedFilters[email][currentPath][name]
      ) {
        updatedFilters[email][currentPath][name] = {
          ...updatedFilters[email][currentPath][name],
          ...formValues["filters"],
        };
      }
    }
    setLoading(true);

    const saveAndFetchFilters = async () => {
      try {
        const response: any = await saveFilter(updatedFilters);
        if (response?.data?.responseCode === 0) {
          messageApi.success("Filter saved successfully!");
        } else {
          messageApi.error("Internal server error!");
        }
      } catch (error) {
        messageApi.error("Failed to save filter!");
      } finally {
        filterForm.resetFields();
        newFilter && toggleSaveFilterModal();
        setLoading(false);
      }
    };

    saveAndFetchFilters();
  };

  /* Reset handler */
  const resetFilters = () => {
    filterForm.resetFields();
  };

  const validateFilterHandler = () => {
    setOpen(false)
    let formValues = filterForm.getFieldsValue();
    const values =
      formValues &&
      Object.values(formValues?.filters) &&
      Object.values(formValues?.filters)?.filter((v) => !!v);

    if (!values?.length) {
      messageApi.error("Add filters before saving!");
      return;
    }

    if (formValues["savedFilter"] == NEW_FILTER) {
      toggleSaveFilterModal();
    } else {
      saveFilterhandler({ name: formValues["savedFilter"] });
    }
  };

  /* Remove handler */
  const removeFilter = (key: string) => {
    filterForm.setFieldValue(["filters", key], undefined);
    const newAppliedFilter: any = { ...appliedFilters };
    delete newAppliedFilter?.[key];
    if (!Object.keys(newAppliedFilter)?.length)
      filterForm.setFieldValue("savedFilter", undefined);
    dispatch(resetAppliedFilter(newAppliedFilter));
    filterForm.submit();
  };

  const [SaveFilterForm] = Form.useForm();
  const [openSaveFilterModal, toggleSaveFilterModal] = useToggle(false);
  const NEW_FILTER = "New filter";

  const [appliedFilterKeys, setAppliedFilterKeys] = useState<string[]>([]);

  useEffect(() => {
    if (appliedFilters && Object.keys(appliedFilters).length) {
      setAppliedFilterKeys(Object.keys(appliedFilters));
    }
  }, [appliedFilters]);

  // const appliedFilterKeys = Object.keys(appliedFilters);
  const [savedFilterOptions, setSavedFilterOptions] = useState<any>([
    { label: NEW_FILTER, value: NEW_FILTER },
  ]);

  useEffect(() => {
    if (savedFilters && Object.keys(savedFilters).length) {
      setSavedFilterOptions([
        { label: NEW_FILTER, value: NEW_FILTER },
        ...Object.keys(savedFilters).map((f: string) => ({
          label: f,
          value: f,
        })),
      ]);
    }
  }, [savedFilters]);

  /* Set values of saved filter */
  const setSavedFilterFieldsHandler = (value: string) => {
    if (value == NEW_FILTER) {
      const filterKeys = filters.map((item) => item.key);
      filterKeys.forEach((k: string) =>
        filterForm.setFieldValue(["filters", k], undefined)
      );
      return;
    }

    const sf = savedFilters?.[value];
    Object.keys(sf).forEach((key) => {
      filterForm.setFieldValue(["filters", key], sf[key]);
    });
  };

  return (
    <Row className="cls-personalized-filter" gutter={isSmallScreen ? 0 : 40} justify="end">
      {!!Object.keys(appliedFilters)?.length && (
        <Col>
          <Flex align="center" justify="center" className="cls-applied-filters">
            { tableDataPreparationHandler &&
              <Text type="secondary" className="fs-14 mr-3">
                Applied Filters :
              </Text>
            }
            <Space>
              {appliedFilterKeys
                .slice(0, 2)
                ?.map((f: string, index: number) => {
                  return (
                    <Card className="cls-applied-filter-card" key={index}>
                      <Text>{(appliedFilters as any)?.[f]}</Text>
                      <Button type="link" className="px-0 py-0">
                        <Text
                          className="Infi-Fd_82_CloseMark fs-10 cls-close-mark ml-2"
                          onClick={() => removeFilter(f)}
                        ></Text>
                      </Button>
                    </Card>
                  );
                })}
              {appliedFilterKeys?.length > 2 &&
                `+ ${appliedFilterKeys?.length - 2}`}
            </Space>
          </Flex>
        </Col>
      )}
      <Col className="cls-filter-dropdown">
        <Dropdown
          className="mr-2"
          // menu={{ items }}
          dropdownRender={(menu) => (
            <Card className="cls-dropdown" bordered={false} style={{minWidth: 247}}>
              <Form
                form={filterForm}
                layout="vertical"
                onFinish={filterHandler}
              >
                <Flex
                  align="center"
                  justify="space-between"
                  className="cls-filter-header py-2"
                >
                  <Text>
                    <Text title="Go back" className="Infi-Fd_10_ArrowRight cls-goBack" onClick={()=>setOpen(false)}></Text>
                    <Text className="fs-16 f-med">Filters</Text>
                  </Text>
               
                  <Button
                    type="link"
                    className="px-0 py-0 fs-13 f-reg p-clr"
                    onClick={resetFilters}
                  >
                    Reset All
                  </Button>
                </Flex>
                <Divider className="my-0" />
                <Flex vertical gap={8} className="cls-filters pt-2 py-3">
                { tableDataPreparationHandler &&
                  <Form.Item
                    className="cls-saved-filter"
                    name="savedFilter"
                    label="Saved Filters"
                    key="savedFilter"
                  >
                    <Select
                      options={savedFilterOptions}
                      onChange={setSavedFilterFieldsHandler}
                      optionRender={(option) => {
                        const isNewFilter = option.data.value == NEW_FILTER;
                        return (
                          <Text
                            className={`${isNewFilter ? "cls-grey-lite" : ""}`}
                          >
                            {option.data.value}
                          </Text>
                        );
                      }}
                      placeholder="Select"
                    />
                  </Form.Item>
                }
                  {filters.slice(0, 3).map((filter: CustomFilterType) => {
                    const options: OptionType[] = generateOptions(
                      tableData,
                      filter.option
                    );
                    return (
                      <Form.Item
                        name={["filters", filter.key]}
                        key={filter.key}
                        label={filter.label}
                      >
                        <Select options={options} placeholder="Select" />
                      </Form.Item>
                    );
                  })}
                  {filters.length > 3 && (
                    <Flex className="mt-2">
                      <Collapse
                        ghost
                        items={collapseItems}
                        className="cls-more-items-collapse w-100"
                      />
                    </Flex>
                  )}
                  <Button
                    htmlType="submit"
                    type="default"
                    className="mt-4 w-100 cls-submit"
                  >
                    Apply
                  </Button>
                  { tableDataPreparationHandler &&
                    <Button
                      htmlType="button"
                      type="primary"
                      className="w-100"
                      onClick={validateFilterHandler}
                      loading={loading}
                    >
                      Save filter
                    </Button>
                  }
                </Flex>
              </Form>
            </Card>
          )}
          open={open}
          onOpenChange={handleOpenChange}
          trigger={["click"]}
          placement="bottom"
        >
          <Tooltip title={t("add_filter")}>
            <Button type="primary" className="px-1">
              <FdFilter />
            </Button>
            {/* <Text className="Infi-Fd_11_FilterMenu fs-22"></Text> */}
          </Tooltip>
        </Dropdown>
        {contextHolder}
      </Col>
      {/* Save filter modal */}
      <Modal
        open={openSaveFilterModal}
        title="Save Filter"
        onCancel={toggleSaveFilterModal}
        destroyOnClose
        className="cls-save-fliter-modal"
        footer={false}
        modalRender={(dom) => (
          <Form
            layout="vertical"
            form={SaveFilterForm}
            name="form_in_modal"
            initialValues={{ modifier: "public" }}
            clearOnDestroy
            onFinish={(values) => saveFilterhandler(values, true)}
          >
            {dom}
          </Form>
        )}
      >
        <Form.Item
          name="name"
          label="Filter Name"
          rules={[
            {
              required: true,
              message: "Please input filter name!",
            },
            {
              max: 20,
              message: "Name should not exceed 20 characters!",
            },
          ]}
        >
          <Input type="string" />
        </Form.Item>
        <Flex justify="center">
          <Button
            className="w-20"
            type="primary"
            block
            htmlType="submit"
            size="large"
            loading={loading}
          >
            Save
          </Button>
        </Flex>
      </Modal>
    </Row>
  );
};

/**
 * Generates options for select fields based on provided list and keys.
 *
 * @param {any[]} list - The list of items to generate options from.
 * @param {Array<{ key: string; labelFunc?: (value: string) => string }>}
 *        keys - Array of objects containing:
 *        - key: The property to extract from each item in the list.
 *        - labelFunc: (Optional) Function to format the label of the option (defaults to the value itself).
 *
 * @returns {Record<string, OptionType[]>} - An object where each key corresponds to the options generated for that key.
 *
 * Example:
 * const usersList = [
 *   { group: "admin", status: "active" },
 *   { group: "user", status: "inactive" },
 *   { group: "admin", status: "inactive" },
 * ];
 *
 * const options = generateOptions(usersList, [
 *   { key: "group", labelFunc: (value) => `Group: ${value}` },
 *   { key: "status" }
 * ]);
 *
 * Result:
 * {
 *   group: [
 *     { label: 'Group: admin', value: 'admin' },
 *     { label: 'Group: user', value: 'user' }
 *   ],
 *   status: [
 *     { label: 'active', value: 'active' },
 *     { label: 'inactive', value: 'inactive' }
 *   ]
 * }
 */
const generateOptions = (
  list: any[],
  { key: optionKeys, labelFunc, valueFunc, type }: DynamicOptionsType
): OptionType[] => {
  let keys;
  /* Multiple keys */
  if (type === "split") keys = optionKeys.split("__");
  else if (type === "date") {
    /* Date dropdown */
    const dateFilters = ["Today", "This week", "This month", "This year"];
    return dateFilters.map((f: string) => {
      return { label: f, value: f };
    });
  } else
  /* Basic with single key */
    keys = [optionKeys];

  let options: OptionType[] = [];

  keys.forEach((key: string) => {
    list.forEach((item: any) => {
      const value = valueFunc ? valueFunc(item[key]) : item[key];
      const label = labelFunc ? labelFunc(value) : value;
      if (!options.find((opt) => opt.value === value)) {
        options.push({ label, value });
      }
    });
  });

  return options;
};

export default PersonalizedFilter;
export { generateOptions };
