import "./ServerError.scss";
import { Logo } from "@/components/Logo/Logo";
import { Button, Col, Flex, List, Row, Typography } from "antd";
import { Theme } from "@/components/Theme/Theme";
import Language from "@/components/Language/Language";
import { useAuth } from "@/hooks/Auth.hook";

const ServerError: React.FC = () => {
  const { Text, Title } = Typography;

  //To redirect on login page after logout
  const { isAuthenticated, logout } = useAuth();

  const redirectToLoginHandler = async () => {
    if(isAuthenticated) await logout();
    window.location.href = "/";
  };

  const data = [
    "Ensure that you are connected to the internet.",
    "Try clearing your browser's cache and cookies.",
    "The issue might be temporary. Please try again later.",
    "If the problem persists, please contact our support team.",
  ];

  return (
    <>
      <Row
        data-testid="serverError"
        align="middle"
        justify="start"
        className="cls-pagenotfound-header"
      >
      <Col xs={24} sm={13} md={16} lg={17} xl={19}>
          <Logo />
        </Col>
        <Col xs={15} sm={7} md={5} lg={4} xl={3}>
          <Theme />
        </Col>
        <Col xs={9} sm={4} md={3} lg={3} xl={2}>
          <Language />
        </Col>
      </Row>
      <Row
        align="middle"
        justify="center"
        className="cls-server-error-container"
        gutter={10}
      >
        <Col span={24}>
        <div className="cls-image-con">
          <div className="cls-image"></div>
        </div>
          <Title className="cls-heading mt-3">Something went wrong !</Title>
          <Text className="cls-help-text">
            We encountered an unexpected error.
          </Text>
        </Col>
        <Col>
          <List
            bordered
            dataSource={data}
            renderItem={(item) => (
              <List.Item>
                <span dangerouslySetInnerHTML={{ __html: item }} />
              </List.Item>
            )}
          ></List>
          <Flex align="center" justify="center" className="mt-2">
            <Text>
              You can return to the{" "}
              <Button
                type="link"
                className="cls-login-btn fs-14 f-med p-0"
                onClick={redirectToLoginHandler}
              >
                login
              </Button>{" "}
              page and navigate from there.
            </Text>
          </Flex>
        </Col>
      </Row>
    </>
  );
};

export default ServerError;
