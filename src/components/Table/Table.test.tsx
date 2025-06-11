import { render, screen, fireEvent } from "@testing-library/react";
import TableDisplay from "./Table";
import { FdNoDataFound } from "../Icons/Icons";
import { Table } from "antd";
import { useTranslation } from "react-i18next";

// Mock dependencies
jest.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));
jest.mock("../Icons/Icons", () => ({
  FdNoDataFound: jest.fn(() => <div data-testid="no-data-icon">No Data</div>),
}));

describe("TableDisplay", () => {
  const columnsMock = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
    },
  ];

  const dataMock = [
    {
      key: "1",
      name: "John Brown",
      age: 32,
    },
    {
      key: "2",
      name: "Jim Green",
      age: 42,
    },
  ];

  const defaultProps = {
    data: dataMock,
    columns: columnsMock,
    pagination: {
      position: undefined, // Corrected to match TablePaginationPosition
      pageSize: 10,
    },
    selection: undefined,
    size: undefined,
    layout: undefined,
    scroll: { y: 300 },
    loading: false,
  };

  const renderTable = (props = {}) => {
    return render(<TableDisplay {...defaultProps} {...props} />);
  };

  it("renders table with data and columns", () => {
    renderTable();
    expect(screen.getByText("John Brown")).toBeInTheDocument();
    expect(screen.getByText("Jim Green")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
  });

  it("shows custom empty data message when no data is available", async () => {
    renderTable({ data: [] });
    await expect(screen.getByText("no_data_found")).toBeInTheDocument();
  });

  it("handles row selection when checkbox selection is enabled", () => {
    const mockSelectionHandler = jest.fn();
    renderTable({
      selection: {
        type: "checkbox",
        handler: mockSelectionHandler,
      },
    });

    const firstCheckbox = screen.getAllByRole("checkbox")[1];
    fireEvent.click(firstCheckbox);

    expect(mockSelectionHandler).toHaveBeenCalledWith(
      expect.any(Array)
    );
  });

  it("renders with the correct pagination position and page size", () => {
    renderTable({
      pagination: {
        position: ["bottomLeft"],
        pageSize: 1,
      },
    });
    const pageButtons = screen.getAllByRole("button");
    expect(pageButtons.length).toBe(2); // For page navigation (1, next)
  });

});
