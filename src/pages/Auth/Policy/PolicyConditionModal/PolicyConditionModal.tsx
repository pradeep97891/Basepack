import { Button, Col, Flex, Modal, Radio, Row, Typography } from "antd";
import { useAppDispatch, useAppSelector } from "@/hooks/App.hook";
import { updateOpenConditionModal } from "@/stores/Policy.store";
import { useTranslation } from "react-i18next";
import "./PolicyConditionModal.scss";
import { useRedirect } from "@/hooks/Redirect.hook";
const { Text } = Typography;

/**
 * PolicyConditionModal component displays a modal for setting policy conditions.
 * It allows users to choose between "assistive" and "expert" modes and provides information about policy conditions.
 */
const PolicyConditionModal: React.FC = () => {
  const { t } = useTranslation();
  const {redirect} = useRedirect();
  const dispatch = useAppDispatch();
  const { openConditionModal } = useAppSelector((state) => state.PolicyReducer);

  return (
    <Modal
      className="cls-policy-modal"
      title={[<Text className="fs-18 cls-modal-title">{t("policy_modal_title")}</Text>]}
      centered
      onCancel={() => dispatch(updateOpenConditionModal(false))}
      open={openConditionModal}
      footer={[
        <Flex gap={20} justify="flex-end" className="mt-6">
          <Button
            className="cls-cancel-btn px-5 py-1"
            key="back"
            type="default"
            onClick={() => dispatch(updateOpenConditionModal(false))}
          >
            {t("cancel")}
          </Button>
          <Button
            key="submit"
            type="primary"
            className={`cls-primary-btn px-5 py-1`}
            htmlType="submit"
            onClick={() => {
              dispatch(updateOpenConditionModal(false));
              redirect("createPolicy");
            }}
          >
            {t("continue")}
          </Button>
        </Flex>,
      ]}
    >
      <Row>
        <Col className="cls-radio-container mt-2 mb-4" xs={24}>
          <Radio.Group
            defaultValue="assistive"
            size="large"
            buttonStyle="solid"
          >
            <Radio.Button value="assistive">{t("assistive")}</Radio.Button>
            <Radio.Button value="expert">{t("expert")}</Radio.Button>
          </Radio.Group>
        </Col>
        <Col xs={24} className="mb-2">
          <Flex align="center">
            <Text type="secondary" className="Infi-Fd_15_Info fs-22"></Text>
            <Text type="secondary" className="f-med">
              {t("policy_condition_1")}
            </Text>
          </Flex>
        </Col>
        <Col xs={24}>
          <Flex align="center">
            <Text type="secondary" className="Infi-Fd_15_Info fs-22"></Text>
            <Text type="secondary" className="f-med">
              {t("policy_condition_2")}
            </Text>
          </Flex>
        </Col>
      </Row>
    </Modal>
  );
};

export default PolicyConditionModal;
