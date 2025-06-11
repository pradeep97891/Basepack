import { Badge, Button, Card, Col, Row, Typography, notification } from "antd";
import { useDispatch } from "react-redux";
import mealpack from "@/assets/images/addSSR/mealpack.png";
import {
  setSsrPNRData
} from "@/stores/Ssr.store";
import { CSSTransition } from 'react-transition-group';
import "./BaggageMealBox.scss";
import { useEffect, useState } from "react";
import CFG from "@/config/config.json";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";
import AddSSRSkeleton from "../AddSSR.skeleton";
import { useResize } from "@/Utils/resize";
const Text = Typography.Text;

const BaggageMealBox = (props: any) => {

  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResize(991);
  const [paxBaggageMealsName, setPaxBaggageMealsName] = useState('');
  const tabSelected = props.currentTab;
  const mealNameList: any = ['Kosher', 'Non Veg', 'Veg', 'Baby', 'Jain'];
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mealsList, setMealsList] = useState<any>();
  const [paxLength, setPaxLength] = useState<number>();
  const [loopData, setLoopData] = useState<any>([]);
  const [allPaxCheck, setAllPaxCheck] = useState<any>();
  const [, SsetSsrPNRData] = useSessionStorage<any>("ssrPNRData");

  useEffect(() => {
    setMealsList(
      props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.mealsList[0]
    );
    setTimeout(() => {
      setLoopData({
        baggage: props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.baggageList,
        meals: props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.mealsList[0]?.Kosher
      });
    }, 500);
    // eslint-disable-next-line
  }, []);

  const onChange = (value: any, index: any) => {
    setSelectedIndex(index);
    const text = value.target ? value?.target?.innerHTML : value;
    if (mealsList) {
      setLoopData((prev: any) => ({
        ...prev,
        meals: mealsList?.[text],
      }));
    }
  };

  const handleClick = (data: any) => {
    if (paxBaggageMealsName === undefined || paxBaggageMealsName === "") {
      notification.warning({
        key: 1,
        message: "Choose the passenger before choosing the " + tabSelected + ".",
        duration: 5
      });
      return false;
    }

    let value: any = [];
    let baggageData = (tabSelected === t("baggage")) ? {
      item: data.item,
      price: data.price,
      selected: true
    } : {};

    let mealsDetail = (tabSelected === t("meals")) ? {
      item: data.item,
      type: data.type,
      price: data.price,
      selected: true
    } : {};

    var pnrData = JSON.parse(JSON.stringify(props.pnrData));
    var paxSSRDataTemp = pnrData[0]?.paxInfo;
    var dataUpdateItem =
      tabSelected === t("baggage") ?
        paxSSRDataTemp.find((value: any) => (
          value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.item === "" &&
          value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isBaggageChecked === true
        )) :
        paxSSRDataTemp.find((value: any) => (
          value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.item === "" &&
          value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isMealsChecked === true
        ));

    tabSelected === t("baggage")
      ? (dataUpdateItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail = baggageData)
      : (dataUpdateItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail = mealsDetail);

    paxSSRDataTemp?.forEach((ssr: any) => {
      if (ssr.id === dataUpdateItem.id) {
        ssr = dataUpdateItem;
      }
      value.push(ssr);
    });
    value.sort((a: any, b: any) => {
      if (tabSelected === t("baggage")) {
        return a?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.selected - b?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.selected;
      } else {
        return a?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.selected - b?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.selected;
      }
    });
    pnrData[0].paxInfo = value;
    dispatch(setSsrPNRData({ value: pnrData }));
    SsetSsrPNRData(pnrData);
  };

  useEffect(() => {
    if (props.pnrData !== undefined) {
      let pnrData = JSON.parse(JSON.stringify(props.pnrData));
      let paxInfo = pnrData[0].paxInfo;
      var item = paxInfo.find((paxItem: any) => (
        tabSelected === t("baggage")
          ? (paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isBaggageChecked === true && paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.selected === false)
          : (paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isMealsChecked === true && paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.selected === false))
      );
      setPaxBaggageMealsName(!!item ? item?.passengerDetail?.firstName + " " + item?.passengerDetail?.lastName : "");
      // eslint-disable-next-line
      var allPaxSelected = paxInfo.filter((paxItem: any) => (
        tabSelected === t("baggage")
          ? (paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isBaggageChecked === true && paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.selected === true)
          : (paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isMealsChecked === true && paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.selected === true)));
      setAllPaxCheck(allPaxSelected);
      setPaxLength(paxInfo.length);
    }
    // eslint-disable-next-line
  }, [props.pnrData, props.tripIndex, tabSelected])

  return (
    <>
      <Card data-testid="baggageMealBox" className="cls-baggage-ele ml-5 mr-3 mb-4">
        {isSmallScreen ?
          <Text className="fs-15 f-bold d-block cls-fv-Passengers pt-2">
            {tabSelected}
          </Text>
          : <></>
        }
        {paxBaggageMealsName ? (
          <Text className="cls-select-seat-pax d-block">
            Select {tabSelected} for {paxBaggageMealsName}
          </Text>
        ) : (
          allPaxCheck && allPaxCheck.length !== paxLength ? (
            <Text className="cls-select-seat-pax d-block">
              {t("select_pax_msg")} {tabSelected.toLowerCase() === "baggage" ? t("baggage") : t("meals")}
            </Text>
          ) : (
            !isSmallScreen
              ? <Text className="d-iblock h-26"></Text>
              : <></>
          )
        )}
        {
          loopData?.baggage && loopData?.meals ?
            <>
              {tabSelected === t("baggage") ? (
                <CSSTransition
                  in={!!loopData?.baggage?.length}
                  timeout={600}
                  classNames="fade"
                  unmountOnExit
                >
                  <Row>
                    {loopData?.baggage?.map((value: any, index: number) => (
                      <Col xs={24} sm={12} lg={12} xl={12} key={`baggageMealData${index}`}>
                        <Row className={`pr-1 mt-3 mb-3 cls-booking-box pt-3 pb-3 pl-3 ${index % 2 !== 0 ? "ml-4" : ""}`}>
                          <Col xs={3} lg={5} xl={3}>
                            {value.item === '5kg'
                              ? <Text className="Infi-Fd_58_Baggage_5kg"></Text>
                              : value.item === '10kg'
                                ? <Text className="Infi-Fd_59_Baggage_10kg"></Text>
                                : value.item === '15kg'
                                  ? <Text className="Infi-Fd_60_Baggage_15kg"></Text>
                                  : value.item === '20kg'
                                    ? <Text className="Infi-Fd_61_Baggage_20kg"></Text>
                                    : <Text className="Infi-Fd_62_Baggage_25kg"></Text>
                            }
                          </Col>
                          <Col xs={5} lg={4} xl={4} className={`${isSmallScreen ? "fs-13 px-2" : "fs-16"} f-med pr-3 cls-baggage-weight text-right`}>
                            {value.item}
                          </Col>
                          <Col xs={10} lg={9} xl={10} className={`${isSmallScreen ? "fs-14 f-med" : "fs-16 f-reg"} pl-2`}>
                            {CFG.currency} {value.price}
                          </Col>
                          <Col
                            xs={5}
                            lg={6} 
                            xl={6} 
                            className="text-right"
                          >
                            <Button
                              onClick={() => handleClick(value)}
                              className="cls-baggage-add-btn"
                            >
                              {t("add")}
                            </Button>
                          </Col>
                        </Row>
                      </Col>
                    ))}
                  </Row>
                </CSSTransition>
              ) :
                (
                  <>
                    <CSSTransition
                      in={!!loopData?.meals?.length}
                      timeout={600}
                      classNames="fade"
                      unmountOnExit
                    >
                      <Row align="middle">
                        <Col xs={24} lg={4} xl={3} className={`${isSmallScreen ? "pb-2" : ""} fs-14`}>
                          <Text>{t("show_meal")}:</Text>
                        </Col>
                        <Col span={20}>
                          <Row style={{ gap: isSmallScreen ? 10 : 15 }}>
                            {mealNameList?.map((value: any, index: any) => (
                              <Col className="cls-meals-btn" key={`baggageMeal${index}`}>
                                <Button
                                  type="default"
                                  block
                                  shape="round"
                                  className={`btn ${selectedIndex === index ? 'cls-active' : ''}`}
                                  onClick={() => onChange(value, index)}
                                >
                                  {value}
                                </Button>
                              </Col>
                            ))}
                          </Row>
                        </Col>
                      </Row>
                    </CSSTransition>
                    <CSSTransition
                      in={!!loopData?.meals?.length}
                      timeout={600}
                      classNames="fade"
                      unmountOnExit
                    >
                      <Row>
                        {loopData?.meals?.map((value: any, index: number) => (
                          <Col xs={24} sm={12} lg={12} xl={12} key={`baggageMealData${index}`}>
                            <Row className={`pr-1 mt-3 mb-3 cls-booking-box pt-1 pb-1 pl-1 ${index % 2 !== 0 ? "ml-4" : ""}`}>
                              <Col span={3}>
                                <img src={mealpack} alt={t(tabSelected)} />
                              </Col>
                              <Col span={13} className="ml-3 cls-meals-list">
                                <Row className="f-reg">{value.item}</Row>
                                <Row className="f-sbold">
                                  <Col className={`${isSmallScreen ? "fs-14 f-sbold" : "fs-16 f-reg"} pr-1`}>{CFG.currency} {value.price}</Col>
                                  <span className="meals-price-status">
                                    <Badge status={value?.type === "veg" ? "success" : "error"} />
                                  </span>
                                </Row>
                              </Col>
                              <Col span={5} className="text-right">
                                <Button
                                  onClick={() => handleClick(value)}
                                  className="cls-baggage-add-btn"
                                >
                                  {t("add")}
                                </Button>
                              </Col>
                            </Row>
                          </Col>
                        ))}
                      </Row>
                    </CSSTransition>
                  </>
                )}
            </>
            :
            <AddSSRSkeleton />
        }
      </Card>
    </>
  );
};
export default BaggageMealBox;