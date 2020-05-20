import React from 'react';

import CSS from './ColorPicker.module.scss';
import { ColorPickerProps } from './ColorPicker.d';
import colorChoices from '../../../config/colorChoices';
import { toCss } from '../../../util/util';
const {
    colorRow: s_colorRow,
    colorPicker: s_colorPicker,
} = CSS;

export default function(props: ColorPickerProps): JSX.Element {
    
    return (
        <div
            className={toCss(s_colorRow)}
            style={props.style}
        >
            {colorChoices.map(obj => (
                <label 
                    key={obj.name}
                    className={toCss(s_colorPicker)}
                >
                    <input 
                        type='radio'
                        value={obj.name}
                        onChange={event => props.onSelectedColorChanged(event.target.value)}
                        checked={obj.name === props.selectedColorName}
                        name={'color'}
                    />
                    <span style={{backgroundColor: obj.value}}></span>
                    <svg viewBox="0 0 120 120" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50"/>
                    </svg>
                </label>
            ))}
        </div>
    );
}