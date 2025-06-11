import { hydrateUserFromLocalStorage } from "@/Utils/user";
import { useAppSelector } from "@/hooks/App.hook";
import { useGetChartDataMutation } from "@/services/reschedule/Reschedule";
import { useContext, useEffect, useMemo } from "react"; // Replace import for useState
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
} from "recharts";
import { ThemeContext } from "@/components/ThemeManager/ThemeManager";

const ChartBar = () => {
  const [chartData, chartDataResponse] = useGetChartDataMutation<any>();
  const { chartTimeLine } = useAppSelector((state) => state.DashboardReducer);
  const adminUserRoles = ["reschedule_admin", "reschedule_airline_user"];
  const { selectedTheme } = useContext(ThemeContext);

  useEffect(() => {
    chartData([]);
  }, [chartData]);

  const user = hydrateUserFromLocalStorage();
  const userRole = useMemo(() => {
    const userRole = user?.groups.some((value) =>
      adminUserRoles.includes(value)
    )
      ? "AL"
      : "TA";
    return userRole;
    // eslint-disable-next-line
  }, [user]);

  const selectedData =
    chartDataResponse?.isSuccess && chartDataResponse?.data?.response?.data
    ? (chartDataResponse?.data as any)?.response?.data[0][userRole][0][chartTimeLine]
    : [];


  let rootStyles = (document.querySelector(":root") as any).style;
  useEffect(() => {
    // eslint-disable-next-line
    rootStyles = (document.querySelector(":root") as any).style;
  }, [selectedTheme]);

  return (
    <div data-testid="barChart">
      <BarChart
        width={900}
        height={330}
        data={selectedData}
        className="cls-barchart"
        margin={{
          top: 10,
          right: 10,
          left: 0,
          bottom: 10,
        }}
      >
        <CartesianGrid strokeDasharray="4 3" />
        <XAxis dataKey="name" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar
          barSize={10}
          dataKey="Accept"
          radius={3}
          legendType="rect"
          stackId="a"
          fill={rootStyles.getPropertyValue("--t-dashboard-barchart-accept")}
        />
        <Bar
          barSize={10}
          dataKey="Modify"
          radius={3}
          legendType="rect"
          stackId="a"
          fill={rootStyles.getPropertyValue("--t-dashboard-barchart-modify")}
        />
        <Bar
          barSize={10}
          dataKey="Reject"
          radius={3}
          legendType="rect"
          stackId="a"
          fill={rootStyles.getPropertyValue("--t-dashboard-barchart-reject")}
        />
      </BarChart>
    </div>
  );
};

export { ChartBar };