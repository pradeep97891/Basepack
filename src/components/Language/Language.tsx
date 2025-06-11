import { Select,Tooltip,Typography } from "antd";
import { useLang } from "@/hooks/Language.hook";
import CFG from "@/config/config.json";
import "./Language.scss";
import { useState } from "react";
import { useTranslation } from "react-i18next";

const {Text} = Typography;

const Language = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const { t } = useTranslation(); 
  const { lang, changeLang } = useLang();
  const changeLanguage = (value: string) => {
    changeLang(value);
  };

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  return (
    <>
      <div className="language" data-testid="lang">
        <Tooltip title={!isDropdownOpen ? t("language_selector") : ""}>
          <Select
            defaultValue={CFG.default_lang}
            value={lang}
            onChange={changeLanguage}
            suffixIcon={<Text className="Infi-Fd_04_DropdownArrow fs-10 cls-dropdown-icon"></Text>}
            style={{ width: 120 }}
            variant='borderless'
            onClick={toggleDropdown}
            open={isDropdownOpen}
          >
            {CFG.language.map((option) => (
              <Select.Option key={option.code} value={option.code} className="cls-language-option">
                  <img src={`/images/${option.flag}.svg`} alt="" />
                {option.text}
              </Select.Option>
            ))}
          </Select>
        </Tooltip>
      </div>
    </>
  );
};

export default Language;
