import { NavigationItemConfig } from "../navigationItems/NavigationItems";

export interface SideDrawerProps {
    imgUrl?: string;
    displayName: string;
    onLogout: Function;
    navItems: Array<NavigationItemConfig>;
}