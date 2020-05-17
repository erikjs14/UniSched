import React from 'react';
import CSS from './Input.module.scss';
import { toCss } from '../../../util/util';

const {
    wrapper: s_wrapper,
    input: s_input,
    label: s_label
} = CSS;

export interface InputProps {
    elementType: string;
    value: any;
    onChange(event: React.ChangeEvent<HTMLInputElement>): void;
    label: string;
    elementConfig?: object;
}

export default function(props: InputProps): JSX.Element| null {

    switch (props.elementType) {
        case 'input': 
            return (
                <div className={toCss(s_wrapper)}>
                    <label className={toCss(s_label)} >{props.label}</label>
                    <input {...props.elementConfig} placeholder='' value={props.value} onChange={props.onChange} className={toCss(s_input)} />
                </div>
            );
        default:
            return null;
    }

}