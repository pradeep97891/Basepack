import { Col, notification, Row, Spin, Tooltip, Typography } from "antd";
import { useEffect, useState } from "react";
import "./Flight.scss";
import { SeatDetail } from "../AddSSR/AddSSRTypes";
import {
  BendLine,
  FdBabySeatIcon,
  FdFreeSeatIcon,
  FdOccupiedSeatIcon,
  FdSelectedSeatIcon,
  FdUSD5SeatIcon,
  FdUSD10SeatIcon,
  FlightFront,
} from "@/components/Icons/Icons";
import React from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useTranslation } from "react-i18next";
import { useDispatch } from "react-redux";
import { setSsrPNRData } from "@/stores/Ssr.store";
const Text = Typography.Text;

const Flight = (props: any) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [width, setWidth] = useState<string>();
  const [colNumArray, setColNumArray] = useState<number[]>([]);

  const rowDataSet = [
    ["I", "H", "G"],
    ["F", "E", "D"],
    ["C", "B", "A"]
  ];
  const [paxSeatSelectName, setPaxSeatSelectName] = useState("");
  const [allPaxCheck, setAllPaxCheck] = useState<any>(true);
  const [seatMapDetails, setSeatMapDetails] = useState<any>();
  const [, SsetSsrPNRData] = useSessionStorage<any>("ssrPNRData");

  const mappingSeatInfo = (seat: any) => {
    let value: any = [];
    let pnrData = JSON.parse(JSON.stringify(props.pnrData));
    let paxSSRDataTemp = pnrData[0].paxInfo;
    
    var dataUpdateItem = paxSSRDataTemp.find((value: any) =>
      value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number === "" && value?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.isSeatChecked === true
    );
    var duplicateCheck = paxSSRDataTemp.find((value: any) => 
      value.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail?.number === seat?.seat_number
    );

    if (duplicateCheck) {
      notification.warning({
        key: 1,
        message: "Seat is selected already, choose another seat.",
        duration: 3,
      });
      return;
    }

    var seatDetailsTemp = JSON.parse(JSON.stringify(props.pnrData[0]?.rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData.seatList));
    seatDetailsTemp?.forEach((seatRowItem: any) => {
      seatRowItem.forEach((seatColItem: any) => {
        if (
          seatColItem.seat_number === seat.seat_number &&
          paxSeatSelectName !== undefined
        ) {
          seatColItem.icon = "FdSelectedSeatIcon";
          seatColItem.item = "Selected";
        }
      });
    });

    let seatData: SeatDetail = {
      number: seat?.seat_number,
      type: seat?.type,
      item: seat?.item,
      price: seat?.price,
      icon:
        seat?.item === "Free" ? "FdFreeSeatIcon" : 
        seat?.item === "USD 5" ? "FdUSD5SeatIcon" : 
        seat?.item === "USD 10"? "FdUSD10SeatIcon" : 
        "FdBabySeatIcon",
      selected: true,
    };

    if (dataUpdateItem) {
      dataUpdateItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail = seatData;
      paxSSRDataTemp?.forEach((ssr: any) => {
        ssr.id === dataUpdateItem.id && (ssr = dataUpdateItem)
        value.push(ssr);
      });    

      value.sort((a:any, b:any) => {
        return a.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail.selected - b.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]]?.seatDetail.selected;
      });

      pnrData[0].paxInfo = value;
      pnrData[0].rebookOptionalFlightDetails[props.tripIndex[0]].flightDetails[props.tripIndex[1]].ssrData.seatList = seatDetailsTemp;
      dispatch(setSsrPNRData({ value: pnrData }));
      SsetSsrPNRData(pnrData);
      setSeatMapDetails(seatDetailsTemp);

    }
  };

  const selectSeatHandler = (seatData: any) => {    
    if (seatData?.icon === "FdSelectedSeatIcon") {
      notification.warning({
        key: 1,
        message: "Seat is selected already.",
        duration: 3,
      });
      return;
    }
    if (paxSeatSelectName === "") {
      notification.warning({
        key: 1,
        message: "Choose the passenger before choosing the seat.",
        duration: 3,
      });
      return false;
    }
    mappingSeatInfo(seatData);
  };

  
  useEffect(() => {  
    if (props.pnrData && props.tripIndex) {
      let colLength = props.pnrData[0]?.rebookOptionalFlightDetails?.[props.tripIndex[0]]?.flightDetails[props.tripIndex[1]]?.ssrData?.seatList?.[0]?.length;
      let colLengthArray = [];
      setWidth((350 + colLength * 47).toString() + "px");
      for (let i: number = 0; i < colLength; i++) {
        colLengthArray.push(i + 1);
      }
      setColNumArray(colLengthArray)
      setSeatMapDetails(
        JSON.parse(JSON.stringify(
          props.pnrData[0].rebookOptionalFlightDetails[props.tripIndex[0]].flightDetails?.[props.tripIndex[1]]?.ssrData?.seatList)
        )
      );      

      var paxInfo = props.pnrData[0].paxInfo;   
      var paxSelectRequired = paxInfo.find(
        (paxItem: any) =>
          paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isSeatChecked === true &&
          paxItem.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail?.selected === false
      );

      setPaxSeatSelectName(
        !!paxSelectRequired
          ? paxSelectRequired?.passengerDetail?.firstName +
              " " +
              paxSelectRequired?.passengerDetail?.lastName
          : ""
      );

      var allPaxSelected = paxInfo.filter(
        (paxItem: any) =>
          paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].isSeatChecked === true &&
          paxItem?.rebookSsrData[props.tripIndex[0]].ssrData[props.tripIndex[1]].seatDetail?.selected === true
      );
      setAllPaxCheck(allPaxSelected);
    }
    // eslint-disable-next-line
  }, [props.tripIndex, props.pnrData]);


  return (
    <>
      <Row className="cls-flight-ele ml-5 mb-2" data-testid="flight">
        { paxSeatSelectName ?
          <Text className="cls-select-seat-pax">
              Select seat for { paxSeatSelectName }
          </Text> :
          allPaxCheck && (allPaxCheck?.length !== props.pnrData[0]?.paxInfo?.length ?
          <Text className="cls-select-seat-pax">
              {t("select_pax_msg")} {" "} {t("seat")}
          </Text> :
          <></> )
        }
        {
          seatMapDetails?.length && props.tripIndex && width ? 
          <Col span={24}>
            <Row style={{ width: width, flexWrap: "nowrap"}}>
              <Col className="cls-front-fight">
                <Row>
                  <Col span={24} className="pt-2 mt-2"></Col>
                  <Col span={24} className="mt-2 mb-2 cls-font-inner">
                    <Row>
                      <Col span={24} className="cls-flight-line">
                        <Row style={{ height: "402px" }}>
                          <Col span={2} offset={2} className="cls-flight-front">
                            <FlightFront />
                          </Col>
                          <Col span={2} offset={1} className="cls-bend-line">
                            <BendLine />
                          </Col>
                          <Col span={8}> </Col>
                          <Col span={2} className="d-flex cls-meals-row">
                            <Text className="cls-top">
                              <Text className="Infi-Fd_10_ArrowRight cls-arrow"> </Text>
                              <Text className="Infi-Fd_54_Meals"> </Text>
                            </Text>
                            <Text className="cls-bottom">
                              <Text className="Infi-Fd_55_Restroom"> </Text>
                              <Text className="Infi-Fd_10_ArrowRight cls-arrow"> </Text>
                            </Text>
                          </Col>
                          <Col span={2} className="d-flex align-center cls-seat-row-num">
                            { rowDataSet.map((value, index)=>(
                              <Text className="cls-seat-row-group" key={"seatRow"+index}>
                                { value.map((subValue, subIndex) => (
                                  <Text className="d-block" key={"seatInnerRow"+subIndex}>
                                    {subValue}
                                  </Text>
                                ))}
                              </Text>
                            ))}
                          </Col>
                          <Col span={2} className="d-flex align-center cls-child-icon-col">
                            <Text className="cls-child-icon-group">
                              <Text className="Infi-Fd_53_InfantSeat"> </Text>
                              <Text className="Infi-Fd_53_InfantSeat"> </Text>
                            </Text>
                            <Text className="Infi-Fd_53_InfantSeat"> </Text>
                            <Text className="cls-child-icon-group">
                              <Text className="Infi-Fd_53_InfantSeat"> </Text>
                              <Text className="Infi-Fd_53_InfantSeat"> </Text>
                            </Text>
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
              <Col span={16}>
                <Row>
                  <Col span={24} className="cls-seat-colNum">
                    {colNumArray?.map((value: any, index: number) => {
                      return (
                        <React.Fragment key={"seatCol"+index}>
                          {value === 8 || value === 12 || value === 18 ? (
                            <>
                              <span className="cls-seat-col-num cls-seat-customizate"></span>
                              <span className="cls-seat-col-num">{value}</span>
                            </>
                          ) : (
                            <span className="cls-seat-col-num">{value}</span>
                          )}
                        </React.Fragment>
                      );
                    })}
                  </Col>
                  <Col span={24} className="mt-2 mb-2 cls-airline-outer">
                    <Row className="cls-seat-section">
                      <Col span={24} className="cls-design-part">
                        { 
                          seatMapDetails.map((rowData: any, rowIndex:number) => {
                            return (
                              <React.Fragment key={"seatMap"+rowIndex}>
                                {(rowData as any)[0]["seat_number"].includes(
                                  "F"
                                ) ||
                                (rowData as any)[0]["seat_number"].includes(
                                  "C"
                                ) ? (
                                  <Row className="pt-3 pb-2"></Row>
                                ) : (
                                  <></>
                                )}
                                <Row>
                                  {rowData.map((seatData: any, seatIndex: number) => {
                                    return (
                                      <React.Fragment key={"seatData"+seatIndex}>
                                        {seatData["seat_number"].includes(8) ||
                                        seatData["seat_number"].includes(12) ? (
                                          <span className="cls-flight-seat-space"></span>
                                        ) : (
                                          <></>
                                        )}
                                        <Tooltip title={seatData["seat_number"] + " : " + seatData["item"]}>
                                          <Text
                                            style={{cursor: "pointer"}}
                                            className="cls-flight-seat-space"
                                            onClick={() =>
                                              selectSeatHandler(seatData)
                                            }
                                          >
                                            {
                                              seatData["icon"] === "FdFreeSeatIcon" ? <FdFreeSeatIcon /> :
                                              seatData["icon"] === "FdUSD5SeatIcon" ? <FdUSD5SeatIcon /> :
                                              seatData["icon"] === "FdUSD10SeatIcon" ? <FdUSD10SeatIcon /> :
                                              seatData["icon"] === "FdBabySeatIcon" ? <FdBabySeatIcon /> :
                                              seatData["icon"] === "FdSelectedSeatIcon" ? <FdSelectedSeatIcon /> :
                                              seatData["icon"] === "FdOccupiedSeatIcon" ? <FdOccupiedSeatIcon /> : <></>
                                            }
                                          </Text>
                                        </Tooltip>
                                      </React.Fragment>
                                    );
                                  })}
                                </Row>
                              </React.Fragment>
                            );
                          })
                        }
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Col>
            </Row>
          </Col>
          : 
          <Text style={{height:"400px", margin: "150px auto 0px"}} className="d-block">
            <Spin size="large" className="mt-6" style={{ display: "block" }} /> 
          </Text>
        }
      </Row>
    </>
    // const [apiFlightSeat, apiFlightSeatResponse] = useGetFlightSeatDataMutation(); // eslint-disable-next-line
    // const [newSeat, setNewSeat] = useState<any>();
    
    // useEffect(() => {
    //   apiFlightSeat([]); // eslint-disable-next-line
    // }, []);

    // useEffect(() => {
    //   if (
    //     apiFlightSeatResponse.isSuccess &&
    //     (apiFlightSeatResponse?.data as any)?.response?.data
    //   ) {
    //     setNewSeat((apiFlightSeatResponse?.data as any)?.response?.data);
    //   }
    // }, [apiFlightSeatResponse]);
    // <>
    //   <Row className="cls-flight-ele ml-5 mb-4" data-testid="flight">
    //     {paxSeatSelectName ? (
    //       <Text className="cls-select-seat-pax">
    //         Select seat for {paxSeatSelectName}
    //       </Text>
    //     ) : (
    //       allPaxCheck &&
    //       (allPaxCheck.length !== paxInfo.length ? (
    //         <Text className="cls-select-seat-pax">
    //           Select passenger from passengers list to choose seat
    //         </Text>
    //       ) : (
    //         <></>
    //       ))
    //     )}
    //     {
    //       seatsMapDetails.length ? (
    //         // <>
    //         <Col span={24}>
    //           <Row
    //             style={{
    //               width: width,
    //               marginBottom: "50px",
    //               flexWrap: "nowrap",
    //             }}
    //           >
    //             <Col className="cls-front-fight">
    //               <Row>
    //                 <Col span={24} className="pt-2 mt-2"></Col>
    //                 <Col span={24} className="mt-2 mb-2 cls-font-inner">
    //                   <Row style={{
    //                 flexWrap: "nowrap",
    //               }}>
    //                     <Col span={24} className="cls-flight-line">
    //                       <Row>
    //                         <Col span={2} className="d-flex cls-meals-row">
    //                           <Text className="cls-top">
    //                             <Text className="Infi-Fd_10_ArrowRight cls-arrow">
    //                               {" "}
    //                             </Text>
    //                             <Text className="Infi-Fd_54_Meals"> </Text>
    //                           </Text>
    //                           <Text className="cls-bottom">
    //                             <Text className="Infi-Fd_55_Restroom"> </Text>
    //                             <Text className="Infi-Fd_10_ArrowRight cls-arrow">
    //                               {" "}
    //                             </Text>
    //                           </Text>
    //                         </Col>
    //                         <Col
    //                           span={2}
    //                           className="d-flex align-center cls-seat-row-num"
    //                         >
    //                           {rowDataSet.map((value) => (
    //                             <Text className="cls-seat-row-group">
    //                               {value.map((subValue) => (
    //                                 <Text className="d-block">{subValue}</Text>
    //                               ))}
    //                             </Text>
    //                           ))}
    //                         </Col>
    //                         <Col
    //                           span={2}
    //                           className="d-flex align-center cls-child-icon-col"
    //                         >
    //                           <Text className="cls-child-icon-group">
    //                             <Text className="Infi-Fd_53_InfantSeat"> </Text>
    //                             <Text className="Infi-Fd_53_InfantSeat"> </Text>
    //                           </Text>
    //                           <Text className="Infi-Fd_53_InfantSeat"> </Text>
    //                           <Text className="cls-child-icon-group">
    //                             <Text className="Infi-Fd_53_InfantSeat"> </Text>
    //                             <Text className="Infi-Fd_53_InfantSeat"> </Text>
    //                           </Text>
    //                         </Col>
    //                       </Row>
    //                     </Col>
    //                     <Col span={24}>
    //                       <Flex>
    //                         {newSeat ? (
    //                           newSeat?.map((item: any, mainIndex: number) => (
    //                             <>
    //                               <Flex
    //                                 style={{
    //                                   flexDirection: "column",
    //                                   width: "40px",
    //                                 }}
    //                               >
    //                                 {item?.column_seats?.map(
    //                                   (column: any, index: number) => (
    //                                     <>
    //                                       {mainIndex === 0 && index === 0 && (
    //                                         <div className="w-100 h-40"> </div>
    //                                       )}
    //                                       {mainIndex === 0 && (
    //                                         <Text className="w-100 d-block h-32 py-1">
    //                                           {column.column_number}
    //                                         </Text>
    //                                       )}
    //                                     </>
    //                                   )
    //                                 )}
    //                               </Flex>
    //                               <Flex
    //                                 style={{
    //                                   flexDirection: "column",
    //                                   width: "40px",
    //                                 }}
    //                                 align="center"
    //                               >
    //                                 <Text className="w-100 h-40 text-center">
    //                                   {item.row_number}
    //                                 </Text>
    //                                 {item?.column_seats?.map((column: any) => (
    //                                   <>
    //                                     { column?.seat_code === "path" ?
    //                                       <Text
    //                                         className="cls-flight-seat-space"
    //                                       >
    //                                         <Text className="d-block h-25">
    //                                         </Text>
    //                                       </Text>
    //                                     :
    //                                     <Tooltip
    //                                       title={column?.seat_code + " : "}
    //                                     >
    //                                       <Text
    //                                         className="cls-flight-seat-space"
    //                                         onClick={() =>
    //                                           selectSeatHandler(column)
    //                                         }
    //                                       >
    //                                         <Text className="d-block h-25">
    //                                           {column?.icon ===
    //                                           "FdFreeSeatIcon" ? (
    //                                             <FdFreeSeatIcon />
    //                                           ) : column?.icon ===
    //                                             "FdUSD5SeatIcon" ? (
    //                                             <FdUSD5SeatIcon />
    //                                           ) : column?.icon ===
    //                                             "FdUSD10SeatIcon" ? (
    //                                             <FdUSD10SeatIcon />
    //                                           ) : column?.icon ===
    //                                             "FdBabySeatIcon" ? (
    //                                             <FdBabySeatIcon />
    //                                           ) : column?.icon ===
    //                                             "FdSelectedSeatIcon" ? (
    //                                             <FdSelectedSeatIcon />
    //                                           ) : column?.icon ===
    //                                             "FdOccupiedSeatIcon" ? (
    //                                             <FdOccupiedSeatIcon />
    //                                           ) : (
    //                                             <></>
    //                                           )}
    //                                         </Text>
    //                                       </Text>
    //                                     </Tooltip>
    //                                     }
    //                                   </>
    //                                 ))}
    //                               </Flex>
    //                             </>
    //                           ))
    //                         ) : (
    //                           <></>
    //                         )}
    //                       </Flex>
    //                     </Col>
    //                   </Row>
    //                 </Col>
    //               </Row>
    //             </Col>
    //           </Row>
    //         </Col>
    //       ) 
    //       : (
    //         <Spin size="large" style={{ display: "block" }} />
    //       )
    //       // </>
    //     }
    //   </Row>
    // </>
  );
};
export default Flight;
