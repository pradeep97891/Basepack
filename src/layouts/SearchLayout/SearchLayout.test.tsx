import { render, screen } from "@testing-library/react";
import SearchLayout from "./SearchLayout";
import { BrowserRouter as Router } from "react-router-dom";
import Testwrapper from '@/components/CommonTestWrapper/CommonTestWrapper';

// Mock components
jest.mock("@/components/Header/Header", () => ({
  HeaderItems: jest.fn(() => <div>Header Items Component</div>),
}));

jest.mock("@/components/AccessibilityHeader/AccessibilityHeader", () => ({
  __esModule: true,
  default: jest.fn(() => <div>Accessibility Header Component</div>),
}));

jest.mock("@/components/Logo/Logo", () => ({
  Logo: jest.fn(() => <div>Logo Component</div>),
}));

describe("SearchLayout Component", () => {
  const renderComponent = () =>
    render(
      <Router>
        <Testwrapper>
            <SearchLayout children={undefined} />
        </Testwrapper>
      </Router>
    );

  it("renders AccessibilityHeader component", () => {
    renderComponent();
    expect(
      screen.getByText("AccessibilityHeader Component")
    ).toBeInTheDocument();
  });

  it("renders HeaderItems and Logo components", () => {
    renderComponent();
    expect(screen.getByText("Accessibility")).toBeInTheDocument();
  });

});
