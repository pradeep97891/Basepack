import { Col, Tooltip } from "antd";
import "./Logo.scss";
import CFG from "@/config/config.json";
import { useTranslation } from "react-i18next";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTheming } from "@/hooks/Theme.hook";

const DEFAULT_AIRLINE = "VA";

const Logo = (props: any) => {
  const { t } = useTranslation();
  const [SairlineCode] = useSessionStorage("airlineCode");
  let dynamicImagePath: string;
  
  try {
    dynamicImagePath = require(`@/plugins/${ SairlineCode ? SairlineCode : CFG.airline_code}/assets/images/logo.svg`);
  } catch {
    console.error(`Error loading logo for airline ${SairlineCode ? SairlineCode : CFG.airline_code}`);
    dynamicImagePath = require(`@/plugins/${DEFAULT_AIRLINE}/assets/images/logo.svg`);
  }

  return (
    <Col data-testid="logo" className="cls-logo-comp" xs={16} lg={10}>
      <Tooltip
        title={t("home")}
        className="cls-cursor-pointer"
      >
        <a href="/" className="cls-logo-anchor">
          <img src={dynamicImagePath} className={`${SairlineCode}`} alt={t("logo")} />
        </a>
      </Tooltip>
    </Col>
  );
};

export { Logo };
