import React, { PropsWithChildren, Fragment, useCallback } from 'react';
import cuteDog from '../../assets/img/cute_dog.jpg';
import bird1 from '../../assets/img/bird1.jpeg';
import bird2 from '../../assets/img/bird2.jpeg';
import bird3 from '../../assets/img/bird3.jpeg';
import bird4 from '../../assets/img/bird4.jpeg';
import bird5 from '../../assets/img/bird5.jpeg';
import bird6 from '../../assets/img/bird6.jpeg';
import bird7 from '../../assets/img/bird7.jpeg';
import bird8 from '../../assets/img/bird8.jpeg';

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

    const getRandomUserIconUrl = useCallback((maxNr: number) => {
        const options = [cuteDog, bird1, bird2, bird3, bird4, bird5, bird6, bird7, bird8];
        return options[(Math.floor(Math.random() * maxNr))];
    }, []);

    return (
        <Fragment>
            <nav className={toCss(s_navDesktop)}>
                <Sidebar 
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)} 
                    displayName={displayName}
                    imgUrl={imgUrl ? imgUrl : getRandomUserIconUrl(9)}
                />
            </nav>

            <nav className={toCss(s_navMobile)}>
                <SideDrawer
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)}
                    displayName={displayName}
                    imgUrl={imgUrl ? imgUrl : getRandomUserIconUrl(9)}
                />  
            </nav>

            <main className={toCss(s_main)}>
                {props.children}
            </main>
        </Fragment>
    )
}