import { useState } from "react";
import {
  Button,
  Col,
  Divider,
  Drawer,
  Radio,
  RadioChangeEvent,
  Row,
  Tooltip,
} from "antd";
import { CloseCircleOutlined } from "@ant-design/icons";
import "./ThemeChanger.scss";
import { useTheming } from "@/hooks/Theme.hook";
import { ThemeIcon, ThemePreviewIcon, ThemeChecked } from "../Icons/HeaderIcon";
import { useTranslation } from "react-i18next";
import { useLocalStorage, useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { ThemeContext } from "../ThemeManager/ThemeManager";
import CFG from "@/config/config.json";
import { GFThemeIcon, VAThemeIcon } from "../Icons/Icons";

const ThemeChanger = () => {
  const [themeCollapse, setThemeCollapse] = useState(false);
  const [showDrawer, setShowDrawer] = useState(false);
  const { t } = useTranslation();
  const [Llayout, LsetLayout, LremoveLayout] = useLocalStorage("layout");

  const changeLayout = (layoutName: string) => {
    layoutName === "Reset" ? LremoveLayout() : LsetLayout(layoutName);
    window.location.reload();
  };

  return (
    <div data-testid="ThemeChanger">
      <Tooltip title={t(t("theme_selector"))}>
        <Button
          data-testid="ThemeButton"
          type="link"
          className="cls-theme-selector"
          onClick={() => {
            setThemeCollapse(true);
            setShowDrawer(true);
          }}
        >
          <ThemeIcon />
        </Button>
      </Tooltip>
      {showDrawer && (
        <Drawer
          closable={false}
          placement="right"
          onClose={() => {
            setThemeCollapse(false);
            setTimeout(() => {
              setShowDrawer(false);
            }, 1000);
          }}
          open={themeCollapse}
        >
          <div className="ThemeChanger">
            <div className="flex-container mb-4 theme-header space-between">
              <h3 className="f-sbold mb-0 d-flex align-center">
                <ThemeIcon />
                {t("theme_settings")}
              </h3>
              <CloseCircleOutlined
                onClick={() => {
                  setThemeCollapse(false);
                  setTimeout(() => {
                    setShowDrawer(false);
                  }, 1000);
                }}
                style={{ color: "#FF4646", fontSize: "20px" }}
              />
            </div>
            <div className="cls-theme-change">
              <p>{t("theme")}</p>
              <TempThemeChanger />
            </div>
            {/* <div className="notification flex-container">
              <h3 className="f-sbold">{t("notifications")}</h3>
              <Switch />
            </div> */}
            <Row className="my-3">
              <Col className="f-sbold"> {t("select_layout")} </Col>
            </Row>
            <Radio.Group
              className="cls-layout-group"
              onChange={(e: RadioChangeEvent) => changeLayout(e.target.value)}
              defaultValue={Llayout ? Llayout : "HomeLayout"}
            >
              <Radio.Button value="HomeHorizontalLayout">{t("horizontal_layout")}</Radio.Button>
              <Radio.Button value="HomeLayout">{t("vertical_layout")}</Radio.Button>
            </Radio.Group>
          </div>
        </Drawer>
      )}
    </div>
  );
};

const TempThemeChanger = () => {
  const { changeTheme } = useTheming();
  const { t } = useTranslation();
  const [Ltheme] = useLocalStorage("theme");
  const [SairlineCode, SsetAirlineCode] = useSessionStorage("airlineCode");
  const handleTheme = (e: RadioChangeEvent) => {
    if (SairlineCode !== e.target.value && e.target.value.length === 2) {
      SsetAirlineCode(e.target.value);
      window.location.reload();
    } else {
      changeTheme(e.target.value);
    }
  };

  return (
    <>
      <Radio.Group onChange={handleTheme} defaultValue={Ltheme}>
        <Radio.Button value="default">
          <ThemePreviewIcon color="#CDDDF5" />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
        <Radio.Button className="dark" value="dark">
          <ThemePreviewIcon color="#4B5284" />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
      </Radio.Group>
      <Divider />
      <Row className="my-3">
        <Col className="f-sbold"> {t("airline_theme")} </Col>
      </Row>
      <Radio.Group onChange={handleTheme} defaultValue={SairlineCode ? SairlineCode : CFG.airline_code}>
        <Radio.Button className="cls-airline-theme-logo" value="VA" title="Voyageraid">
          <VAThemeIcon />
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
        <Radio.Button className="cls-airline-theme-logo" value="GF" title="Gulf air">
          <GFThemeIcon/>
          <span className="checked-icon">
            <ThemeChecked />
          </span>
        </Radio.Button>
      </Radio.Group>
    </>
  );
};

export { ThemeChanger };
