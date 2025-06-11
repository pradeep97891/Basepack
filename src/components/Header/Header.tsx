import {
  Row,
  Col,
  Avatar,
  Button,
  Popover,
  Typography,
  Drawer,
  Image,
  Tooltip,
} from "antd";
import {
  CompressOutlined,
  LogoutOutlined,
  EditOutlined,
} from "@ant-design/icons";
import "./Header.scss";
import { useEffect, useState } from "react";
import Language from "../Language/Language";
import { useAppSelector } from "@/hooks/App.hook";
import { ThemeChanger } from "../ThemeChanger/ThemeChanger";
import { Notification } from "../Notification/Notification";
import { useAuth } from "@/hooks/Auth.hook";
import { useTranslation } from "react-i18next";
import AccessibilityHeader from "../AccessibilityHeader/AccessibilityHeader";
import CFG from "@/config/config.json";
import { SideBar } from "@/components/Menu/Menu";
import { useEventListener } from "@/hooks/EventListener.hook";
import { useLocalStorage, useSessionStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";
import { useResize } from "@/Utils/resize";
import { FdPolicy } from "../Icons/MenuIcon";
const { Text } = Typography;

const HeaderItems = () => {
  const { isAuthenticated, logout } = useAuth();
  const { user } = useAppSelector((state: { user: any }) => state.user);
  const [isFullScreen, setIsFullscreen] = useState(true);
  const {redirect, isCurrentPathEqual} = useRedirect();
  const { t } = useTranslation();
  const [, , LremoveLayout] = useLocalStorage('layout');
  const isPlanBOrViewPnrInfo =
    isCurrentPathEqual("planB") ||
    isCurrentPathEqual("viewPnrInfo");
  const [SairlineCode] = useSessionStorage("airlineCode");
  const { isSmallScreen } = useResize(991);
  // Notification
  // const [pushNewTokenService, pushNewTokenResponse] = usePushTokenMutation();
  // const tokenSentRef = useRef(false);

  // const userDetail = hydrateUserFromLocalStorage();
  /* Posting tokenData when user logged in if token already not sent */
  useEffect(() => {
    // if (tokenSentRef.current) return;
    // tokenSentRef.current = true;
    // if (localStorage.getItem('firebaseToken') === 'true') {
    //   return;
    // }
    // reqToken()
    //   .then((currentToken: any) => {
    //     const pushTokenPostData = {
    //       email_id: userDetail?.email,
    //       fcm_token: currentToken,
    //       project_code: 'GRM'
    //     };
    //     return;
    //   })
    //   .then((resolvedValue: any) => {
    //     if (resolvedValue.data.responseCode === 0) {
    //       localStorage.setItem('firebaseToken', JSON.stringify(true));
    //     }
    //   })
    //   .catch((error: any) => {
    //     console.log('An error occurred:', error);
    //     localStorage.setItem('firebaseToken', JSON.stringify(false));
    // });
  }, []);

  let userName = user?.firstName + " " + user?.lastName;

  let userRole;
  if (user?.groups?.length) {
    userRole = user.groups.find((group : string) => group.includes('fdms')).split("_").splice(1).join(" "); // Split the string into an array of word
    userRole = userRole.charAt(0).toUpperCase() + userRole.substring(1);
  }

  const toggleScreen = () => {
    !document.fullscreenElement
      ? document.documentElement.requestFullscreen()
      : document.exitFullscreen();
  };

  const handleFullscreenChange = () => {
    !document.fullscreenElement
      ? setIsFullscreen(true)
      : setIsFullscreen(false);
  };

  // Add event listener for fullscreen change
  useEventListener("fullscreenchange", handleFullscreenChange, document);

  // For Focus issue fix - accessibility section
  const changeFocus = (e: React.KeyboardEvent) => {
    const currElement = e.target as HTMLElement;
    e.key === "Tab" &&
      !(e.key === "Tab" && e.shiftKey) &&
      !!document.querySelectorAll(".cls-accessibility-popover")[0] &&
      !document
        .querySelectorAll(".cls-accessibility-popover")[0]
        .classList.contains("ant-popover-hidden") &&
      e.preventDefault();
    setTimeout(() => {
      if (
        !!document.querySelectorAll(".cls-accessibility-popover")[0] &&
        !document
          .querySelectorAll(".cls-accessibility-popover")[0]
          .classList.contains("ant-popover-hidden")
      ) {
        const element = document.querySelectorAll(
          ".cls-accessibility-popover .cls-default"
        )[0] as HTMLElement;
        (e.key === "Enter" || e.key === "Space") &&
          element.clientWidth &&
          element.focus();
        e.key === "Tab" &&
          !(e.key === "Tab" && e.shiftKey) &&
          element.clientWidth &&
          element.focus();
      } else {
        (e.key === "Enter" || e.key === "Space") && currElement.focus();
      }
    }, 300);
  };

  const closeMenu = (data: boolean) => {
    setOpenMobMenu(data);
  };

  const [openMobMenu, setOpenMobMenu] = useState(false);

  const dynamicImagePath = require(
    `@/plugins/${SairlineCode ? SairlineCode : CFG.airline_code}/assets/images/loginLogo.svg`
  );

  const onLogoutClick = async () => {
    LremoveLayout();
    await logout();
    window.location.href = "/";
  };

  return (
    <>
      <Col
        flex="auto"
        xs={3}
        md={3}
        lg={14}
        xl={14}
        className="menu-row HeaderItems"
        data-testid="header"
      >
        <Row justify="end">
          <Col className="header-side-buttons d-flex">
            {CFG.accessibility_pos === "vertical" && (
              <Popover
                trigger="click"
                overlayClassName="cls-accessibility-popover"
                placement="bottom"
                content={<AccessibilityHeader />}
                title={null}
              >
                <Button
                  type="link"
                  className="cls-accessibility"
                  onKeyDown={changeFocus}
                >
                  {t("accessibility")}
                </Button>
              </Popover>
            )}
            <Button type="link" style={{ paddingRight: 0 }}>
              <Language />
            </Button>
            {isAuthenticated ? <ThemeChanger /> : ""}
            <Button
              type="link"
              onClick={toggleScreen}
              className="cls-toggle-screen"
              style={{width: 16}}
            >
              {!isFullScreen ? (
                <Tooltip title={t("compress_screen")}>
                  <CompressOutlined className="cls-screen-expand-collapse" />
                </Tooltip>
              ) : (
                <Tooltip title={t("expand_screen")}>
                  <Text className="Infi-Fd_03_Expand cls-expand-icon"></Text>
                </Tooltip>
              )}
            </Button>
            {!isPlanBOrViewPnrInfo || isAuthenticated ? <Notification /> : ""}
            {isAuthenticated ? (
              <Button type="link">
                <Popover
                  trigger="click"
                  overlayClassName="user-actions"
                  placement="bottomRight"
                  content={<ProfileDropDown />}
                  title={null}
                  className="cls-user-dropdown"
                >
                  <Tooltip title={t("profile_photo")}>
                    <Avatar
                      shape="circle"
                      alt={userName}
                      children={<>{userName?.slice(0, 1)}</>}
                    />
                  </Tooltip>
                  <Typography.Text className={`loggedUser`}>
                      <span className="cls-logged-username">
                        {userName}
                      </span>
                      <span className="cls-logged-userrole">
                        {userRole}
                      </span>
                  </Typography.Text>
                  <Text className="cls-arrow-icon Infi-Fd_04_DropdownArrow">
                    {" "}
                  </Text>
                </Popover>
              </Button>
            ) : (
              ""
            )}
            {isPlanBOrViewPnrInfo && !isAuthenticated ? (
              <Button
                type="link"
                className="cls-signin"
                onClick={() => redirect("login")}
              >
                {t("sign_in")}
              </Button>
            ) : (
              ""
            )}
          </Col>
        </Row>
      </Col>
      {(isAuthenticated && isSmallScreen) && (
        <>
          <Col className="cls-mob-user" xs={3}>
            <Avatar
              onClick={() => setOpenMobMenu(true)}
              shape="circle"
              alt={userName}
              children={<>{userName?.slice(0, 1)}</>}
            />
          </Col>
          <Drawer
            width={"72%"}
            className="cls-mob-menu"
            placement={"left"}
            closable={false}
            onClose={() => setOpenMobMenu(false)}
            open={openMobMenu}
            zIndex={100}
            key={"menuDrawer"}
          >
            <Text className="cls-user-info">
              <Avatar
                shape="circle"
                alt={userName}
                children={<>{userName?.slice(0, 1)}</>}
              />
              <Typography.Text className={`loggedUser`}>
                <Text title={userName} className="cls-logged-username">
                  {userName}
                </Text>
                <Text title={userRole} className="cls-logged-userrole">
                  {userRole}
                </Text>
              </Typography.Text>
            </Text>
            <SideBar position={"inline"} onData={closeMenu} />
            <Button type="link" className="d-block w-100 text-left fs-16 f-med cls-logoutBtn" onClick={onLogoutClick}> 
              <FdPolicy />
              Logout 
            </Button>
            <Text className="cls-mob-logo">
              <Image src={dynamicImagePath}></Image>
            </Text>
          </Drawer>
        </>
      )}
    </>
  );
};

const ProfileDropDown = () => {
  const { t } = useTranslation();
  const {redirect} = useRedirect();
  //To redirect on login page after logout
  const { isAuthenticated, logout } = useAuth();
  const [, , LremoveLayout] = useLocalStorage('layout');

  useEffect(() => {
    if (isAuthenticated === false) window.location.href = "/";
  }, [isAuthenticated]);

  const onLogoutClick = async () => {
    LremoveLayout();
    await logout();
    window.location.href = "/";
  };

  return (
    <ul className="mb-0">
      <li>
        <Button
          block
          icon={<EditOutlined />}
          style={{ textAlign: "left" }}
          type="text"
          onClick={()=>redirect("editUser")}
        >
          {t("edit_profile")}
        </Button>
      </li>
      <li>
        <Button
          onClick={onLogoutClick}
          block
          style={{ justifyContent: "flex-start" }}
          icon={<LogoutOutlined rotate={180} />}
          type="text"
        >
          {t("logout")}
        </Button>
      </li>
    </ul>
  );
};

export { HeaderItems, ProfileDropDown };
