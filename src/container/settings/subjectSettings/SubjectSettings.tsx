import React, { useReducer, useState, useEffect, useCallback, Fragment } from 'react';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { Button, Dialog } from 'evergreen-ui';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
import { defaultColor } from '../../../config/colorChoices';
import ColorPicker from '../../../components/ui/colorPicker/ColorPicker';
import { fetchSubject, updateSubject, addSubject, deleteSubject } from './../../../firebase/firestore';
import { useLocation, useHistory, Prompt } from 'react-router-dom';
import Loader from '../../../components/ui/loader/Loader';
import { reducer, initialState, setSubject, setError, setLoading, changeName, changeColor, startSaving, setSaved, initialStateNew } from './state';
const {
    wrapper: s_wrapper,
    titleInput: s_titleInput,
    settingsCard: s_settingsCard,
    header: s_header,
    settingsArea: s_settingsArea,
    trashIcon: s_trashIcon,
    eventsArea: s_eventsArea,
    tasksArea: s_tasksArea,
    examsArea: s_examsArea,
    footer: s_footerArea,
    saveBtn: s_saveBtn,
} = CSS;

export default React.memo(function(props: SubjectSettingsProps): JSX.Element {

    const location = useLocation();
    const history = useHistory();
    
    const [state, dispatch] = props.new
        ? useReducer(reducer, initialStateNew)
        : useReducer(reducer, initialState);

    const [wantDelete, setWantDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

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
    }, [props.new, location.pathname, dispatch]);

    // logic for animating and changing color
    const [animateColorChange, startAnimateColorChange] = useState(false);

    const updateColor = useCallback((colorName: string): void => {
        dispatch(changeColor(colorName));
        startAnimateColorChange(true);
    }, [dispatch]);

    const updateTitle = useCallback((newTitle: string): void => {
        dispatch(changeName(newTitle))
    }, [dispatch]);

    const saveHandler = useCallback(() => {
        dispatch(startSaving());
        if (state.subject?.changed) {
            if (props.new) {
                addSubject({
                    name: state.subject.name,
                    color: state.subject.color.newColor.name,
                }).then(id => {
                    history.replace(`/settings/${id}`);
                    dispatch(setSaved());
                }).catch(error => {
                    dispatch(setError(error.message));
                })

            } else {
                updateSubject(
                    state.subject.id,
                    {
                        name: state.subject.name,
                        color: state.subject.color.newColor.name,
                    }
                ).then(() => {
                    console.log('Saved Subject');
                    dispatch(setSaved());
                }).catch(error => {
                    dispatch(setError(error.message));
                })
            }
        }
    }, [dispatch, history, props.new, state.subject]);

    if (state.loading) {
        return <Loader />;
    } else if (state.error) {
        return <span>An Error has occurred. Try refreshing the page.</span>;
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
        <Fragment>
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
                                        addClass={s_titleInput}
                                        elementType='input-transparent'
                                        value={state.subject?.name || ''}
                                        onChange={updateTitle}
                                        label='Title'
                                        labelColor={state.subject?.color.newColor.textColor}
                                    />
                                    <div 
                                        className={toCss(s_trashIcon)}
                                        onClick={() => setWantDelete(true)}    
                                    >
                                        <FontAwesomeIcon icon={faTrash} />
                                    </div>
                                </div>

                                <ColorPicker
                                    style={{zIndex: 100}}
                                    onSelectedColorChanged={updateColor}
                                    selectedColorName={state.subject?.color.newColor.name || defaultColor()}
                                />

                                <div className={toCss(s_settingsArea)}>

                                    <div className={toCss(s_tasksArea)}>
                                        TASKS
                                    </div>
                                
                                    <div className={toCss(s_eventsArea)}>
                                        EVENTS
                                    </div>

                                    <div className={toCss(s_examsArea)}>
                                        EXAMS
                                    </div>

                                </div>

                                <div className={toCss(s_footerArea)}>
                                    <Button 
                                        appearance='primary' 
                                        className={toCss(s_saveBtn)}
                                        iconBefore='floppy-disk'
                                        isLoading={state.saving}
                                        disabled={!state.subject?.changed}
                                        onClick={saveHandler}
                                    >
                                        Save
                                    </Button>
                                </div>
                                
                            </div>

                            <Dialog
                                isShown={wantDelete}
                                isConfirmLoading={deleting}
                                title={`Delete subject ${state.subject?.name}`}
                                confirmLabel='Confirm'
                                onCancel={close => {
                                    setWantDelete(false);
                                    close();
                                }}
                                onConfirm={close => {
                                    if (!state.subject) {
                                        dispatch(setError('Unexpected error.'));
                                    } else {
                                        setDeleting(true);
                                        deleteSubject(state.subject.id)
                                            .then(() => {
                                                close();
                                                history.push('/settings');
                                            })
                                            .catch(error => {
                                                dispatch(setError(error.message));
                                                setDeleting(false);
                                                setWantDelete(false);
                                            })
                                    }
                                }}
                                onCloseComplete={() => { //closed in another way
                                    setWantDelete(false);
                                }}
                            >
                                Are you sure you want to delete this subject including all of the exams, events and tasks?
                            </Dialog>

                        </div>

                    );
                }}
            </Transition>
            <Prompt
                when={state.subject?.changed}
                message='You have unsaved changes. Proceed?'
            />
        </Fragment>
    );
});

const extractIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
}