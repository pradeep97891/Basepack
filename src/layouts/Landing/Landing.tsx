import { Col, Row, Typography } from "antd";
import css from "./Landing.module.scss";
import { useTranslation } from "react-i18next";
import { LandingLogo } from "@/components/Icons/HeaderIcon";
import { Logo } from "@/components/Logo/Logo";
import Language from "@/components/Language/Language";
import { Theme } from "@/components/Theme/Theme";
import Login from "@/pages/Unauth/Login/Login";
import CFG from "@/config/config.json";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";

const Text = Typography;

const Container = (props: any) => {
  const { t } = useTranslation();
  const [SairlineCode] = useSessionStorage("airlineCode");

  return (
    <Row className={`${css.container} ${css["h-100"]}`}>
      <Col
        className={`${css.containerImage} ${css[`container-image${SairlineCode ? SairlineCode : CFG.airline_code}`]} ${css["cls-landing-container"]}`}
        xs={24}
        sm={13}
        md={12}
      >
        <Row justify="center" align="top">
          <Col span={24} md={19} sm={20} lg={24}>
            <div
              className={`${
                !props.isPlanb
                  ? css.clsContentCenter
                  : css.clsContentCentermodal
              }`}
            >
              <LandingLogo airline={SairlineCode ? SairlineCode : CFG.airline_code} />
            </div>
            <Col
              className={`f-sbold  ${
                !props.isPlanb
                  ? css.cls_description_heading
                  : css.cls_description_headingmodal
              }`}
            >
              {t("login_registered_users_get_more_offers")}
            </Col>
            <Row>
              <Col
                span={18}
                offset={5}
                className={`  fs-21 ${css.cls_description_points} ${
                  props.isPlanb && css.cls_description_pointsmodal
                }`}
              >
                <ul
                  className={`${
                    !props.isPlanb ? css.cls_ul_points : css.cls_ul_points_modal
                  }`}
                >
                  {/* {landing_description?.map((item, index) => (
                    <li
                      key={index}
                      style={{ marginBottom: "15px" }}
                    >
                      {item}
                    </li>
                  ))} */}
                  <li> {t("view_cancel_reschedule_booking")} </li>
                  <li>
                    {" "}
                    {t("manage_cancellation_booking_view_booking_history")}{" "}
                  </li>
                  <li> {t("faster_booking_with_saved_travelers")} </li>
                  <li>
                    {" "}
                    {t("low_cancellation_fee_for_SME_business_customers")}{" "}
                  </li>
                </ul>
              </Col>
            </Row>
          </Col>
        </Row>
      </Col>
      <Col
        className={`${css.form} ${css["cls-login-container"]}`}
        xs={24}
        sm={24}
        md={12}
      >
        <Text className={`${css["cls-mob-logo"]}`}>
          <Logo airline={SairlineCode ? SairlineCode : CFG.airline_code} />
        </Text>
        <Row
          justify="center"
          align="top"
          className={`${css["container-wrapper"]} ${
            props.isPlanb ? css["container-wrapper-modal"] : ""
          }`}
        >
          {!props.isPlanb ? (
            <Row className={css["cls-right-container-header"]} justify="end">
              <Col className={css["cls-header-content"]}>
                <Theme />
                <Language />
              </Col>
            </Row>
          ) : (
            ""
          )}
          <Col span={20} md={20} sm={22} xs={22} lg={16}>
            {props?.isPlanb ? <Login /> : props.children}
          </Col>
        </Row>
      </Col>
    </Row>
  );
};

export default Container;
