import { Divider, Skeleton, Flex } from "antd";

const ScoreSettingsSkeleton = () => {
    return (
        <>
            <Skeleton active />
            <br /> <br /> <br />
            <Flex justify='space-between'>
                <Flex gap={15}>
                    <Skeleton.Button active size="large" />
                    <Skeleton.Button active size="large" />
                </Flex>
                <Flex gap={15}>
                    <Skeleton.Input active size="large" />
                    <Skeleton.Input active size="large" />
                    <Skeleton.Input active size="large" />
                </Flex>
            </Flex>
            <Divider />
            <Skeleton active />
            <br /> <br /> <br />
            <Flex gap={15} justify='center'>
                <Skeleton.Button active size="large" />
                <Skeleton.Button active size="large" />
            </Flex>
        </>
    )
}

export default ScoreSettingsSkeleton;