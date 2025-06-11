import "./PrePlannedDisruptionList.scss";
import { Button, Col, Row } from "antd";
import DescriptionHeader from "@/components/DescriptionHeader/DescriptionHeader";
import { ItineraryHeaderProps } from "@/components/DescriptionHeader/DescriptionHeader";
import { useTranslation } from "react-i18next";
import EmptyData from "@/components/Empty/EmptyData";
import Advertisement from "@/components/Advertisement/Advertisement";
import DisruptedPnrList from "./PrePlannedDisruptedPNRList/PrePlannedDisruptedPNRList";
import { useToggle } from "@/hooks/Toggle.hook";
import { useLocation } from "react-router";
import { useEffect } from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useDispatch } from "react-redux";
import { updateActivePNR } from "@/stores/Pnr.store";
import { useRedirect } from "@/hooks/Redirect.hook";

const PrePlannedDisruptionList: React.FC = () => {
  const { t } = useTranslation();
  /* Sync PNR modal states */
  // eslint-disable-next-line
  const [isModalOpen, toggleModal] = useToggle(false);
  const [, , SremoveAdhocFlightPNRs] =
    useSessionStorage<any>("adhocFlightPNRs");
  const { isCurrentPathEqual } = useRedirect();
  // const [, , SremoveFormData] = useSessionStorage<any>("formData");
  const [, , SremoveFinalViewPnrData] =
    useSessionStorage<any>("finalViewPNRData");
  const dispatch = useDispatch();
  const user: any = localStorage.getItem(
    process.env.REACT_APP_STORAGE_PREFIX + "user"
  );
  let userRole: any;
  const decodedUser = atob(user);
  let user_local: any;
  try {
    user_local = JSON.parse(decodedUser);
    if (user_local?.groups?.length) {
      userRole = user_local.groups
        .find((group: string) => group.includes("fdms"))
        .split("_")
        .splice(1)
        .join(" "); // Split the string into an array of word
      userRole = userRole.charAt(0).toUpperCase() + userRole.substring(1);
    }
  } catch (error) {
    console.error("Failed to parse JSON:", error, decodedUser);
  }

  // Setting header props to pass to the header component
  let headerProps: ItineraryHeaderProps["data"] = {
    title:
      (isCurrentPathEqual("adhocPnrList")
        ? t("adhoc") + " " + t("pnr")
        : userRole == "Service executive" 
          ? "Disrupted PNR list"
          : t("pre_planned")) + " "+
      (userRole === "Service executive"
        ? ""
        :  t("disruption_list").toLowerCase()),
    description: t("preplanned_disruption_list_description"),
    breadcrumbProps: [
      {
        path: isCurrentPathEqual("adhocPnrList") ? "/adhoc" : "/dashboard",
        title: isCurrentPathEqual("adhocPnrList")
          ? t("adhoc") + " " + t("disruption_list").toLowerCase()
          : t("dashboard"),
        breadcrumbName: isCurrentPathEqual("adhocPnrList")
          ? "Adhoc Disruption list"
          : "Dashboard",
        key: isCurrentPathEqual("adhocPnrList")
          ? "Disruption list"
          : "Dashboard",
      },
      {
        path: isCurrentPathEqual("adhocPnrList")
          ? "/adhocPnrList"
          : "/prePlanned",
        title:
          (isCurrentPathEqual("adhocPnrList")
            ? t("adhoc") + " " + t("pnr")
            : userRole == "Service executive" 
          ? "Disrupted PNR list"
          : t("pre_planned")) + " "+
      (userRole === "Service executive"
        ? ""
        :  t("disruption_list").toLowerCase()),
        breadcrumbName: isCurrentPathEqual("adhocPnrList")
          ? "Adhoc PNR disruption list"
          : "Pre-planned disruption list",
        key: "Disruption list",
      },
    ],
  };

  useEffect(() => {
    dispatch(updateActivePNR([]));
    SremoveFinalViewPnrData();
    window.scroll(0, 0);
  }, []);

  const isPnrSynced = true;

  // useEffect(() => {
  //   return () => {
      // SremoveAdhocFlightPNRs();
  //   };
  // }, []);

  return (
    <>
      <Row
        className="cls-disruption-list"
        justify="space-between"
        data-testid="prePlannedDisruptionList"
      >
        <Col lg={isPnrSynced ? 24 : 18} xs={24}>
          <Row className="cls-view-pnr-list">
            <Col span={24}>
              <DescriptionHeader data={headerProps} />
            </Col>
            <Col span={24}>
              <Row align="middle" justify="center" className="cls-pnr-list">
                <Col span={24} className="cls-pnr-not-found">
                  {isPnrSynced ? (
                    <DisruptedPnrList />
                  ) : (
                    <Row justify="center" align="middle">
                      <Col span={24}>
                        <EmptyData content={t("no_pnr_found")} />
                      </Col>
                      <Col>
                        <Button
                          onClick={toggleModal}
                          type="primary"
                          className="cls-primary-btn-inverted f-med mt-3 px-4 py-2 fs-18"
                        >
                          {t("sync_pnr")}
                        </Button>
                      </Col>
                    </Row>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
        {/* <Col lg={isPnrSynced ? 0 : 4} xs={24}>
          <Row gutter={20} className="cls-advertisement-container">
            {[1, 2].map((element, index) => (
              <Col lg={24} xs={24} sm={12}>
                <Advertisement />
              </Col>
            ))}
          </Row>
        </Col> */}
      </Row>
    </>
  );
};

export default PrePlannedDisruptionList;
