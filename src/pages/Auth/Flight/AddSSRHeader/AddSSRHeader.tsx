import { Button, Col, Flex, Radio, Row, Skeleton, Typography } from "antd";
import React, { useEffect } from "react";
import "./AddSSRHeader.scss";
import { useTranslation } from "react-i18next";
import { useResize } from "@/Utils/resize";
const { Text } = Typography;

const AddSSRHeader = (props: any) => {
  const { t } = useTranslation();
  const { isSmallScreen } = useResize(991);
  const flightHeaderData = props?.pnrData[0]?.rebookOptionalFlightDetails;
  const servicesList: any = [
    {
      serviceName: t("meals"),
      serviceIcon: <Text className="Infi-Fd_54_Meals"></Text>,
    },
    {
      serviceName: t("baggage"),
      serviceIcon: <Text className="Infi-Fd_57_BaggageLite"></Text>,
    },
    {
      serviceName: t("seat"),
      serviceIcon: <Text className="Infi-Fd_56_SeatLite"></Text>,
    }
  ];

  useEffect(()=>{
    var getIndex = 0;
    Array.from(document.getElementsByClassName("cls-ssr-btns")).forEach((element, index) => {
      if(element.classList.contains("active")) {
        getIndex = index;
      }
    });
    btnActiveHandler(getIndex);
  },[props])

  const btnActiveHandler = (index:number) => {
    Array.from(document.getElementsByClassName("cls-ssr-btns")).forEach((element) => {
      element.classList.remove("active");
    });
    document.getElementsByClassName("cls-ssr-btns")[index]?.classList?.add("active");
  }

  useEffect(() => {
    (document.querySelector(".cls-ssr-btns.active") as any)?.click();
  }, [t]);  

  return (
    <Row className="cls-addSSRTabs mt-2 ml-3" data-testid="addSSRTabs">
      <Col span={24} className="py-2 cls-addSSRHeadCol">
        <Row justify="space-between">
          { flightHeaderData ? (
            <>
              <Col span={24}>
                <Radio.Group
                  defaultValue="0-0"
                  size="large"
                  className="cls-trip-btn pt-2 ml-2"
                  onChange={(e) => props.handleTripSelection(e)}
                >
                  {flightHeaderData
                    ? flightHeaderData?.map((flight: any, index: number) => {
                      if (flight?.statusCode !== "HK") {
                        return flight?.flightDetails?.map((flightDetail: any, detailIndex: number) => {
                          return (
                            <Radio.Button
                              type="text"
                              value={index + "-" + detailIndex}
                            >
                              {flightDetail.originAirportCode} - {flightDetail.destinationAirportCode} |
                              <Text className="cls-fv-number pl-1">
                                {flightDetail.flightNumber.split(",")[0]}
                              </Text>
                            </Radio.Button>
                          );
                        });
                      }
                      return null;
                    })
                    : <></>
                  }
                </Radio.Group>
              </Col>
              <Col className="pt-2 pl-2" span={24}>
                <Text
                  className="mr-3 cls-flight-header-btn cls-fv-header-row d-flex"
                  style={{ border: "1px solid var(--t-flight-view-btn-border-color)", borderRadius: "5px" }}
                >
                  {
                    servicesList?.map((value: any, index: number) => {
                      return (
                        <Text
                          className="cls-header-btn"
                          key={"serviceList" + index}
                        >
                          <Button
                            block
                            type="text"
                            className="cls-ssr-btns"
                            style={{
                              verticalAlign: "middle",
                              fontSize: "15px",
                            }}
                            onClick={(e) => {
                              btnActiveHandler(index);
                              props.onChange(value.serviceName); // Call the props.onChange function in parent
                            }}
                            icon={value.serviceIcon}
                          >
                            {value.serviceName}
                          </Button>
                        </Text>
                      );
                    })
                  }
                </Text>
              </Col>
            </>
          ) : (
            <Flex className="w-100 pr-3" justify="space-between">
              <Skeleton.Input active size="large" />
              <Flex gap="20px">
                {[...Array(3)].map((_, skeletonIndex) => (
                  <React.Fragment key={"skeleton" + skeletonIndex}>
                    <Skeleton.Button active size="large" />
                  </React.Fragment>
                ))}
              </Flex>
            </Flex>
          )}
        </Row>
      </Col>
    </Row>
  );
};
export default AddSSRHeader;
