import React, { useState, Fragment } from 'react';

import CSS from './ColorPicker.module.scss';
import { ColorPickerProps } from './ColorPicker.d';
import colorChoices, { textColOf } from '../../../config/colorChoices';
import { toCss } from '../../../util/util';
import CustomColorDialog from './CustomColorDialog';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen } from '@fortawesome/free-solid-svg-icons';
const {
    colorRow: s_colorRow,
    colorPicker: s_colorPicker,
} = CSS;

export default function(props: ColorPickerProps): JSX.Element {

    const [showCustomSelect, setShowCustomSelect] = useState(false);
    
    const customSelected = props.selectedColorName.startsWith('#');
    const customDefaultCol = '#ff0000';
    const customCol = customSelected ? props.selectedColorName : customDefaultCol;
    return (
        <Fragment>
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

                <label className={toCss(s_colorPicker)} onClick={() => setShowCustomSelect(true)}>
                    <input 
                        type='radio'
                        value={customCol}
                        checked={customSelected}
                        onChange={() => {}}
                        name={'color'}
                    />
                    <span style={{backgroundColor: customCol}}>
                        <FontAwesomeIcon 
                            icon={faPen} 
                            style={{
                                color: textColOf(customCol),
                                zIndex: 1000,
                            }}
                        />
                    </span>
                    <svg viewBox="0 0 120 120" version="1.1"
                        xmlns="http://www.w3.org/2000/svg">
                        <circle cx="60" cy="60" r="50"/>
                    </svg>
                </label>

            </div>

            <CustomColorDialog
                initialCol={customCol}
                show={showCustomSelect}
                onConfirm={col => props.onSelectedColorChanged(col)}
                onClose={() => setShowCustomSelect(false)}
            />

        </Fragment>
    );
}