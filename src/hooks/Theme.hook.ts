import { useContext } from "react";
import { ThemeContext } from "../components/ThemeManager/ThemeManager";
import { themesType } from "../components/ThemeManager/ThemeManagerTypes";

/**
 * Custom hook for handling theme changes.
 * @returns An object containing the currently selected theme and a function to change the theme.
 */
const useTheming = () => {
  const { selectedTheme, setSelectedTheme } = useContext(ThemeContext);

  /**
   * Function to change the theme.
   * @param theme The theme type to set as the selected theme.
   */
  const changeTheme = (theme: themesType) => 
    
    setSelectedTheme(theme);

  return { selectedTheme, changeTheme };
};

export { useTheming };
