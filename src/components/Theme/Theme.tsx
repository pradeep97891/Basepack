import { Radio, RadioChangeEvent, Tooltip, Typography } from "antd";
import "./Theme.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { useState } from "react";
import { useEffect } from "react";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";


const Theme = () => {
  const { t } = useTranslation();
  const { Text } = Typography;
  const { changeTheme } = useTheming();
  const [newTheme,setNewTheme] = useState(true);
  const [themeValue, setThemeValue] = useState();
  /* Localstorage theme value & handlers */
  const [Ltheme] = useLocalStorage('theme');

  useEffect(() => {
    setNewTheme(Ltheme === 'default' ? true : false) // eslint-disable-next-line
  }, [])
  
  return (
    <Tooltip title={t("theme_selector")}>
      <Radio.Group
        onChange={(e: RadioChangeEvent) => { 
          if(e.target.value === 'default'){
            setNewTheme(true);
          }else{
            setNewTheme(false);
          }
          changeTheme(e.target.value); setThemeValue(e.target.value);
        }}
        className="radioSwitch" value={themeValue}
      >
        <Radio.Button className={`${newTheme ?'cls-default-theme cls-radio-switch':"cls-radio-switch"}`} value="default">
          <Text className="cls-light-icon Infi-Fd_63_Light"></Text> Light
        </Radio.Button>
        <Radio.Button className={`${newTheme ?'cls-radio-switch':"cls-default-theme  cls-radio-switch"}`} value="dark">
          <Text className="cls-dark-icon Infi-Fd_64_Dark"></Text> Dark
        </Radio.Button>
      </Radio.Group>
    </Tooltip>
  );
};

export { Theme };