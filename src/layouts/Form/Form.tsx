import { Col, Row } from "antd";
import { ReactNode } from "react";
import { useTranslation } from "react-i18next";
import "./Form.scss";
import { BackButton } from "@/components/BackButton/BackButton";

interface ContainerProps {
  title: string;
  children: ReactNode;
  additionalHead?: ReactNode;
}

const FormLayout = ({ children, title, additionalHead }: ContainerProps) => {
  const { t } = useTranslation();
  return (
    <>
      <Row className="dynamic-form">
        <Col span={24}>
          <Row justify="space-between">
            <Col>
              <p className="title">{title}</p>
            </Col>
            <Col>
              <Row align="middle" gutter={[24, 0]}>
                <Col>{additionalHead}</Col>
                <Col>
                  <BackButton />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        <Col span={24} className="form-container">
          <div className="cls-form-legend">{t("fill_below_details")}</div>
          {children}
        </Col>
      </Row>
    </>
  );
};

export { FormLayout };
