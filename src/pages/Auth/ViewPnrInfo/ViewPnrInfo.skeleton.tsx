import { useResize } from "@/Utils/resize";
import { useAuth } from "@/hooks/Auth.hook";
import { Skeleton, Divider, Flex, Row, Col, Card, Typography } from "antd";

const ViewPnrInfoSkeleton = () => {

    const { isAuthenticated } = useAuth();
    const Text = Typography.Text;
    const { isSmallScreen } = useResize(991);

    return (
        <Row className="cls-flightchange-row">
            <Col xl={24}>
                <Row
                    className={`mb-3 cls-headerTitle ${isAuthenticated ? "" : "cls-before-login"} `}
                    justify={isSmallScreen ? "start" : "space-between"}
                    wrap
                >
                    <Col lg={24} xl={24}>
                        <Flex gap={"10px"} className="mt-3" align="center" wrap>
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
                    <Col xs={24} lg={6} xl={6} className={`${isSmallScreen ? "w-100" : ""} mt-3`}>
                        <Skeleton.Input active size="large" className="w-100" />
                    </Col>
                    <Col xs={24} lg={18} xl={18} className={`${isSmallScreen ? "w-100" : "text-right"} mt-3`}>
                        <Skeleton.Input active size="large" className={`${isSmallScreen ? "w-100" : ""}`} />
                    </Col>
                    <Col xs={24} lg={15} xl={15} className={`${isSmallScreen ? "w-100 mt-4" : "mt-2"}`}>
                        <Skeleton.Input active size="large" className="w-100 h-30 mb-3" />
                    </Col>
                    <Col xs={24} lg={9} xl={9} className={`${isSmallScreen ? "" : "text-right"} mt-2`}>
                        <Skeleton.Input active size="large" className="w-80 h-30" />
                    </Col>
                    <Divider className="mt-2 mb-4" />
                    <Col xs={24} lg={8} xl={8} className={`${isSmallScreen ? "w-100" : ""}`}>
                        <Skeleton.Input active size="large" className="w-100" />
                    </Col>
                    <Col xs={24} lg={16} xl={16} className={`${isSmallScreen ? "w-100 mt-3" : "text-right"}`}>
                        <Skeleton.Input active size="large" />
                    </Col>
                </Row>
                <Row className="my-3">
                    <Col lg={24} xl={24}>
                        <Card>
                            <Skeleton.Input active className="w-8 h-30" />
                            <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                                {[...Array(7)].map(() => (
                                    <Skeleton.Input active size="small" />
                                ))}
                            </Flex>
                            <Row>
                                <Skeleton.Input active className="w-8 h-30" />
                            </Row>
                            <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                                {[...Array(7)].map(() => (
                                    <Skeleton.Input active size="small" />
                                ))}
                            </Flex>
                            <Divider className="my-3" />
                            <Row>
                                <Skeleton.Input active className="w-8 h-30" />
                            </Row>
                            <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                                {[...Array(7)].map(() => (
                                    <Skeleton.Input active size="small" />
                                ))}
                            </Flex>
                        </Card>
                    </Col>
                </Row>
                <Divider className="mt-4 mb-4" />
                <Row>
                    <Col lg={8} xl={8}>
                        <Skeleton.Input active size="large" className="w-100" />
                    </Col>
                </Row>
                <Row className="my-3 cls-rebooked-col">
                    <Col lg={24} xl={24}>
                        <Col xl={24} className="cls-bg-radio-reschedule px-3 pt-1 pb-3">
                            <Row>
                                <Flex gap={"10px"} className="my-3" align="center" wrap>
                                    {[...Array(4)].map(() => (
                                        <Skeleton.Input active size="small" />
                                    ))}
                                </Flex>
                            </Row>
                            <Col lg={8} xl={8}>
                                <Skeleton.Input active size="large" className="w-100" />
                            </Col>
                        </Col>
                        <Skeleton.Input active className="w-8 h-30 my-2" />
                        <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                            {[...Array(7)].map(() => (
                            <Skeleton.Input active size="small" />
                            ))}
                        </Flex>
                        <Skeleton.Input active className="w-8 h-30" />          
                        <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                            {[...Array(7)].map(() => (
                            <Skeleton.Input active size="small" />
                            ))}
                        </Flex>
                        <Divider className="my-3" />
                        <Skeleton.Input active className="w-8 h-30" />
                        <Flex gap={"10px"} className="my-3" align="center" justify={isSmallScreen ? "flex-start" : "space-between"} wrap>
                            {[...Array(7)].map(() => (
                            <Skeleton.Input active size="small" />
                            ))}
                        </Flex>
                    </Col>
                </Row>
                <Row justify={"center"} className="my-5">
                    <Col lg={4} xl={4}>
                        <Skeleton.Input active className="w-100 h-40" />
                    </Col>
                </Row>
            </Col>
        </Row>
    );
};

export default ViewPnrInfoSkeleton;