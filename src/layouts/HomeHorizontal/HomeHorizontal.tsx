import { Col, Layout, Row } from "antd";
import styled from "styled-components";
import { HeaderItems } from "@/components/Header/Header";
import AccessibilityHeader from "@/components/AccessibilityHeader/AccessibilityHeader";
import "./HomeHorizontal.scss";
import { Logo } from "@/components/Logo/Logo";
import { SideBar } from "@/components/Menu/Menu";
import { useAuth } from "@/hooks/Auth.hook";
import CFG from "@/config/config.json";
import { ReactNode } from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
const { Header, Content } = Layout;
const ContainerLayout = styled(Layout)`
  min-height: 100%;

  .ant-layout-header {
    padding: 0px;
    line-height: unset;

    .container {
      height: 100%;
      padding: 0px 28px;
      align-items: center;
    }
  }
  .ant-layout {
    &.ant-layout-has-sider {
      margin-top: 22px;
    }
  }
`;
const HomeHorizontalLayout = ({children}: { children: ReactNode }) => {
  const {isAuthenticated} = useAuth();
  const [SairlineCode] = useSessionStorage("airlineCode");
  const responsive = window.matchMedia(
    "(min-width: 320px) and (max-width: 767px)"
  ).matches;

  return (
    <ContainerLayout className="HomeHorizontal">
      {CFG.accessibility_pos === "horizontal" && <AccessibilityHeader />}
      <Header className="cls-header cls-header-container">
        <Row className="container">
          <Col xs={19} md={10} className="cls-logo-col">
            <Logo airline={SairlineCode ? SairlineCode : CFG.airline_code} />
          </Col>
          <HeaderItems />
        </Row>
      </Header>
      <Layout className="cls-home-content">
        {isAuthenticated && !responsive ? (
          <SideBar position={"horizontal"} />
        ) : (
          ""
        )}
        <Layout className="layout">
          <Content className="content">
            {children}
          </Content>
        </Layout>
      </Layout>
    </ContainerLayout>
  );
};

export default HomeHorizontalLayout;
