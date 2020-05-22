import React from 'react';

import CSS from './FloatingButton.module.scss';
import { FloatingButtonProps } from './FloatingButton.d';
import { toCss } from './../../../util/util';
const {
    btn: s_btn,
} = CSS;

export default function(props: FloatingButtonProps): JSX.Element {
    
    return (
        <button
            className={toCss(s_btn)}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );
}