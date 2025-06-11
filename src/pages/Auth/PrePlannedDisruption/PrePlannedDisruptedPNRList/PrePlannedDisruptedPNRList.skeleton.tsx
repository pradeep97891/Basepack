import { useResize } from "@/Utils/resize";
import { Divider, Skeleton, Flex, Typography, Col } from "antd";

const { Text } = Typography;

const PrePlannedDisruptedPNRListSkeleton = () => {
  const { isSmallScreen } = useResize();
  return (
    <>
      <Text className="d-block" style={isSmallScreen ? {} : { margin: "30px 0px" }}>
        <Flex gap={10} wrap={"wrap"} justify="space-between">
          <Skeleton.Input active size="large" />
          <Skeleton.Input active size="large" />
        </Flex>
        <Divider />
        <Flex wrap={"wrap"} gap={10} justify="space-between">
          <Flex wrap={"wrap"} gap={15}>
            <Skeleton.Input active />
          </Flex>
          <Flex wrap={"wrap"} gap={15}>
            {[...Array(2)].map(() => (
              <Skeleton.Input active size="large" />
            ))}
          </Flex>
        </Flex>
        <br />
        {[...Array(5)].map(() => (
          <Text>
            <Flex wrap={"wrap"} justify="space-between" gap={10}>
              {[...Array(6)].map((_, col) => (
                  <Skeleton.Input active size="default" />
              ))}
            </Flex>
            <br />
          </Text>
        ))}
      </Text>
    </>
  );
};

export default PrePlannedDisruptedPNRListSkeleton;
