import { useResize } from "@/Utils/resize";
import { useAuth } from "@/hooks/Auth.hook";
import { Skeleton, Divider, Flex, Row, Col, Card, Typography } from "antd";

const ReviewFlightSkeleton = () => {

    const { isAuthenticated } = useAuth();
    const { isSmallScreen } = useResize(991);
    const Text = Typography.Text;

    return (
        <Row className={`cls-flightchange-row ${isSmallScreen ? "mb-4" : ""}`}>
            <Col lg={24} xl={24}>
                <Row
                    className={`mb-3 cls-headerTitle ${isAuthenticated ? "" : "cls-before-login"} `}
                    justify="space-between"
                >
                    <Col xs={24} lg={24} xl={24}>
                        <Flex gap={"10px"} className="my-3" align="center" wrap>
                            {[...Array(3)].map((_, index) => (
                                <>
                                    <Skeleton.Input active size="small" /> 
                                    {
                                        (index < 2) 
                                            ? <Text className='cls-breadcrumbSeparator fs-11 Infi-Fd_06_DownArrow' />
                                            : <></>
                                    }
                                </>
                            ))}
                        </Flex>
                    </Col>
                    <Col xs={24} sm={8} lg={6} xl={6} className={isSmallScreen ? "mb-2" : ""}>
                        <Skeleton.Input active size="large" className="w-100" />
                    </Col>
                    <Col xs={24} sm={16} lg={18} xl={18} className={isSmallScreen ? "mb-1 text-right" : "text-right"}>
                        <Skeleton.Input active size="large" />
                    </Col>
                    <Col xs={24} lg={15} xl={15} className={`${isSmallScreen ? "my-2" : "mt-2 mb-3"}`}>
                        <Skeleton.Input active size="large" className="w-100 h-30" />   
                    </Col>
                    <Col sm={16} lg={9} xl={9} className={`${isSmallScreen ? "text-left mb-2" : "text-right"} mt-2`}>
                        <Skeleton.Input active size="large" className="w-80 h-30" />
                    </Col>
                    <Divider />
                    <Col lg={16} xl={16} className="text-right pt-3">
                        <Skeleton.Input active size="large" />
                    </Col>
                    <Col lg={8} xl={8} className="pt-3"> </Col>
                </Row>
                <Row className="my-3">
                    <Col xs={24} lg={16} xl={16}>
                        <Card>
                            {[...Array(2)].map((_, index) =>
                                <>
                                    <Row>
                                        <Skeleton.Input active className="w-20 h-30"/>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Flex gap={"10px"} className={`${isSmallScreen ? "" : "h-20"} my-3`} align="center" justify="space-between" wrap>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                            </Flex>
                                        </Col>
                                    </Row>
                                    <Row justify="center" className={isSmallScreen ? "my-1" : "my-4"}>
                                        <Col lg={9} xl={9}>
                                            <Skeleton.Input active className="w-100"/>
                                        </Col>
                                    </Row>
                                    <Row>
                                        <Col span={24}>
                                            <Flex gap={"10px"} className={`${isSmallScreen ? "" : "h-20"} my-3`} align="center" justify="space-between" wrap>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                                <Skeleton.Input active size="small"/>
                                            </Flex>
                                        </Col>
                                    </Row>
                                    { index === 0 ? <Divider className="my-3" /> : <></> }
                                </>
                            )}
                        </Card>
                    </Col>
                    <Col xs={24} lg={7} xl={7} className={isSmallScreen ? "mt-4" : "ml-5"}>
                        <Card>
                            <>
                                <Row>
                                    <Skeleton.Input active className="w-8 h-30"/>
                                </Row>
                                {[...Array(4)].map((_, index) =>
                                    <Row className={`mt-3 ${index === 3 ? "mb-4" : ""} w-100`}>
                                        <Col xs={24} lg={24} xl={24}>
                                            <Flex gap={"10px"} className="h-20 w-100" align="center" justify="space-between">
                                                <Skeleton.Input active size="small" className={`w-100 ${isSmallScreen ? "pr-6" : ""}`}/>
                                                <Skeleton.Input active size="small" className={`w-100 ${isSmallScreen ? "pr-6" : ""}`}/>
                                            </Flex>
                                        </Col>
                                    </Row>
                                )}
                                <Divider />
                                <Row className="mt-4">
                                    <Skeleton.Input active className="w-100"/>
                                    <Skeleton.Input active  className="w-100 pt-2"/>
                                </Row>
                            </>
                        </Card>
                    </Col>
                </Row>
                <Row className={isSmallScreen ? "mt-5 mb-10" : "my-5" }>
                    <Col xs={24} lg={16} xl={16}>
                        <Card>
                            <Col xs={24} lg={7} xl={7} className="mb-4">
                                <Skeleton.Input active className="w-100 h-30"/>
                            </Col>
                            {[...Array(3)].map((_, index) =>
                                <>
                                    <Row>
                                        <Skeleton.Input active className="w-20 h-30 mb-3"/>
                                    </Row>
                                    <Row className="mb-6" align="middle" justify="space-between">
                                        {[...Array(4)].map(() =>
                                            <Col xs={12} lg={8} xl={8} className="mt-2">
                                                <Skeleton.Input active size="large" className="w-100 pr-6"/>
                                            </Col>
                                        )}
                                    </Row>
                                </>
                            )}
                        </Card>
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ReviewFlightSkeleton;