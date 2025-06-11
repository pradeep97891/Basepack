import { Skeleton, Flex, Row, Col } from "antd";

/* Skeleton loader for create policy page */
const CreatePolicySkeleton = () => {
  return (
    <Row justify="space-between">
      <Col xs={24} sm={12} md={16} lg={8} xl={6} style={{ padding: "30px" }}>
        <Skeleton.Input active block size="large" />
        <Skeleton.Button
          active
          block
          size="large"
          style={{ marginBlock: 16 }}
        />
        <br />
        <Flex vertical gap={20}>
          {[...Array(16)].map(() => (
            <Flex gap={10}>
              <Skeleton.Input active size="small" block />
              <Skeleton.Input active size="small" />
            </Flex>
          ))}
        </Flex>
      </Col>
      <Col span={18} style={{ padding: "30px" }}>
        <Skeleton.Input
          active
          block
          size="large"
          style={{ marginBlockEnd: 16 }}
        />
        <Flex gap={10} vertical>
          {[...Array(6)].map(() => (
            <Skeleton active />
          ))}
        </Flex>
      </Col>
    </Row>
  );
};

export default CreatePolicySkeleton;
