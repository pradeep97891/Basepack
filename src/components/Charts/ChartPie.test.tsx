import { render, screen } from "@testing-library/react";
import CommonTestWrapper from "../CommonTestWrapper/CommonTestWrapper";
import { PieChartExample } from "./ChartPie";

it("renders PieChart", () => {
  render(
    <CommonTestWrapper>
      <PieChartExample
        data={[
          { name: "test1", value: 1 },
          { name: "test2", value: 1 },
        ]}
      />
    </CommonTestWrapper>
  );
  expect(screen.getByTestId("pieChart")).toBeInTheDocument();
});
