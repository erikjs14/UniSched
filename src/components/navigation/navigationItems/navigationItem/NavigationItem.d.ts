import { PropsWithChildren } from 'react';

export interface NavigationItemProps extends PropsWithChildren<{}> {
    link: string;
}