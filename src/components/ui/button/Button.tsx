import React from 'react';
import CSS from './Button.module.scss';
import { removeKey } from './../../../util/util';
import { ButtonProps } from './Button.d';

export default function(props: ButtonProps): JSX.Element {
    const inlineStyle = {
        fontSize: props.fontSize,
    }
    return <button style={inlineStyle} className={CSS.btn} {...removeKey('fontSize', props)}>{props.children}</button>;
}