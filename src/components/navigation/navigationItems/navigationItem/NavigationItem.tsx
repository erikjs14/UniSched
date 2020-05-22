import React from 'react';
import { NavLink } from 'react-router-dom';

import CSS from './NavigationItem.module.scss';
import { NavigationItemProps } from './NavigationItem.d';
import { toCss } from './../../../../util/util';
const {
    navItem: s_navItem,
    active: s_active,
} = CSS;

export default function(props: NavigationItemProps): JSX.Element {
    return (
        <li className={toCss(s_navItem)}>
            <NavLink
                exact to={props.link}
                activeClassName={s_active}
                onClick={() => props.onClick()}
            >
                {props.children}
            </NavLink>
        </li>
    )
}