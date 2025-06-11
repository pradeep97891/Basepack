import { ReactNode } from "react";

export type themesType = "default" | "BW" | "BY" | "YB" | "dark";
export type configType = "global" | "component" | "custom" | "algorithm";

export interface ThemeManagerProps {
  children: ReactNode; // Use ReactNode to accept any type of children
}
/* Interface for ThemeContext, with optional custom config support */
export interface ThemeContextProps {
  selectedTheme: string;
  themeAlgorithm: string;
  setSelectedTheme: (theme: themesType) => void;
  setThemeAlgorithm: (algorithm: string) => void;
}

export type CSSVariables = {
  [key: string]: string;
};

export type ConfigKeyType = {
  global: CSSVariables;
  component: {
    [key: string]: {
      key: CSSVariables;
    };
  };
  custom: CSSVariables;
  algorithm: string;
};

export type AirlineThemeType = {
  default: ConfigKeyType;
  dark: ConfigKeyType;
  fonts?: CSSVariables;
};

export type GeneralThemeType = {
  BW: ConfigKeyType;
  BY: ConfigKeyType;
  YB: ConfigKeyType;
  general: CSSVariables;
};

export type CombinedThemeType = AirlineThemeType & GeneralThemeType;