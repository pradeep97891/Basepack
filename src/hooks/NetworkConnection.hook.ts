import { useState } from "react";
import { useEventListener } from "./EventListener.hook";

/**
 * Custom hook to monitor network connection status.
 * @returns A boolean indicating whether the network is online.
 */
const NetworkConnection = () => {
  // State to store the current network connection status
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  useEventListener("online", () => setIsOnline(true));
  useEventListener("offline", () => setIsOnline(false));

  // Return the current network connection status
  return isOnline;
};

export default NetworkConnection;
