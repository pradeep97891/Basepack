import {
  Row,
  Col,
  Divider,
  Checkbox,
  Typography,
  Select,
  Button,
  Badge,
} from "antd";
import "./PassengersList.scss";
import { useDispatch } from "react-redux";
import { useEffect, useState } from "react";
import { CheckboxChangeEvent } from "antd/lib/checkbox";
import { Icons } from "@/components/Icons/Icons";
import Icon from "@ant-design/icons";
import { setSsrPNRData } from "@/stores/Ssr.store";
import { SeatColDetail } from "../../AddSSR/AddSSRTypes";
import PassengerListSkeleton from "./PassengerList.skeleton";
import React from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";
import { useResize } from "@/Utils/resize";
const { Text } = Typography;

const seatList = [
  {
    item: "Free",
    icon: "FdFreeSeatIcon",
    mapping: false,
  },
  {
    item: "USD 5",
    icon: "FdUSD5SeatIcon",
    mapping: false,
  },
  {
    item: "USD 10",
    icon: "FdUSD10SeatIcon",
    mapping: false,
  },
];

interface PassengerListProps {
  pnrData: any;
  currentTab: any;
  tripIndex?: any;
  initialSeatList?: any;
  baggageDetails?: any;
  mealsDetails?: any;
}

const PassengersList = (props: PassengerListProps) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { isSmallScreen } = useResize(991);
  // const [allSelectData, SetAllSelectData] = useState<any>([]);
  const [seatSelectAll, setSeatSelectAll] = useState("");
  const [baggageSelectAll, setBaggageSelectAll] = useState("");
  const [mealsSelectAll, setMealsSelectAll] = useState("");
  const [paxData, setPaxData] = useState<any>([]);
  const [activeMealsButton, setActiveMealsButton] = useState<any>({});
  const [visible, setVisible] = useState<{ [key: string]: boolean }>({});
  const [, SsetSsrPNRData] = useSessionStorage<any>("ssrPNRData");
  var tabSelected = props.currentTab;


  const toggleVisible = (mealType: string, bool: boolean) => {
    setVisible((prevVisible) => ({
      ...prevVisible,
      [mealType]: bool,
    }));
  };

  useEffect(() => {
    setPaxData(props.pnrData[0].paxInfo);

    var check;
    if (props?.pnrData[0]?.paxInfo?.length) {
      var paxDetails = props?.pnrData[0]?.paxInfo;
      if (tabSelected === t("seat")) {
        check = paxDetails?.every((pax: any) => {
          return pax.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.type === paxDetails?.[0]?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.type;
        });
        if (check)
          setSeatSelectAll(paxDetails[0].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.item)
      } else if (tabSelected === t("baggage")) {
        check = paxDetails?.every((pax: any) => {
          return pax.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.item === paxDetails[0].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.item;
        });
        if (check)
          setBaggageSelectAll(paxDetails[0].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.item);
      } else {
        check = paxDetails?.every((pax: any) => {
          return pax.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.item === paxDetails[0]?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.item;
        });
        var mainMealMenu: any;
        if (props.pnrData[0]) {
          Object.keys(props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]].ssrData?.mealsList)?.map((mealType: any) => {
            var checkAll = props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]].ssrData?.mealsList[0][mealType]?.some(
              (value: any) => value.item === paxDetails[0]?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.item
            );
            checkAll && (mainMealMenu = mealType);
            return mealType;
          });
        }
        if (check)
          handleButtonClick(
            mainMealMenu,
            paxDetails[0]?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.item,
            true
          );
      }
    }
    // eslint-disable-next-line
  }, [props.tripIndex, props.pnrData]);

  const allSelectData =
    tabSelected === t("seat")
      ? seatList
      : tabSelected === t("baggage")
        ? props.baggageDetails
        : tabSelected === t("meals")
          ? props.mealsDetails
          : [];
        
  useEffect(() => {

    var pnrData = JSON.parse(JSON.stringify(props?.pnrData));
    // var data = pnrData?.[0]?.rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData;
    // SetAllSelectData(
    //   tabSelected === t("seat")
    //     ? seatList
    //     : tabSelected === t("baggage")
    //       ? data?.baggageList
    //       : tabSelected === t("meals")
    //         ? data?.mealsList[0]
    //         : []
    // );

    var paxSSRDatatemp = pnrData[0].paxInfo;

    if (paxSSRDatatemp) {
      paxSSRDatatemp = JSON.parse(JSON.stringify(paxSSRDatatemp));
      paxSSRDatatemp?.sort((a: any, b: any) => {
        if (tabSelected === t("seat")) {
          return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.selected;
        } else if (tabSelected === t("baggage")) {
          return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.selected;
        } else {
          return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.selected;
        }
      });

      pnrData[0].paxInfo = paxSSRDatatemp;
      SsetSsrPNRData(pnrData);
      dispatch(setSsrPNRData({ value: pnrData }));
    }
    // eslint-disable-next-line
  }, [tabSelected, props.tripIndex]);



  const selectPassengerHandler = (e: CheckboxChangeEvent) => {
    var seatDetailsTemp: any;
    let passenger = JSON.parse(JSON.stringify(e.target.value));
    const checked = e.target.checked;
    let passengerData = JSON.parse(JSON.stringify(paxData));
    passengerData.forEach((item: any) => {
      if (item.id === passenger.id) {
        if (tabSelected === t("seat")) {
          item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isSeatChecked = checked ? true : false;
          if (!checked) {
            seatDetailsTemp = JSON.parse(JSON.stringify(props.pnrData[0]?.rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData.seatList));
            var apiSeatDetailsTemp = JSON.parse(JSON.stringify(props.initialSeatList));
            apiSeatDetailsTemp.forEach((apiSeatRowItem: any) => {
              apiSeatRowItem.forEach((apiSeatColItem: any) => {
                seatDetailsTemp.forEach((seatRowItem: any) => {
                  seatRowItem.forEach((seatColItem: any) => {
                    if (
                      seatColItem.seat_number === item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.number &&
                      apiSeatColItem.seat_number === item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.number
                    ) {
                      seatColItem.icon = apiSeatColItem.icon;
                      seatColItem.item = apiSeatColItem.item;
                    }
                  });
                });
              });
            });
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.icon = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.number = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.price = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.type = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected = false;
          }
        } else if (tabSelected === t("baggage")) {
          item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isBaggageChecked = checked ? true : false;
          if (!checked) {
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.item = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.price = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected = false;
          }
        } else {
          item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isMealsChecked = checked ? true : false;
          if (!checked) {
            setMealsSelectAll("");
            setActiveMealsButton("");
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.item = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.type = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.price = "";
            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected = false;
          }
        }
      }
    });

    passengerData?.sort((a: any, b: any) => {
      if (tabSelected === t("seat")) {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected - a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected;
      } else if (tabSelected === t("baggage")) {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected;
      } else {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected;
      }
    });

    var pnrData = JSON.parse(JSON.stringify(props.pnrData));
    if (seatDetailsTemp) {
      pnrData[0].rebookOptionalFlightDetails[props.tripIndex[0]].flightDetails[props.tripIndex[1]].ssrData.seatList = seatDetailsTemp;
    }
    pnrData[0].paxInfo = passengerData;
    SsetSsrPNRData(pnrData);
    dispatch(setSsrPNRData({ value: pnrData }));
    setPaxData(passengerData);

    !checked &&
      (document.querySelector(".cls-fv-Passengers") as any).scrollIntoView({
        behavior: "smooth",
        block: "start",
      });

    var check =
      tabSelected === t("seat")
        ? passengerData.filter(
          (paxItem: any) =>
            paxItem?.rebookSsrData?.[props.tripIndex[0]]?.isSeatChecked === true &&
            paxItem?.rebookSsrData?.[props.tripIndex[0]]?.seatDetail?.selected === true
        )
        : tabSelected === t("baggage")
          ? passengerData.filter(
            (paxItem: any) =>
              paxItem?.rebookSsrData?.[props.tripIndex[0]]?.isBaggageChecked === true &&
              paxItem?.rebookSsrData?.[props.tripIndex[0]]?.baggageDetail?.selected === true
          )
          : tabSelected === t("meals")
            ? passengerData.filter(
              (paxItem: any) =>
                paxItem?.rebookSsrData?.[props.tripIndex[0]]?.isMealsChecked === true &&
                paxItem?.rebookSsrData?.[props.tripIndex[0]]?.mealsDetail?.selected === true
            )
            : [];

    if (!check.length || !checked) {
      if (tabSelected === t("seat")) {
        setSeatSelectAll("");
      } else if (tabSelected === t("baggage")) {
        setBaggageSelectAll("");
      } else {
        setMealsSelectAll("");
      }
    }
  };

  const selectAllHandler = (
    value: any,
    price: number = 0,
    type: string = ""
  ) => {
    let selectAllValue = value;
    let count = 0;
    let pnrData = JSON.parse(JSON.stringify(props.pnrData));
    let seatDetailsTemp = JSON.parse(JSON.stringify(props.initialSeatList));
    let paxSSRDatatemp = JSON.parse(JSON.stringify(paxData));
    let setValue = "";
    let selectedSeatArr: SeatColDetail[] = [];

    if (tabSelected === t("seat")) {
      setValue =
        seatSelectAll === selectAllValue
          ? ""
          : selectAllValue;
      setSeatSelectAll(setValue);
      seatDetailsTemp.forEach((seatRowItem: any) => {
        seatRowItem.forEach((seatColItem: any) => {
          if (
            seatColItem.item === selectAllValue &&
            paxSSRDatatemp.length > count
          ) {
            setValue !== "" && selectedSeatArr.push(seatColItem);
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isSeatChecked =
              setValue === "" ? false : true;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.icon =
              setValue === "" ? "" : seatColItem.icon;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.number =
              setValue === "" ? "" : seatColItem.seat_number;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.price =
              setValue === "" ? "" : seatColItem.price;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.type =
              setValue === "" ? "" : seatColItem.type;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.item =
              setValue === "" ? "" : seatColItem.item;
            paxSSRDatatemp[count].rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected =
              setValue === "" ? false : true;
            setValue !== "" && (seatColItem.icon = "FdSelectedSeatIcon");
            count++;
          } else {
            if (count < paxSSRDatatemp.length) {
              paxSSRDatatemp.forEach((paxItem: any, index: number) => {
                if (paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected === true && index >= count) {
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isSeatChecked = false;
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.icon = "";
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.number = "";
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.price = "";
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.type = "";
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.item = "";
                  paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected = false;
                }
              });
            }
          }
        });
      });
    } else if (tabSelected === t("baggage")) {
      setValue =
        baggageSelectAll === selectAllValue
          ? ""
          : selectAllValue;
      setBaggageSelectAll(setValue);
      paxSSRDatatemp.forEach((item: any) => {
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isBaggageChecked = setValue === "" ? false : true;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.item = setValue === "" ? "" : selectAllValue;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.price = setValue === "" ? "" : price;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected = setValue === "" ? false : true;
      });
    } else {
      setValue =
        mealsSelectAll === selectAllValue
          ? ""
          : selectAllValue;
      setMealsSelectAll(setValue);
      paxSSRDatatemp.forEach((item: any) => {
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isMealsChecked = setValue === "" ? false : true;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.item = setValue === "" ? "" : selectAllValue;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.type = setValue === "" ? "" : type;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.price = setValue === "" ? "" : price;
        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected = setValue === "" ? false : true;
      });
    }
    paxSSRDatatemp?.sort((a: any, b: any) => {
      if (tabSelected === t("seat")) {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail.selected;
      } else if (tabSelected === t("baggage")) {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].baggageDetail.selected;
      } else {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].mealsDetail.selected;
      }
    });

    if (tabSelected === t("seat")) {
      pnrData[0].rebookOptionalFlightDetails[props.tripIndex[0]].flightDetails[props.tripIndex[1]].ssrData.seatList = setValue !== "" ? seatDetailsTemp : props.initialSeatList;
    }

    pnrData[0].paxInfo = paxSSRDatatemp;
    dispatch(setSsrPNRData({ value: pnrData }));
    SsetSsrPNRData(pnrData);
    setPaxData(paxSSRDatatemp);

  };

  const unselectPax = (e: React.MouseEvent<HTMLSpanElement>) => {
    ((e.target as any)
      .closest(".cls-passenger-check-list")
      .querySelector("input") as HTMLInputElement
    ).click();
  };

  const handleButtonClick = (mealType: string, value: string, set: boolean) => {
    // Iterate over the items in the meal type
    var data = Object.keys(props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.mealsList[0]).reduce<{
      [key: string]: any[];
    }>((acc, mealType) => {
      acc[mealType] = props.pnrData[0].rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.mealsList[0][mealType].map((item: any) => ({
        ...item,
        selected: item.item === value,
      }));
      return acc;
    }, {});
    setActiveMealsButton(data);
    setMealsSelectAll(value);
  };

  return (
    <Row
      datatest-id="passengerList"
      className={`cls-passengerListMain ${tabSelected === t("seat") ? "cls-seat" : "cls-others"}`}
      data-testid="passengersList"
      id="passengersList"
    >
      <Col xs={24} xl={24}>
        {paxData.length ? (
          <>
            <Row>
              <Col className="fs-15 f-bold cls-fv-Passengers">
                {t("passengers_list")}
              </Col>
            </Row>
            <Row className="mt-3 fs-13">
              <Col xs={24} xl={24} className="cls-fvp-para f-reg">
                {tabSelected === t("seat")
                  ? t("seats")
                  : tabSelected === t("baggage")
                    ? t("baggage")
                    : tabSelected === t("meals")
                      ? t("meals")
                      : ""}{" "}
                {t("selected_automatically")}
              </Col>
            </Row>
            <Row>
              <Col xs={24} xl={24} className="mr-3 ml-3 cls-flightSeatList">
                {tabSelected === t("meals")
                  ? 
                  Object.keys(allSelectData).map((mealType) => {
                    if (typeof mealType === 'string') {
                      return (
                        <React.Fragment key={mealType}>
                          <Select
                            suffixIcon={
                              <Text className="Infi-Fd_04_DropdownArrow fs-8 p-clr cls-dropdown-icon" />
                            }
                            className={`cls-seat-list ${allSelectData[mealType].length ? allSelectData?.[mealType]?.some((value: any) => value.item === mealsSelectAll) : ""}`}
                            style={{ marginBottom: isSmallScreen ? 5 : 10 }}
                            defaultValue={mealType}
                            open={visible[mealType] || false}
                            onClick={() => toggleVisible(mealType, !visible[mealType])}
                            dropdownRender={() => (
                              <div className="cls-meals-dropdown">
                                {allSelectData[mealType].length ? allSelectData[mealType].map((value:any, mealIndex:number) => (
                                  <div
                                    className="cls-options d-flex space-between align-center px-2 py-1"
                                    key={mealIndex}
                                  >
                                    <Text className="cls-meal-select">
                                      <Badge
                                        status={value?.type === 'veg' ? 'success' : 'error'}
                                      />
                                    </Text>
                                    {value.item}
                                    <Button
                                      value={value.item}
                                      type="text"
                                      className={`cls-score-apply ${activeMealsButton?.[mealType]?.some((data:any) => data.item === value.item && data.selected === true)}`}
                                      onClick={() => {
                                        handleButtonClick(mealType, value.item, true);
                                        selectAllHandler(value.item, value.price, value?.type);
                                      }}
                                    >
                                      {t("add")}
                                    </Button>
                                  </div>
                                )) : <div>No items available</div>}
                              </div>
                            )}
                            size="large"
                          >
                            <Select.Option value={mealType.replace("_", " ")}>
                              <Text className="fs-18 Infi-Fd_54_Meals my-1 mr-2 d-iblock cls-meal-icon" />
                              {mealType.replace("_", " ")}
                            </Select.Option>
                          </Select>
                        </React.Fragment>
                      );
                    }
                    return null; // Return null if `mealType` is not a string
                  })
                  : allSelectData.length ? allSelectData?.map((value: any, index: number) => (
                    <Checkbox
                      key={"allSelect" + index}
                      className="cls-seat-list"
                      value={value?.item}
                      onChange={() =>
                        selectAllHandler(value?.item, value?.price)
                      }
                      checked={
                        tabSelected === t("seat") &&
                          (seatSelectAll === value.item)
                          ? true
                          : tabSelected === t("baggage") &&
                            (baggageSelectAll === value.item)
                            ? true
                            : false
                      }
                    >
                      <Text className="cls-seatlist_icon">
                        {value.icon ? (
                          <Text>
                            {value.icon ? (
                              <Icon component={Icons.get(value.icon)} />
                            ) : (
                              <></>
                            )}
                          </Text>
                        ) : (
                          <Text
                            className={`cls-icon ${tabSelected === t("baggage") ? "Infi-Fd_57_BaggageLite" : "Infi-Fd_54_Meals"}`}
                          ></Text>
                        )}
                        <Text className="cls-value"> {value.item} </Text>
                      </Text>
                    </Checkbox>
                  )) : <></>}
              </Col>
            </Row>
            <Text className={`cls-grey f-reg d-block ${isSmallScreen ? "pt-1 fs-13" : "pt-2 fs-14"}`}>
              {t("selected")}{" "}
              <Text
                className={`cls-grey f-reg ${isSmallScreen ? "fs-13" : "fs-14"}`}
                style={{ textTransform: "lowercase" }}
              >
                {tabSelected === t("seat")
                  ? t("seats")
                  : tabSelected === t("baggage")
                    ? t("baggage")
                    : tabSelected === t("meals")
                      ? t("meals")
                      : ""}{" "} :
              </Text>
              <Text
                className={`cls-dark-grey f-med pl-2 ${isSmallScreen ? "fs-13" : "fs-14"}`}
                style={{ textTransform: "lowercase" }}
              >
                {tabSelected === t("seat")
                  ? paxData?.filter(
                    (paxItem: any) =>
                      paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isSeatChecked === true &&
                      paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.selected === true
                  ).length || 0 // Return 0 if the length is undefined
                  : tabSelected === t("baggage")
                    ? paxData?.filter(
                      (paxItem: any) =>
                        paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isBaggageChecked === true &&
                        paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.selected === true
                    ).length || 0 // Return 0 if the length is undefined
                    : tabSelected === t("meals")
                      ? paxData?.filter(
                        (paxItem: any) =>
                          paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isMealsChecked === true &&
                          paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.selected === true
                      ).length || 0 // Return 0 if the length is undefined
                      : 0}
                /{paxData.length} {t("selected")}
              </Text>
            </Text>
            <Divider dashed style={{ marginBlockStart: 12 }} />
            {paxData.map((item: any, index: number) => {
              return (
                <React.Fragment key={"paxData" + index}>
                  <Row className="cls-passenger-check-list">
                    <Col 
                      xs={tabSelected === t("meals") ? 20 : 17}
                      sm={tabSelected === t("meals") ? 21 : 20} 
                      md={tabSelected === t("meals") ? 22 : 21} 
                      lg={tabSelected === t("meals") ? 19 : 17}
                      xl={tabSelected === t("meals") ? 20 : 17}
                    >
                      <Checkbox
                        value={item}
                        onChange={selectPassengerHandler}
                        checked={
                          tabSelected === t("seat")
                            ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isSeatChecked
                            : tabSelected === t("baggage")
                              ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isBaggageChecked
                              : tabSelected === t("meals")
                                ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isMealsChecked
                                : false
                        }
                        className="f-sbold cls-passenger-checkbox"
                      >
                        {item?.passengerDetail?.firstName}{" "}
                        {item?.passengerDetail?.lastName}
                        {item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isSeatChecked}
                      </Checkbox>
                    </Col>
                    <Col
                      className="cls-passengerlist-icon text-right"
                      xs={tabSelected === t("meals") ? 2 : 3}
                      sm={tabSelected === t("meals") ? 1 : 2}
                      md={tabSelected === t("meals") ? 1 : 1}
                      lg={tabSelected === t("meals") ? 2 : 4}
                      xl={tabSelected === t("meals") ? 2 : 5}
                    >
                      {tabSelected === t("seat") ? (
                        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.icon ? (
                          <Icon
                            component={Icons.get(item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.icon)}
                          />
                        ) : (
                          <></>
                        )
                      ) : (
                        <Text
                          className={
                            tabSelected === t("baggage") &&
                              item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail.item !== ""
                              ? "Infi-Fd_57_BaggageLite"
                              : tabSelected === t("meals") &&
                                item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail.item !== ""
                                ? "Infi-Fd_54_Meals"
                                : ""
                          }
                        ></Text>
                      )}
                      {tabSelected === t("seat") &&
                        item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number !== ""
                        ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number
                        : tabSelected === t("baggage") &&
                          item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.item !== ""
                          ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.item
                          : ""}
                    </Col>
                    <Col
                      xs={tabSelected === t("meals") ? 2 : 4}
                      sm={2}
                      md={tabSelected === t("meals") ? 1 : 2} 
                      lg={3}
                      xl={2}
                      className="cls-close-col d-flex align-center justify-end"
                    >
                      {
                        ((tabSelected === t("seat") &&
                          item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number !== "") ||
                          (tabSelected === t("baggage") &&
                            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.baggageDetail?.item !== "") ||
                          (tabSelected === t("meals")
                            ? item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.item
                            : "")) && (
                          <Text
                            className="Infi-Fd_82_CloseMark fs-12 mr-1 cls-close-mark"
                            style={{ color: "#FF0303", fontWeight: "bold" }}
                            onClick={(e: React.MouseEvent<HTMLSpanElement>) =>
                              unselectPax(e)
                            }
                          >
                          </Text>
                        )}
                    </Col>
                  </Row>
                  <Row className="cls-meal-select">
                    {tabSelected === t("meals") && item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.item ? (
                      <>
                        {" "}
                        <Badge
                          status={
                            item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.type === "veg"
                              ? "success"
                              : "error"
                          }
                        />{" "}
                        {item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.mealsDetail?.item}{" "}
                      </>
                    ) : tabSelected === t("seat") &&
                      item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number ? (
                      <Text className="fs-12 cls-grey">
                        {" "}
                        {item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.item}
                        {" "}-{" "}
                        {item.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.type}
                      </Text>
                    ) : (
                      ""
                    )}
                  </Row>
                  {index !== paxData?.length - 1 && <Divider dashed />}
                </React.Fragment>
              )
            }
            )}
          </>
        ) : (
          <PassengerListSkeleton />
        )}
      </Col>
    </Row>
  );
};
export default PassengersList;
