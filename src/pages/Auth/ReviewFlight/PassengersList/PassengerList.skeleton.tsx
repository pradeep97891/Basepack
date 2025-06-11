import { useResize } from '@/Utils/resize';
import { Skeleton, Divider, Flex} from 'antd';
import React from 'react';

const PassengerListSkeleton = () => {

  const { isSmallScreen } = useResize();

  return (
    <>
      <Skeleton.Input active size="small" />
        <Skeleton.Input active size="small" className="my-1 w-100" />
        <Flex gap={"10px"}>
          {[...Array(3)].map((_, index) => (
            <Skeleton.Button active size="default" key={"paxList"+index} />
          ))}
        </Flex>
        {[...Array(5)].map((_, index) => (
          <React.Fragment key={"paxListDown"+index}>
            <Divider dashed />
            <Skeleton.Input active size="small" className="w-85" />
          </React.Fragment>
        ))}
    </>
  );
};

export default PassengerListSkeleton;
