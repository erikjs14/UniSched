import React, { PropsWithChildren, useState, useMemo, useCallback, Fragment, useRef, useEffect } from 'react';

import CSS from './AddTaskDialog.module.scss';
import { AddTaskDialogProps } from './AddTaskDialog.d';
import { Dialog } from 'evergreen-ui';
import { toCss, arrayToN, filterSubjectsForSpace } from '../../../util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Input from '../../../components/ui/input/Input';
import { getTaskStartState } from '../../../config/settingsConfig';
import Button from '../../../components/ui/button/Button';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { getDateFromTimestamp, getDateFromSeconds, getTimestampFromDate, dateToHTMLString, endOf, HTMLStringToDate, addDays, subtractHours, getNDatesAsSecondsForInterval, formatDateOutput, getConfigDataFromTimestamps } from '../../../util/timeUtil';
import { getEditedTimestamps, getWeekDay } from '../../../util/timeUtil';
import { PREF_ID_DAY_STARTS_AT } from '../../../config/userPreferences';
import { RootState } from '../../..';
import { useSelector, useDispatch } from 'react-redux';
import SimpleSettingsRow from '../../../components/subjects/SimpleSettingsRow/SimpleSettingsRow';
import { IntervalOptions } from '../../../firebase/model';
import { CONFIG__QUICK_ADD_FUTURE_END_OPTIONS } from '../../../config/todoConfig';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { addAndSaveNewTask, fetchTasks } from '../../../store/actions';
import { TIME_BEFORE_DATA_REFRESH_MS } from '../../../config/generalConfig';
import * as chrono from 'chrono-node';
const {
    wrapper: s_wrapper,
    angleLeft: s_angleLeft,
    angleRight: s_angleRight,
    hidden: s_hidden,
    pages: s_pages,
    page: s_page,
    shortcuts: s_shortcuts,
    subjectScrollPane: s_subjectScrollPane,
    star: s_star,
    error: s_error,
    inAndStar: s_inAndStar,
    typeInput: s_typeInput,
    firstDeadlineInput: s_firstDeadlineInput,
    intervalOptions: s_intervalOptions,
    addTextField: s_addTextField,
    spacesSelect: s_spacesSelect,
    space: s_space,
    spaceSelected: s_spaceSelected,
    nosubs: s_nosubs,
} = CSS;

