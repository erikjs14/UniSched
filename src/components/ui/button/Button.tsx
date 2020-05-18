import React from 'react';
import CSS from './Button.module.scss';
import { removeKey } from './../../../util/util';

export interface ButtonProps extends React.ComponentProps<'button'> {
    fontSize?: string;
}

export default function(props: ButtonProps): JSX.Element {
    const inlineStyle = {
        fontSize: props.fontSize,
    }
    return <button style={inlineStyle} className={CSS.btn} {...removeKey('fontSize', props)}>{props.children}</button>;
}