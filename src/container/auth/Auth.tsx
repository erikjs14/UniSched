import React, { useEffect, Fragment } from 'react';
import { showAuthUI } from '../../firebase/firebase';
import { toCss } from './../../util/util';
import { RootState } from '../../index';
import Button from '../../components/ui/button/Button';
import Loader from '../../components/ui/loader/Loader';
import { logout } from '../../store/actions/dispatcher';

import CSS from './Auth.module.scss';
import { useSelector, useDispatch } from 'react-redux';
const {
    wrapper: s_wrapper,
    authUI: s_authUI,
    authDescr: s_authDescr,
    authHeader: s_authHeader,
} = CSS;  

export default function() {

    const loading = useSelector((state: RootState) => state.user.globalLoading);
    const isAuthenticated = useSelector((state: RootState) => state.user.username !== null);

    useEffect((): void => {
        if (!isAuthenticated) showAuthUI('#firebase-auth-container');
    }, [isAuthenticated])

    const dispatch = useDispatch();

    const authUI = (
        loading 
            ? <Loader />
            : isAuthenticated
                ? <Button onClick={() => logout(dispatch)} fontSize='2.5rem'>Sign out</Button>
                : (
                    <Fragment>
                        <h1 className={toCss(s_authHeader)}>Sign in or Register</h1>
                        <div className={toCss('util-card', 'util-bg-light')} >
                            <p className={s_authDescr}>Choose one of the following providers:</p>
                            <div id="firebase-auth-container" className={s_authUI}></div>
                        </div>
                    </Fragment>
                )
    );

    return (
        <div className={toCss(s_wrapper)}>
            {authUI}
        </div>
    );
}