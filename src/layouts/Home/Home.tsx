import { Col, Layout, Row } from "antd";
import styled from "styled-components";
import { HeaderItems } from "@/components/Header/Header";
import AccessibilityHeader from "@/components/AccessibilityHeader/AccessibilityHeader";
import "./Home.scss";
import { Logo } from "@/components/Logo/Logo";
import { SideBar } from "@/components/Menu/Menu";
import { useAppSelector } from "@/hooks/App.hook";
import { useAuth } from "@/hooks/Auth.hook";
import CFG from "@/config/config.json";
import { ReactNode } from "react";
import { useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useResize } from "@/Utils/resize";

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
  }
`;
const HomeLayout = ({children}: { children: ReactNode }) => {
  const {isAuthenticated} = useAuth();
  const { isSmallScreen } = useResize(991);
  const [SairlineCode] = useSessionStorage("airlineCode");
  const { user } = useAppSelector((state: { user: any }) => state.user);
  let userName = user?.name;
  if (userName && userName.includes("@")) {
    userName = userName.split("@")[0];
    userName =
      userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
  }

  return (
    <ContainerLayout className="Home">
      {CFG.accessibility_pos === "horizontal" && <AccessibilityHeader />}
      <Header className="cls-header">
        <Row className="container cls-header-container">
          <Col xs={18} md={18} lg={10} xl={10} className="cls-logo-col">
            <Logo airline={SairlineCode ? SairlineCode : CFG.airline_code} />
          </Col>
          <HeaderItems />
        </Row>
      </Header>
      <Layout className="cls-home-content">
        {isAuthenticated ? (
          <SideBar position={"vertical"} />
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

export default HomeLayout;
