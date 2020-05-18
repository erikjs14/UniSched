import React, { PropsWithChildren, Fragment } from 'react';

import Sidebar from '../../components/navigation/sidebar/Sidebar';
import { useDispatch } from 'react-redux';

import { logout } from '../../store/actions/dispatcher';

export default function(props: PropsWithChildren<{}>): JSX.Element {

    const dispatch = useDispatch();

    return (
        <Fragment>
            <nav>
                <Sidebar onLogout={() => logout(dispatch)} />
            </nav>

            <main>
                {props.children}
            </main>
        </Fragment>
    )
}