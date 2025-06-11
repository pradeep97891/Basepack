import { useState } from "react";

/**
 * Custom hook to toggle a boolean state.
 * @param initialValue The initial boolean value of the toggle state, defaulting to false.
 * @returns An array containing the current boolean value and a function to toggle it.
 */
const useToggle = (initialValue: boolean = false): [boolean, () => void] => {
  const [value, setValue] = useState<boolean>(initialValue);

  /**
   * Function to toggle the boolean state.
   */
  const toggle = () => setValue((prevValue) => !prevValue);

  return [value, toggle];
};

export { useToggle };

/* Usage in components */
// const [isModalOpen, toggleModal] = useToggle(false);
