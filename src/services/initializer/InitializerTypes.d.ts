export interface RouterResponse {
  path: string;
  layout: string;
  component: string;
  title: string;
  description: string;
  default?: boolean;
}

export interface MenuInterface {
  name: string;
  path: string;
  iconName: string;
  subMenu?: SubMenuInterface[];
}

export interface SubMenuInterface {
  name: string;
  path: string;
  iconName?: string;
}

export interface MenuServiceInterface {
  menu_code: string;
  path: string;
  icon_name: string;
  sub_menu?: SubMenuServiceInterface[];
}
