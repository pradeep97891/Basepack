import { Col, Layout, Row } from "antd";
import styled from "styled-components";
import AccessibilityHeader from "@/components/AccessibilityHeader/AccessibilityHeader";
import "./PlanB.scss";
import { Logo } from "@/components/Logo/Logo";
import { HeaderItems } from "@/components/Header/Header";
import { useAuth } from "@/hooks/Auth.hook";
import { useAppSelector } from "@/hooks/App.hook";
import { SideBar } from "@/components/Menu/Menu";
import { ReactNode } from "react";
import { useResize } from "@/Utils/resize";
const { Header, Content } = Layout;

const ContainerLayout = styled(Layout)`
  min-height: 100%;
  .ant-layout-header {
    padding: 0px;
    line-height: unset;
    height: 79px;

    .container {
      height: 100%;
      padding: 0px 28px;
      align-items: center;
      box-shadow: 2px 4px 9px 0px #0000000f;
      justify-content: space-between;

      a[title=""] {
        display: inline-block;
      }
    }
  }
  .ant-layout {
    padding-top: 0px;
  }
`;

const Container = ({children} : {children : ReactNode}) => {
  const {isAuthenticated} = useAuth();
  const { user } = useAppSelector((state: { user: any }) => state.user);
  const responsive = window.matchMedia(
    "(min-width: 320px) and (max-width: 767px)"
  ).matches;
  const { isSmallScreen } = useResize(991);

  let userName = user?.name;
  if (userName && userName.includes("@")) {
    userName = userName.split("@")[0];
    userName =
      userName.slice(0, 1).toUpperCase() + userName.slice(1).toLowerCase();
  }

  return (
    <>
      <ContainerLayout className="plan-b">
        <AccessibilityHeader />
        {/* <Affix> */}

        <Header className="cls-header">
          <Row className="container">
            { 
              !isAuthenticated && isSmallScreen
                ? <Col xs={3}></Col>
                : <></>
            }
            <Logo />
            {/* <BreadCrumb /> */}
            <HeaderItems />
          </Row>
        </Header>
        {/* </Affix> */}

        <Layout className="cls-layout-plan-b">
          {isAuthenticated && !responsive ? (
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
        {/* <Footer /> */}
      </ContainerLayout>
    </>
  );
};

export default Container;
