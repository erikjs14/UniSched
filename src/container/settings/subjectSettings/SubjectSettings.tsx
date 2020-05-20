import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
import colorChoices, { findColorConfig } from '../../../config/colorChoices';
const {
    wrapper: s_wrapper,
    settingsCard: s_settingsCard,
    header: s_header,
    trashIcon: s_trashIcon,
    colorRow: s_colorRow,
    colorPicker: s_colorPicker,
} = CSS;

export default function(props: SubjectSettingsProps): JSX.Element {

    const [title, setTitle] = useState('');
    const [colorConfig, setColorConfig] = useState({
        newColor: { name: 'turquoise', value: '#1abc9c', textColor: '#fff' },
        oldColor: { name: 'turquoise', value: '#1abc9c', textColor: '#fff' },
    });
    const [animateColorChange, startAnimateColorChange] = useState(false);

    const changeColor = (colorName: string): void => {
        setColorConfig(prev => ({
            newColor: findColorConfig(colorName),
            oldColor: prev.newColor,
        }));
        startAnimateColorChange(true);
    }

    const defaultStyle = {
        transition: 'background-color .3s ease-in-out',
        backgroundColor: colorConfig.newColor.value,
        color: colorConfig.newColor.textColor,
    };
    const colorStyles =  {
        unmounted: {},
        entering: { backgroundColor: colorConfig.oldColor.value },
        entered: { backgroundColor: colorConfig.newColor.value },
        exiting: {},
        exited: {},
    }
    
    return (
        <Transition 
            in={animateColorChange}
            timeout={300}
            exit={false}
        >
            {state => {

                return (
                    <div
                        className={toCss(s_wrapper, 'util-center-content')}
                    >
                        <div
                            style={{
                                ...defaultStyle,
                                ...colorStyles[state],
                            }} 
                            className={toCss(s_settingsCard)}
                        >

                            <div className={toCss(s_header)}>
                                <Input 
                                    elementType='input-transparent'
                                    value={title}
                                    onChange={setTitle}
                                    label='Title'
                                />
                                <div className={toCss(s_trashIcon)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                            </div>

                            <div
                                className={toCss(s_colorRow)}
                            >
                                {colorChoices.map(obj => (
                                    <label 
                                        key={obj.name}
                                        className={toCss(s_colorPicker)}
                                    >
                                        <input 
                                            type='radio'
                                            value={obj.name}
                                            onChange={event => changeColor(event.target.value)}
                                            checked={obj.name === colorConfig.newColor.name}
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
                        </div>
                    </div>

                );
            }}
        </Transition>
    );
}