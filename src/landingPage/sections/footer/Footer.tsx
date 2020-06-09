import React, { Fragment } from 'react';
import {ReactComponent as Wave} from '../../assets/svg/wave1.svg';

import CSS from './Footer.module.scss';
import { FooterProps } from './Footer.d';
import { toCss } from '../../../util/util';
import { Link } from 'react-router-dom';
const {
    wrapper: s_wrapper,
    wave: s_wave,
} = CSS;

export default function(props: FooterProps): JSX.Element {
    
    return (
        <Fragment>
            <Wave className={toCss(s_wave)} style={{backgroundColor: props.transparentBg ? 'transparent' : undefined}} /> 
            <footer className={toCss(s_wrapper)}>
                <Link to='/'>Home</Link>
                <Link to='/auth'>Login/Signup</Link>
                <Link to='/legal-details'>Legal Details</Link>
                <Link to='/tos'>Terms of Service</Link>
                <Link to='/privacy'>Privacy Policy</Link>
            </footer>
        </Fragment>
    );
}