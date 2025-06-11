import { Skeleton, Divider, Flex, Row, Col, Typography, Card } from 'antd';
const { Text } = Typography;

const QueueSettingsSkeleton = () => {
    return (
        <Row className='cls-queue-skeleton'>
            {/* Header Section */}
            <Col span={24}>
                <Flex wrap={"wrap"} gap="10px" className="my-3" align="center">
                    <Skeleton.Input active size="small" />
                    <Text className='cls-breadcrumbSeparator Infi-Fd_06_DownArrow'></Text>
                    <Skeleton.Input active size="small" />
                    <Text className='cls-breadcrumbSeparator Infi-Fd_06_DownArrow'></Text>
                    <Skeleton.Input active size="small" />
                </Flex>
            </Col>
            <Col span={6}>
                <Skeleton.Input active size="large" className="w-100" />
            </Col>

            {/* Main Card Section */}
            <Col span={24} className='mt-4'>
                <Card>
                    <Row>
                        <Col span={24}>
                            <Flex wrap={"wrap"} gap={20}>
                                {[...Array(4)].map((_, index) => (
                                    <Skeleton.Input key={index} active size="large" />
                                ))}
                            </Flex>
                        </Col>
                    </Row>
                    <Divider />
                    <Row>
                        <Col span={6}>
                            <Skeleton.Input active size="large" className="w-100" />
                        </Col>
                        {[...Array(2)].map((_, index) => (
                            <Col span={24} className='mt-5'>
                                <Flex wrap={"wrap"} gap={20}>
                                    
                                        <Flex wrap={"wrap"} key={index} gap={20}>
                                            {[...Array(4)].map((_, idx) => (
                                                <Skeleton.Input key={idx} active size="large" />
                                            ))}
                                        </Flex>
                                </Flex>
                            </Col>
                        ))}
                         <Col span={6} className='mt-5'>
                            <Skeleton.Input active size="large" />
                        </Col>
                    </Row>
                </Card>
            </Col>

            {/* Footer Section */}
            <Col span={21} className='mt-5 text-center'>
                <Skeleton.Button active size="large" />
            </Col>
        </Row>
    );
};

export default QueueSettingsSkeleton;
