import React, { useState } from 'react';
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
    glowRed: s_glowRed,
    textarea: s_textarea,
    simpleCheckbox: s_simpleCheckbox,
} = CSS;

export interface InputProps<T> {
    elementType: 'input' |'input-transparent' | 'text-area' | 'select-visual' | 'checkbox' | 'simple-checkbox';
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
    markWhenEmpty?: boolean;    
}

export default function(props: InputProps<string|boolean>): JSX.Element| null {

    const [touched, setTouched] = useState(false);

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
                        onChange={event => {
                            props.onChange(event.target.value);
                            setTimeout(() => setTouched(true), 500);
                        }}
                        className={toCss(s_input, s_transparent, ((props.markWhenEmpty || touched) && (props.value as string)) === '' ? s_glowRed : '')}
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
        case 'text-area':
            return (
                <div style={style} className={toCss(s_wrapper, props.addClass || '')}>
                    <textarea 
                        {...props.elementConfig}
                        placeholder=''
                        value={props.value as string}
                        onChange={event => props.onChange(event.target.value)}
                        className={toCss(s_textarea)} 
                    />
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
        case 'simple-checkbox':
            return (
                <div className={toCss(s_wrapper, props.addClass || '')} >
                    <input
                        className={toCss(s_simpleCheckbox)} 
                        type='checkbox'
                        value={props.label}
                        onChange={event => props.disabled ? null : props.onChange(event.target.value)}
                        checked={props.value as boolean}
                        name={props.label}
                    />
                </div>
            );
        default:
            return null;
    }

}