import { Skeleton, Divider, Flex} from 'antd';
import Text from 'antd/lib/typography/Text';

const MailerTemplatesListSkeleton = () => {
  return (
    <>
      <Text className="d-block" style={{ margin: "30px 0px" }}>
        <Skeleton.Input active size="large" />
        <Divider />
        <Flex justify='space-between'>
          <Flex gap={15}>
            <Skeleton.Input active />
          </Flex>
          <Flex gap={15}>
            {[...Array(2)].map((_, index) => (
              <Skeleton.Input key={index} active size="large" />
            ))}
          </Flex>
        </Flex>
        <br />
        {[...Array(5)].map((_, row) => (
          <Text key={row}>
            <Flex justify="space-between" key={row}>
              {[...Array(6)].map((_, col) => (
                <Skeleton.Input key={col} active size="default" />
              ))}
            </Flex>
            <br />
          </Text>
        ))}
      </Text>
    </>
  );
};

export default MailerTemplatesListSkeleton;