// !!! ALWAYS UPDATE
const pageLen = 7;
const keyMap: {[key: string]: boolean} = {};
export default function(props: PropsWithChildren<AddTaskDialogProps>): JSX.Element | null{

    const {data: tasks, timestamp, } = useSelector((state: RootState) => state.data.tasks);
    const spaces = useSelector((state: RootState) => state.user.spaces);
    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const {loading, error} = useSelector((state: RootState) => state.data.tasks);
    const dispatch = useDispatch();

    // fetch all tasks if not already loaded
    useEffect(() => {
        if ((props.isShown && subjects && spaces && !tasks && !error) || (props.isShown && !loading && Date.now() - timestamp > TIME_BEFORE_DATA_REFRESH_MS)) { //fetch on first mount and when timespan has elapsed
            dispatch(fetchTasks());
        }
    }, [dispatch, error, loading, props.isShown, spaces, subjects, tasks, timestamp]);

    const [pageCnt, setPageCnt] = useState(spaces && spaces.length > 1 ? 0 : 1);
    const [addEnabled, setAddEnabled] = useState(false);
    const [markTypeInput, setMarkTypeInput] = useState(false);

    const [spaceId, setSpaceId] = useState(spaces && spaces.length === 1 ? spaces[0] : null);
    const [subjectId, setSubjectId] = useState<string|null>(null);
    const [taskConfig, setTaskConfig] = useState(
        getTaskStartState()
    );
    const {firstDeadline, lastDeadline, interval} = useMemo(() => {
        return getConfigDataFromTimestamps(taskConfig.timestamps, taskConfig.timestampsDone);
    }, [taskConfig.timestamps, taskConfig.timestampsDone]);

    // enable Add button when subject is selected and title input
    useEffect(() => {
        if (subjectId && taskConfig.type?.length > 0) {
            setAddEnabled(true);
        } else {
            setAddEnabled(false);
        }
    }, [subjectId, taskConfig.type]);

    const handleKey = useCallback(
        (e) => {
            keyMap[e.key] = e.type === 'keydown';
        },
        [],
    );

    // set focus to input when rendered
    const typeInputRef = useRef<HTMLInputElement>(null);
    const addTextInputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (props.isShown && pageCnt === 2){
            // evergreen dialog focuses on cancel by default --> wait and override
            setTimeout(() => typeInputRef.current?.focus(), 350);
        } else if (props.isShown && pageCnt === pageLen - 1) {
            setTimeout(() => addTextInputRef.current?.focus(), 350);
        } else if (!props.isShown) {
            setPageCnt(0);
        }
    }, [pageCnt, props.isShown]);

    const changeHandler = useCallback((key: string, newVal: any) => {
        if (key === 'type') {
            setTaskConfig(prev => ({
                ...prev,
                type: newVal as string,
            }))
        } else if (key === 'firstDeadline' || key === 'lastDeadline' || key === 'interval') {
            const [newTimestamps, newTimestampsDone] = getEditedTimestamps(
                {
                    firstDeadline: key === 'firstDeadline' ? getTimestampFromDate(newVal as Date) : firstDeadline,
                    lastDeadline: key === 'lastDeadline' ? getTimestampFromDate(newVal as Date) : lastDeadline,
                    interval: key === 'interval' ? newVal as string : interval,
                },
                taskConfig.timestamps,
                taskConfig.timestampsDone,
                taskConfig.tasksTickedAt,
            );
            setTaskConfig(prev => ({
                ...prev,
                timestamps: newTimestamps,
                timestampsDone: newTimestampsDone,
            }));
        } else if (key === 'star') {
            setTaskConfig(prev => ({
                ...prev,
                star: newVal as boolean,
            }));
        } else if (key === 'additionalInfo') {
            setTaskConfig(prev => ({
                ...prev,
                additionalInfo: (newVal as string).length > 0 
                    ? { text: (newVal as string) }
                    : null,
            }));
        }
    }, [firstDeadline, interval, lastDeadline, taskConfig.timestamps, taskConfig.timestampsDone, taskConfig.tasksTickedAt]);

    const onChangePageCnt = useCallback((amount: number, force: boolean = false) => {
        // check type input
        if (amount !== 0 && pageCnt === 2) {
            if (taskConfig.type.trim().length === 0) {
                setMarkTypeInput(true);
                return;
            }
        }

        let newCnt = pageCnt + amount;
        if (newCnt < 0) newCnt = 0;
        else if (newCnt >= pageLen) newCnt = pageLen - 1;

        // check if last deadline is to be skipped
        if (!force && newCnt === 5 && interval === 'once') {
            if (amount > 0)
                newCnt = 6;
            else if (amount < 0)
                newCnt = 4;
        }

        setPageCnt(newCnt);
    }, [interval, pageCnt, taskConfig.type]);

    const reset = useCallback(() => {
        setPageCnt(0);
        setMarkTypeInput(false);
        setSpaceId(spaces && spaces.length === 1 ? spaces[0] : null);
        setSubjectId(null);
        setTaskConfig(getTaskStartState());
    }, [spaces]);

    const addTaskHandler = useCallback((closeDialog: Function) => {
        if (taskConfig?.type?.length > 0 && subjectId) {
            // if on type page --> look for possible date extraction from natural language
            const config = {
                ...taskConfig,
                timestamps: [...taskConfig.timestamps],
                timestampsDone: [...taskConfig.timestampsDone],
            };
            if (pageCnt === 2 && interval === 'once') {
                const spec = chrono.parse(taskConfig.type);
                if (spec?.length > 0) {
                    const typeWithoutDate = taskConfig.type.replace(spec[0].text, '');
                    const date = chrono.parseDate(taskConfig.type);

                    config.type = typeWithoutDate;
                    config.timestamps = [getTimestampFromDate(date)];
                    config.timestampsDone = [];
                    setTaskConfig(config);
                }
            }

            setPageCnt(pageLen - 1);
            dispatch(addAndSaveNewTask(config, subjectId, closeDialog, reset));
        }
    }, [dispatch, interval, pageCnt, reset, subjectId, taskConfig]);
    
    const userPrefersDayStartsAtHour = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_DAY_STARTS_AT] as (number|undefined));

    const pages = useCallback((closeDialog: Function) => [
        <Fragment>
            <div className={toCss(s_spacesSelect)} >
                {spaces?.map(s => (
                    <span 
                        className={toCss(s_space, s.id === spaceId ? s_spaceSelected : '')}
                        onClick={() => {
                            setSpaceId(s.id);
                            onChangePageCnt(1);
                        }}
                    >
                        {s.name}
                    </span> 
                ))}
            </div>
        </Fragment>,
        <Fragment>
            <div className={toCss(s_subjectScrollPane)}>
                {(() => {
                    const filteredSubs = filterSubjectsForSpace(subjects || [], spaceId);
                    if (!filteredSubs || filteredSubs.length === 0) {
                        return <h3 className={toCss(s_nosubs)} >No Subjects in this space!</h3>
                    } else {
                        return (filteredSubs.map(subject => (
                            <SimpleSettingsRow 
                                key={subject.id}
                                title={subject.name}
                                bgColor={subject.color}
                                onClick={() => {
                                    setSubjectId(subject.id);
                                    onChangePageCnt(1);
                                }}
                                outline={subject.id === subjectId}
                            />
                        )));
                    }
                })()}
            </div> 
        </Fragment>,
        <Fragment>
            <h3>What do you want to do?</h3>
            <div className={toCss(s_inAndStar)}> 
                <Input
                    label=''
                    addClass={toCss(s_typeInput)}
                    elementType='input'
                    value={taskConfig.type}
                    onChange={newType => changeHandler('type', newType)}
                    ref={typeInputRef}
                    markWhenEmpty={markTypeInput}
                    elementConfig={{
                        onKeyPress: (event: React.KeyboardEvent) => {
                            if (event.key === 'Enter') {
                                if (keyMap.Shift || keyMap.Control) addTaskHandler(closeDialog);
                                else onChangePageCnt(1);
                            }
                        },
                        onKeyDown: handleKey,
                        onKeyUp: handleKey,
                    }}
                />
                <FontAwesomeIcon 
                    className={toCss(s_star)}  
                    icon={(taskConfig.star ? fasStar : farStar) as IconProp}
                    onClick={() => changeHandler('star', !taskConfig.star)}
                />
            </div>
        </Fragment>,
        <Fragment>
                
            <h3>When do you want to be reminded?</h3>
            <div className={toCss(s_shortcuts)} >
                {(() => {
                    const dateIn = (days: number): Date => addDays(endOf(subtractHours(new Date(), userPrefersDayStartsAtHour || 0)), days);
                    const dates = arrayToN(6).map((val, idx) => dateIn(idx));
                    return dates.map((date, idx) => (
                        <Button
                            key={idx}
                            fontSize='.8em'
                            onClick={() => {
                                changeHandler('firstDeadline', date);
                                onChangePageCnt(1);
                            }}
                        >
                            { idx === 0 ? 'Today'
                                : idx === 1 ? 'Tomorrow'
                                : getWeekDay(date) }
                        </Button>
                    ));
                })()}
                <input 
                    type="date"
                    value={dateToHTMLString(getDateFromTimestamp(firstDeadline))}
                    onChange={e => changeHandler('firstDeadline', HTMLStringToDate(e.target.value, 23, 59))}
                    className={toCss(s_firstDeadlineInput)} 
                />
            </div>

        </Fragment>,
        <Fragment>
                
            <h3>What is the interval?</h3>
            <Input
                label='Interval'
                elementType='select-visual'
                value={interval}
                onChange={newInterval => {
                    changeHandler('interval', newInterval);
                }}
                onClick={(event: any) => {
                    if (event.target.value !== 'once')
                        onChangePageCnt(1, true);
                    else 
                        onChangePageCnt(2, true);
                }}
                options={IntervalOptions.reverse()}
                addClass={toCss(s_intervalOptions)}
            />

        </Fragment>,
        <Fragment>  
                
            <Fragment>
                <h3>What's the last date?</h3>
                <select value={lastDeadline.seconds} onChange={event => {
                    changeHandler('lastDeadline', getDateFromSeconds(parseInt(event.target.value))); 
                    onChangePageCnt(1);
                }}>
                    { getNDatesAsSecondsForInterval(firstDeadline.seconds, interval, CONFIG__QUICK_ADD_FUTURE_END_OPTIONS).map(secs => (
                        <option key={secs} value={secs}>{formatDateOutput(getDateFromSeconds(secs))}</option>
                    ))}
                </select>
            </Fragment>
                
        </Fragment>,
        <Fragment>
            <h3>Any Additional Text?</h3>
            <Input
                ref={addTextInputRef}
                label='Add Info'
                elementType='text-area'
                value={taskConfig.additionalInfo?.text || ''}
                onChange={newText => changeHandler('additionalInfo', newText)}
                addClass={toCss(s_addTextField)}
            />
            { error && <span className={toCss(s_error)}>{error}</span> }
        </Fragment>,
    ], [addTaskHandler, changeHandler, error, firstDeadline, handleKey, interval, lastDeadline.seconds, markTypeInput, onChangePageCnt, spaceId, spaces, subjectId, subjects, taskConfig.additionalInfo, taskConfig.star, taskConfig.type, userPrefersDayStartsAtHour]);
    
    if (!props.isShown) return null;

    return (
        <Dialog
            isShown={props.isShown}
            onCloseComplete={() => props.onCloseComplete()}
            onConfirm={close => addTaskHandler(close)}
            topOffset='18vmin'
            title='Quickly Add New Task'
            confirmLabel='Add'
            isConfirmDisabled={!addEnabled}
            isConfirmLoading={loading}
            onCancel= {close => {
                close();
                reset();
            }}
        >
            {({ close }) => (
                <div 
                    className={toCss(s_wrapper)}
                    tabIndex={-1}
                    onKeyDown={event => {
                        handleKey(event);
                        if (pageCnt !== 2) {
                            if (event.key === 'ArrowLeft')
                                onChangePageCnt(-1);
                            else if (event.key === 'ArrowRight')
                                onChangePageCnt(1);
                            else if (pageCnt !== pageLen - 1 && event.key === 'Enter')
                                addTaskHandler(close);
                        }
                    }}
                    onKeyUp={handleKey}
                >
                    
                    <FontAwesomeIcon 
                        icon={faAngleLeft} 
                        className={toCss(s_angleLeft, (pageCnt <= 0 ? s_hidden : ''))} 
                        onClick={() => onChangePageCnt(-1)}
                    /> 
                    <FontAwesomeIcon 
                        icon={faAngleRight}
                        className={toCss(s_angleRight, ((pageCnt <= 1 || pageCnt >= pageLen - 1) ? s_hidden : ''))}
                        onClick={() => onChangePageCnt(1)}
                    /> 

                    <div 
                        className={toCss(s_pages)} 
                        style={{
                            transform: 'translateX(-' + (pageCnt*100) + '%)',
                        }}
                    >
                        {pages(close).map(pageContent => (
                            <div className={toCss(s_page)} >
                                {pageContent}
                            </div>
                        ))}
                    </div>

                </div>
            )}
        </Dialog>
    );
}