import { useTranslation } from "react-i18next";
import css from "./Title.module.scss";
import { useRedirect } from "@/hooks/Redirect.hook";

interface FormTitleProps {
  title: string;
  subTitle: string;
  clsName?: string;
  testId?: string;
}

const FormTitle = ({ subTitle, title, clsName, testId }: FormTitleProps) => {
  const { t } = useTranslation();
  const {isCurrentPathEqual} = useRedirect();
  const tempClass = clsName === undefined ? css["title"] : css[clsName];
  return (
    <div data-testid={testId} className={`${tempClass}  ${ isCurrentPathEqual("viewPnrInfo") ? css.cls_title_modal : '' }`}>
      <h1 className={`${css["title-head"]}`}>{t(title)}</h1>
      <p className={`${css["title-head-sub"]}`}>{t(subTitle)}</p>
    </div>
  );
};

export { FormTitle };
