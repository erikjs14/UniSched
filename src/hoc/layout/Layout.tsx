import React, { PropsWithChildren, Fragment } from 'react';

import Sidebar from '../../components/navigation/sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../store/actions/dispatcher';
import navConfig from '../../config/nav';
import { RootState } from '../../index';

import CSS from './Layout.module.scss';
import { toCss } from './../../util/util';
import SideDrawer from '../../components/navigation/sidedrawer/SideDrawer';
const {
    navDesktop: s_navDesktop,
    navMobile: s_navMobile,
    main: s_main,
} = CSS;

export default function(props: PropsWithChildren<{}>): JSX.Element {

    const dispatch = useDispatch();

    let [displayName, imgUrl] = useSelector((state: RootState) => [state.user.username, state.user.userImgUrl]);
    if (!displayName) displayName = 'User';

    return (
        <Fragment>
            <nav className={toCss(s_navDesktop)}>
                <Sidebar 
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)} 
                    displayName={displayName}
                    imgUrl={imgUrl ? imgUrl : 'img/cute_dog.jpg'}
                />
            </nav>

            <nav className={toCss(s_navMobile)}>
                <SideDrawer
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)}
                    displayName={displayName}
                    imgUrl={imgUrl ? imgUrl : 'img/cute_dog.jpg'}
                />  
            </nav>

            <main className={toCss(s_main)}>
                {props.children}
            </main>
        </Fragment>
    )
}