import styles from "./FilterPopUp.module.scss";
import styled from "styled-components";
import { Col, Row, Form, Input, DatePicker, Button, AutoComplete } from "antd";
import { useForm } from "antd/lib/form/Form";
// import { useQueueSettings } from "../../hooks/Queue.hook";
import { useEffect } from "react";
import FilterSelect from "./FilterSelect/FilterSelect";
import moment from "moment";

interface FilterPopUpProps {
  onFormSubmit: (values: any) => void;
  className: string;
  show: boolean;
}

const Div = styled.div<{
  show: string;
}>`
  display: ${(props) => props.show};

  .ant-picker {
    border-radius: 5px;
    width: 100%;
  }
  .buttonCol {
    text-align: right;
    Button {
      color: var(--check-box-color);
      background: var(--background);
      border: 1px solid var(--check-box-color);
      border-radius: 10px;
    }
  }
`;

const filterList = [
  {
    filter_name: "queue_number",
    fieldKey: "queue_no",
    placeholder: "Queue number",
    type: "autocomplete",
  },
  {
    filter_name: "purpose",
    fieldKey: "queue_purpose",
    placeholder: "Queue purpose",
    type: "select",
  },
  {
    filter_name: "status",
    fieldKey: "queue_purpose",
    placeholder: "Status",
    type: "select",
  },
  {
    filter_name: "start_date",
    fieldKey: "date_range",
    placeholder: "Start date",
    type: "datepicker",
  },
  {
    filter_name: "end_date",
    fieldKey: "date_range",
    placeholder: "End  date",
    type: "datepicker",
  },
];

const autoCompleteList: any = [];
const FilterInput = (props: {
  name: string;
  fieldKey: string;
  placeholder: string;
}) => {
  return (
    <Form.Item name={props.name} fieldKey={props.fieldKey}>
      <Input placeholder={props.placeholder} />
    </Form.Item>
  );
};
const FilterDatePicker = (props: {
  name: string;
  fieldKey: string;
  placeholder: string;
}) => {
  return (
    <Form.Item name={props.name} fieldKey={props.fieldKey}>
      <DatePicker inputReadOnly={true} placeholder={props.placeholder} format={"MMM DD, YYYY"}/>
    </Form.Item>
  );
};
const FilterAutoComplete = (props: {
  name: string;
  fieldKey: string;
  placeholder: string;
}) => {
  return (
    <Form.Item name={props.name} fieldKey={props.fieldKey}>
      <AutoComplete
        options={autoCompleteList}
        placeholder={props.placeholder}
      />
    </Form.Item>
  );
};

const FilterPopUp = (props: FilterPopUpProps) => {
  let QueueMasterInfo: any = {
    status: [
      {
        value: 1,
        label: "Active",
      },
      {
        value: 2,
        label: "In-active",
      },
      {
        value: 3,
        label: "Delete",
      },
      {
        value: 4,
        label: "Mail sent",
      },
      {
        value: 5,
        label: "Mail not sent",
      },
      {
        value: 6,
        label: "New",
      },
      {
        value: 7,
        label: "Accepted",
      },
      {
        value: 8,
        label: "Rejected",
      },
      {
        value: 9,
        label: "Modified",
      },
      {
        value: 10,
        label: "Synced",
      },
      {
        value: 11,
        label: "No change",
      },
      {
        value: 12,
        label: "No itinerary",
      },
      {
        value: 13,
        label: "PNR error",
      },
      {
        value: 14,
        label: "Schedule Changed",
      },
      {
        value: 15,
        label: "Cancelled",
      },
      {
        value: 16,
        label: "Confirmed",
      },
      {
        value: 17,
        label: "Processing",
      },
      {
        value: 18,
        label: "Segment confirmation failed",
      },
      {
        value: 19,
        label: "Divide failed",
      },
      {
        value: 20,
        label: "Completed",
      },
    ],
    airline: [],
    cron: [],
    purpose: [
      {
        value: 1,
        label: "Reschedule",
      },
      {
        value: 2,
        label: "Ticketing",
      },
      {
        value: 3,
        label: "Cancellation",
      },
    ],
  };

  const [form] = useForm();
  const classes = props.className;
  const show = props.show;

  const onFilterSubmit = (values: any) => {
    let formFieldsData = JSON.parse(JSON.stringify(values));
    formFieldsData["start_date"] = values.start_date?._d
      ? moment(values.start_date?._d).format("YYYY-MM-DD")
      : undefined;
    formFieldsData["end_date"] = values.end_date?._d
      ? moment(values.end_date?._d).format("YYYY-MM-DD")
      : undefined;
    props.onFormSubmit(formFieldsData);
  };

  const onClearFilter = () => {
    form.resetFields();
    props.onFormSubmit({});
  };

  useEffect(() => {
    const formFields: any = {};
    filterList.forEach((value: any) => {
      formFields[value.fieldKey] = "" as string | number | null;
    });
    form.setFieldsValue(formFields);
  }, [form]);

  return (
    <Div
      data-testid="filterPopUp"
      show={show ? "block" : "none"}
      className={`${styles.filterBox} ${classes}`}
    >
      <Form
        form={form}
        onFinish={onFilterSubmit}
        layout="vertical"
        size="large"
      >
        <Row style={{background:"#fff"}}>
          <Col className={styles.ClearFilter} span={24}>
            <Button type="link" onClick={onClearFilter} className="fs-12">
              Clear filter
            </Button>
          </Col>
          {filterList.map((item, index) => {
            return (
              <Col className={styles.filterCol} key={index} span={12}>
                {item.type === "input" && (
                  <FilterInput
                    name={item.filter_name}
                    fieldKey={item.fieldKey}
                    placeholder={item.placeholder}
                  />
                )}
                {item.type === "select" && (
                  <FilterSelect
                    name={item.filter_name}
                    fieldKey={item.fieldKey}
                    placeholder={item.placeholder}
                    optionList={QueueMasterInfo[item.filter_name]}
                  />
                )}
                {item.type === "datepicker" && (
                  <FilterDatePicker
                    name={item.filter_name}
                    fieldKey={item.fieldKey}
                    placeholder={item.placeholder}
                  />
                )}
                {item.type === "autocomplete" && (
                  <FilterAutoComplete
                    name={item.filter_name}
                    fieldKey={item.fieldKey}
                    placeholder={item.placeholder}
                  />
                )}
              </Col>
            );
          })}

          <Col className={`${styles.filterCol} buttonCol`} span={24}>
            <Button htmlType="submit" type="default">
              Apply
            </Button>
          </Col>
        </Row>
      </Form>
    </Div>
  );
};

export default FilterPopUp;
