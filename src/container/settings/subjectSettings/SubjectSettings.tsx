import React, { useState } from 'react';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
import { findColorConfig } from '../../../config/colorChoices';
import ColorPicker from '../../../components/ui/colorPicker/ColorPicker';
const {
    wrapper: s_wrapper,
    settingsCard: s_settingsCard,
    header: s_header,
    settingsArea: s_settingsArea,
    trashIcon: s_trashIcon,
    eventsArea: s_eventsArea,
    tasksArea: s_tasksArea,
    examsArea: s_examsArea,
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
                                    labelColor={colorConfig.newColor.textColor}
                                />
                                <div className={toCss(s_trashIcon)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                            </div>

                            <ColorPicker
                                style={{zIndex: 100}}
                                onSelectedColorChanged={changeColor}
                                selectedColorName={colorConfig.newColor.name}
                            />

                            <div className={toCss(s_settingsArea)}>
                            
                                <div className={toCss(s_eventsArea)}>
                                    EVENTS
                                </div>

                                <div className={toCss(s_tasksArea)}>
                                    TASKS
                                </div>

                                <div className={toCss(s_examsArea)}>
                                    EXAMS
                                </div>

                            </div>
                            
                        </div>

                    </div>

                );
            }}
        </Transition>
    );
}