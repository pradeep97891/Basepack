import { render, screen } from "@testing-library/react";
import PlanB from "./PlanB";
import { useAuth } from "@/hooks/Auth.hook";
import { useAppSelector } from "@/hooks/App.hook";

// Mock necessary dependencies
jest.mock("@/hooks/Auth.hook", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/App.hook", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/components/Logo/Logo", () => ({
  Logo: jest.fn(() => <div>Logo Component</div>),
}));

jest.mock("@/components/Header/Header", () => ({
  HeaderItems: jest.fn(() => <div>HeaderItems Component</div>),
}));

jest.mock("@/components/Menu/Menu", () => ({
  SideBar: jest.fn(() => <div>SideBar Component</div>),
}));

jest.mock("@/components/AccessibilityHeader/AccessibilityHeader", () => ({
  AccessibilityHeader: jest.fn(() => <div>AccessibilityHeader Component</div>),
}));

describe("Container Component", () => {
  const renderComponent = (props = {}) => {
    return render(<PlanB {...props}>Test Child Content</PlanB>);
  };

  beforeEach(() => {
    // Default mock implementation
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    (useAppSelector as jest.Mock).mockReturnValue({ user: { name: "testuser@example.com" } });
  });

  it("renders the AccessibilityHeader, Logo, and HeaderItems components", () => {
    renderComponent();
    expect(screen.getByText("AccessibilityHeader Component")).toBeInTheDocument();
    expect(screen.getByText("Logo Component")).toBeInTheDocument();
    expect(screen.getByText("HeaderItems Component")).toBeInTheDocument();
  });

  it("renders child content", () => {
    renderComponent();
    expect(screen.getByText("Test Child Content")).toBeInTheDocument();
  });

  it("renders the username properly (without email domain)", () => {
    renderComponent();
    expect(useAppSelector).toHaveBeenCalled();
    expect(useAppSelector).toHaveBeenCalledWith(expect.any(Function));
    expect(screen.queryByText("Testuser")).not.toBeInTheDocument();
  });

  it("renders the SideBar when the user is authenticated and screen width is large", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    // Mock media query for desktop view
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: false, // for desktop view
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderComponent();
    expect(screen.getByText("SideBar Component")).toBeInTheDocument();
  });

  it("does not render the SideBar when the user is authenticated but screen width is small", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: true });
    // Mock media query for mobile view
    window.matchMedia = jest.fn().mockImplementation(query => ({
      matches: true, // for mobile view
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    }));

    renderComponent();
    expect(screen.queryByText("SideBar Component")).not.toBeInTheDocument();
  });

  it("does not render the SideBar when the user is not authenticated", () => {
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });
    renderComponent();
    expect(screen.queryByText("SideBar Component")).not.toBeInTheDocument();
  });
});
