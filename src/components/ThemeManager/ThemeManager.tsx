import React, {
  useState,
  createContext,
  useCallback,
  useLayoutEffect,
} from "react";
import { ConfigProvider, theme } from "antd";
import CFG from "@/config/config.json";
import {
  AirlineThemeType,
  CSSVariables,
  CombinedThemeType,
  GeneralThemeType,
  ThemeContextProps,
  ThemeManagerProps,
  configType,
  themesType,
} from "./ThemeManagerTypes";
import { useLang } from "@/hooks/Language.hook";
import { useLocalStorage, useSessionStorage } from "@/hooks/BrowserStorage.hook";

/* Enums for clarity and type safety */
enum ConfigTypes {
  GLOBAL = "global",
  COMPONENT = "component",
  CUSTOM = "custom",
  ALGORITHM = "algorithm",
}

/* Basic constants used across theme management */
const DEFAULT_AIRLINE: string = "VA";
const DEFAULT_THEME: themesType = "default";
const DEFAULT_ALGORITHM: "light" | "dark" = "light";
const LOCALSTORAGE_VAR: string = "theme";

/* Theme manager context */
export const ThemeContext = createContext<ThemeContextProps>({
  selectedTheme: DEFAULT_THEME,
  themeAlgorithm: DEFAULT_ALGORITHM,
  setSelectedTheme: () => {},
  setThemeAlgorithm: () => {},
});

/**
 * ThemeManager component manages the application's theme settings.
 * It combines airline-specific and general themes, applies theme changes,
 * and provides a context for theme-related data.
 * @param props ThemeManagerProps containing children components.
 * @returns A ConfigProvider component with theme settings applied.
 */
const ThemeManager: React.FC<ThemeManagerProps> = (props) => {
  /* Language hook */
  const { antdLangProvider } = useLang();
  const [Ltheme] = useLocalStorage('theme');
  const [SairlineCode] = useSessionStorage<string>("airlineCode");

  /* Load airline data on component mount */
  let airlineThemes: AirlineThemeType;
  let imgUrl: string;
  try {
    airlineThemes = require(`@/plugins/${SairlineCode ? SairlineCode : CFG.airline_code}/config/theme.json`);
    imgUrl = require(`@/plugins/${SairlineCode ? SairlineCode : CFG.airline_code}/assets/images/favicon.ico`);
  } catch {
    console.error(
      `Error loading logo and themes for airline ${SairlineCode ? SairlineCode : CFG.airline_code}`
    );
    airlineThemes = require(`@/plugins/${DEFAULT_AIRLINE}/config/theme.json`);
    imgUrl = require(`@/plugins/${DEFAULT_AIRLINE}/assets/images/favicon.ico`);
  }

  /* Set the favicon's href only if both favicon and imgUrl are available */
  const favicon = document.getElementById("favicon") as HTMLLinkElement | null;
  if (favicon && imgUrl) favicon.href = imgUrl;

  /* Get general themes from asset */
  const generalThemes: GeneralThemeType = require(`@/assets/theme/theme.json`);

  const isValidTheme = ["default", "dark", "fonts"].every(
    (key: string) => key in airlineThemes
  );

  /* Localstorage item to set current theme */
  const [LcurrentTheme, LsetCurrentTheme] = useLocalStorage(LOCALSTORAGE_VAR, DEFAULT_THEME);

  /* Set themes combing airline and general themes */ // eslint-disable-next-line
  const [themes, setThemes] = useState<CombinedThemeType>(
    isValidTheme
      ? {
          ...airlineThemes,
          ...generalThemes,
        }
      : require(`@/plugins/${DEFAULT_AIRLINE}/config/theme.json`)
  );

  /* Selected Airline */ // eslint-disable-next-line
  const [selectedAirline, setSelectedAirline] = useState<string>(
    SairlineCode ? SairlineCode : CFG.airline_code
  );

  /* Selected theme */
  const [selectedTheme, setSelectedTheme] = useState<themesType>(
    (LcurrentTheme as themesType) || DEFAULT_THEME
  );

  /* Theme config */ // eslint-disable-next-line
  const [globalConfig, setGlobalConfig] = useState<CSSVariables>(
    themes[selectedTheme]?.global
  );

  /* Component config */ // eslint-disable-next-line
  const [componentConfig, setComponentConfig] = useState<any>(
    themes[selectedTheme]?.component
  );

  /* Custom component config */ // eslint-disable-next-line
  const [customConfig, setCustomConfig] = useState<any>({});

  /* Theme algorithm */
  const [themeAlgorithm, setThemeAlgorithm] = useState<string>(
    themes[selectedTheme]?.algorithm
  );

  /* Applying styles based on configs on changing airline code or theme */
  useLayoutEffect(() => {
    Object.values(ConfigTypes).forEach((value: configType) => {
      const config = themes?.[selectedTheme]?.[value] || {};
      config && handleConfigChange(config, value);
      value === ConfigTypes.CUSTOM && setCustomVariables(config);
    });

    /* Setting general custom variables like fonts */
    setCustomVariables(themes?.fonts ? themes?.fonts : themes?.general);

    /* Updating selected theme in local storage */
    LsetCurrentTheme(selectedTheme as any);

    // eslint-disable-next-line
  }, [themes, selectedAirline, selectedTheme]);

  /* Improved config change handler with type safety */
  const handleConfigChange = useCallback(
    (newThemeConfig: configType | {}, configType: string) => {
      const configFunctions: any = {
        [ConfigTypes.GLOBAL]: setGlobalConfig,
        [ConfigTypes.COMPONENT]: setComponentConfig,
        [ConfigTypes.CUSTOM]: setCustomConfig,
        [ConfigTypes.ALGORITHM]: setThemeAlgorithm,
      };
      configFunctions[configType](newThemeConfig);
    },
    [setGlobalConfig, setComponentConfig, setCustomConfig, setThemeAlgorithm]
  );

  /* Utility function to update css root variable */ // eslint-disable-next-line
  const updateRootValueInDOM = (property: string, value: string) => {
    (document.querySelector(":root") as any).style.setProperty(property, value);
  };

  /* Improved and type-safe CSS variable setter */
  const setCustomVariables = useCallback(
    (config: configType | {}) => {
      for (const [property, value] of Object.entries(config)) {
        updateRootValueInDOM(property, value);
      }
    },
    [updateRootValueInDOM]
  );

  return (
    <ThemeContext.Provider
      value={{
        selectedTheme,
        setSelectedTheme,
        themeAlgorithm,
        setThemeAlgorithm,
      }}
    >
      {themes.hasOwnProperty(selectedTheme) && (
        <ConfigProvider
          theme={{
            token: themes[selectedTheme].global,
            components: themes[selectedTheme].component,
            algorithm:
              themeAlgorithm === DEFAULT_ALGORITHM
                ? theme.defaultAlgorithm
                : theme.darkAlgorithm,
            cssVar: true,
            hashed: false,
          }}
          locale={antdLangProvider}
        >
          {props.children}
        </ConfigProvider>
      )}
    </ThemeContext.Provider>
  );
};

export default ThemeManager;
