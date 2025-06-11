import { FC, useEffect, useState } from "react";
import "./ConfirmModalPopup.scss";
import { Modal, Typography, Row, Col, Button, Form } from "antd";
import TextArea from "antd/lib/input/TextArea";
import {
  CalendarIcon,
  FdQuestionMark,
  FdDeleteConfirmIcon,
  FdResetConfirmIcon,
} from "../Icons/Icons";
import { useTranslation } from "react-i18next";
import { useResize } from "@/Utils/resize";
const Text = Typography;

export type ModalType = "confirm" | "delete" | "reset" | "default";
export interface ConfirmModalPopupProps {
  props: {
    modalName: string;
    page: string;
    header?: string | null;
    description?: string;
    position?: string;
    placement?: string;
    modalToggle?: boolean;
    list?: any;
    modalClass?: string;
    modalWidth?: number;
    primaryBtn?: { text: string; value: boolean };
    secondaryBtn: { text: string; value: boolean | string };
    type?: string | ModalType;
    loading?: boolean | (() => Promise<boolean>);
  };
  onData?: (data: any) => void;
}

const ConfirmModalPopup: FC<ConfirmModalPopupProps> = ({ onData, props }) => {
  const { t } = useTranslation();
  const { isSmallScreen } = useResize(991);
  const [confirmBtn, setConfirmBtn] = useState(false);
  const [confirmLoading, setConfirmLoading] = useState(false);

  const sendDataToParent = (condition: any) => {
    if (onData) onData(condition);
  };

  useEffect(() => {
    props.modalName === "cancelOffer" || props.modalName === "cancel"
      ? setConfirmBtn(true)
      : setConfirmBtn(false); // eslint-disable-next-line
  }, []);

  const enableConfirmBtn = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    (e.target as any).value.length >= 40
      ? setConfirmBtn(false)
      : setConfirmBtn(true);
  };

  const handleOk = () => {
    if (props.loading) {
      setConfirmLoading(true);
      setTimeout(() => {
        setConfirmLoading(false);
        sendDataToParent(props.secondaryBtn.value);
      }, 2000);
    } else sendDataToParent(props.secondaryBtn.value);
  };

  return (
    <>
      <div className="ConfirmModalPopup" data-testid="ConfirmModalPopup">
        <Modal
          width={props.modalWidth}
          open={props.modalToggle}
          onCancel={() => {
            if (props?.primaryBtn?.text) {
              return sendDataToParent(props.primaryBtn.value);
            } else {
              return false;
            }
          }}
          closeIcon={
            // props?.primaryBtn?.text ? (
            //   <Text className="Infi-Fd_09_CloseIcon cls-close-modal-icon"></Text>
            // ) : (
              false
            // )
          }
          footer={false}
          className={`${props.modalClass} cls-confirm-popup`}
        // confirmLoading={confirmLoading}
        >
          <Row className="cls-modal cls-modalclose" justify="center">
            <Col className="mb-4 cls-icon">
              {props.modalName === "confirm" ? (
                <FdQuestionMark />
              ) : props.modalName === "delete" ? (
                <FdDeleteConfirmIcon />
              ) : props.modalName === "reset" ? (
                <FdResetConfirmIcon />
              ) : props.modalName === "cancel" ? (
                <CalendarIcon />
              ) : (
                <></>
              )}
            </Col>
          </Row>
          {props?.header && (
            <Row className="cls-modal mb-1" justify="center">
              <Col className="cls-modal-header">
                <Typography.Title className="cls-popup-header" level={3}>
                  {props.header}
                </Typography.Title>
              </Col>
            </Row>
          )}
          {props?.list ?
            <Row className="cls-modal mb-1" justify="center">
              <Col xs={24} xl={24}>
                {props?.list?.map((list: any) => (
                  <Text className="f-reg fs-16 text-center cls-grey pb-3">{list}</Text>
                ))}
              </Col>
            </Row> : <></>
          }
          <Row className="cls-modal" justify="center">
            {props.description &&
              <Col xs={24} xl={22} className="fs-18 mb-4 cls-modal-body text-center">
                <p> {props.description} </p>
              </Col>
            }
            {props.modalName === "cancel" ||
              props.modalName === "declineOffer" ? (
              <Form className="w-100">
                <Form.Item
                  name="description"
                // validateTrigger={["onBlur", "onChange"]}
                // rules={[
                //   {
                //     validator: (_, value) =>
                //       (
                //         (value && value.length >= 40) || value.length === 0)
                //         ? Promise.resolve()
                //         : Promise.reject(new Error(t("text_area_description"))
                //       )
                //   },
                // ]}
                >
                  <TextArea
                    rows={4}
                    className="mb-2"
                    placeholder={t("text_area_description")}
                    onKeyUp={enableConfirmBtn}
                  />
                </Form.Item>
              </Form>
            ) : (
              <></>
            )}
            {props?.primaryBtn?.text && (
              <Col xs={11} xl={8} className="mt-4 cls-btn">
                <Button
                  className="cls-modal-btn cls-secondary-btn f-med"
                  block
                  size="large"
                  onClick={() => sendDataToParent(props?.primaryBtn?.value)}
                >
                  {props.primaryBtn.text}
                </Button>
              </Col>
            )}
            <Col xs={11} xl={8} className="mt-4 cls-btn" offset={1}>
              <Button
                type="primary"
                block
                className={`cls-modal-btn f-med ${(props.modalName === "declineOffer" || props.modalName === "cancel") && confirmBtn ? "cls-disabled no-events" : ""} ${isSmallScreen ? "cls-primary-btn-inverted" : ""}`}
                size="large"
                onClick={handleOk}
                loading={confirmLoading}
              >
                {props.secondaryBtn.text}
              </Button>
            </Col>
          </Row>
        </Modal>
      </div>
    </>
  );
};

export default ConfirmModalPopup;
