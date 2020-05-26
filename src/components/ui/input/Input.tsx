import React from 'react';
import CSS from './Input.module.scss';
import { toCss, hex2rgba } from '../../../util/util';

const {
    wrapper: s_wrapper,
    input: s_input,
    label: s_label,
    transparent: s_transparent,
    selectVisual: s_selectVisual,
    wrapperSelect: s_wrapperSelect,
} = CSS;

export interface InputProps<T> {
    elementType: 'input' |'input-transparent' | 'select-visual';
    value: T;
    onChange(val: T): void;
    label: string;
    elementConfig?: object;
    width?: number;
    inputColor?: string;
    labelColor?: string;
    addClass?: string;
    options?: string[];
    labelLeft?: boolean;
}

export default function(props: InputProps<string>): JSX.Element| null {

    const style: {width?: string} = {}
    if (props.width) style.width = props.width+'rem';

    switch (props.elementType) {
        case 'input': 
            return (
                <div style={style} className={toCss(s_wrapper, props.addClass || '')}>
                    <input {...props.elementConfig} placeholder='' value={props.value} onChange={event => props.onChange(event.target.value)} className={toCss(s_input)} />
                    <label className={toCss(s_label)} >{props.label}</label>
                </div>
            );
        case 'input-transparent':
            return (
                <div style={style} className={toCss(s_wrapper, props.addClass || '')}>
                    <input 
                        {...props.elementConfig} 
                        value={props.value} 
                        onChange={event => props.onChange(event.target.value)} 
                        className={toCss(s_input, s_transparent)}
                        style={{color: props.inputColor ? hex2rgba(props.inputColor) : 'inherit'}}
                        placeholder='invisible'
                    />
                    <label 
                        style={{
                            color: hex2rgba(props.labelColor ? props.labelColor : '#000', .4), 
                            textAlign: (props.labelLeft ? 'left' : undefined),
                        }} 
                        className={toCss(s_label)}
                    >
                        {props.label}
                    </label>
                </div>
            );
        case 'select-visual':
            return (
                <div className={toCss(s_wrapper, s_wrapperSelect, props.addClass || '')}>
                    {props.options?.map(option => (
                        <label
                            key={option}
                            className={toCss(s_selectVisual)}
                        >
                            <input
                                type='checkbox'
                                value={option}
                                onChange={event => props.onChange(event.target.value)}
                                checked={option === props.value}
                                name={props.label}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );
        default:
            return null;
    }

}