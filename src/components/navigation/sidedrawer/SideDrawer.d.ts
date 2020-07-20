import { NavigationItemConfig } from "../navigationItems/NavigationItems";

export interface SideDrawerProps {
    imgUrl?: string;
    displayName: string;
    onLogout: Function;
    onPlus: Function;
    navItems: Array<NavigationItemConfig>;
    showQuickAddToggle?: boolean;
    onQuickAdd?: Function;
}