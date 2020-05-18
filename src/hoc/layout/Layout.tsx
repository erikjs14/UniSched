import React, { PropsWithChildren, Fragment } from 'react';

import Sidebar from '../../components/navigation/sidebar/Sidebar';
import { useDispatch, useSelector } from 'react-redux';

import { logout } from '../../store/actions/dispatcher';
import navConfig from '../../config/nav';
import { RootState } from '../../index';

export default function(props: PropsWithChildren<{}>): JSX.Element {

    const dispatch = useDispatch();

    let [displayName, imgUrl] = useSelector((state: RootState) => [state.user.username, state.user.userImgUrl]);
    if (!displayName) displayName = 'User';

    return (
        <Fragment>
            <nav>
                <Sidebar 
                    navItems={navConfig}
                    onLogout={() => logout(dispatch)} 
                    displayName={displayName}
                    imgUrl={imgUrl ? imgUrl : undefined}
                />
            </nav>

            <main>
                {props.children}
            </main>
        </Fragment>
    )
}