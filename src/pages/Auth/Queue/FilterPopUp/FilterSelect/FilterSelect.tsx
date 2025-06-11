import { Form, Select } from "antd";

const FilterSelect = (props: {
  name: string;
  fieldKey: string;
  placeholder: string;
  optionList: any[] | undefined;
  label?: string;
  rules?: any;
}) => {
  const { Option } = Select;
  return (
    <Form.Item
      name={props.name}
      fieldKey={props.fieldKey}
      label={props.label}
      rules={props.rules}
      data-testid="filterSearch"
    >
      <Select
        placeholder={props.placeholder}
        data-testid="selectBox"
        // style={{ minWidth: 120 }}
        showSearch
        allowClear
        notFoundContent={"Not Found"}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option as any)?.children
            ?.toString()
            .toLowerCase()
            .indexOf(input.toLowerCase()) >= 0
        }
      >
        {props.optionList &&
          props.optionList.map((option) => (
            <Option key={option.label} value={option.value}>
              {option.label}
            </Option>
          ))}
      </Select>
    </Form.Item>
  );
};
export default FilterSelect;
