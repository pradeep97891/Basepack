import css from "./Loader.module.scss";
import { memo } from "react";
import CFG from "@/config/config.json";
import { useTranslation } from "react-i18next";
import { useLocalStorage, useSessionStorage } from "@/hooks/BrowserStorage.hook";

interface LoaderProps {
  fallback?: boolean;
}

const Loader = memo(({ fallback }: LoaderProps) => {
  
  const { t } = useTranslation();
  const [Ltheme] = useLocalStorage('theme');
  const [SairlineCode] = useSessionStorage("airlineCode");

  const Loader = memo(() => {
    const dynamicImagePath = require(
      `@/plugins/${SairlineCode ? SairlineCode : CFG.airline_code}/assets/loader.gif`
    );
    return (
      <div data-testid="loader" className={css["container"]}>
        <div className={css["loader"]} >
          <span className="d-block w-100 text-center">
            <img src={dynamicImagePath} alt="Loader" width={125}></img>
            <span className="d-block fs-16 f-med p-clr" style={{marginTop: "-15px"}}>{t("please_wait")}</span>
          </span>
        </div>
      </div>
    );
  });

  return fallback ? <Loader /> : null;
});

export { Loader };
