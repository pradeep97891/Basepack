import { Col, Row, Button } from "antd";
import Language from "@/components/Language/Language";
import "./PageNotFound.scss";
import { Logo } from "@/components/Logo/Logo";
import { Theme } from "@/components/Theme/Theme";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

const PageNotFound = () => {
  const [LprevRoute,] = useLocalStorage<string>('pr');
  const {redirect} = useRedirect()
  
  return (
    <>
      <Row data-testid="PageNotFound" align="middle" justify="start" className="cls-pagenotfound-header">
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
      <Row align="middle" justify="center" className="PageNotFound">
        <Col xs={24} sm={24} md={24} lg={24} xl={24}>
          <div className="image-con">
            <div className="image"></div>
          </div>
          <div className="heading">Page not found !</div>
          <div className="help-text">
            We can’t find the page you are looking for
          </div>
          { LprevRoute && 
          <Button type="primary" onClick={()=>redirect(-1)}>
            Back to previous page
          </Button>
          }
        </Col>
      </Row>
    </>
  );
};

export default PageNotFound;
