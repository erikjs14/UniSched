import React from 'react';
import { ToggleProps } from './Toggle.d';

import CSS from './Toggle.module.scss';
import { toCss } from './../../../../util/util';
const {
    toggle: s_toggle,
    toggled: s_toggled,
} = CSS;

export default function(props: ToggleProps): JSX.Element {
    const css = props.toggled ? toCss(s_toggle, s_toggled) : toCss(s_toggle);
    return (
        <div className={css} onClick={props.onClick}>
            <span></span>
            <span></span>
            <span></span>
        </div>
    );
}