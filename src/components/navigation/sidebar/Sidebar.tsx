import React from 'react';
import { SidebarProps } from './Sidebar.d';

import CSS from './Sidebar.module.scss';
import { toCss } from './../../../util/util';
import Button from '../../ui/button/Button';
const {
    sidebar: s_sidebar,
    logoutArea: s_logoutArea,
} = CSS;

export default function(props: SidebarProps): JSX.Element {
    return (
        <div className={toCss(s_sidebar)}>

            <div className={toCss(s_logoutArea)}>
                <Button>Sign out</Button>
            </div>
        </div>
    )
}