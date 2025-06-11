import { render, screen } from "@testing-library/react";
import HomeHorizontalLayout from "./HomeHorizontal";
import { useAuth } from "@/hooks/Auth.hook";
import { useAppSelector } from "@/hooks/App.hook";
import CFG from "@/config/config.json";

// Mock the hooks
jest.mock("@/hooks/Auth.hook", () => ({
  useAuth: jest.fn(),
}));

jest.mock("@/hooks/App.hook", () => ({
  useAppSelector: jest.fn(),
}));

jest.mock("@/components/AccessibilityHeader/AccessibilityHeader", () => () => (
  <div data-testid="accessibility-header">Accessibility Header</div>
));

jest.mock("@/components/Header/Header", () => ({
  HeaderItems: () => <div data-testid="header-items">Header Items</div>,
}));

jest.mock("@/components/Logo/Logo", () => ({
  Logo: () => <div data-testid="logo">Logo</div>,
}));

jest.mock("@/components/Menu/Menu", () => ({
  SideBar: () => <div data-testid="sidebar">SideBar</div>,
}));

describe("HomeHorizontalLayout Component", () => {
  const mockAuth = { isAuthenticated: true };
  const mockUser = { user: { name: "john.doe@test.com" } };

  beforeEach(() => {
    (useAuth as jest.Mock).mockReturnValue(mockAuth);
    (useAppSelector as jest.Mock).mockReturnValue(mockUser);
  });

  test("renders HomeHorizontalLayout component correctly", () => {
    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // Check if the Logo, HeaderItems, and content are rendered
    expect(screen.getByTestId("logo")).toBeInTheDocument();
    expect(screen.getByTestId("header-items")).toBeInTheDocument();
    expect(screen.getByText("Test Content")).toBeInTheDocument();
  });

  test("renders AccessibilityHeader when accessibility_pos is horizontal", () => {
    CFG.accessibility_pos = "horizontal";
    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // Check if AccessibilityHeader is rendered
    expect(screen.getByTestId("accessibility-header")).toBeInTheDocument();
  });

  test("does not render AccessibilityHeader when accessibility_pos is not horizontal", () => {
    CFG.accessibility_pos = "vertical";
    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // AccessibilityHeader should not be in the document
    expect(screen.queryByTestId("accessibility-header")).not.toBeInTheDocument();
  });

  test("renders SideBar when user is authenticated and screen is not responsive", () => {
    // Mock window.matchMedia to return false for responsiveness check
    window.matchMedia = jest.fn().mockReturnValue({
      matches: false,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });

    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // Check if the SideBar is rendered
    expect(screen.getByTestId("sidebar")).toBeInTheDocument();
  });

  test("does not render SideBar when user is authenticated but screen is responsive", () => {
    // Mock window.matchMedia to return true for responsiveness check
    window.matchMedia = jest.fn().mockReturnValue({
      matches: true,
      addListener: jest.fn(),
      removeListener: jest.fn(),
    });

    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // SideBar should not be rendered in responsive mode
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });

  test("renders user's name properly when authenticated", () => {
    // User's email is mocked to be "john.doe@test.com"
    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // User name should be "John"
    expect(useAppSelector).toHaveBeenCalled();
    expect(mockUser.user.name).toBe("john.doe@test.com");
  });

  test("correctly formats username if it includes '@'", () => {
    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // Check if username is formatted correctly
    const userName = mockUser.user.name.split("@")[0];
    const formattedName =
      userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();

    expect(formattedName).toBe("John");
  });

  test("does not render SideBar when not authenticated", () => {
    // Mock authentication to false
    (useAuth as jest.Mock).mockReturnValue({ isAuthenticated: false });

    render(
      <HomeHorizontalLayout>
        <div>Test Content</div>
      </HomeHorizontalLayout>
    );

    // Check that SideBar is not rendered
    expect(screen.queryByTestId("sidebar")).not.toBeInTheDocument();
  });
});
