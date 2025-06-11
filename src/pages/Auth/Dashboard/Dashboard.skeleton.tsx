import { Skeleton, Divider, Flex, Row, Col, Card } from "antd";

const DashboardSkeleton = () => {
  return (
    <>
      <Row className="g-10" align="middle" justify={"start"}>
        <Col lg={8} sm={24} xs={24} md={24}>
          <Skeleton.Input active size="large" className="w-100" />
        </Col>
        <Col xs={20} sm={12} md={8} lg={5} xl={5}>
          <Skeleton.Input active size="large" className="w-100" />
        </Col>
        <Col xs={15} sm={2} md={4} lg={1} xl={1}>
          <Skeleton.Input active size="large" className="w-100" />
        </Col>
      </Row>
      <Row gutter={[16, 16]} className="mx-4 my-4">
        {[...Array(4)].map(() => (
            <Col xs={24} sm={12} md={12} lg={6} xl={4}>
                <Skeleton.Input active size="large" className="w-100 h-100" />
            </Col>
        ))}
      </Row>
      <Row className="mb-3" gutter={[16, 16]}>
        <Col xs={24} lg={15} md={15} className="">
          <Card>
            <Skeleton.Input active size="large" className="w-70 h-35 mb-3" />
            {[...Array(4)].map(() => (
                <Skeleton.Input active size="large" className="w-100 h-30 mb-3" />
            ))}
            <Skeleton.Input active size="large" className="w-70 h-30" />
          </Card>
        </Col>
        <Col xs={24} md={9} lg={9} className="cls-gap ">
        <Card>
            <Skeleton.Input active size="large" className="w-60 h-35 mb-3" />
            <Skeleton.Input active size="large" className="w-100 h-30" />
            <Divider className="my-3" />
            {[...Array(2)].map((val, index) => (
                <>
                    <Flex wrap={"wrap"} gap="10px">
                        <Skeleton.Input active size="small" className="w-50 mb-3" />
                        <Skeleton.Input active size="small" className="w-50 mb-3" />
                        <Flex wrap="wrap">
                            <Skeleton.Input active size="small" className="w-100 mb-1" />
                            <Skeleton.Input active size="small" className="w-100" />
                        </Flex>
                    </Flex>
                    { index !==1 ? <Divider className="my-3" /> : <></> }
                </>
            ))}
          </Card>
        </Col>
      </Row>
      <Row gutter={[16, 16]}>
        <Col xs={24} lg={15} md={15} span={15}>
          <Card>
            <Skeleton.Input active size="large" className="w-50 h-35 mb-3" />
            {[...Array(4)].map(() => (
                <Skeleton.Input active size="large" className="w-100 h-30 mb-3" />
            ))}
            <Skeleton.Input active size="large" className="w-80 h-30" />
          </Card>
        </Col>
        <Col xs={24} lg={9} md={9} className="cls-gap ">
            <Card>
                <Skeleton.Input active size="large" className="w-50 h-35 mb-3" />
                {[...Array(4)].map(() => (
                    <Skeleton.Input active size="large" className="w-100 h-30 mb-3" />
                ))}
                <Skeleton.Input active size="large" className="w-100 h-30" />
            </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardSkeleton;