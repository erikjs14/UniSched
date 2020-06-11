import React, { PropsWithChildren } from 'react';

import CSS from './CtaButton.module.scss';
import { CtaButtonProps } from './CtaButton.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    btn: s_btn,
} = CSS;

export default function(props: PropsWithChildren<CtaButtonProps>): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)} >
            <a 
                className={toCss(s_btn)} 
                href={props.linkTo}
            >
                {props.children}
            </a>
        </div>
    );
}