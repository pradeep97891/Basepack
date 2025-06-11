import { Skeleton, Card, Row, Col } from 'antd';

const AddUserSkeleton = () => {
    return (
        <Card>
            <Row>
                {[...Array(10)].map((_, index) => (
                    <Col xs={24} sm={12} md={8} lg={8} xl={8}>
                        <Skeleton.Button active size="small" className='d-iblock w-50 mb-1' key={"formLabel" + index} />
                        <Skeleton.Button active size="large" className='d-iblock w-100 pr-2 mb-2' key={"formData" + index} />
                    </Col>
                ))}
            </Row>
            <Row style={{ margin: "0 auto", gap: 20 }}>
                {[...Array(2)].map((_, index) => (
                    <Col>
                        <Skeleton.Button active size="large" className='d-iblock w-100 h-40 mb-1 text-right' key={"formbutton" + index} />
                    </Col>
                ))}
            </Row>
        </Card>
    );
};

export default AddUserSkeleton;
