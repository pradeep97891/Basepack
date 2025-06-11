import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import TableTab from "./TableTab";

// Mock dependencies
jest.mock("antd", () => ({
  ...jest.requireActual("antd"),
  Button: jest.fn((props) => <button {...props}>{props.children}</button>),
  Dropdown: jest.fn(({ overlay, children }) => <div>{children}{overlay}</div>),
  Menu: jest.fn(({ children, onClick }) => <div>{children}</div>),
  MenuItem: jest.fn(({ children }) => <div>{children}</div>),
}));

describe("TableTab", () => {
  const optionsMock = [
    { label: "Tab 1", value: "tab1" },
    { label: "Tab 2", value: "tab2" },
    { label: "Tab 3", value: "tab3" }
  ];

  const changeHandlerMock = jest.fn();
  const defaultProps = {
    options: optionsMock,
    changeHandler: changeHandlerMock,
    currentTab: "tab1",
  };

  const renderComponent = (props = {}) => {
    return render(<TableTab {...defaultProps} {...props} />);
  };

  it("renders with the given options", () => {
    renderComponent();

    expect(screen.getByText("Tab 1")).toBeInTheDocument();
    expect(screen.getByText("Tab 2")).toBeInTheDocument();
    expect(screen.getByText("Tab 3")).toBeInTheDocument();
  });

  it("calls the changeHandler when a tab is selected", () => {
    renderComponent();

    const tab2 = screen.getByText("Tab 2");
    fireEvent.click(tab2);

    expect(changeHandlerMock).toHaveBeenCalledWith("tab2");
  });
  
});
