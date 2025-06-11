import { Form, Select } from 'antd';
import { useState } from 'react';

const { Option } = Select;

const AutoComplete = (props: any) => {
  const [autoCompleteOpen, setAutoCompleteOpen] = useState(false);
  const handleSelectEvent = (value: any) => {
    if (props.onSelect) {
      return props.onSelect(props.name, value, props.index);
    }
  };

  const handleChange = (value: any) => {
    if (props.name === 'settings' && value === undefined) return props.onChange(props.name, value);
  };

  const handleFocus = (event: any) => {
    setAutoCompleteOpen(false);
  };

  const handleSearchEvent = (value: string) => {
    if (props.onSearch) {
      if (value.length > 0) {
        setAutoCompleteOpen(true);
        props.onSearch(value, props.index);
      } else if (value.length === 0) {
        setAutoCompleteOpen(false);
      }
    }
  };

  const inputProps: any = {
    placeholder: props.title,
    onSelect: handleSelectEvent,
    onChange: handleChange,
    value: props.value
  };
  if (props.type === 'dynamic') {
    inputProps['open'] = autoCompleteOpen;
    inputProps['onSearch'] = handleSearchEvent;
    inputProps['onChange'] = handleFocus;
    inputProps['onFocus'] = handleFocus;
  }

  return (
    <Form.Item
      data-testid="AutoComplete"
      name={props.formItemName}
      label={props.formItemLabel}
      rules={[{ required: props.formItemRequired, message: props.formItemMessage }]}
      {...props.formItemField}
      fieldKey={props.formItemFieldKey}
    >
      <Select
        data-testid="autoComplete"
        {...inputProps}
        showSearch
        allowClear
        notFoundContent={'Not Found'}
        optionFilterProp="children"
        filterOption={(input, option) =>
          (option as any)?.children?.toString().toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
      >
        {props.option &&
          props.option.map((lang: any, index: any) => {
            return (
              <Option value={lang.value ? lang.value : lang.id}>
                {lang.label}
              </Option>
            );
          })}
      </Select>
    </Form.Item>
  );
};

export { AutoComplete };
