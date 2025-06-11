import { useResize } from '@/Utils/resize';
import { Skeleton, Divider, Flex, Typography, Card} from 'antd';
import React from 'react';
const Text = Typography;

const AddSSRSkeleton = () => {

  const { isSmallScreen, isLargeScreen } = useResize();
  
  return (
    <>
        {/* <Flex gap={"10px"} justify='space-between' align='center'>
          <Text>
            {[...Array(2)].map((_, index) => (
              <Skeleton.Button active size="large" className='d-iblock pr-2' key={"paxList"+index} />
            ))}
          </Text>
          <Text className='d-iblock pr-1'>
            {[...Array(3)].map((_, index) => (
              <Skeleton.Button active size="default" className={`d-iblock ${index<2 ? "pr-2" : ""}`} key={"paxList"+index} />
            ))}
          </Text>
        </Flex> */}
        {/* <Skeleton.Input active size="small" className="mt-3 mb-2 w-100" /> */}
        {[...Array(6)].map((_, index) => (
              <Skeleton.Button active size="large" className={`${isSmallScreen ? "pb-2" : ""} d-iblock pr-2`} key={"paxList"+index} />
          ))}
        
        <Flex gap={isLargeScreen ? 0 : 10} className={`${isSmallScreen ? "w-100" : ""} mt-4 cls-addSSRskeleton`} align='center' wrap={isSmallScreen}>
          {[...Array(2)].map((_, index) => (
            <Card className={`${isSmallScreen ? "w-100" : "w-50"} px-2 py-2 h-70`}>
              <Flex align='center'>
                <Skeleton.Button active size="default" className='w-15 h-50' key={"paxList"+index} />
                <Text className={`px-6 w-67`}>
                  <Skeleton.Button active size="default" className='w-100 h-19 pb-1' key={"paxList"+index} />
                  <Skeleton.Button active size="default" className='w-100 h-19' key={"paxList"+index} />
                </Text>
                <Skeleton.Button active size="small" className={`${isSmallScreen ? "w-10 px-3" : "w-18"} pb-2 h-30`} key={"paxList"+index} />  
              </Flex>
            </Card>
          ))}
        </Flex>
    </>
  );
};

export default AddSSRSkeleton;
