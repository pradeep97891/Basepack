import { render, screen, fireEvent } from "@testing-library/react";
import TableTabSearchFilter from "./TableTabSearchFilter";
import { useDebounce } from "@/hooks/Debounce.hook";

// Mock the necessary dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

jest.mock("@/hooks/Debounce.hook", () => ({
  useDebounce: jest.fn((fn) => fn),
}));

describe("TableTabSearchFilter", () => {
  const dataMock = [
    { name: "John Brown", status: "Active", scoreSet: "high" },
    { name: "Jim Green", status: "Inactive", scoreSet: "low" },
    { name: "Joe Black", status: "Active", scoreSet: "medium" },
  ];

  const searchFieldsMock = ["name", "status", "scoreSet"];
  const tableDataPreparationHandlerMock = jest.fn((item) => item);
  const setTableDataMock = jest.fn();

  const defaultProps = {
    data: dataMock,
    currentTab: "all",
    searchFields: searchFieldsMock,
    tableDataPreparationHandler: tableDataPreparationHandlerMock,
    setTableData: setTableDataMock,
  };

  const renderComponent = (props = {}) => {
    return render(<TableTabSearchFilter tabDataKey={""} {...defaultProps} {...props} />);
  };

  it("renders the input component with default placeholder", () => {
    renderComponent();
    expect(screen.getByPlaceholderText("search")).toBeInTheDocument();
  });

  it("renders the input component with a custom placeholder", () => {
    renderComponent({ placeholder: "Search data..." });
    expect(screen.getByPlaceholderText("Search data...")).toBeInTheDocument();
  });

  it("handles empty data gracefully", () => {
    renderComponent({ data: [], currentTab: "all" });
    expect(setTableDataMock).toHaveBeenCalledWith([]);
  });
});
