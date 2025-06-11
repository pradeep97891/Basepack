import { Col, Row, Form, Input, Typography } from "antd";
import { useQueueSettings } from "@/hooks/Queue.hook";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { AutoComplete } from "@/components/AutoComplete/AutoComplete";
const { Text } = Typography;

const QueueConditionForm = (props: any) => {
  const { t } = useTranslation();
  const { useRegularActionSelection } = useQueueSettings();
  const { regularActionInfo } = useRegularActionSelection();
  const index = props.index;
  const name = props.name;
  const fieldKey = props.fieldKey;
  const field = props.field;

  const actionData = [
    {
      label: "Queue moved",
      value: 1,
    },
    {
      label: "Queue removed",
      value: 2,
    },
  ];

  useEffect(() => {
    autoCompleteSelect("", 2);
    // eslint-disable-next-line
  }, [regularActionInfo]);

  const autoCompleteSelect = (option: string, value: number) => {
    for (let i: number = 0; i < regularActionInfo?.serviceData.length; i++) {
      let data: any = regularActionInfo?.serviceData[i];
      if (data.rule === value && data?.rule_actions[0]?.fields) {
        // const temp = data?.rule_actions[0]?.fields?.map((action: any) => {
        //   return {
        //     label: action.label,
        //     id: action.field,
        //   };
        // });
        // setAction(temp);
        break;
      }
    }
  };

  // To change the PCC value to uppercase on input
  const handlePCCInput = (event: React.FormEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).value = (
      event.target as HTMLInputElement
    ).value.toUpperCase();
  };

  return (
    <Row data-testid="queueConditionForm" className="cls-queue-condition-form-row">

      <Col className="cls-queue-settings-form-col" xs={24} sm={11} md={12} lg={8} xl={6}>
        <AutoComplete
          formItemName={[name, "pnr_rule"]}
          formItemLabel={index === 0 ? `${t("pnr_rule")}` : ""}
          formItemRequired={true}
          formItemMessage="Missing Action Name"
          formItemField={field}
          formItemFieldKey={[fieldKey, "pnr_rule"]}
          onSelect={autoCompleteSelect}
          title="Select PNR rule"
          option={regularActionInfo?.optionData}
        />
      </Col>

      <Col className="cls-queue-settings-form-col" xs={24} sm={11} md={12} lg={8} xl={6}>
        <AutoComplete
          formItemName={[name, `action`]}
          formItemLabel={index === 0 ? `${t("action")}` : ""}
          formItemRequired={true}
          formItemMessage="Missing action"
          formItemField={field}
          formItemFieldKey={[fieldKey, "action"]}
          title="Select action"
          option={actionData}
        />
      </Col>
      <Form.Item name={'queue_rule_action'} {...field} style={{display:'none'}}>
        <Input />
      </Form.Item>
      {/* <Form.Item name={'rule_action_id'} {...field} style={{display:'none'}}>
        <Input />
      </Form.Item> */}

      <Col className="cls-queue-settings-form-col" xs={24} sm={11} md={12} lg={8} xl={4}>
        <Form.Item
          {...field}
          label={index === 0 ? `${t("queue_no")}.` : ""}
          name={[name, `queue_no`]}
          fieldKey={[fieldKey, `queue_no`]}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Missing Queue number",
            },
          ]}
        >
          <Input maxLength={3} placeholder={`${t("queue_no")}.`} />
        </Form.Item>
      </Col>
      <Col className="cls-queue-settings-form-col" xs={19} sm={7} md={7} lg={8} xl={4}>
        <Form.Item
          {...field}
          label={index === 0 ? `${t("pcc")}` : ""}
          name={[name, `pcc`]}
          fieldKey={[fieldKey, `pcc`]}
          rules={[
            {
              required: true,
              whitespace: true,
              message: "Missing PCC",
            },
          ]}
        >
          <Input
            maxLength={3}
            placeholder={t("pcc")}
            onInput={handlePCCInput}
          />
        </Form.Item>
      </Col>
      <Col className="cls-queue-settings-form-col close-form-icon" xs={4} sm={4} md={4} lg={8} xl={4}>
        <div onClick={() => props.remove(name)}>
          <Text className="Infi-Fd_31_ThinCloseIcon cls-closeIcon"></Text>
        </div>
      </Col>
    </Row>
  );
};

export default QueueConditionForm;
