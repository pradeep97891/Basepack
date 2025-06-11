import { Row, Col, Typography, Skeleton, Tooltip } from "antd";
import "./DescriptionHeader.scss";
import { useAuth } from "@/hooks/Auth.hook";
import { useTranslation } from "react-i18next";
import BreadcrumbComponent, {
  BreadcrumbItemProps,
} from "../Breadcrumb/Breadcrumb";
import { useResize } from "@/Utils/resize";
export interface ItineraryHeaderProps {
  data: {
    title: string;
    description?: string;
    primaryHeading?: string;
    primaryValue?: string;
    secondaryHeading?: string;
    secondaryValue?: string;
    breadcrumbProps?: BreadcrumbItemProps[] | undefined;
  } | undefined;
}

const DescriptionHeader = (props: ItineraryHeaderProps) => {
  const headerData = props?.data;
  const { Title, Text } = Typography;
  const { isAuthenticated } = useAuth();
  const { t } = useTranslation();
  const { isSmallScreen } = useResize();

  return (
    <div data-testid="DescriptionHeader" className="cls-description-header">
      {headerData?.breadcrumbProps ? (
        <BreadcrumbComponent
          key={headerData.title + "breadcrumb"}
          props={headerData?.breadcrumbProps}
        />
      ) : (
        <></>
      )}
      {headerData ? (
        <Row
          className={`mb-3 cls-headerTitle ${isAuthenticated ? "" : "cls-before-login"} `}
          justify="space-between"
        >
          <Col className="cls-header-left" xs={24} sm={11} md={12} lg={12} xl={16}>
            <Title level={3} className="cls-heading f-reg ">
              {headerData.title}
              { headerData?.description ?
                <Tooltip
                  className="cls-cursor-pointer"
                  title={<Text className="cls-description-tooltip fs-13 f-reg"> {headerData?.description} </Text>}
                  placement="bottom"
                >
                  <Text className={`Infi-Fd_15_Info d-iblock ${isSmallScreen ? "fs-23" : "fs-27"} pl-1 p-clr sbold valign-middle`} />    
                </Tooltip>
                : <></>
              }
            </Title>
            {/* <Text className="fs-13 f-reg cls-description">
              {headerData.description}
            </Text> */}
          </Col>
          {headerData?.primaryHeading && (
            <Col className="cls-pnr-section cls-bgLayout-text-color" xs={24} sm={13} md={12} lg={12} xl={8}>
              <Row justify="end">
                <Col className="cls-pnr-text">
                  {t(`${headerData.primaryHeading}`)} :
                    <Title
                      className={`cls-pnr-code cls-bgLayout-text-color d-iblock ${isSmallScreen ? "fs-14" : "fs-18"}`}
                      level={5}
                    >
                      &nbsp;{headerData.primaryValue}
                    </Title>
                </Col>
              </Row>
              {headerData?.secondaryHeading && (
                <Row justify="end" style={{marginLeft: isSmallScreen ? 0 : -10}}>
                  <Col className="cls-pnr-text">
                    {t(`${headerData.secondaryHeading}`)} :
                    <Text className={`cls-dob f-sbold ${isSmallScreen ? "py-1 fs-13" : "pl-1 fs-14"}`}>
                      {headerData?.secondaryValue}
                    </Text>
                  </Col>
                </Row>
              )}
            </Col>
          )}
        </Row>
      ) : (
        <>
          <Skeleton.Input active size="large" className="w-50 h-35 mb-3" />
          <Skeleton.Input active size="large" className="w-100 h-30 mb-3" />
        </>
      )}
    </div>
  );
};

export default DescriptionHeader;
