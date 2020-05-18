import { NavigationItemConfig } from "../navigationItems/NavigationItems";

export interface SidebarProps {
    imgUrl?: string;
    displayName: string;
    onLogout: Function;
    navItems: Array<NavigationItemConfig>;
}