import React, { PropsWithChildren, Fragment, useEffect } from 'react';
import {ReactComponent as Wave1} from '../landingPage/assets/svg/wave1.svg';

import CSS from './LegalSite.module.scss';
import { toCss } from '../util/util';
import Footer from '../landingPage/sections/footer/Footer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
const {
    header: s_header,
    wave: s_wave,
    main: s_main,
    home: s_home,
} = CSS;

export default function(props: PropsWithChildren<{title: string}>): JSX.Element {

    const history = useHistory();

    useEffect(() => window.scrollTo(0,0), []);
    
    return (
        <Fragment>
            <header className={toCss(s_header)}>
                <FontAwesomeIcon icon={faHome} className={toCss(s_home)} onClick={() => history.push('/')} /> 
                <h1>{props.title}</h1>
                <Wave1 className={toCss(s_wave)} />
            </header>

            <main className={toCss(s_main)} >
                {props.children}
            </main>

            <Footer transparentBg/>
        </Fragment>
    );
}