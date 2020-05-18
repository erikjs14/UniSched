import React, { PropsWithChildren, Fragment } from 'react';

import Sidebar from '../../components/navigation/sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../store/actions/dispatcher';
import navConfig from '../../config/nav';
import { RootState } from '../../index';

import CSS from './Layout.module.scss';
import { toCss } from './../../util/util';
const {
    nav: s_nav,
    main: s_main,
} = CSS;

export default function(props: PropsWithChildren<{}>): JSX.Element {

    const dispatch = useDispatch();

    let [displayName, imgUrl] = useSelector((state: RootState) => [state.user.username, state.user.userImgUrl]);
    if (!displayName) displayName = 'User';

    return (
        <Fragment>
            <nav className={toCss(s_nav)}>
                <Sidebar 
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