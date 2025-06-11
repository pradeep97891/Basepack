import { Card, Carousel, Col, Row, Image, Typography } from "antd";
import { useGetUpcomingEventMutation } from "@/services/reschedule/Reschedule";
import ad from "@/assets/images/Common/advertisement.png";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import './Advertisement.scss';

const { Title, Text } = Typography;

const Advertisement: React.FC = () => {
  const [upcomingEvent, upcomingEventResponse] = useGetUpcomingEventMutation();
  const { t } = useTranslation();

  useEffect(() => {
    upcomingEvent([]);
  }, [upcomingEvent]);

  return (
    <div data-testid="Advertisement">
      <Row>
        <Col span={24}>
          <Image
            src={ad}
            width="100%"
            height="215px"
            className="cls-ad-img"
          ></Image>
        </Col>
      </Row>
      <Row className="pt-2 mt-4 cls-upcoming-event-container">
        <Col>
          <Card>
            <Title level={5} className="fs-18 cls-upcoming-event-title">
              {t("upcoming_events")}
            </Title>
            <Col span={24} className="cls-upcoming-event-carousel">
              <Carousel
                autoplay
                dots={true}
                dotPosition="bottom"
                className="custom-carousel"
              >
                {upcomingEventResponse?.isSuccess &&
                  (upcomingEventResponse?.data as any)?.response?.data?.map((value: any, index: any) => {
                    return (
                      <Row
                        data-testid="upcomingEvent"
                        className="pt-1 pb-5 pl-3 cls-db-event-ele"
                      >
                        <Col span={24}>
                          <h1 className="fs-30 f-sbold cls-db-date">
                            {value.day}
                          </h1>
                        </Col>
                        <Col span={24}>
                          <p className="fs-12 pb-4">{value.month}</p>
                        </Col>
                        <Col span={24}>
                          <p className=" mt-1 fs-13">{value.text}</p>
                        </Col>
                        <Col span={24}>
                          <Text className="fs-12 f-sbold">{value.time}</Text>
                        </Col>
                      </Row>
                    );
                  })}
              </Carousel>
            </Col>
          </Card>
        </Col>
      </Row>
    </div>
  );
};


export default Advertisement;