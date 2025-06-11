import React, { useEffect, useState } from "react";
import {
  Col,
  MenuProps,
  Modal,
  Row,
  Table,
  Typography,
  message
} from "antd";
import type { ColumnsType } from "antd/es/table";
import { useGetRecentActionMutation } from "@/services/reschedule/Reschedule";
import { updateSelectedPNRForAction } from "@/stores/Pnr.store";
import { useDispatch } from "react-redux";
import { useTranslation } from "react-i18next";
import { useAppSelector } from "@/hooks/App.hook";
import './RecentAction.scss';

interface DataType {
  id: number;
  pnr: string;
  actioned: string;
  date: string;
  origin: string;
  destination: string;
  type: string;
  status: string;
}

const { Text, Title } = Typography;

const columns: ColumnsType<DataType> = [
  {
    title: "PNR",
    dataIndex: "pnr",
    key: "pnr",
    render: (text: any) => (
      <>
        <div className="cls-pnr-name-container">
          {/* <Text type="danger" className="f-sbold"> */}
          <Text type="danger">
            30min(s) to left
          </Text>
          <div className="f-bold">{text}</div>
        </div>
      </>
    ),
  },
  // {
  //   title: "JOURNEY",
  //   dataIndex: "origin",
  //   key: "journey",
  // },
  {
    title: "ACTIONED",
    dataIndex: "actioned",
    key: "actioned",
  },

  {
    title: "DATE",
    dataIndex: "date",
    key: "date",
  },
  {
    title: "TYPE",
    dataIndex: "type",
    key: "type",
  },
  // {
  //   title: "",
  //   dataIndex: "View",
  //   key: "View",
  // },
  {
    title: "STATUS",
    dataIndex: "status",
    key: "status",
    render: (text: any) => (
      <>
        <Text type={text === "Changed" ? "success" : "danger"}>{text}</Text>
      </>
    ),
  },
];

const RecentAction: React.FC = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [selectedPNRs, setSelectedPNRs] = useState<React.Key[]>([]);
  const [authRoutesAPI, authRoutesResponse] = useGetRecentActionMutation();
  const [serviceData, setServiceData] = useState<DataType[]>([]);
  const { selectedPNRsForAction } = useAppSelector(
    (state: any) => state.PNRReducer
  );

  // modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);
  // const toggleShow = () => setIsModalOpen((p) => !p);

  const handleOk = () => {
    setConfirmLoading(true);
    setTimeout(() => {
      setIsModalOpen(false);
      setConfirmLoading(false);
      message.success("Completed action successfully");
    }, 2000);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  useEffect(() => {
    authRoutesAPI([]);
  }, [authRoutesAPI]);

  useEffect(() => {
    if (authRoutesResponse.isSuccess && authRoutesResponse?.data) {
      setServiceData((authRoutesResponse.data as any)?.response?.data);
    }
  }, [authRoutesResponse]);

  const onSelectChange = (newSelectedRowKeys: React.Key[]) => {
    setSelectedPNRs(newSelectedRowKeys);
  };

  // eslint-disable-next-line
  const rowSelection = {
    selectedPNRs,
    onChange: onSelectChange,
  };

  // eslint-disable-next-line
  const actionHandler: MenuProps["onClick"] = ({ key }) => {
    if (selectedPNRs.length) {
      dispatch(
        updateSelectedPNRForAction({
          action: key,
          pnr: selectedPNRs,
        })
      );
      setIsModalOpen(true);
    } else {
      message.info("To take action, select the appropriate PNR(s)");
    }

  };

  // eslint-disable-next-line
  const actionItems = [
    {
      key: "send-notification",
      label: "Send Notification",
    },
    {
      key: "push",
      label: "Push it to later",
    },
    {
      key: "remove",
      label: "remove",
    },
    {
      key: "move",
      label: "Move from queue",
    },
  ];

  return (
    <>
      <Row justify="space-between" align="middle" className="cls-table-headerText" data-testid="recentAction">
        <Col className="f-med">
          <Title level={5} className="fs-17 f-reg cls-RA-header">
            {t("recent_action")}
          </Title>
        </Col>

        {/* <Col className="mb-2">
          <Dropdown
            placement="bottom"
            overlay={<Menu onClick={actionHandler} items={actionItems} />}
          >
            <Button type="link" onClick={(e) => e.preventDefault()}>
              Actions &nbsp;
              <Text className="Infi-Fd_06_DownArrow fs-8"></Text>
            </Button>
          </Dropdown>
        </Col> */}
      </Row>
      <Row>
        <Col span={24} className="cls-table">
          <div>
            {serviceData.length && (
              <Table
                // rowSelection={rowSelection}
                columns={columns}
                pagination={false}
                dataSource={serviceData.map((data) => ({
                  ...data,
                  key: data.id,
                }))}
              />
            )}
          </div>
        </Col>
      </Row>
      {isModalOpen && selectedPNRsForAction.pnr.length && (
        <Modal
          title={null}
          open={isModalOpen}
          onOk={handleOk}
          confirmLoading={confirmLoading}
          onCancel={handleCancel}
          okText={"Yes"}
          cancelText={"No"}
        >
          <p>
            Are you sure you want to
            {selectedPNRsForAction.action === "send-notification"
              ? " send notifications to the selected PNR(s)?"
              : selectedPNRsForAction.action === "push"
              ? " push the selected PNR(s) to later?"
              : selectedPNRsForAction.action === "remove"
              ? " remove the selected PNR(s)?"
              : selectedPNRsForAction.action === "move"
              ? " move the selected PNR(s) from queue?"
              : "take action?"}
          </p>
        </Modal>
      )}
    </>
  );
};

export default RecentAction;