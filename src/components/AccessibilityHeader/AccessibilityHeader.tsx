import { Button, Col, Row, Typography } from "antd";
import "./AccessibilityHeader.scss";
import { useTheming } from "@/hooks/Theme.hook";
import CFG from "@/config/config.json";
import { themesType } from "../ThemeManager/ThemeManagerTypes";
const { Text } = Typography;

const AccessibilityHeader = () => {
  const { changeTheme, selectedTheme } = useTheming();

  // For focusing back to accessibility menu item
  const focusBack = (e: React.KeyboardEvent) => {
    if (
      e.key === "Tab" &&
      e.shiftKey &&
      !!document.getElementsByClassName("cls-accessibility")[0]
    ) {
      e.preventDefault();
      const element = document.getElementsByClassName(
        "cls-accessibility"
      )[0] as HTMLElement;
      element && element.focus();
    }
  };

  // For focusing next to accessibility menu item
  const focusNext = (e: React.KeyboardEvent) => {
    if (
      e.key === "Tab" &&
      !(e.key === "Tab" && e.shiftKey) &&
      !!document.getElementsByClassName("cls-accessibility")[0]
    ) {
      e.preventDefault();
      const element = document.getElementsByClassName("cls-accessibility")[0]
        .nextElementSibling as HTMLElement;
      element && element.focus();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    changeTheme(e.currentTarget.value as themesType);
  };

  // Get the root styles to read custom properties
  const rootStyles = getComputedStyle(document.documentElement);
  // Default zoom level based on device pixel ratio
  const defaultZoom = window.devicePixelRatio;
  const maxIncrease =
    parseInt(rootStyles.getPropertyValue("--FONTMAXINCREASE"), 10) || 2;
  const maxDecrease =
    parseInt(rootStyles.getPropertyValue("--FONTMAXDECREASE"), 10) || 2;

  // Extend the CSSStyleDeclaration interface to include the zoom property
  interface CSSStyleDeclaration {
    zoom?: string | number;
  }

  // Function to increase font size
  const increaseFontSize = () => {
    // Get the current zoom level from a data attribute or a global variable
    let currentZoom =
      parseFloat((document.body.style as CSSStyleDeclaration).zoom as string) ||
      defaultZoom;
    // Check if maximum increase limit is reached
    if (currentZoom < defaultZoom + maxIncrease * 0.1) {
      currentZoom += 0.1;
      (document.body.style as CSSStyleDeclaration).zoom = currentZoom;
    }
  };

  // Function to decrease font size
  const decreaseFontSize = () => {
    // Get the current zoom level from a data attribute or a global variable
    let currentZoom =
      parseFloat((document.body.style as CSSStyleDeclaration).zoom as string) ||
      defaultZoom;
    // Check if maximum decrease limit is reached
    if (currentZoom > defaultZoom - maxDecrease * 0.1) {
      currentZoom -= 0.1;
      (document.body.style as CSSStyleDeclaration).zoom = currentZoom;
    }
  };

  // Function to reset font size to default
  const resetFontSize = () => {
    (document.body.style as CSSStyleDeclaration).zoom = defaultZoom;
  };

  const handleFsizeClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    const buttons = document.querySelectorAll(".cls-fsize button");
    buttons.forEach((btn) => {
      btn.classList.remove("active");
    });
    (e.currentTarget as HTMLButtonElement).classList.add("active");
  };

  // handle contrast theme change
  let rowClass = "cls-" + CFG.accessibility_pos,
    colWidth = 24;
  if (CFG.accessibility_pos !== "vertical") colWidth = 5;
  return (
    <Row
      className={`AccessibilityHeader ${rowClass}`}
      align="middle"
      data-testid="Accessibility"
    >
      <Col className="cls-contrast-cont" sm={colWidth}>
        Contrast :
        <Text className="custom-radio cls-contrast rounded">
          <Button
            className={`cls-default ${selectedTheme === "default" ? "active" : ""}`}
            type="text"
            value="default"
            onClick={handleClick}
            onKeyDown={focusBack}
          >
            Default
          </Button>
          <Button
            className={`cls-bw ${selectedTheme === "BW" ? "active" : ""}`}
            type="text"
            value="BW"
            onClick={handleClick}
          >
            A
          </Button>
          <Button
            className={`cls-by ${selectedTheme === "BY" ? "active" : ""}`}
            type="text"
            value="BY"
            onClick={handleClick}
          >
            A
          </Button>
          <Button
            className={`cls-yb ${selectedTheme === "YB" ? "active" : ""}`}
            type="text"
            value="YB"
            onClick={handleClick}
          >
            A
          </Button>
        </Text>
      </Col>
      <Col className="cls-fsize-cont" sm={colWidth}>
        Font size :
        <Typography.Text className="cls-fsize rounded d-block">
          <Button
            type="link"
            className="cls-default active"
            onClick={(e) => {
              handleFsizeClick(e);
              resetFontSize();
            }}
          >
            Default
          </Button>
          <Button
            type="link"
            className="text-dark px-1"
            onClick={(e) => {
              handleFsizeClick(e);
              decreaseFontSize();
            }}
          >
            A-
          </Button>
          <Button
            type="link"
            className="text-dark px-1"
            onClick={(e) => {
              handleFsizeClick(e);
              increaseFontSize();
            }}
            onKeyDown={focusNext}
          >
            A+
          </Button>
        </Typography.Text>
      </Col>
    </Row>
  );
};
export default AccessibilityHeader;
