import { render } from "@testing-library/react";
import { HelmetProvider } from "react-helmet-async";
import { useLocation } from "react-router-dom";
import { DocumentHead } from "./DocumentHead";
import { useAppSelector } from "@/hooks/App.hook"; // Assuming this is the custom hook for accessing the store

// Mock the useLocation hook to simulate pathname changes
jest.mock("react-router", () => ({
  ...jest.requireActual("react-router"),
  useLocation: jest.fn(),
}));

// Mock the useAppSelector hook to return dummy route data
jest.mock("@/hooks/App.hook", () => ({
  useAppSelector: jest.fn(),
}));

describe("DocumentHead Component", () => {
  const mockRoutes = [
    { path: "/", title: "Dashboard" },
    { path: "/planB", title: "Plan B" },
  ];

  beforeEach(() => {
    jest.clearAllMocks();

    // Mock the selector to return the dummy routes
    (useAppSelector as jest.Mock).mockReturnValue({
      Routes: mockRoutes,
      LandingRoutes: [],
    });
  });

  test("should update document title based on pathname", () => {
    // Mock the pathname returned by useLocation
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/" });

    render(
      <HelmetProvider>
        <DocumentHead />
      </HelmetProvider>
    );

    expect(document.title).toBe("Dashboard");
  });

  test("should update document title and description for specific path", () => {
    // Mock the pathname for a specific route
    (useLocation as jest.Mock).mockReturnValue({ pathname: "/planB" });

    render(
      <HelmetProvider>
        <DocumentHead />
      </HelmetProvider>
    );

    expect(document.title).toBe("Plan B");
  });
});
