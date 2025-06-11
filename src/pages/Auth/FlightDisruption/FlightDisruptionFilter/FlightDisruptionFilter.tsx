import { Button, Col, DatePicker, Form, Input, Row } from "antd";
import { DatePickerRe } from "@/components/Icons/Icons";
import "./FlightDisruptionFilter.scss";
import { useTranslation } from "react-i18next";

const FlightDisruptionFilter: React.FC = () => {
  const { t } = useTranslation();
  return (
    <Row className="cls-flight-disruption-filter-container" data-testid='flightDisruptionFilter'>
      <Col span={24}>
        <Form
          data-testid="flightDisruptionForm"
          // form={form}
          // onFinish={formSubmit}
          // onReset={onReset}
          className="flightDisruptionForm"
          layout="vertical"
          size="large"
        >
          <Row>
            <Col className="cls-date-picker-container">
              <Form.Item label="Select Date Range">
                <DatePicker
                  disabled={false}
                  inputReadOnly={true}
                  suffixIcon={<DatePickerRe />}
                  size="middle"
                  format="DD/MM/YYYY"
                  // disabledDate={(current) => {
                  //   return moment().add(-1, 'days') >= current;
                  // }}
                  // onChange={(date, dateString) => customDataHandling(value, dateString, 'date')}
                />
              </Form.Item>
            </Col>
            <Col>
              <Form.Item
                label={t("pcc")}
                name="pcc"
                fieldKey="pcc"
                rules={[
                  {
                    required: true,
                    whitespace: true,
                    message: "Missing PCC",
                  },
                ]}
              >
                <Input maxLength={3} placeholder="PCC" />
              </Form.Item>
            </Col>
            <Col>
              <Row className="cls-form-btn-container" align="bottom">
                <Col span={12}>
                  <Button htmlType="submit" type="primary">
                    {t("filter")}
                  </Button>
                </Col>
                <Col span={12}>
                  <Button htmlType="submit" type="primary">
                    {t("reset")}
                  </Button>
                </Col>
              </Row>
            </Col>
          </Row>
        </Form>
      </Col>
      <Col></Col>
    </Row>
  );
};

export default FlightDisruptionFilter;
