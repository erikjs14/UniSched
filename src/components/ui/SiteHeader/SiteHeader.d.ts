import { IconType } from '../../../config/globalTypes';

export interface SiteHeaderProps {
    type: IconType;
    title: string;
    onRefresh?: Function;
    refreshing?: boolean;
}