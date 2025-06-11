import { useResize } from "@/Utils/resize";
import { Skeleton, Divider, Flex, Card, Col } from "antd";
import Text from "antd/lib/typography/Text";

const ReaccommodationFlightSkeleton = () => {
  const { isSmallScreen } = useResize();

  return (
    <Text className="d-block" style={isSmallScreen ? {} : { margin: "10px 5px 20px", padding: "20px" }}>
      <Flex wrap={"wrap"} gap={10} justify="space-between" align="center">
        <Skeleton.Input active size="large" />
        <Skeleton.Input active size="default" />
      </Flex>
      <Skeleton.Input
        active
        size="default"
        block
        style={{ marginBlock: "10px 5px" }}
      />
      <Skeleton.Input active size="default" block />
      <Divider />
      <Flex wrap={"wrap"} gap={15}>
        {[...Array(4)].map((_, index) => (
          <Skeleton.Input key={index} active size="default" />
        ))}
      </Flex>
      <br />
      <Flex wrap={"wrap"} gap={15}>
        {[...Array(2)].map((_, row) => (
          <Col xs={24} sm={24} md={24} lg={12} xl={12}>
            <Card>
              <Skeleton.Input active size="default" />
              {[...Array(3)].map((_, col) => (
                <Col xs={24} sm={10} md={10} lg={12} xl={12}>
                     <Skeleton.Input
                  key={row}
                  active
                  size="default"
                  block
                  style={{ height: "100px", marginBlock: "10px" }}
                />
                </Col>
           
              ))}
            </Card>
          </Col>

        ))}
      </Flex>
      <br />
      <br />
      <Flex wrap={"wrap"} gap={15} justify="center">
        <Skeleton.Input active size="default" />
        <Skeleton.Input active size="default" />
      </Flex>
    </Text>
  );
};

export default ReaccommodationFlightSkeleton;
