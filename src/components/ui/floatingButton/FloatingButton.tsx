import React from 'react';

import CSS from './FloatingButton.module.scss';
import { FloatingButtonProps } from './FloatingButton.d';
import { toCss } from './../../../util/util';
const {
    btn: s_btn,
} = CSS;

export default function(props: FloatingButtonProps): JSX.Element {

    const button =  (
        <button
            className={toCss(s_btn)}
            onClick={props.onClick}
        >
            {props.children}
        </button>
    );

    if (props.center) {
        return (
            <div className={'util-center-content ' + (props.className ? props.className : '')}>
                {button}
            </div>
        );
    } else if (props.className) {
        return (
            <div className={props.className}>
                {button}
            </div>
        );
    } else {
        return button;
    }
}