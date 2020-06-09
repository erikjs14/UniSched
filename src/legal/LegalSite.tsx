import React, { PropsWithChildren, Fragment } from 'react';
import {ReactComponent as Wave1} from '../landingPage/assets/svg/wave1.svg';

import CSS from './LegalSite.module.scss';
import { toCss } from '../util/util';
import Footer from '../landingPage/sections/footer/Footer';
const {
    header: s_header,
    wave: s_wave,
    main: s_main,
} = CSS;

export default function(props: PropsWithChildren<{title: string}>): JSX.Element {
    
    return (
        <Fragment>
            <header className={toCss(s_header)}>
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