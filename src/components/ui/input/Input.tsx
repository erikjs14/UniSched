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
    checkbox: s_checkbox,
    checkWrapper: s_checkWrapper,
    disabled: s_disabled,
    minSize: s_minSize,
} = CSS;

export interface InputProps<T> {
    elementType: 'input' |'input-transparent' | 'select-visual' | 'checkbox';
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
    disabled?: boolean;
    minSize?: boolean;
}

export default function(props: InputProps<string|boolean>): JSX.Element| null {

    const style: {width?: string} = {}
    if (props.width) style.width = props.width+'rem';

    switch (props.elementType) {
        case 'input': 
            return (
                <div style={style} className={toCss(s_wrapper, props.addClass || '')}>
                    <input {...props.elementConfig} placeholder='' value={props.value as string} onChange={event => props.onChange(event.target.value)} className={toCss(s_input)} />
                    <label className={toCss(s_label)} >{props.label}</label>
                </div>
            );
        case 'input-transparent':
            return (
                <div style={style} className={toCss(s_wrapper, props.addClass || '')}>
                    <input 
                        {...props.elementConfig} 
                        value={props.value as string} 
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
                            className={toCss(s_selectVisual, (props.minSize ? '' + s_minSize : ''))}
                        >
                            <input
                                type='checkbox'
                                value={option}
                                onChange={event => props.onChange(event.target.value)}
                                checked={props.value === option}
                                name={props.label}
                            />
                            <span>{option}</span>
                        </label>
                    ))}
                </div>
            );
        case 'checkbox':
            return (
                <div className={toCss(s_checkWrapper)}>
                    <label
                        className={toCss(s_checkbox, (props.disabled ? s_disabled : ''))}
                    >
                        <input
                            type='checkbox'
                            value={props.label}
                            onChange={event => props.disabled ? null : props.onChange(event.target.value)}
                            checked={props.value as boolean}
                            name={props.label}
                        />
                        <span></span>
                    </label>
                </div>
            );
        default:
            return null;
    }

}