import { Skeleton, Row, Col, Card } from 'antd';
import Text from 'antd/lib/typography/Text';
import "./SearchFlight.scss";
import { useResize } from '@/Utils/resize';

const SearchFlightSkeleton = () => {

  const { isSmallScreen, isLargeScreen } = useResize(991);
  
  return (
    <>
      <Text className="cls-searchFlightMain d-block cls-skeleton">
        <div className="cls-head-bg">
          <div className="cls-head-content">
            <Row className='space-between w-100'>
              <Col xs={24} sm={8} lg={16} xl={16}>
                <Skeleton.Input active style={{ backgroundColor: "var(--t-header-background)" }} className={`${isSmallScreen ? "mb-1 w-100" : "pr-6"}`} />
                <Skeleton.Input active style={{ backgroundColor: "var(--t-header-background)" }} className={`${isSmallScreen ? "w-100" : ""}`} />
              </Col>
              <Col xs={24} sm={16} lg={8} xl={8} className={`${isSmallScreen ? "mt-2" : ""} text-right`}>
                <Skeleton.Input active style={{ backgroundColor: "var(--t-header-background)" }} />
              </Col>
            </Row>
          </div>
        </div>
        <Row justify='space-between' className={`${isSmallScreen ? "px-3" : "px-6"}`}>
          <Col xs={24} lg={6} xl={6}>
            <Skeleton.Input active className={`${isSmallScreen ? "pt-3" : "pt-6"} w-100`} />
          </Col>
          <Col xs={24} lg={6} xl={6} className='text-right'>
            <Skeleton.Input active className={`${isSmallScreen ? "pt-3" : "pt-6"} w-80`} />
          </Col>
        </Row>
        <Row className={`${isSmallScreen ? "mt-3 mx-3" : "mt-6 ml-6"}`}>
          <Col xs={24} lg={16} xl={16}>
            {[...Array(6)].map((_, index) => (
              <Card key={`card-${index}`} className={`${isSmallScreen ? "mb-2" : isLargeScreen ? "mb-4" : "mb-4 h-100"}`}>
                <Row style={{gap: isSmallScreen ? 0 : isLargeScreen ? 15 : 20, overflow: "hidden"}} >
                  {[...Array(5)].map((_, subIndex) => (
                    <Col xs={12} sm={8} md={6} lg={5} xl={4} className={`${isSmallScreen ? "mb-2 pr-2" : ""}`}>
                      <Skeleton.Input key={`input-${index}-${subIndex}`} active size="small" className={`${isSmallScreen ? "w-100" : ""} h-50`} />
                    </Col>
                  ))}
                </Row>
              </Card>
            ))}
          </Col>
          <Col xs={24} sm={24} lg={7} xl={7} className={`${isSmallScreen ? "mb-6" : "ml-6"}`}>
            <Card>
              {[...Array(2)].map((_, index) => (
                <div key={`sidebar-card-${index}`}>
                  <Skeleton.Input active size="default" className="mb-1" />
                  <Skeleton.Input active size="default" className="w-100 h-40 mb-3" />
                  <Skeleton.Input active size="default" className="w-90 h-40 mb-3" />
                </div>
              ))}
            </Card>
          </Col>
        </Row>
      </Text>
    </>
  );
};

export default SearchFlightSkeleton;
