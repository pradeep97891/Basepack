/**
 * Custom hook for debouncing function calls.
 * Debouncing is a technique used to limit the rate at which a function is invoked.
 * @returns A debounced version of the provided function.
 */
const useDebounce = () => {
  /**
   * Debounce function that wraps the provided callback function.
   * @param callBack The function to be debounced.
   * @param timeout The debounce timeout duration in milliseconds (default: 300).
   * @returns A debounced version of the provided callback function.
   */
  const debounce = (callBack: any, timeout = 300) => {
    let time: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(time); // Clear any existing timeout

      time = setTimeout(() => callBack(...args), timeout);
    };
  };

  return debounce;
};

export { useDebounce };
