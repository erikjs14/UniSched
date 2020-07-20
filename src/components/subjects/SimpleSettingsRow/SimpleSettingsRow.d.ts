import { IconType } from '../../../config/globalTypes';

export interface SimpleSettingsRowProps {
    title: string;
    icon?: IconType;
    bgColor: string;
    linkTo?: string;
    onClick?: Function;
    noHover?: boolean;
    darkenBy?: number;
    outline?: boolean;
}