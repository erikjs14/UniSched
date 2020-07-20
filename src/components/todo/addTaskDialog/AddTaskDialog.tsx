import React, { PropsWithChildren, useState, useMemo, useCallback, Fragment, useRef, useEffect } from 'react';

import CSS from './AddTaskDialog.module.scss';
import { AddTaskDialogProps } from './AddTaskDialog.d';
import { Dialog } from 'evergreen-ui';
import { toCss, arrayToN } from '../../../util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleLeft, faAngleRight } from '@fortawesome/free-solid-svg-icons';
import Input from '../../ui/input/Input';
import { getTaskStartState } from '../../../config/settingsConfig';
import Button from '../../ui/button/Button';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { getDateFromTimestamp, getDateFromSeconds, getTimestampFromDate, dateToHTMLString, endOf, HTMLStringToDate, addDays, subtractHours, getNDatesAsSecondsForInterval, formatDateOutput, getConfigDataFromTimestamps } from '../../../util/timeUtil';
import { getEditedTimestamps, getWeekDay } from './../../../util/timeUtil';
import { PREF_ID_DAY_STARTS_AT } from '../../../config/userPreferences';
import { RootState } from '../../..';
import { useSelector, useDispatch } from 'react-redux';
import SimpleSettingsRow from '../../subjects/SimpleSettingsRow/SimpleSettingsRow';
import { IntervalOptions } from '../../../firebase/model';
import { CONFIG__QUICK_ADD_FUTURE_END_OPTIONS } from '../../../config/todoConfig';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { addAndSaveNewTask } from '../../../store/actions';
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
    sectionFirstDeadline: s_sectionFirstDeadline,
    sectionInterval: s_sectionInterval,
    sectionLastDeadline: s_sectionLastDeadline,
    intervalOptions: s_intervalOptions,
    addTextField: s_addTextField,
} = CSS;

// !!! ALWAYS UPDATE
const pageLen = 4;
export default function(props: PropsWithChildren<AddTaskDialogProps>): JSX.Element {

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    const {loading, error} = useSelector((state: RootState) => state.data.tasks);
    const dispatch = useDispatch();

    const [pageCnt, setPageCnt] = useState(0);
    const [addEnabled, setAddEnabled] = useState(false);
    const [markTypeInput, setMarkTypeInput] = useState(false);

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

    // set focus to input when rendered
    const typeInputRef = useRef<HTMLInputElement>(null);
    const addTextInputRef = useRef<HTMLTextAreaElement>(null);
    useEffect(() => {
        if (props.isShown && pageCnt === 1){
            // evergreen dialog focuses on cancel by default --> wait and override
            setTimeout(() => typeInputRef.current?.focus(), 350);
        } else if (props.isShown && pageCnt === 3) {
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
                taskConfig.timestampsDone
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
    }, [firstDeadline, interval, lastDeadline, taskConfig.timestamps, taskConfig.timestampsDone]);

    const onChangePageCnt = useCallback((amount: number) => {
        // check type input
        if (amount !== 0 && pageCnt === 1) {
            if (taskConfig.type.trim().length === 0) {
                setMarkTypeInput(true);
                return;
            }
        }

        let newCnt = pageCnt + amount;
        if (newCnt < 0) newCnt = 0;
        else if (newCnt >= pageLen) newCnt = pageLen - 1;
        setPageCnt(newCnt);
    }, [pageCnt, taskConfig.type]);

    const reset = useCallback(() => {
        setPageCnt(0);
        setMarkTypeInput(false);
        setSubjectId(null);
        setTaskConfig(getTaskStartState());
    }, []);

    const addTaskHandler = useCallback((closeDialog: Function) => {
        if (taskConfig?.type?.length > 0 && subjectId) {
            setPageCnt(pageLen - 1);
            dispatch(addAndSaveNewTask(taskConfig, subjectId, closeDialog, reset));
        }
    }, [dispatch, reset, subjectId, taskConfig]);
    
    const userPrefersDayStartsAtHour = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_DAY_STARTS_AT] as (number|undefined));

    const pages = useMemo(() => [
        <Fragment>
            <div className={toCss(s_subjectScrollPane)}>
                {subjects?.map(subject => (
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
                ))}
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
                                onChangePageCnt(1);
                            }
                        },
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
            <div className={toCss(s_sectionFirstDeadline)} >
                
                <h3>When do you want to be reminded?</h3>
                <div className={toCss(s_shortcuts)} >
                    {(() => {
                        const dateIn = (days: number): Date => addDays(endOf(subtractHours(new Date(), userPrefersDayStartsAtHour || 0)), days);
                        const dates = arrayToN(6).map((val, idx) => dateIn(idx));
                        return dates.map((date, idx) => (
                            <Button
                                key={idx}
                                fontSize='.8em'
                                onClick={() => changeHandler('firstDeadline', date)}
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
            </div>

            <div className={toCss(s_sectionInterval)} >
                
                <h3>What is the interval?</h3>
                <Input
                    label='Interval'
                    elementType='select-visual'
                    value={interval}
                    onChange={newInterval => changeHandler('interval', newInterval)}
                    options={IntervalOptions.reverse()}
                    addClass={toCss(s_intervalOptions)}
                />
            </div>

            <div className={toCss(s_sectionLastDeadline, (interval === 'once' ? s_hidden : ''))} >
                
                <Fragment>
                    <h3>What's the last date?</h3>
                    <select value={lastDeadline.seconds} onChange={event => changeHandler('lastDeadline', getDateFromSeconds(parseInt(event.target.value)))}>
                        { getNDatesAsSecondsForInterval(firstDeadline.seconds, interval, CONFIG__QUICK_ADD_FUTURE_END_OPTIONS).map(secs => (
                            <option key={secs} value={secs}>{formatDateOutput(getDateFromSeconds(secs))}</option>
                        ))}
                    </select>
                </Fragment>
                
            </div>
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
    ], [changeHandler, error, firstDeadline, interval, lastDeadline.seconds, markTypeInput, onChangePageCnt, subjectId, subjects, taskConfig.additionalInfo, taskConfig.star, taskConfig.type, userPrefersDayStartsAtHour]);
    
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
        >
            {({ close }) => (
                <div 
                    className={toCss(s_wrapper)}
                    tabIndex={-1}
                    onKeyDown={event => {
                        if (pageCnt !== 1) {
                            if (event.key === 'ArrowLeft')
                                onChangePageCnt(-1);
                            else if (event.key === 'ArrowRight')
                                onChangePageCnt(1);
                            else if (pageCnt !== pageLen - 1 && event.key === 'Enter')
                                addTaskHandler(close);
                        }
                    }}
                >
                    
                    <FontAwesomeIcon 
                        icon={faAngleLeft} 
                        className={toCss(s_angleLeft, (pageCnt <= 0 ? s_hidden : ''))} 
                        onClick={() => onChangePageCnt(-1)}
                    /> 
                    <FontAwesomeIcon 
                        icon={faAngleRight}
                        className={toCss(s_angleRight, (pageCnt >= pages.length - 1 || pageCnt === 0 ? s_hidden : ''))}
                        onClick={() => onChangePageCnt(1)}
                    /> 

                    <div 
                        className={toCss(s_pages)} 
                        style={{
                            transform: 'translateX(-' + (pageCnt*100) + '%)',
                        }}
                    >
                        {pages.map(pageContent => (
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