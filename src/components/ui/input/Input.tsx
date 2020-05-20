import React from 'react';
import CSS from './Input.module.scss';
import { toCss, hex2rgba } from '../../../util/util';

const {
    wrapper: s_wrapper,
    input: s_input,
    label: s_label,
    transparent: s_transparent,
} = CSS;

export interface InputProps<T> {
    elementType: string;
    value: T;
    onChange(val: T): void;
    label: string;
    elementConfig?: object;
    width?: number;
    labelColor?: string;
}

export default function(props: InputProps<string>): JSX.Element| null {

    const style: {width?: string} = {}
    if (props.width) style.width = props.width+'rem';

    switch (props.elementType) {
        case 'input': 
            return (
                <div style={style} className={toCss(s_wrapper)}>
                    <input {...props.elementConfig} placeholder='' value={props.value} onChange={event => props.onChange(event.target.value)} className={toCss(s_input)} />
                    <label className={toCss(s_label)} >{props.label}</label>
                </div>
            );
        case 'input-transparent':
            return (
                <div style={style} className={toCss(s_wrapper)}>
                    <input 
                        {...props.elementConfig} 
                        value={props.value} 
                        onChange={event => props.onChange(event.target.value)} 
                        className={toCss(s_input, s_transparent)}
                        placeholder=''
                    />
                    <label 
                        style={{color: hex2rgba(props.labelColor ? props.labelColor : '#000', .4)}} 
                        className={toCss(s_label)} 
                    >
                        {props.label}
                    </label>
                </div>
            );
        default:
            return null;
    }

}