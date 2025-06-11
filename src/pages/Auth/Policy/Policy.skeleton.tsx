import { Divider, Skeleton, Flex, Typography, Row, Col } from "antd";
import { useResize } from "@/Utils/resize";

const { Text } = Typography;

const PolicySkeleton = () => {
  const { isSmallScreen } = useResize();

  return (
    <Row style={{width : '100%'}}>
      <Col span={24}>
        <Text className="d-block" style={{ margin: "30px 0px" }}>
          <Flex gap={ isSmallScreen ? 10 : 0} wrap="wrap" justify="space-between">
            <Skeleton.Input active size="large" />
            <Skeleton.Input active size="large" />
          </Flex>
          <Divider />
          <Flex gap={ isSmallScreen ? 10 : 0} wrap="wrap" justify="space-between">
            <Flex  wrap="wrap" gap={15}>
              <Skeleton.Input active />
            </Flex>
            <Flex  wrap="wrap" gap={15}>
              {[...Array(2)].map(() => (
                <Skeleton.Input active size="large" />
              ))}
            </Flex>
          </Flex>
          <br />
          {[...Array(5)].map(() => (
            <Text>
              <Flex wrap="wrap" justify="space-between" gap={ isSmallScreen ? 10 :40}>
                {[...Array(6)].map((_, col) => (
                  <Skeleton.Input active size="default" />
                ))}
              </Flex>
              <br />
            </Text>
          ))}
        </Text>
      </Col>
    </Row>
  );
};

export default PolicySkeleton;
