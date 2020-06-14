import React, { PropsWithChildren, Fragment, useMemo, useRef, useEffect } from 'react';
import cuteDog from '../../assets/img/cute_dog.jpg';
import bird1 from '../../assets/img/bird1.jpeg';
import bird2 from '../../assets/img/bird2.jpeg';
import bird3 from '../../assets/img/bird3.jpeg';
import bird4 from '../../assets/img/bird4.jpeg';
import bird5 from '../../assets/img/bird5.jpeg';
import bird6 from '../../assets/img/bird6.jpeg';
import bird7 from '../../assets/img/bird7.jpeg';
import bird8 from '../../assets/img/bird8.jpeg';
import bird9 from '../../assets/img/bird9.jpeg';
import bird10 from '../../assets/img/bird10.jpeg';
import bird11 from '../../assets/img/bird11.jpeg';
import bird12 from '../../assets/img/bird12.jpeg';

import Sidebar from '../../components/navigation/sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';
import * as actions from '../../store/actions';
import BackTop from '../../components/backtop/BackTop';

import { logout } from '../../store/actions/dispatcher';
import navConfig from '../../config/nav';
import { RootState } from '../../index';

import CSS from './Layout.module.scss';
import { toCss } from './../../util/util';
import SideDrawer from '../../components/navigation/sidedrawer/SideDrawer';
import { PREF_ID_ACTIVATE_RANDOM_AVATAR } from '../../config/userPreferences';
const {
    navDesktop: s_navDesktop,
    navMobile: s_navMobile,
    main: s_main,
} = CSS;

export default function(props: PropsWithChildren<{}>): JSX.Element {

    const dispatch = useDispatch();
    const useRandomAvatar = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_ACTIVATE_RANDOM_AVATAR]);

    let [displayName, imgUrl] = useSelector((state: RootState) => [state.user.username, state.user.userImgUrl]);
    if (!displayName) displayName = 'User';

    const randomUserIconUrl = useMemo(() => {
        const options = [cuteDog, bird1, bird2, bird3, bird4, bird5, bird6, bird7, bird8, bird9, bird10, bird11, bird12];
        return options[(Math.floor(Math.random() * 13))];
    }, []);

    const scrollContainerRef = useRef(null);
    useEffect(() => {
        dispatch(actions.setScrollContainerRef(scrollContainerRef));
    }, [dispatch]);

    return (
        <Fragment>
            <nav className={toCss(s_navDesktop)}>
                <Sidebar 
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)} 
                    displayName={displayName}
                    imgUrl={imgUrl && !useRandomAvatar ? imgUrl : randomUserIconUrl}
                />
            </nav>

            <nav className={toCss(s_navMobile)}>
                <SideDrawer
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)}
                    displayName={displayName}
                    imgUrl={imgUrl && !useRandomAvatar ? imgUrl : randomUserIconUrl}
                />
            </nav>

            <main ref={scrollContainerRef} className={toCss(s_main)}>
                {props.children}
                <BackTop />
            </main>
        </Fragment>
    )
}