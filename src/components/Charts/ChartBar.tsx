import { Empty } from "antd";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  LabelList,
} from "recharts";
import "./Charts.scss";

export interface SettingsWiseUsage {
  setting_name: string;
  total_api_request: number;
  email_instances: number;
  Sent?: number;
  Notsent?: number;
  sent?: number;
  not_sent?: number;
  total_api_request_data?: number;
}
interface IChartBar {
  data: SettingsWiseUsage[];
}

const ChartBar = ({ data }: IChartBar) => {
  let xaxisValue = 0;
  const chartData: SettingsWiseUsage[] = [];
  data.forEach((value: SettingsWiseUsage, index: number) => {
    if (value.email_instances !== 0) {
      xaxisValue =
        xaxisValue < value.email_instances ? value.email_instances : xaxisValue;
      chartData[chartData.length] = {
        ...value,
        total_api_request_data:
          value.total_api_request !== 0 ? value.total_api_request : 2000,
        Sent: Math.ceil(value.sent !== undefined ? value.sent : 0),
        Notsent: value.not_sent !== undefined ? value.not_sent : 0,
      };
    }
  });
  const xaxisValueLength = Math.trunc(xaxisValue / 4).toString().length;
  const xAxisCalcValue =
    xaxisValueLength === 3
      ? 10
      : xaxisValueLength === 4
      ? 100
      : xaxisValueLength === 5
      ? 1000
      : xaxisValueLength === 6
      ? 10000
      : 100;
  if (xaxisValue < 100) {
    xaxisValue = xaxisValue * 2;
    xaxisValue = Math.trunc(xaxisValue / 10 / 4) * 4 * 10;
  } else {
    let xaxisOneFourthValue = Math.trunc(xaxisValue / 4);
    const remainderValue =
      xAxisCalcValue - (xaxisOneFourthValue % xAxisCalcValue);
    xaxisOneFourthValue = xaxisOneFourthValue + remainderValue;
    xaxisValue = xaxisOneFourthValue * 5;
    const remainderLength = Math.trunc(xaxisValue).toString().length;
    const xaxisMultipleValue =
      remainderLength === 3 ? 100 : remainderLength === 4 ? 1000 : 10000;
    xaxisValue =
      (Math.trunc(xaxisValue / xaxisMultipleValue / 4) * 4 +
        Math.trunc(xaxisValue / xaxisMultipleValue / 4) +
        Math.trunc((xaxisValue / xaxisMultipleValue) % 4)) *
      xaxisMultipleValue;
  }
  const renderCustomizedLabel = (props: any) => {
    const { x, y, value } = props;
    const xAxis = x - 13;
    const yAxis = y + 12;
    const width = 40;
    const radius = 20;

    return (
      <g>
        <text
          x={xAxis + width / 2}
          y={yAxis - radius}
          fill="#000"
          textAnchor="middle"
          dominantBaseline="middle"
        >
          {value.toLocaleString("en-US")}
        </text>
      </g>
    );
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <div data-testid="chartbar">
      {chartData.length > 0 ? (
        <ResponsiveContainer className="cls-chartbar" width="100%" height={300}>
          <BarChart
            data-testid="barChart"
            width={50}
            height={50}
            data={chartData}
          >
            <CartesianGrid strokeDasharray="4 3" />
            <XAxis dataKey="setting_name" />
            <YAxis axisLine={true} tickLine={true} domain={[0, xaxisValue]} />
            <Tooltip />
            <Legend />
            <Bar barSize={13} dataKey="Sent" stackId="a" fill="#FFB175" />
            <Bar barSize={13} dataKey="Notsent" stackId="a" fill="#FF6363">
              <LabelList
                className="cls-chartbar-datalabel"
                content={renderCustomizedLabel}
              />
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      ) : (
        <Empty />
      )}
    </div>
  );
};

export { ChartBar };
