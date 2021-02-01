import React from 'react';
import CSS from './Button.module.scss';
import { removeKey, toCss } from './../../../util/util';
import { ButtonProps } from './Button.d';
const {
    btn: s_btn,
    danger: s_danger,
    marked: s_marked,
} = CSS;

export default function(props: ButtonProps): JSX.Element {
    const inlineStyle = {
        fontSize: props.fontSize,
    }
    return <button {...removeKey('fontSize', props)} style={inlineStyle} className={toCss(s_btn, props.danger ? s_danger : '', props.mark ? s_marked : '')} >{props.children}</button>;
}