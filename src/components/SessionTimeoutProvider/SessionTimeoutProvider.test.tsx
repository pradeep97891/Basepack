import { render, screen, fireEvent, act } from "@testing-library/react";
import SessionTimeoutProvider from "./SessionTimeoutProvider";
import { useAuth } from "@/hooks/Auth.hook";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import TestWrapper from "../CommonTestWrapper/CommonTestWrapper";

// Mock dependencies
// jest.mock("@/hooks/Auth.hook");
// jest.mock("react-router-dom", () => ({
//   useNavigate: jest.fn(), // Properly mock useNavigate
//   useLocation: jest.fn(() => ({ pathname: "/planB" })), // Example pathname
// }));
// jest.mock("react-i18next", () => ({
//   useTranslation: () => ({ t: (key: string) => key }),
// }));
// jest.mock("@/hooks/BrowserStorage.hook", () => ({
//   useLocalStorage: jest.fn(),
// }));
// jest.mock("../ConfirmModalPopup/ConfirmModalPopup", () => ({
//   __esModule: true,
//   default: ({ onData }: any) => (
//     <button data-testid="ConfirmModalPopup" onClick={() => onData(true)} />
//   ),
// }));

describe("SessionTimeoutProvider", () => {
  // const setUpMocks = (authProps: any, storageData: any) => {
  //   (useAuth as jest.Mock).mockReturnValue(authProps);
  //   (useLocalStorage as jest.Mock).mockReturnValue(storageData);
  // };

  // const mockProps = {
  //   exemptedRoutes: ["/login", "/dashboard"],
  // };

  // const renderComponent = (authProps: any, storageData: any) => {
  //   return render(
  //     <SessionTimeoutProvider {...mockProps}>
  //       <div>Test Content</div>
  //     </SessionTimeoutProvider>
  //   );
  // };

  // beforeEach(() => {
  //   jest.clearAllMocks();
  //   jest.useFakeTimers(); // Use fake timers for timeouts
  // });

  // afterEach(() => {
  //   jest.runOnlyPendingTimers();
  //   jest.useRealTimers(); // Return to real timers
  // });

  it("renders session provider", async () => {
    render(
      <TestWrapper>
        <SessionTimeoutProvider children={undefined} exemptedRoutes={[]} />
      </TestWrapper>
    );
    expect(await screen.findByTestId("ConfirmModalPopup")).toBeInTheDocument();
  });
  

  // it("renders children correctly", () => {
  //   setUpMocks({ isAuthenticated: true, logout: jest.fn() }, [0, jest.fn(), jest.fn()]);
  //   const { getByText } = renderComponent({ isAuthenticated: true }, [0, jest.fn(), jest.fn()]);
  //   expect(getByText("Session expired")).toBeInTheDocument();
  // });

  // it("should display the session expired popup after timeout", async () => {
  //   const mockLogout = jest.fn();
  //   setUpMocks(
  //     { isAuthenticated: true, logout: mockLogout },
  //     [Date.now() - 25 * 60 * 1000, jest.fn(), jest.fn()] // Session start time set to expire
  //   );

  //   renderComponent({ isAuthenticated: true }, [0, jest.fn(), jest.fn()]);

  //   // Advance timers to trigger the session timeout
  //   act(() => {
  //     jest.advanceTimersByTime(30 * 60 * 1000); // Advance 30 minutes to simulate timeout
  //   });

  //   // Check if the modal is displayed
  //   expect(await screen.findByTestId("ConfirmModalPopup")).toBeInTheDocument();

  //   // Simulate clicking the modal to confirm
  //   act(() => {
  //     fireEvent.click(screen.getByTestId("ConfirmModalPopup"));
  //   });

  //   // Assert the logout function is called
  //   expect(mockLogout).toHaveBeenCalled();
  // });

  // it("should reset session timeout on user activity", () => {
  //   const setSStartMock = jest.fn();
  //   const clearTimeoutMock = jest.spyOn(window, "clearTimeout");
  //   const setTimeoutMock = jest.spyOn(window, "setTimeout");

  //   setUpMocks(
  //     { isAuthenticated: true, logout: jest.fn() },
  //     [Date.now(), jest.fn(), jest.fn()] // Active session
  //   );

  //   renderComponent({ isAuthenticated: true }, [0, setSStartMock, jest.fn()]);

  //   // Simulate user activity
  //   act(() => {
  //     fireEvent.mouseMove(window);
  //   });

  //   // Ensure timers were cleared and reset
  //   expect(clearTimeoutMock).toHaveBeenCalled();
  //   expect(setTimeoutMock).toHaveBeenCalled();
  //   expect(setSStartMock).toHaveBeenCalled();
  // });

  // it("should not set session timeout on exempted routes", () => {
  //   setUpMocks({ isAuthenticated: true, logout: jest.fn() }, [Date.now(), jest.fn(), jest.fn()]);

  //   const { queryByTestId } = renderComponent({ isAuthenticated: true }, [0, jest.fn(), jest.fn()]);

  //   // No modal should appear since we're on an exempted route
  //   expect(queryByTestId("ConfirmModalPopup")).toBeNull();
  // });

  // it("should log out user and redirect to login on popup confirmation", async () => {
  //   const mockLogout = jest.fn();
  //   const mockNavigate = jest.fn(); // Mock navigation

  //   (useNavigate as jest.Mock).mockReturnValue(mockNavigate); // Set mockNavigate inside the test

  //   setUpMocks(
  //     { isAuthenticated: true, logout: mockLogout },
  //     [Date.now(), jest.fn(), jest.fn()]
  //   );

  //   renderComponent({ isAuthenticated: true }, [0, jest.fn(), jest.fn()]);

  //   // Simulate clicking the modal to confirm logout
  //   act(() => {
  //     fireEvent.click(screen.getByTestId("ConfirmModalPopup"));
  //   });

  //   // Assert the logout function is called and the user is redirected
  //   expect(mockLogout).toHaveBeenCalled();
  //   expect(mockNavigate).toHaveBeenCalledWith("/login"); // Check if navigate is called with "/login"
  // });
});
