import React, { Fragment } from 'react';
import {ReactComponent as Wave} from '../../assets/svg/wave1.svg';

import CSS from './Footer.module.scss';
import { FooterProps } from './Footer.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    wave: s_wave,
} = CSS;

export default function(props: FooterProps): JSX.Element {
    
    return (
        <Fragment>
            <Wave className={toCss(s_wave)} /> 
            <footer className={toCss(s_wrapper)}>
                Imprint, About, TOS, Github
            </footer>
        </Fragment>
    );
}