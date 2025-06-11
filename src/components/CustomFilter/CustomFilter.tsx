import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  Button,
  Checkbox,
  Col,
  Dropdown,
  Form,
  FormProps,
  Input,
  MenuProps,
  Row,
  Select,
  Space,
  Tooltip,
  Typography,
} from "antd";
import "./CustomFilter.scss";
import { useTranslation } from "react-i18next";

type CustomFilterType = {
  key: string;
  label: string;
  exact?: boolean;
  field: CustomFilterFieldType;
};

type OptionType = { label: string; value: string };

type CustomFilterFieldType = {
  type: "input" | "multiSelect" | "compare";
  inputType?: "string" | "number";
  placeholder?: string;
  operations?: number[];
  options?: OptionType[];
};

export type CustomFiltersType = CustomFilterType[];

type CustomFilterCompType = {
  tableData: any[];
  filters: CustomFiltersType;
  visibleColumns?: any[];
  setTableData: any;
  tableDataPreparationHandler: any;
};

/**
 * CustomFilter Component
 *
 * This component renders a dynamic filter UI with checkboxes for selecting filters
 * and dynamically generates input fields based on the selected filters. It also
 * handles the logic for applying and clearing filters on a dataset.
 *
 * @component
 * @param {CustomFilterCompType} props - The props for the component.
 * @param {any[]} props.tableData - The table data to be filtered.
 * @param {CustomFiltersType} props.filters - List of filter configuration objects.
 * @param {any[]} props.visibleColumns - List of visible columns to show in the dropdown.
 * @param {Function} props.setTableData - Function to update the filtered table data.
 * @param {Function} props.tableDataPreparationHandler - Function to prepare table data before setting.
 *
 * @returns {JSX.Element} The rendered component.
 */
