import { IconType } from '../../../config/globalTypes';

export interface SiteHeaderProps {
    type: IconType;
    title: string;
    subTitle?: string;
    onRefresh?: Function;
    refreshing?: boolean;
}