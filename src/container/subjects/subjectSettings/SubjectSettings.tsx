import React, { useReducer, useState, useEffect, useCallback, useRef, Fragment } from 'react';
import { Transition } from 'react-transition-group';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash, faArrowLeft } from '@fortawesome/free-solid-svg-icons';
import { Button, Dialog, Select } from 'evergreen-ui';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
import { defaultColor } from '../../../config/colorChoices';
import ColorPicker from '../../../components/ui/colorPicker/ColorPicker';
import { updateSubject, addSubject, deleteSubject, fetchSubjectDeep } from './../../../firebase/firestore';
import { useLocation, useHistory, Prompt } from 'react-router-dom';
import Loader from '../../../components/ui/loader/Loader';
import { reducer, initialState, setSubject, setError, setLoading, changeName, changeColor, startSaving, setSaved, initialStateNew, setSpace } from './state';
import { EXAM_START_STATE, EVENTS_START_STATE, getTaskStartState, DEFAULT_TOASTER_CONFIG } from './../../../config/settingsConfig';
import { ICON_EXAMS_TYPE, ICON_TODO_TYPE } from '../../../config/globalTypes.d';
import ExamCard from '../../../components/subjects/examCard/ExamCard';
import SubSettings from './subSettings/SubSettings';
import { ICON_SCHEDULE_TYPE } from './../../../config/globalTypes.d';
import EventCard from '../../../components/subjects/eventCard/EventCard';
import TaskCard from '../../../components/subjects/taskCard/TaskCard';
import { removeSubjectLocally, addSubjectLocally, forceRefresh } from '../../../store/actions';
import { SubjectModel, SpaceModelWithId } from '../../../firebase/model';
import { useDispatch, useSelector } from 'react-redux';
import { updateSubjectLocally } from '../../../store/actions/user';
import { toaster } from 'evergreen-ui';
import { getTimestampFromDate } from '../../../util/timeUtil';
import '../../../style/override.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { RootState } from '../../..';
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
    backArrow: s_backArrow,
    spaceSelectArea: s_spaceSelectArea,
    select: s_select,
    label: s_label,
} = CSS;


