import { Empty } from "antd";
import {
  PieChart,
  Pie,
  Cell,
  Label,
  ResponsiveContainer,
  Legend,
  Tooltip,
} from "recharts";

// const data = [
//   { name: 'Inactive', value: 70 },
//   { name: 'Active', value: 130 },
// ];

// const renderLegend = (props:any) => {
//   const { payload } = props;

//   return (
//     <ul>
//       {payload.map((entry:any, index:number) => (
//         <li key={`item-${index}`}>{entry.value}</li>
//       ))}
//     </ul>
//   );
// };
interface IPieChartExample {
  data: IPieData[];
}
interface IPieData {
  name: string;
  value: number;
}
const PieChartExample = ({ data }: IPieChartExample) => {
  const COLORS = ["#FF9A32", "#6650C7"];

  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
    index,
  }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <g>
        <circle
          cx={x}
          cy={y}
          r="30"
          style={{ filter: "drop-shadow(1px 1px 4px #cccccc)" }}
          stroke="#ffffff"
          fill="#ffffff"
        ></circle>
        <text
          x={x}
          y={y - 5}
          fill="#000000"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {`${(percent * 100).toFixed(0)}%`}
        </text>
        <text
          x={x}
          y={y + 10}
          fontSize={11}
          fill="#636884"
          textAnchor="middle"
          dominantBaseline="central"
        >
          {name}
        </text>
      </g>
    );
  };
  const InnerLabel = () => {
    return (
      <g>
        <text
          x="50%"
          y="50%"
          fill="#3d405c"
          className="recharts-text recharts-label"
          textAnchor="middle"
        >
          <tspan alignmentBaseline="middle" fontSize="26">
            {data.reduce((total: any, val: any) => val.value + total, 0)}
          </tspan>
        </text>
        <text
          x="50%"
          y="60%"
          fill="#3d405c"
          className="recharts-text recharts-label"
          textAnchor="middle"
        >
          <tspan fontSize="16">Total templates</tspan>
        </text>
      </g>
    );
  };
  return (
    // eslint-disable-next-line react/jsx-no-useless-fragment
    <div data-testid="pieChart">
      {data[0]["value"] !== 0 || data[1]["value"] !== 0 ? (
        <ResponsiveContainer width="100%" height={350}>
          <PieChart width={300} height={300}>
            <Legend />
            <Tooltip />
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={renderCustomizedLabel}
              outerRadius={120}
              innerRadius={80}
              cornerRadius={40}
              paddingAngle={-20}
              fill="#8884d8"
              dataKey="value"
              isAnimationActive={false}
            >
              <Label content={<InnerLabel />} position="center"></Label>
              {data.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  stroke={COLORS[index % COLORS.length]}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <Empty />
      )}
    </div>
  );
};
export { PieChartExample };
