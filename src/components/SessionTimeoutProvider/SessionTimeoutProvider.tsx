import { useAuth } from "@/hooks/Auth.hook";
import { useEventListener } from "@/hooks/EventListener.hook";
import React, { ReactNode, useCallback, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLocation } from "react-router-dom";
import ConfirmModalPopup from "../ConfirmModalPopup/ConfirmModalPopup";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

/**
 * SessionTimeoutProvider component to manage session timeouts based on user inactivity.
 * @param children - The child components to be rendered within this provider.
 * @param exemptedRoutes - The location paths that are exempted in session timeout.
 */
function SessionTimeoutProvider({
  children,
  exemptedRoutes,
}: {
  children: ReactNode;
  exemptedRoutes: string[];
}) {
  const location = useLocation();
  const {redirect} = useRedirect();
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const { isAuthenticated, logout } = useAuth();
  const { t } = useTranslation();
  const USER_EVENTS: string[] = ["mousemove", "keydown", "click", "scroll"];
  const [LsStart, LsetSStart, LremoveSStart] =
    useLocalStorage<number>("sStart");

  /* Popup data to show after session expired */
  const [popupData, setPopupData] = useState({
    modalName: "default",
    page: "sessionTimeout",
    header: t("session_expired"),
    description: t("session_expired_description"),
    modalToggle: false,
    modalClass: "",
    modalWidth: 540,
    secondaryBtn: { text: t("ok"), value: true },
    type: "default",
  });

  // Parse the session timeout from the environment variable, defaulting to 24mins (60 seconds) if not defined.
  const timeout: number =
    parseInt(
      process.env.REACT_APP_SESSION_TIMEOUT_MINS || "24",
      10 /* radix */
    ) * 60000;

  /**
   * Helper function to calculate the remaining timeout time
   */
  const getRemainingTime = () => {
    if (LsStart) {
      const elapsedTime = Date.now() - LsStart;
      return timeout - elapsedTime;
    }
    return timeout;
  };

  /**
   * Function to set the session start time
   */
  const setSessionStartTime = (setAnyway: boolean = false) => {
    if (setAnyway || !LsStart) {
      LsetSStart(Date.now());
      return true;
    }
    return false;
  };

  /**
   * Set the session start time if it doesn't exist in localStorage
   */
  useEffect(() => {
    if (
      !isAuthenticated ||
      exemptedRoutes?.includes(location.pathname) ||
      setSessionStartTime()
    )
      return;

    const remainingTime = getRemainingTime();
    if (remainingTime <= 0) {
      setPopupData((prev) => ({ ...prev, modalToggle: true }));
    } else {
      setSessionStartTime();
    }
  }, [isAuthenticated, exemptedRoutes, location.pathname]);

  /**
   * Handles resetting the session timeout whenever user activity is detected.
   * This function clears any existing timeout and sets a new one.
   */
  const handleWindowEvents = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    if (popupData.modalToggle) return;

    const remainingTime = getRemainingTime();
    if (remainingTime <= 0) {
      setPopupData((prev) => ({ ...prev, modalToggle: true }));
    } else {
      timeoutRef.current = setTimeout(() => {
        setPopupData({
          ...popupData,
          modalToggle: true,
        });
      }, remainingTime);

      setSessionStartTime(true); // Reset the session start time on user activity
    }
  }, [popupData, timeout]);

  // listen for specific window events to ensure user is still active
  useEventListener(USER_EVENTS, handleWindowEvents, window, isAuthenticated);

  /**
   * Effect hook to handle session timeout when the location changes.
   * Resets the session timeout on location change, except for exempted routes.
   */
  useEffect(() => {
    if (!isAuthenticated || exemptedRoutes?.includes(location.pathname)) return;

    handleWindowEvents();

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isAuthenticated, handleWindowEvents, location.pathname, exemptedRoutes]);

  /* Method to logout after user clicks 'ok' button from popup */
  const popupHandler = async (data: any) => {
    if (data) {
      await logout();
      redirect("login");
      setPopupData({ ...popupData, modalToggle: false });
    }
  };

  return (
    <>
      {children}
      <ConfirmModalPopup onData={popupHandler} props={popupData} />
    </>
  );
}

export default SessionTimeoutProvider;
