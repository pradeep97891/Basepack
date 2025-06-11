import { useResize } from "@/Utils/resize";
import { Skeleton, Row, Col, Card } from "antd";

const BookTicketSkeleton = () => {

  const { isSmallScreen, isLargeScreen } = useResize(991);
  
  return (
    <Row>
      <Col xs={24} lg={24} xl={24}>
        {[...Array(6)].map((_, index) => (
          <Card key={`card-${index}`} className={`${isSmallScreen ? "mb-2" : isLargeScreen ? "mb-4" : "mb-4 h-100"}`}>
            <Row style={{ gap: isSmallScreen ? 0 : isLargeScreen ? 15 : 20, overflow: "hidden" }} >
              {[...Array(5)].map((_, subIndex) => (
                <Col xs={12} sm={8} md={6} lg={5} xl={4} className={`${isSmallScreen ? "mb-2 pr-2" : ""}`}>
                  <Skeleton.Input key={`input-${index}-${subIndex}`} active size="small" className={`${isSmallScreen ? "w-100" : ""} h-50`} />
                </Col>
              ))}
            </Row>
          </Card>
        ))}
      </Col>
    </Row>
  );
};

export default BookTicketSkeleton;
