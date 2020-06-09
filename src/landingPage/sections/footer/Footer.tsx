import React, { Fragment } from 'react';
import {ReactComponent as Wave} from '../../assets/svg/wave1.svg';

import CSS from './Footer.module.scss';
import { FooterProps } from './Footer.d';
import { toCss } from '../../../util/util';
import { NavLink } from 'react-router-dom';
const {
    wrapper: s_wrapper,
    wave: s_wave,
    active: s_active,
} = CSS;

export default function(props: FooterProps): JSX.Element {
    
    return (
        <Fragment>
            <Wave className={toCss(s_wave)} style={{backgroundColor: props.transparentBg ? 'transparent' : undefined}} /> 
            <footer className={toCss(s_wrapper)}>
                <NavLink activeClassName={s_active} exact to='/'>Home</NavLink>
                <NavLink activeClassName={s_active} exact to='/auth'>Login/Signup</NavLink>
                <NavLink activeClassName={s_active} exact to='/legal-details#'>Legal Details</NavLink>
                <NavLink activeClassName={s_active} exact to='/tos'>Terms of Service</NavLink>
                <NavLink activeClassName={s_active} exact to='/privacy'>Privacy Policy</NavLink>
            </footer>
        </Fragment>
    );
}