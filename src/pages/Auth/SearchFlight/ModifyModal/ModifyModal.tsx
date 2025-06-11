import "./ModifyModal.scss";
import { Button, Col, DatePicker, Divider, Modal, Row, Select, Typography } from "antd";

const { Text } = Typography;

const ModifyModal = (props: any) => {
  const { show, toggleShow } = props;

  return (
    <Modal
      data-testid="modifyModal"
      className="cls-modify-modal flip-card-back"
      open={show}
      footer={false}
      onOk={toggleShow}
      onCancel={toggleShow}
      width="700px"
      closeIcon={ <Text className="fs-20 cls-close-icon Infi-Fd_09_CloseIcon"></Text> }
    >
      <Typography.Title level={4} className="pl-2 pb-1">Modify Search</Typography.Title>
      <Row className="cls-modify-modal-content mb-2" justify="start">
        <Col span={24} className="cls-modify-trip-btn">
          <Col className="fs-14 f-sbold cls-opactiy">Trip 1:</Col>
        </Col>
        <Col span={7} className="cls-modify-from-btn">
          {/* <Col className="fs-12 cls-opactiy">From</Col> */}
          <Select
            defaultValue="MAA"
            className="f-bold"
            showArrow={false}
            options={[
              {
                value: "MAA",
                label: "Chennai",
              },
              {
                value: "DEL",
                label: "Delhi",
              }
            ]}
          />
        </Col>
        <Col span={7} className="cls-modify-from-btn">
          {/* <Col className="fs-12 cls-opactiy">To</Col> */}
          <Select
            defaultValue="DEL"
            className="f-bold"
            showArrow={false}
            options={[
              {
                value: "DEL",
                label: "Delhi",
              },
              {
                value: "MAA",
                label: "Chennai",
              }
            ]}
          />
        </Col>
        <Col span={7} className="cls-modify-datepicker">
          {/* <Col className="fs-12 cls-opactiy">Date</Col> */}
          <DatePicker className="f-bold" format={"MMM DD, YYYY"} inputReadOnly={true} showToday={false} />
        </Col>
      </Row>
      <Row className="cls-modify-modal-content mb-2" justify="start">
        <Col span={24} className="cls-modify-trip-btn">
          <Col className="fs-14 f-sbold cls-opactiy">Trip 2:</Col>
        </Col>
        <Col span={7} className="cls-modify-from-btn">
          {/* <Col className="fs-12 cls-opactiy">From</Col> */}
          <Select
            defaultValue="DEL"
            className="f-bold"
            showArrow={false}
            options={[
              {
                value: "DEL",
                label: "Delhi",
              },
              {
                value: "MAA",
                label: "Chennai",
              },
            ]}
          />
        </Col>
        <Col span={7} className="cls-modify-from-btn">
          {/* <Col className="fs-12 cls-opactiy">To</Col> */}
          <Select
            defaultValue="MAA"
            className="f-bold"
            showArrow={false}
            options={[
              {
                value: "MAA",
                label: "Chennai"
              },
              {
                value: "DEL",
                label: "Delhi"
              },
            ]}
          />
        </Col>
        <Col span={7} className="cls-modify-datepicker">
          {/* <Col className="fs-12 cls-opactiy">Date</Col> */}
          <DatePicker className="f-bold" format={"MMM DD, YYYY"} inputReadOnly={true} showToday={false} />
        </Col>
      </Row>
      <Row justify="center">
        <Col span={24} className="cls-modify-modal-btn text-center">
          <Button type="primary" size="large" block className="f-med fs-14 pt-1 w-25">
            Modify
          </Button>
        </Col>
      </Row>
    </Modal>
  );
};
export default ModifyModal;
