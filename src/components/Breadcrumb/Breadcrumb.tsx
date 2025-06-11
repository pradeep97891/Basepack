import React from "react";
import { Breadcrumb, Typography } from "antd";
import { Link } from "react-router-dom";
import { setMenuSelectionData } from "@/stores/menu.store";
import "./Breadcrumb.scss";
import { useDispatch } from "react-redux";
import { useRedirect } from "@/hooks/Redirect.hook";

const { Text } = Typography;

export interface BreadcrumbItemProps {
  path: string;
  title: string;
  breadcrumbName: string;
  key: string;
}

interface BreadcrumbProps {
  props: BreadcrumbItemProps[];
}

const BreadcrumbComponent: React.FC<BreadcrumbProps> = ({ props }) => {
  const {
    currentPath,
    isCurrentPathEqual,
    getEncryptedPath,
    getDecryptedPath,
  } = useRedirect();
  const dispatch = useDispatch();

  const setMenuFromBreadcrumb = (menu: string, submenu: string) => {
    dispatch(
      setMenuSelectionData({
        currentMenuData: menu,
        currentSubMenuData: submenu,
      })
    );
  };

  const itemRender = (route: any) => {
    // Decrypt the current pathname for comparison
    return isCurrentPathEqual(route.path) ? ( // Compare decrypted path
      <div key={route.key}>{route.title}</div>
    ) : (
      <Link
        key={route.key}
        to={getEncryptedPath(route.path)} // Encrypt the breadcrumb path
        onClick={() => setMenuFromBreadcrumb(route.breadcrumbName, route.key)}
      >
        {route.title}
      </Link>
    );
  };

  return (
    <Breadcrumb
      data-testid="Breadcrumb"
      itemRender={itemRender}
      items={props}
      separator={<Text className="cls-breadcrumbSeparator Infi-Fd_06_DownArrow"></Text>}
    />
  );
};

export default BreadcrumbComponent;
