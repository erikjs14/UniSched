import React, { useReducer, useState, useEffect } from 'react';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
import { defaultColor } from '../../../config/colorChoices';
import ColorPicker from '../../../components/ui/colorPicker/ColorPicker';
import { fetchSubject } from './../../../firebase/firestore';
import { useLocation } from 'react-router-dom';
import Loader from '../../../components/ui/loader/Loader';
import { reducer, initialState, setSubject, setError, setLoading, changeName, changeColor } from './state';
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

    const location = useLocation();
    
    const [state, dispatch] = useReducer(reducer, initialState);

    useEffect(() => {
        // fetch subject data only if changing existing subject
        if (!props.new) {
            fetchSubject(extractIdFromUrl(location.pathname))
                .then(subject => {
                    dispatch(setSubject(subject));
                })
                .catch(error => {
                    dispatch(setError(error));
                })
                .finally(() => {
                    dispatch(setLoading(false));
                })
        }
    }, [props.new, location.pathname]);

    // logic for animating and changing color
    const [animateColorChange, startAnimateColorChange] = useState(false);

    if (state.loading) {
        return <Loader />;
    } else if (state.error) {
        return <span>An Error has occurred. Try refreshing the page.</span>;
    }

    const updateColor = (colorName: string): void => {
        dispatch(changeColor(colorName));
        startAnimateColorChange(true);
    }

    const updateTitle = (newTitle: string): void => {
        dispatch(changeName(newTitle))
    }

    const defaultStyle = {
        transition: 'background-color .3s ease-in-out',
        backgroundColor: state.subject?.color.newColor.value,
        color: state.subject?.color.newColor.textColor,
    };
    const colorStyles =  {
        unmounted: {},
        entering: { backgroundColor: state.subject?.color.oldColor.value },
        entered: { backgroundColor: state.subject?.color.newColor.value },
        exiting: {},
        exited: {},
    }
    
    return (
        <Transition 
            in={animateColorChange}
            timeout={300}
            exit={false}
        >
            {transitionState => {

                return (
                    <div
                        className={toCss(s_wrapper, 'util-center-content')}
                    >
                        <div
                            style={{
                                ...defaultStyle,
                                ...colorStyles[transitionState],
                            }} 
                            className={toCss(s_settingsCard)}
                        >

                            <div className={toCss(s_header)}>
                                <Input 
                                    elementType='input-transparent'
                                    value={state.subject?.name || ''}
                                    onChange={updateTitle}
                                    label='Title'
                                    labelColor={state.subject?.color.newColor.textColor}
                                />
                                <div className={toCss(s_trashIcon)}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </div>
                            </div>

                            <ColorPicker
                                style={{zIndex: 100}}
                                onSelectedColorChanged={updateColor}
                                selectedColorName={state.subject?.color.newColor.name || defaultColor()}
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

const extractIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
}