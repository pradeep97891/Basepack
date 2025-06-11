import Icon from "@ant-design/icons";
import { Tooltip, Typography } from "antd";
import "./SeatMap.scss";
import { Icons } from "../../../../components/Icons/Icons";
const Text = Typography.Text;

const SeatMap = (props: any) => {
  const toolTipData: string = props.data["seat_number"] + " : " + props.data["item"];
  let IconComponent;
  if (props?.selectedData?.length > 0) {
    for (let i: number = 0; i < props.selectedData.length; i++) {
      if (props.data["seat_number"] === props.selectedData[i]["seat_number"]) {
        IconComponent = Icons.get("FdSelectedSeatIcon");
        break;
      } else {
        IconComponent = Icons.get(props.data["icon"]);
      }
    }
  } else {
    IconComponent = Icons.get(props.data["icon"]);
  }
  
  return (
    <>
      { props.data?.mapping === false ?
          <Text>
            <Icon component={IconComponent} data-testid="seatMap" />
          </Text>
        :
          <Tooltip title={toolTipData} className="cls-seat-tooltip">
            <Text>
              <Icon component={IconComponent} data-testid="seatMap" />
            </Text>
          </Tooltip>
      }
    </>
  );
};
export default SeatMap;
