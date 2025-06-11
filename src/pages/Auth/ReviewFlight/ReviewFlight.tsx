import { Button, Col, Row, Typography } from "antd";
import "./ReviewFlight.scss";
import { useEffect, useState } from "react";
import { useAppSelector } from "../../../hooks/App.hook";
import { setReviewFlightDetail } from "../../../stores/ReviewFlight.store";
import { useDispatch } from "react-redux";
import PassengerDetails from "./PassengerDetails/PassengerDetails";
import PriceSummary from "./PriceSummary/PriceSummary";
import ItineraryHeader, {
  ItineraryHeaderProps,
} from "@/components/DescriptionHeader/DescriptionHeader";
import ItineraryReviewList from "@/components/ItineraryReviewList/ItineraryReviewList";
import { useTranslation } from "react-i18next";
import ReviewFlightSkeleton from "./ReviewFlight.skeleton";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { getDynamicDate } from "@/Utils/general";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useResize } from "@/Utils/resize";
const { Text } = Typography;

const ReviewFlight = () => {
  const { t } = useTranslation();
  const dispath = useDispatch();
  const { isSmallScreen } = useResize(1199);
  const { activePNRDetails } = useAppSelector(
    (state) => state.PNRReducer
  );
  const { reviewFlightDetail } = useAppSelector(
    (state) => state.ReviewFlightReducer
  );
  const options = activePNRDetails.paxInfo;
  const [pnrObject, setpnrObject] = useState({} as any);
  const {redirect} = useRedirect();

  const [ SfinalViewPnrData ] = useSessionStorage<any>("finalViewPNRData");
  var activePNR:any = SfinalViewPnrData;

  useEffect(() => {
    window.scroll(0, 0);
  });

  // To change the store value for editing flight details or returning to the previous page's details, use the following useEffect.
  useEffect(() => {
    if (reviewFlightDetail.isEdit) redirect("flightReschedule");
    dispath(setReviewFlightDetail(reviewFlightDetail));
  }, [dispath, reviewFlightDetail]);

  useEffect(() => {
    let pnrData = activePNR;
    if (pnrData?.length > 0) {
      setpnrObject(pnrData[0]);
    }
    // eslint-disable-next-line
  }, [activePNR]);

  let headerProps: ItineraryHeaderProps["data"] = {
    title: `${t("review_itinerary_changes")}`,
    description: `${t("review_itinerary_changes_description")}`,
  };
  // if (Object.keys(pnrObject).length !== 0) {
    headerProps = {
      ...headerProps,
      primaryHeading: 'pnr',
      primaryValue: activePNR[0]?.PNR,
      secondaryHeading: 'dateOfBooking',
      secondaryValue: `${activePNR[0]?.dateOfBooking.split(" ")[1]}, ${getDynamicDate(activePNR[0]?.dateOfBooking.split(" ")[0]) as string} ${activePNR[0]?.dateOfBooking.split(" ")[2]}`,
      breadcrumbProps: [
        // { 
        //   path: "/planB", 
        //   title: t("planb"), 
        //   breadcrumbName: "planB", 
        //   key: "Plan B"
        // },
        {
          path: "/viewPnrInfo",
          title: t("itinerary_details"),
          breadcrumbName: "viewPnrInfo",
          key: "Itinerary details"
        },
        {
          path: "/reviewflight",
          title: t("review_itinerary_changes"),
          breadcrumbName: "reviewflight",
          key: "Review itinerary changes"
        },
      ],
    };
  // }

  return (
    <>
      {activePNR ? (
        <Row className="cls-reviewflightchange-row" data-testid="reviewFlight">
          <Col span={24}>
            <Row>
              <Col span={24}>
                <ItineraryHeader data={headerProps} />
              </Col>
              <Col xs={24} xl={16} className="cls-edit-btn pr-6">
                <Button
                  type="text"
                  className="f-sbold mb-1"
                  icon={<Text className="Infi-Fd_48_EditFill"></Text>}
                  onClick={() => {
                    redirect("viewPnrInfo");
                  }}
                >
                  {t("edit_changes")}
                </Button>
              </Col>
            </Row>
            <Row justify="space-between" className="mt-2">
              <Col xs={24} lg={16} className={isSmallScreen ? "" : "pr-6"}>
                <ItineraryReviewList />
                <Row>
                  <Col span={24} className="cls-passenger-details mt-6">
                    <PassengerDetails options={options} />
                  </Col>
                </Row>
              </Col>
              <Col lg={8} className="cls-price-summary">
                <PriceSummary />
              </Col>
            </Row>
          </Col>
        </Row>
      ) : (
        <ReviewFlightSkeleton />
      )}
    </>
  );
};

export default ReviewFlight;