export default React.memo(function(props: SubjectSettingsProps): JSX.Element {

    const location = useLocation();
    const history = useHistory();

    const dispatchToStore = useDispatch();

    const globalSelectedSpaceId = useSelector((state: RootState) => state.user.selectedSpace);
    const spaces: SpaceModelWithId[] | null = useSelector((state: RootState) => state.user.spaces);
    
    const [state, dispatch] = props.new
        ? useReducer(reducer, initialStateNew(!globalSelectedSpaceId || globalSelectedSpaceId === 'all' ? 'mainSpace' : globalSelectedSpaceId))
        : useReducer(reducer, initialState);


    const [wantDelete, setWantDelete] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [eventsDataChanged, setEventsDataChanged] = useState(false);
    const [eventsSaveState, setEventsSaveState] = useState(false);

    const [examsDataChanged, setExamsDataChanged] = useState(false);
    const [examsSaveState, setExamsSaveState] = useState(false);

    const [tasksDataChanged, setTasksDataChanged] = useState(false);
    const [tasksSaveState, setTasksSaveState] = useState(false);

    const [markSubTitleEmpty, setMarkSubTitleEmpty] = useState(false);

    const eventsRef = useRef<{
        save: (newSubjectId: string | undefined) => void;
        isSaving: () => boolean;
        hasEmptyTitle: () => boolean;
        markEmptyTitles: (val: boolean) => void;
    }>();
    const examsRef = useRef<{
        save: (newSubjectId: string | undefined) => void;
        isSaving: () => Boolean;
        hasEmptyTitle: () => boolean;
        markEmptyTitles: (val: boolean) => void;
    }>();
    const tasksRef = useRef<{
        save: (newSubjectId: string | undefined) => void;
        isSaving: () => Boolean;
        hasEmptyTitle: () => boolean;
        markEmptyTitles: (val: boolean) => void;
    }>();

    useEffect(() => {
        // fetch subject data only if changing existing subject
        if (!props.new) {
            fetchSubjectDeep(extractIdFromUrl(location.pathname))
                .then(data => {
                    dispatch(setSubject({
                        id: data.id,
                        name: data.name,
                        color: data.color,
                        spaceId: data.spaceId,
                        timeCreated: data.timeCreated,
                    }, {
                        exams: data.exams,
                        events: data.events,
                        tasks: data.tasks
                    }));
                })
                .catch(error => {
                    dispatch(setError(error.message));
                })
                .finally(() => {
                    dispatch(setLoading(false));
                });
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
        if (!state.subject) return;

        // check if some title input are empty
        eventsRef.current?.markEmptyTitles(true);
        examsRef.current?.markEmptyTitles(true);
        tasksRef.current?.markEmptyTitles(true);
        setMarkSubTitleEmpty(true);
        if (!state.subject.name) {
            toaster.warning('The subject title must not be empty!', DEFAULT_TOASTER_CONFIG);
            return;
        } else if (eventsRef.current?.hasEmptyTitle()) {
            toaster.warning('You have an event with a non-empty title!', DEFAULT_TOASTER_CONFIG);
            return;
        } else if (examsRef.current?.hasEmptyTitle()) {
            toaster.warning('You have an exam with a non-empty title!', DEFAULT_TOASTER_CONFIG);
            return;
        } else if (tasksRef.current?.hasEmptyTitle()) {
            toaster.warning('You have a task with a non-empty title!', DEFAULT_TOASTER_CONFIG);
            return;
        }
        eventsRef.current?.markEmptyTitles(false);
        examsRef.current?.markEmptyTitles(false);
        tasksRef.current?.markEmptyTitles(false);

        const saveSubData = (id: string | undefined) => {
            if(eventsDataChanged){
                eventsRef.current?.save(id);
                dispatchToStore(forceRefresh('event'));
            } 
            if(examsDataChanged) {
                examsRef.current?.save(id);
                dispatchToStore(forceRefresh('exam'));
            } 
            if(tasksDataChanged) {
                tasksRef.current?.save(id);
                dispatchToStore(forceRefresh('task'));
            }
        }
        if (!props.new) {
            saveSubData(undefined);
        }

        if (state.subject?.changed) {
            dispatch(startSaving());
            if (props.new) {
                const sub: SubjectModel = {
                    name: state.subject.name,
                    color: state.subject.color.newColor.name,
                    spaceId: state.subject.spaceId,
                    timeCreated: getTimestampFromDate(new Date()),
                };
                addSubject(sub)
                    .then(id => {
                        saveSubData(id);
                        
                        history.replace(`/subjects/${id}`);
                        dispatchToStore(addSubjectLocally({
                            ...sub,
                            id
                        }));
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
                        spaceId: state.subject.spaceId,
                    }
                ).then(() => {
                    if (state.subject) {
                        dispatchToStore(updateSubjectLocally({
                            id: state.subject.id,
                            name: state.subject.name,
                            color: state.subject.color.newColor.name,
                            spaceId: state.subject.spaceId,
                            timeCreated: state.subject.timeCreated,
                        }));
                    }
                    dispatch(setSaved());
                }).catch(error => {
                    dispatch(setError(error.message));
                })
            }
        }
    }, [dispatch, dispatchToStore, eventsDataChanged, examsDataChanged, history, props.new, state.subject, tasksDataChanged]);

    if (state.loading) {
        return <Loader />;
    } else if (state.error || !state.subject || !spaces) {
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

                                <FontAwesomeIcon 
                                    icon={faArrowLeft} 
                                    className={toCss(s_backArrow)}
                                    onClick={() => history.push('/subjects')}
                                />

                                <div className={toCss(s_header)}>
                                    <Input 
                                        addClass={s_titleInput}
                                        elementType='input-transparent'
                                        value={state.subject?.name || ''}
                                        onChange={updateTitle}
                                        label='Title'
                                        labelColor={state.subject?.color.newColor.textColor}
                                        labelLeft
                                        markWhenEmpty={markSubTitleEmpty}
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

                                <div className={toCss(s_spaceSelectArea)} >
                                    <h3 className={toCss(s_label)}>Space</h3> 
                                    <Select
                                        className={toCss(s_select)} 
                                        value={state.subject?.spaceId}
                                        onChange={e => {
                                            dispatch(setSpace(e.target.value));
                                        }}
                                    >
                                        {spaces.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
                                    </Select>
                                </div>
                                
                                <div className={toCss(s_settingsArea)}>

                                    <div className={toCss(s_tasksArea)}>
                                        <SubSettings
                                            ref={tasksRef}
                                            dataTypeId='task'
                                            areaTitle='Tasks'
                                            subjectId={state.subject?.id || ''}
                                            initialData={state.initialData?.tasks}
                                            onDataChanged={() => setTasksDataChanged(true)}
                                            onSaveStateChanged={newState => {
                                                setTasksSaveState(newState);
                                                if (newState) setTasksDataChanged(false);
                                            }}
                                            onError={error => dispatch(setError(error))}
                                            dataStartState={getTaskStartState()}
                                            iconType={ICON_TODO_TYPE}
                                            cardComponent={TaskCard}
                                        />
                                    </div>
                                
                                    <div className={toCss(s_eventsArea)}>
                                        <SubSettings
                                            ref={eventsRef}
                                            dataTypeId='event'
                                            areaTitle='Events'
                                            subjectId={state.subject?.id || ''}
                                            initialData={state.initialData?.events}
                                            onDataChanged={() => setEventsDataChanged(true)}
                                            onSaveStateChanged={newState => {
                                                setEventsSaveState(newState);
                                                if (newState) setEventsDataChanged(false);
                                            }}
                                            onError={error => dispatch(setError(error))}
                                            dataStartState={EVENTS_START_STATE}
                                            iconType={ICON_SCHEDULE_TYPE}
                                            cardComponent={EventCard}
                                        />
                                    </div>

                                    <div className={toCss(s_examsArea)}>
                                        <SubSettings
                                            ref={examsRef}
                                            dataTypeId='exam'
                                            areaTitle='Exams'
                                            subjectId={state.subject?.id || ''}
                                            initialData={state.initialData?.exams}
                                            onDataChanged={() => setExamsDataChanged(true)}
                                            onSaveStateChanged={newState => {
                                                setExamsSaveState(newState);
                                                if (newState) setExamsDataChanged(false);
                                            }}
                                            onError={error => dispatch(setError(error))}
                                            dataStartState={EXAM_START_STATE}
                                            iconType={ICON_EXAMS_TYPE}
                                            cardComponent={ExamCard}
                                        />
                                    </div>

                                </div>

                                <div className={toCss(s_footerArea)}>
                                    <Button 
                                        appearance='primary' 
                                        className={toCss(s_saveBtn)}
                                        iconBefore='floppy-disk'
                                        isLoading={
                                            state.saving || eventsSaveState || examsSaveState || tasksSaveState
                                        }
                                        disabled={!eventsDataChanged && !examsDataChanged && !tasksDataChanged && !state.subject?.changed}
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

                                        if (props.new) {
                                            history.push('/subjects');
                                        } else {
                                            deleteSubject(state.subject.id)
                                                .then(() => {
                                                    close();
                                                    dispatchToStore(removeSubjectLocally(state.subject?.id || ''))
                                                    dispatchToStore(forceRefresh('event'));
                                                    dispatchToStore(forceRefresh('task'));
                                                    dispatchToStore(forceRefresh('exam'));
                                                    history.push('/subjects');
                                                })
                                                .catch(error => {
                                                    dispatch(setError(error.message));
                                                    setDeleting(false);
                                                    setWantDelete(false);
                                                })
                                        }
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
                when={(state.subject?.changed || eventsDataChanged || examsDataChanged || tasksDataChanged) && !deleting && !(props.new && state.saving)}
                message='You have unsaved changes. Proceed?'
            />
        </Fragment>
    );
});

const extractIdFromUrl = (url: string): string => {
    const parts = url.split('/');
    return parts[parts.length - 1];
}