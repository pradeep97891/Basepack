import {
  Col,
  Row,
  Form,
  Input,
  Switch,
  Button,
  notification,
  Typography,
  Divider,
} from "antd";
import QueueConditionForm from "./QueueConditionForm/QueueConditionForm";
import { PlusOutlined } from "@ant-design/icons";
import "./QueueSettingsForm.scss";
import { useForm } from "antd/lib/form/Form";
import { useEffect } from "react";
import {
  useLazyAddqueueQuery,
  useLazyPutEditQueueQuery,
} from "@/services/queue/Queue";
import { QueueDataInterface } from "@/services/queue/QueueTypes";
import { useAppSelector } from "@/hooks/App.hook";
import { useQueueSettings } from "@/hooks/Queue.hook";
import { AutoComplete } from "@/components/AutoComplete/AutoComplete";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { updateActiveQueueId } from "@/stores/Queue.store";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

const QueueSettingsForm = (props: any) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const {redirect} = useRedirect();
  const [updateQueueService] = useLazyPutEditQueueQuery();
  const [addQueueService] = useLazyAddqueueQuery();
  const { Title } = Typography;
  const { useQueueMasterData } = useQueueSettings();
  const { QueueMasterInfo } = useQueueMasterData();
  const queueInfo = props.queueInfo;
  const [editQueueId] = useSessionStorage<any>("editQueueId");
  const { QueueList } = useAppSelector((state: any) => state.QueueReducer);

  const purposeQueueData = [
    {
      label: "Reschedule",
      value: "Reschedule",
    },
    {
      label: "Cancellation",
      value: "Cancellation",
    },
    {
      label: "Paymemt expiry",
      value: "Paymemt expiry",
    },
    {
      label: "Name update expiry",
      value: "Name update expiry",
    },
    {
      label: "Ticketing",
      value: "Ticketing",
    },
  ];
  const cronData = [
    {
      label: "Every minutes",
      value: "Every minutes",
    },
    {
      label: "Every hours",
      value: "Every hours",
    },
  ];
  const mode = props.queueInfo ? "edit" : "create";
  const [form] = useForm();

  useEffect(() => {
    if (queueInfo) {
      if (queueInfo && queueInfo?.queue_conditions && form) {
        form.setFieldsValue({
          queue_number: queueInfo?.queue_number as string,
          purpose: queueInfo?.purpose_name as string | undefined,
          cron_frequency: queueInfo?.cron_frequency as string,
          pcc: queueInfo?.pcc as string,
          status: queueInfo?.status_name == 'Active',
          queue_conditions: queueInfo?.queue_conditions
            .filter((value: any) => value.status !== 3)
            .map((value: any) => {
              return {
                queue_rule_action: value.queue_rule_action,
                pnr_rule: value?.rule as string | undefined,
                action: value?.rule_action == "MOVE" ? 1 : 2,
                queue_no: value?.queue_number as string,
                pcc: value?.pcc as string,
              };
            }) as [],
        });
      }
    } else {
      form.setFieldsValue({
        queue_number: undefined,
        purpose: undefined,
        cron_frequency: undefined,
        pcc: undefined,
        status: undefined,
        queue_conditions: [],
      });
    }
    // eslint-disable-next-line
  }, [queueInfo]);

  function getValueFromLabel(label: string) {
    for (const cron of QueueMasterInfo["cron"]) {
      if (cron.label === label) {
        return cron.value;
      }
    }
    return null; // Return null if label is not found
  }

  const formSubmit = async (values: any) => {
    if (typeof values?.purpose === "string") {
      if (QueueMasterInfo && QueueMasterInfo["purpose"]) {
        for (let i = 0; i < QueueMasterInfo["purpose"].length; i++) {
          if (QueueMasterInfo["purpose"][i].label === values.purpose) {
            values.purpose = QueueMasterInfo["purpose"][i].value;
          }
        }
      }
    }
    if (values) {
      const queue: QueueDataInterface = {
        airline: values.airline ? values.airline : 1,
        queue_number: values.queue_number,
        pcc: values.pcc,
        cron_frequency:
          values.cron_frequency === "string"
            ? getValueFromLabel(values.cron_frequency)
            : values.cron_frequency === Number
              ? values.cron_frequency
              : 1,

        purpose: values.purpose,
        status: values.status,
        queue_conditions: values.queue_conditions?.map((item: any) => {
          return {
            rule: item.pnr_rule,
            rule_action: item.action,
            queue_number: item.queue_no,
            pcc: item.pcc,
            queue_rule_action: item.queue_rule_action,
            // pcc: item.pcc,
            // status: item.pnr_rule,
            // queue_number: item.queue_no,
            // rule_action: item.action,
          };
        }),
      };

      let response;
      if (mode === "edit") {
        response = await updateQueueService({
          queue: queue,
          queue_id: editQueueId.toString(),
        })
          .unwrap()
          .catch((err: any) => err.data);
      } else if (mode === "create") {
        response = await addQueueService({
          queue: queue,
          queue_id: QueueList[QueueList.length - 1].queue_id + 1,
        })
          .unwrap()
          .catch((err: any) => err.data);
      }
      if (response.responseCode === 0) {
        dispatch(updateActiveQueueId({ id: response.response.data.queue_id }));
        notification.success({
          message: `Queue ${mode === "create" ? "created" : "updated"} successfully`,
        });
        redirect("queueList");
      } else {
        if (response.responseCode === 1 && response.response.errors) {
          Object.entries(response.response.errors.mailer).forEach(
            ([key, value]) => {
              if (
                [
                  "queue_number",
                  "purpose",
                  "cron_frequency",
                  "folder_name",
                  "status",
                ].includes(key)
              ) {
                value =
                  value instanceof Array
                    ? value
                    : Object.values(value as any)[0];
                form.setFields([{ name: key, errors: value } as any]);
              } else {
              }
            }
          );
        }
      }
    }
  };

  const JobStatusOnChange = (checked: boolean) => {
    form.setFieldsValue({ status: checked });
  };

  const onReset = () => {
    form.resetFields();
  };

  const handlePCCInput = (event: React.FormEvent<HTMLInputElement>) => {
    (event.target as HTMLInputElement).value = (
      event.target as HTMLInputElement
    ).value.toUpperCase();
  };

  return (
    <Form
      data-testid="queueSettingsForm"
      form={form}
      onFinish={formSubmit}
      onReset={onReset}
      className="QueueSettingsForm"
      layout="vertical"
      size="large"
    >
      <Row>
        <Col className="cls-queue-settings-form-col" xs={24} sm={12} md={12} lg={8} xl={6}>
          <Form.Item
            label={t("queue_number")}
            name="queue_number"
            key="queue_number"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Missing queue number",
              },
            ]}
          >
            <Input maxLength={3} type="number" placeholder="Queue number" />
          </Form.Item>
          <p className="queue-form-input-info">{t("queue_number_subtitle")}</p>
        </Col>
        <Col className="cls-queue-settings-form-col" xs={24} sm={12} md={12} lg={8} xl={5}>
          <AutoComplete
            formItemName="purpose"
            formItemLabel={t("purpose_of_queue")}
            formItemFieldKey="purpose"
            formItemRequired={true}
            formItemMessage="Missing purpose of queue"
            title="Select Purpose"
            option={
              QueueMasterInfo &&
              QueueMasterInfo["purpose"] &&
              QueueMasterInfo["purpose"].length > 0
                ? QueueMasterInfo["purpose"]
                : purposeQueueData
            }
          />
          <p className="queue-form-input-info">
            {t("purpose_of_queue_subtitle")}
          </p>
        </Col>
        <Col className="cls-queue-settings-form-col" xs={24} sm={12} md={12} lg={8} xl={6}>
          <AutoComplete
            formItemName="cron_frequency"
            formItemLabel={t("cron_time")}
            formItemFieldKey="cron_frequency"
            formItemRequired={true}
            formItemMessage="Missing cron time"
            title="Select cron time"
            option={
              QueueMasterInfo &&
              QueueMasterInfo["cron"] &&
              QueueMasterInfo["cron"].length > 0
                ? QueueMasterInfo["cron"]
                : cronData
            }
          />
          <p className="queue-form-input-info">{t("cron_time_subtitle")} </p>
        </Col>
        <Col className="cls-queue-settings-form-col" xs={14} sm={7} md={8} lg={8} xl={4}>
          <Form.Item
            label={t("pcc")}
            name="pcc"
            key="pcc"
            rules={[
              {
                required: true,
                whitespace: true,
                message: "Missing PCC",
              },
            ]}
          >
            <Input maxLength={3} placeholder="PCC" onInput={handlePCCInput} />
          </Form.Item>
          <p className="queue-form-input-info">{t("pcc_subtitle")}</p>
        </Col>
        <Col className="cls-queue-settings-form-col cls-status-btn"  xs={10} sm={5} md={4} lg={8} xl={2}>
          <Form.Item
            valuePropName="checked"
            label={t("job_status")}
            name="status"
            key={"status"}
          >
            <Switch defaultChecked onChange={JobStatusOnChange} />
          </Form.Item>
        </Col>
      </Row>
      <Divider className="my-4" />
      <Row className="my-3">
        <Col xs={24} sm={24} md={24} lg={24} xl={24} className="cls-queue-con">
          <Title level={2} className="f-bold">
            {t("queue_conditions")}
          </Title>
          <Title level={4} className="f-sbold">
            {t("queue_conditions_subtitle")}
          </Title>
        </Col>
      </Row>
      <Form.List key="queue_conditions" name="queue_conditions">
        {(field, { add, remove }: { add: any; remove: any }) => {
          return (
            <>
              {field.map(
                ({ key, name, fieldKey, ...field }: any, index: number) => {
                  return (
                    <QueueConditionForm
                      field={field}
                      name={name}
                      fieldKey={fieldKey}
                      key={key}
                      index={index}
                      remove={remove}
                    />
                  );
                }
              )}
              <Button
                key="add-btn"
                className="add-queue__btn"
                onClick={add}
                size="small"
                type="link"
                icon={<PlusOutlined />}
              >
                {t("add_queue_conditions")}
              </Button>
            </>
          );
        }}
      </Form.List>
      <Row className="mt-5" justify="center">
        <Col span={5}>
          <Button htmlType="submit" className="cls-primary-btn" type="primary">
            {mode === "edit" ? t("update") : t("create")}
          </Button>
        </Col>
      </Row>
    </Form>
  );
};

export default QueueSettingsForm;
