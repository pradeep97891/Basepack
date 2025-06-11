import { Layout, Menu, Typography } from "antd";
import { SkeletonLoaderMenuItem } from "../UI/SkeletonLoader/SkeletonLoader";
import Icon from "@ant-design/icons";
import "./Menu.scss";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Icons } from "../Icons/MenuIcon";
import { useDispatch } from "react-redux";
import { setMenuSelectionData } from "@/stores/menu.store";
import { useAppSelector } from "@/hooks/App.hook";
import SubMenu from "antd/es/menu/SubMenu";
import { MenuProps } from "antd/lib/menu/menu";
import { useLocation } from "react-router-dom";
import { useLocalStorage } from "@/hooks/BrowserStorage.hook";
import { useRedirect } from "@/hooks/Redirect.hook";

const Text = Typography;

const { Sider } = Layout;

export interface sideBarProps {
  position: MenuProps["mode"] | undefined;
  placement?: string;
  onData?: (data: any) => void;
}

/**
 * React component for rendering a sidebar menu.Handles menu item selection, rendering menu items, and adjusting layout based on position.
 * @param position MenuProps["mode"] | undefined - Position of the menu ("horizontal", "inline", or "vertical").
 * @param placement? string - Optional placement of the menu.
 * @param onData? Optional callback function to send data to parent component.
 */
const SideBar = ({ onData, position, placement }: sideBarProps) => {
  const dispatch = useDispatch();
  const {currentPath, isCurrentPathEqual } = useRedirect();
  const [currentMenu, setCurrentmenu] = useState(
    isCurrentPathEqual("dashboard") ? "Dashboard" : ""
  );
  const [currentSubMenu, setCurrentSubMenu] = useState("");
  const responsive = window.matchMedia(
    "(min-width: 320px) and (max-width: 767px)"
  ).matches;
  const { menuServiceData } = useAppSelector(
    (state) => state.MenuServiceReducer
  );
  const { getEncryptedPath } = useRedirect();

  /* Localstorage menu value & handlers */
  const [, , LremoveMenu] = useLocalStorage("menu");

  useEffect(() => {
    if (menuServiceData) {
      const menuCode = getMatchingMenuCode(currentPath);
      if (menuCode) {
        setCurrentmenu(menuCode.menu);
        setCurrentSubMenu(menuCode.submenu || "");
      }
    }
    // eslint-disable-next-line
  }, [currentPath, menuServiceData]);

  /* Finds matching menu code based on currentPath. */
  function getMatchingMenuCode(
    currentPath: string
  ): { menu: string; submenu?: string } | null {
    for (const menu of menuServiceData) {
      if (menu.path === currentPath) return { menu: menu.menu_code };
      else if (menu.subMenu.length > 0) {
        for (const subMenu of menu.subMenu)
          if (subMenu.path === currentPath)
            return { menu: menu.menu_code, submenu: subMenu.menu_code };
      }
    }
    return null;
  }

  /* Sends data to parent component */
  const sendDataToParent = (condition: any) => {
    if (onData) {
      onData(condition);
    }
  };

  /* Function to handle menu item click */
  const handleMenuClick = (e: any, parent: string) => {
    parent
      ? setMenuSelection(e?.key, e?.keyPath[1])
      : setMenuSelection("", e?.key);
    responsive && sendDataToParent(false);
  };

  /* Function to set menu selection and dispatch action */
  const setMenuSelection = (submenu: string, menu: string) => {
    /* Temporary */
    LremoveMenu();
    setCurrentmenu(menu);
    setCurrentSubMenu(submenu);
    dispatch(
      setMenuSelectionData({
        currentMenuData: menu,
        currentSubMenuData: submenu,
      })
    );
  };

  /* Function to render menu items recursively */
  const renderMenuItems = (menuData: any[]) => {
    if (menuData && !menuData.length) {
      return [...Array(5)].map((_, index) => (
        <Text className="cls-skeleton-div" key={index}>
          <SkeletonLoaderMenuItem key={index} />
        </Text>
      ));
    } else {
      return menuData?.map((item) => {
        if (item?.subMenu?.length) {
          return (
            <SubMenu
              className={
                currentMenu === item?.menu_code
                  ? "ant-menu-submenu-selected"
                  : ""
              }
              key={item?.menu_code}
              title={item.menu_code}
              icon={<Icon component={Icons.get(item.icon_name)} />}
            >
              {renderMenuItems(item.subMenu)}
            </SubMenu>
          );
        } else {
          return (
            <Menu.Item
              key={item?.menu_code}
              className="cls-submenu-menu"
              onClick={(e) => {
                handleMenuClick(e, item?.parent_menu);
              }}
            >
              <Link to={getEncryptedPath(item.path)} />
              <Icon component={Icons.get(item.icon_name)} />
              <Text className="content">{item.menu_code}</Text>
            </Menu.Item>
          );
        }
      });
    }
  };

  const menuComponent = (
    <Menu
      data-testid="Menu"
      mode={position}
      selectedKeys={[currentMenu, currentSubMenu]}
      className={
        position === "horizontal"
          ? "cls-horizontal-menu"
          : position === "inline"
            ? "cls-inline-menu"
            : ""
      }
      style={{ display: "block" }}
    >
      {renderMenuItems(menuServiceData)}
    </Menu>
  );

  return menuServiceData?.length ? (
    position !== "vertical" ? (
      <>{menuComponent}</>
    ) : (
      <Sider
        width={"88px"}
        collapsedWidth="50px"
        breakpoint="md"
        className="Menu"
        key={position + "menu"}
        data-testid="Menu"
      >
        {menuComponent}
      </Sider>
    )
  ) : (
    <></>
  );
};

export { SideBar };
