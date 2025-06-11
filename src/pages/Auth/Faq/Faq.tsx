import { Col, Collapse, Flex, Row, Typography } from "antd";
import "./Faq.scss";
import { useTranslation } from "react-i18next";
import { useResize } from "@/Utils/resize";

const Faq: React.FC = () => {
  const { t } = useTranslation();
  const {Title} = Typography;
  let FaqInfo = [
    {
      key: "1",
      label: "What is flight disruption?",
      children:
        "Flight disruption refers to any situation where a scheduled flight is delayed, canceled, or rerouted due to unforeseen circumstances such as weather, technical issues, or operational constraints.",
    },
    {
      key: "2",
      label: "How does the disruption management tool handle cancellations?",
      children:
        "The tool automatically detects flight cancellations and alerts the affected passengers. Airlines can use the system to rebook passengers on alternative flights or issue refunds.",
    },
    {
      key: "3",
      label: "Can passengers receive real-time updates on flight status?",
      children:
        "Yes, the tool provides real-time notifications to passengers via SMS or email for any changes in their flight schedule, including delays and cancellations.",
    },
    {
      key: "4",
      label: "How can airlines manage passenger compensation for disruptions?",
      children:
        "Airlines can set predefined compensation rules in the tool, allowing them to automatically calculate and process compensations, such as meal vouchers, hotel bookings, or refunds, based on the severity and duration of the disruption.",
    },
    {
      key: "5",
      label: "How does the tool prioritize rebooking during disruptions?",
      children:
        "The system uses prioritization algorithms to rebook passengers based on factors like loyalty status, fare class, and connection urgency, ensuring efficient seat allocation during disruptions.",
    },
    {
      key: "6",
      label: "What types of disruptions are managed by this tool?",
      children:
        "The tool manages various types of disruptions, including flight delays, cancellations, diversions, and overbooked flights.",
    },
    {
      key: "7",
      label: "How does the tool assist ground handlers during disruptions?",
      children:
        "No, the tool does not provides ground handlers with real-time information on flight schedules, gate changes, and rebooking statuses, helping them manage the boarding process and passenger flow effectively.",
    },
    {
      key: "8",
      label: "Is there a dashboard for monitoring disruption status?",
      children:
        "Yes, the tool includes a comprehensive dashboard that displays real-time flight status, affected passengers, and recovery actions being taken, allowing airline staff to monitor and manage disruptions seamlessly.",
    },
    {
      key: "9",
      label: "How does the tool handle multi-leg or connecting flights during a disruption?",
      children:
        " The tool tracks all legs of a passenger’s journey. If a disruption occurs on any leg, it automatically assesses the impact on subsequent connections and rebooks or notifies passengers accordingly.",
    },
    {
      key: "10",
      label: "What kind of analytics does the tool provide?",
      children:
        "The tool provides detailed analytics on disruption patterns, passenger handling times, compensation costs, and recovery efficiency. This helps airlines optimize their disruption management strategies over time.",
    },
    {
      key: "11",
      label: "Can the tool integrate with external systems like weather forecasting or air traffic control?",
      children:
        "Yes, the tool can be integrated with external systems such as weather forecasts, air traffic control updates, and airport management systems to predict and manage disruptions more effectively.",
    },
    {
      key: "12",
      label: "How are passengers notified about alternative flight options?",
      children:
        "The tool sends notifications to passengers about alternative flight options through multiple channels, such as SMS, email, and mobile apps, allowing them to choose the most suitable option."
    },
    {
      key: "13",
      label: "How does the tool ensure compliance with passenger rights and regulations?",
      children:
        "The tool has built-in compliance checks for various international and regional passenger rights regulations, ensuring that passengers are compensated and accommodated according to the legal requirements of the affected jurisdiction.",
    },
    {
      key: "14",
      label: "Can airlines customize disruption management workflows in the tool?",
      children:
        "Yes, airlines can customize workflows within the tool, such as defining their own disruption response protocols, compensation criteria, and passenger communication strategies, to fit their specific operational needs.",
    },
    
  ];
  
  const { isSmallScreen } = useResize();

  return (
    <>
      <Row
        className={`cls-faq-container ${isSmallScreen ? "" : "px-6 pt-7 pb-8"}`}
        data-testid="faq"
        justify="center"
      >
        <Col xs={24} sm={24} md={24} lg={18} xl={16}>
          <Row className="cls-faq-header">
            <Col span={14}>
              <Title level={3} className="f-sbold">{t("faq")}</Title>
            </Col>
            {/* <Col span={10}>
              <a>+ {t("add_query")}</a>
            </Col> */}
          </Row>
          <Row className="mt-4">
            <Col span={24}>
              <Flex className="cls-faq-item " vertical gap={10}>
                {FaqInfo.map((item: any) => {
                  return <Collapse items={[item]} />;
                })}
              </Flex>
            </Col>
          </Row>
        </Col>
      </Row>
    </>
  );
};

export default Faq;