const CustomFilter: React.FC<CustomFilterCompType> = ({
  tableData,
  filters,
  visibleColumns,
  setTableData,
  tableDataPreparationHandler,
}) => {
  // Constants and state variables
  /**
   * Used to split nested keys when the filter is applied to nested properties.
   */
  const KEY_DELIMETER = "__";
  const OPERATIONS = [
    { label: ">", value: ">" },
    { label: "<", value: "<" },
    { label: ">=", value: ">=" },
    { label: "<=", value: "<=" },
    { label: "=", value: "=" },
  ];
  const { t } = useTranslation();
  const { Text } = Typography;
  const [open, setOpen] = useState(false);
  const [selectedItems, setSelectedItems] = useState<CustomFiltersType>([]); // Store selected items
  const [customFilterForm] = Form.useForm();
  const [visibleFilters, setVisibleFilters] = useState<any[]>([]);

  /* Set visible filters in the dropdown from custom column funcitionality */
  useEffect(() => {
    setVisibleFilters(
      filters.filter((f: any) =>
        visibleColumns?.some((column: any) => column.key === f.key)
      )
    );
  }, [filters, visibleColumns]);

  /**
   * Runs when the component mounts to prepare the initial state of the table data.
   */
  useEffect(() => {
    setTableData(tableData.map(tableDataPreparationHandler));
  }, [tableData]);

  /**
   * Handles the checkbox selection and deselection logic for filters.
   * Adds or removes filters from the selectedItems state based on user interaction.
   *
   * @param {CustomFilterType} item - The filter being selected/deselected.
   * @param {boolean} checked - Whether the checkbox is checked or unchecked.
   */
  const onCheckboxChange = useCallback(
    (item: CustomFilterType, checked: boolean) => {
      // Resetting the form item value on checkbox event change
      customFilterForm.setFieldsValue({ [item.key]: "" });
      setSelectedItems((prevSelected: CustomFiltersType) => {
        if (checked) {
          return [...prevSelected, item];
        } else {
          return prevSelected.filter((i) => i.key !== item.key);
        }
      });
    },
    [visibleFilters]
  );

  /**
   * useMemo hook for memoizing the filter menu items.
   *
   * Generates the filter options (checkboxes) that appear in the dropdown.
   * Memoized to avoid unnecessary re-renders when the component updates.
   */
  const items = useMemo<MenuProps["items"]>(
    () =>
      visibleFilters.map((filter: CustomFilterType) => ({
        label: (
          <Checkbox
            checked={selectedItems.some((i) => i.key === filter.key)}
            onChange={(e) => onCheckboxChange(filter, e.target.checked)}
          >
            {filter.label}
          </Checkbox>
        ),
        key: filter.key,
      })),
    [visibleFilters, selectedItems, onCheckboxChange]
  );

  /**
   * Toggles the dropdown's open state when a user interacts with it.
   *
   * @param {boolean} flag - Represents whether the dropdown should be opened or closed.
   */
  const handleOpenChange = (flag: boolean) => {
    if (flag !== open) setOpen(flag);
  };

  /**
   * Function that applies the selected filters to the table data.
   * Loops through form values, filters the tableData based on selected filter criteria.
   * Can handle both exact match or partial match (based on the `exact` flag).
   *
   * @param {Object} values - The form values containing the user input for each filter.
   */
  const applyFilter: FormProps<any>["onFinish"] = useCallback(
    (values: Record<string, any>) => {
      let filteredItems = [...tableData];

      for (let [key, value] of Object.entries(values)) {
        // Fix to resolve defualt empty selected value in multi select
        if (key.includes("ms:")) key = key.split(":")[1];

        if (!value || value == "" || (Array.isArray(value) && !value.length))
          continue;

        const filter = visibleFilters.find((f: any) => f.key === key);

        // Comparison operation functionality
        if (
          filter?.field.type === "compare" &&
          value &&
          Object.keys(value).length
        ) {
          // Extract the operation and the value for comparison
          const { operation, value: compareValue } = value as {
            operation: string;
            value: string;
          };

          if (!operation || !compareValue) continue;

          filteredItems = filteredItems.filter((item: any) => {
            const itemValue = Number(item[key]);

            // Perform the comparison based on the operation
            switch (operation) {
              case ">":
                return itemValue > Number(compareValue);
              case "<":
                return itemValue < Number(compareValue);
              case ">=":
                return itemValue >= Number(compareValue);
              case "<=":
                return itemValue <= Number(compareValue);
              case "=":
                return itemValue === Number(compareValue);
              default:
                return true; // If no operation is provided, don't filter
            }
          });
        } else {
          const searchValue = Array.isArray(value)
            ? value.map((v: string) => v?.trim()?.toLowerCase())
            : [(value as string)?.trim()?.toLowerCase()]; // Convert to array for uniform handling

          const splitKeys = key.split(KEY_DELIMETER);

          // key1__key2 functionality
          if (splitKeys.length > 1) {
            filteredItems = filteredItems.filter((item: any) => {
              return splitKeys.some((splitKey) => {
                return searchValue.some((sv) => {
                  const itemValue = item[splitKey]?.trim()?.toLowerCase();
                  return filter?.exact
                    ? itemValue === sv
                    : itemValue?.includes(sv);
                });
              });
            });
          } else {
            // basic search case
            filteredItems = filteredItems?.filter((item: any) => {
              return searchValue?.some((sv) => {
                const itemValue = item[key]?.trim()?.toLowerCase();
                return filter?.exact
                  ? itemValue === sv
                  : itemValue?.includes(sv);
              });
            });
          }
        }
      }

      setTableData(filteredItems.map(tableDataPreparationHandler));
    },
    [tableData, tableDataPreparationHandler, setTableData, visibleFilters]
  );

  /**
   * Clears all applied filters, resets the form, and restores the original table data.
   * Also resets selectedItems if the clear action is triggered.
   *
   * @param {Object} value - Information about which filter action triggered the clear.
   */
  const clearFilter = useCallback(
    (value: any) => {
      customFilterForm.resetFields();
      if (value.key == "option") setSelectedItems([]);
      setTableData(tableData.map(tableDataPreparationHandler));
    },
    [tableData, tableDataPreparationHandler]
  );

  /**
   * Defines the options for clearing filters (e.g., clear filter option, clear filter data).
   */
  const clearFilterItems: MenuProps["items"] = [
    {
      key: "option",
      label: t("clear_option"),
      onClick: clearFilter,
    },
    {
      key: "data",
      label: t("clear_data"),
      onClick: clearFilter,
    },
  ];

  /**
   * Renders the appropriate form field (e.g., input, multiSelect) based on the filter's configuration.
   * Supports different input types such as text input or multi-select dropdowns.
   *
   * @param {CustomFilterType} filter - The filter's configuration.
   *
   * @returns {JSX.Element} The appropriate input component.
   */
  const getDynamicFilterField = (filter: CustomFilterType) => {
    if (filter.field.type === "input")
      return (
        <Form.Item name={filter.key} key={filter.key} className="mb-0">
          <Input
            placeholder={filter?.field?.placeholder}
            type={filter?.field?.inputType}
            style={{ width: 160 }}
            allowClear
          />
        </Form.Item>
      );

    if (filter.field.type === "multiSelect") {
      return (
        <Form.Item name={`ms:${filter.key}`} key={filter.key} className="mb-0">
          <Select
            mode="multiple"
            allowClear
            placeholder={filter.field.placeholder}
            style={{ width: 240 }}
            listHeight={200}
            maxTagCount="responsive"
            options={filter?.field?.options}
          />
        </Form.Item>
      );
    }

    if (filter.field.type === "compare" && filter.field?.operations) {
      const options = filter.field?.operations.map(
        (o: number) => OPERATIONS[o]
      );
      return (
        <Space.Compact>
          <Form.Item
            name={[filter.key as string, "operation"]}
            className="mb-0"
          >
            <Select
              options={options ? options : []}
              listHeight={200}
              // defaultValue={{label : ">", value : ">"}}
              style={{ width: 60 }}
            />
          </Form.Item>
          <Form.Item name={[filter.key as string, "value"]} className="mb-0">
            <Input
              type="number"
              placeholder={filter?.field?.placeholder}
              style={{ width: 80 }}
            />
          </Form.Item>
        </Space.Compact>
      );
    }
  };

  /* Update selected items if the column is disabled from custom column functionality */
  useEffect(() => {
    visibleFilters?.length &&
      setSelectedItems((prevSelected: CustomFiltersType) =>
        prevSelected.filter((selected: CustomFilterType) =>
          visibleFilters.some(
            (filter: CustomFilterType) => selected.key === filter.key
          )
        )
      );
  }, [visibleFilters]);

  /* Applying filter on custom column change */
  const mounted = useRef(false);
  useEffect(() => {
    /* useRef logic is to skip the initial render (i.e., when the component mounts) 
    and only run on subsequent updates. */
    if (mounted.current) applyFilter(customFilterForm.getFieldsValue());
    else mounted.current = true;
  }, [selectedItems]);

  return (
    /**
     * Form Component
     *
     * Wraps the dynamic filter input fields and manages form submission for applying filters.
     * Displays the dynamically generated filter inputs based on selected checkboxes.
     * Also contains buttons to apply or clear filters.
     */

    <Form
      form={customFilterForm}
      name="createPolicy"
      layout="horizontal"
      onFinish={applyFilter}
      requiredMark={false}
    >
      <Row align="top" className="cls-custom-filter">
        <Col span={1}>
          <Dropdown
            className="mr-3"
            menu={{ items }}
            open={open}
            onOpenChange={handleOpenChange} // Handle outside clicks to close the dropdown
            trigger={["click"]}
            placement="bottomLeft"
          >
            <Tooltip title={t("add_filter")}>
              <Button type="primary" className="px-1">
                <Text className="Infi-Fd_11_FilterMenu fs-22 "></Text>
              </Button>
            </Tooltip>
          </Dropdown>
        </Col>
        <Col span={23}>
          <Row gutter={10}>
            <Col span={19}>
              <Space
                className="cls-filter-scroll-container show-scrollbar"
                wrap
              >
                {/* Dynamically render input fields based on selected checkboxes */}
                {selectedItems.map((item: CustomFilterType) =>
                  getDynamicFilterField(item)
                )}
              </Space>
            </Col>
            <Col span={5} style={{}}>
              {!!selectedItems.length && (
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    className="px-2 py-1"
                  >
                    {t("apply_filter")}
                  </Button>
                  <Dropdown
                    menu={{ items: clearFilterItems }}
                    placement="top"
                    arrow
                  >
                    <Button type="default" className="px-2 py-1">
                      {t("clear_filter")}
                    </Button>
                  </Dropdown>
                </Space>
              )}
            </Col>
          </Row>
        </Col>
      </Row>
    </Form>
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
  keys: { key: string; labelFunc?: (value: string) => string }[]
) => {
  return keys.reduce(
    (acc: Record<string, OptionType[]>, { key, labelFunc }) => {
      acc[key] = list.reduce((options: OptionType[], item: any) => {
        const value = item[key];
        const label = labelFunc ? labelFunc(value) : value;

        if (!options.find((opt) => opt.value === value)) {
          options.push({ label, value });
        }

        return options;
      }, []);
      return acc;
    },
    {}
  );
};

export default CustomFilter;
export { generateOptions };
