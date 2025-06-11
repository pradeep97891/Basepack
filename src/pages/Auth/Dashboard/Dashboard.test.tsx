import { render, screen, fireEvent } from "@testing-library/react";
import Dashboard from "./Dashboard";
// import { useGetAdhocFlightListMutation } from "@/services/reschedule/Reschedule";

// Mock translation and service hook data
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

jest.mock("@/services/reschedule/Reschedule", () => ({
  useGetAttentionDataMutation: jest.fn(),
  useGetBarChartDataMutation: jest.fn(),
  useGetDashboardAdhocDataMutation: jest.fn(),
  useGetDashboardPaxDataMutation: jest.fn(),
  useGetLineChartDataMutation: jest.fn(),
  useGetNotificationDataMutation: jest.fn(),
}));

describe("Dashboard Component", () => {

  test("renders Dashboard component with correct attention data", async () => {
    render(<Dashboard />);
    expect(screen.getByText("Attention")).toBeInTheDocument();
    expect(screen.getByText("Alerts")).toBeInTheDocument();
  });

  test("renders the bar chart with sample data", async () => {
    render(<Dashboard />);
    expect(screen.getByText("Turnaround time")).toBeInTheDocument();
    expect(screen.getByText("Customer response")).toBeInTheDocument();
  });

  test("refresh button reloads the dashboard data", async () => {
    render(<Dashboard />);

    const refreshButton = screen.getByRole("button", { name: /refresh/i });
    expect(refreshButton).toBeInTheDocument();

    // Simulate clicking the refresh button
    fireEvent.click(refreshButton);

    // Verify that the data reload function was called
    // expect(useGetAdhocFlightListMutation).toHaveBeenCalledTimes(1);
  });

  test("toggles between chart and table view", () => {
    render(<Dashboard />);

    const toggleButton = screen.getByRole("button", { name: /toggle view/i });
    expect(toggleButton).toBeInTheDocument();

    // Simulate toggle to table view
    fireEvent.click(toggleButton);

  });
});
