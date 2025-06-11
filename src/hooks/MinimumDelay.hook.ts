import { useState, useEffect } from "react";

/**
 * Custom hook to ensure a smoother and more organized loading experience by delaying.
 * @returns A boolean indicating whether the delay is over or not.
 */
const useMinimumDelay = (delay: number) => {
  const [isDelayComplete, setIsDelayComplete] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDelayComplete(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [delay]);

  return isDelayComplete;
};

export default useMinimumDelay;
