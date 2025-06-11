import React from "react";
import { Empty, Typography } from "antd";
import { FdEmptyIcon } from "../Icons/Icons";
import './EmptyData.scss';

interface EmptyType {
  content: string;
}

const {Text} = Typography;

const EmptyData: React.FC<EmptyType> = (props: EmptyType) => {
  const { content } = props;
  return (
    <Empty
      data-testid="EmptyData"
      className="cls-empty"
      image={<FdEmptyIcon />}
      imageStyle={{ height: 400 }}
      description={<Text className="cls-empty-description fs-24 f-med">{content}</Text>}
    >
    </Empty>
  );
};

export default EmptyData;