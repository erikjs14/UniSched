import React, { useState, useEffect, useCallback, Fragment, useMemo, useRef } from 'react';

import WeekdaySeperator from './weekdaySeperator/WeekdaySeperator';
import Collapsible from '../../ui/collapsible/Collapsible';
import DueTask from './dueTask/DueTask';
import CSS from './DueTasks.module.scss';
import { DueTasksProps } from './DueTasks.d';
import { toCss } from './../../../util/util';
import { getRelevantTaskSemanticsGrouped, containsDay, endOf, allTasksOfOneDayContained, taskContained, getSecondsFromDate, subtractHours, dayIsInLimit, TaskSemantic } from './../../../util/timeUtil';
import AnimateHeight from 'react-animate-height';
import { faSmileBeam, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { IconButton, TextInput } from 'evergreen-ui';
const {
    wrapper: s_wrapper,
    dayWrapper: s_dayWrapper,
    noTodo: s_noTodo,
    fadeOutMargin: s_fadeOutMargin,
    noTodoToday: s_noTodoToday,
    animMargin: s_animMargin,
    small: s_small,
    filterStar: s_filterStar,
    enabled: s_enabled,
    amountStars: s_amountStars,
    showMore: s_showMore,
    showLess: s_showLess,
    showMoreLessArea: s_showMoreLessArea,
    nofound: s_nofound,
    infoRow: s_infoRow,
    filterInput: s_filterInput,
    crossInput: s_crossInput,
    filter: s_filter,
    headlineWrapper: s_headlineWrapper,
} = CSS;

export default React.memo(function(props: DueTasksProps): JSX.Element {

    const [fadeTaskOut, setFadeTaskOut] = useState<[string, number][]>([]);
    const [fadeDayOut, setFadeDayOut] = useState<Date[]>([])
    const [filterText, setFilterText] = useState('');
    const filterInputRef = useRef<HTMLInputElement>();

    useEffect(() => {
        const handler = (event: KeyboardEvent) => {
            if (event.ctrlKey && event.key === 'f') {
                event.preventDefault();
                filterInputRef?.current?.focus();
            }
        }
        window.addEventListener('keydown', handler)
        return () => window.removeEventListener('keydown', handler);
    }, []);

    const [semTasks, starsPerDay, remindersPerDay] = React.useMemo(() => getRelevantTaskSemanticsGrouped(
            props.dueTasks, false, undefined, false, false, false, props.onlyRelevantTasks || false, props.forceShowAllTasksForXDays || undefined 
        ), [props.dueTasks, props.forceShowAllTasksForXDays, props.onlyRelevantTasks]);
    const containsStars = React.useMemo(() => {
        return starsPerDay.some(nr => nr > 0);
    }, [starsPerDay]);
    const amountStars = React.useMemo(() => {
        return starsPerDay.reduce((prev, cur) => prev + cur, 0);
    }, [starsPerDay]);

    const minShowDayLimit = useMemo((() => {
        if (!props.limitDaysInFuture && props.limitDaysInFuture !== 0) 
            return 5;
        let limit = 0;
        for (let tasksOneDay of semTasks) {
            if (dayIsInLimit(tasksOneDay[0].dueAt, props.limitDaysInFuture)) {
                limit++;
            } else {
                break;
            }
        }
        return limit;
    }), [props.limitDaysInFuture, semTasks]);
    const [showDays, setShowDays] = useState<number>(
        props.limitDaysInFuture
            ? minShowDayLimit
            : semTasks.length
    );
    const showLess = useCallback(() => {
        const newAmount = showDays - 7;
        if (newAmount < minShowDayLimit)
            setShowDays(minShowDayLimit);
        else 
            setShowDays(newAmount);
    }, [minShowDayLimit, showDays]);
    const showMore = useCallback(() => {
        const newAmount = showDays + 7;
        if (newAmount > semTasks.length)
            setShowDays(semTasks.length);
        else 
            setShowDays(newAmount);
    }, [semTasks.length, showDays]);

    const [onlyStars, setOnlyStars] = useState(props.onlyStars);
    
    useEffect(() => {
        for (const tasksOneDay of semTasks) {
            if (allTasksOfOneDayContained(tasksOneDay, fadeTaskOut)) {
                setFadeDayOut(prev => [...prev, tasksOneDay[0].dueAt]);
            }
        }
    }, [fadeTaskOut, semTasks]);

    

    // no tasks todo
    if (!semTasks || semTasks.length === 0) {
        return (
                <div className={toCss(s_noTodo)}>
                    <FontAwesomeIcon icon={faSmileBeam} />
                    <h2>Nothing on your list right now. Yeah!!</h2>
                </div>
        )
    }

    const endOfDayMsAdapted = endOf(subtractHours(new Date(), props.dayStartsAtHour || 0)).getTime();
    // if no tasks today or from past display that today all tasks are done
    const todayView = (
        <AnimateHeight
            height={endOfDayMsAdapted < endOf(semTasks[0][0].dueAt).getTime() ? 'auto' : 0}
            animateOpacity
            duration={400}
            animationStateClasses={{
                staticHeightAuto: s_animMargin,
            }}
            easing='ease-in'
        >
            <div className={toCss(s_noTodoToday)}>
                <FontAwesomeIcon icon={faSmileBeam} />
                <h2>You have finished all tasks for today. Yeah!!</h2>
            </div>
        </AnimateHeight>
    );
    
    const filteredStarsPerDay: number[] = filterText ? [] : starsPerDay;
    const filteredRemindersPerDay: number[] = filterText ? [] : remindersPerDay;
    const filteredTasksPerDay: number[] = filterText ? [] : semTasks.map(day => day.length);
    const filteredTasks: TaskSemantic[][] = filterText ? semTasks.map((tasksOneDay, idx) => {
        return tasksOneDay.filter(task => {
            return task.name.toUpperCase().includes(filterText.toUpperCase()) 
                || task.additionalInfo?.text?.toUpperCase().includes(filterText.toUpperCase())
                || props.subjects[task.subjectId].name.toUpperCase().includes(filterText.toUpperCase());
        });
    }).reduce<TaskSemantic[][]>((acc, current, curIdx) => {
        if (current.length > 0) {
            filteredStarsPerDay.push(starsPerDay[curIdx]);
            filteredRemindersPerDay.push(remindersPerDay[curIdx]);
            filteredTasksPerDay.push(current.length);
            return [
                ...acc,
                current
            ];
        } else {
            return acc;
        }
    }, [])
        : semTasks;
        
    const allTasks = filteredTasks.map((tasksOneDay, idx) => {
        //check if limit reached
        if ((!onlyStars && idx + 1 > showDays) || ( onlyStars && filteredStarsPerDay.reduce((prev, cur, lidx) => lidx <= idx && cur > 0 ? prev + 1 : prev , 0) > showDays ) ){
            return null;
        }
        //check for stars
        if (onlyStars && filteredStarsPerDay[idx] < 1) {
            return null;
        }

        // check for reminders
        if (props.onlyReminders && filteredRemindersPerDay[idx] < 1) {
            return null;
        }
        if (props.excludeReminders && (filteredTasksPerDay[idx] - filteredRemindersPerDay[idx]) < 1) {
            return null;
        }

        const dayContained = containsDay(fadeDayOut, tasksOneDay[0].dueAt);
        const dayInPast = tasksOneDay[0].dueAt.getTime() <= endOfDayMsAdapted;
        return (
            <AnimateHeight
                key={tasksOneDay[0].dueAt.getTime()} 
                height={dayContained ? 0 : 'auto'}
                duration={400}
                delay={1800}
                // onAnimationEnd={params => params.newHeight === 0 ? setFadeDayOut(prev => prev.filter(d => !sameDay(d, tasksOneDay[0].dueAt))) : null}
            >
                <div className={toCss(s_dayWrapper, (dayContained ? s_fadeOutMargin : ''))}>
                    <Collapsible
                        header={(
                            <WeekdaySeperator
                                date={tasksOneDay[0].dueAt}
                                amount={tasksOneDay.length}
                                withClock={dayInPast}
                                amountStars={filteredStarsPerDay[idx]}
                                dayStartsAtHour={props.dayStartsAtHour}
                            />
                        )}
                        uncollapsed={onlyStars
                            || filterText?.length > 0
                            || props.expandAllVisibleDays 
                            || endOf(subtractHours(new Date(), props.dayStartsAtHour || 0)).getTime() >= endOf(tasksOneDay[0].dueAt).getTime()
                        }
                        noBorder
                        fullWidthHeader
                        headerClickable
                    >
                            
                            {tasksOneDay.map(task => (
                                (!onlyStars || (onlyStars && task.star))
                                && (!props.onlyReminders || (props.onlyReminders && task.reminder))
                                && (!props.excludeReminders || (props.excludeReminders && !task.reminder)) ?
                                    <DueTask
                                        key={task.taskId}
                                        taskSemantic={task}
                                        subjectDisplayName={props.subjects[task.subjectId].name}
                                        onCheck={() => {
                                            if (!taskContained(task.taskId, task.dueAt.getTime(), fadeTaskOut)) {
                                                setFadeTaskOut(prev => [...prev, [task.taskId, task.dueAt.getTime()]]);
                                            }
                                        }}
                                        fadeOut={taskContained(task.taskId, task.dueAt.getTime(), fadeTaskOut)}
                                        onFadeOutComplete={() => {
                                            props.onTaskChecked(task.subjectId, task.taskId, getSecondsFromDate(task.dueAt));
                                            // setFadeTaskOut(prev => prev.filter(([id, ts]) => task.taskId !== id || task.dueAt.getTime() !== ts));
                                        }}
                                        backgroundColor={props.subjects[task.subjectId].color}
                                        small={props.small}
                                        star={task.star}
                                        bell={task.reminder}
                                        moreInfo={task.additionalInfo?.text ? true : false}
                                        showExactTime={props.showTimeForTasks || (props.showTimeForStarredTasks && task.star)}
                                    />
                                : null 
                                ))
                            }
                    </Collapsible>
                </div>
            </AnimateHeight>
        );
    });
    
    return (
        <div className={toCss(s_wrapper, (props.small ? s_small : ''))}>

            {props.headline && (
                <div className={s_headlineWrapper}>
                    <h3>{props.headline}</h3>
                </div>
            )}

            <div className={toCss(s_infoRow)}>
                {containsStars &&
                    <Fragment>
                        <span className={toCss(s_amountStars)} >
                            <FontAwesomeIcon icon={faStar} />
                            { amountStars }
                        </span>
                        <span className={toCss(s_filterStar, (onlyStars ? s_enabled : ''))} onClick={() => setOnlyStars(prev => !prev)}>Only stars</span>
                    </Fragment>
                }
                { (semTasks && semTasks.length > 0) && (
                    <div className={toCss(s_filter)}>
                        <TextInput 
                            value={filterText}
                            onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setFilterText(e.target.value)}
                            placeholder='Search...'
                            className={toCss(s_filterInput)}
                            innerRef={filterInputRef as any}
                        />
                        <IconButton 
                            icon='cross' 
                            onClick={() => setFilterText('')}
                            appearance='minimal'
                            className={toCss(s_crossInput)}
                        />
                    </div>
                )}
            </div>
            {todayView}
            {allTasks}
            { filterText?.length > 0 && filteredTasks.length < 1 && (
                <div className={toCss(s_nofound)} >
                    None found
                </div>
            )}
            <div className={toCss(s_showMoreLessArea)} >
                {(!onlyStars ? (showDays < filteredTasks.length - 1) : (showDays < amountStars) ) &&
                    <span className={toCss(s_showMore)}  onClick={showMore}>
                        Show More
                    </span>
                }
                {showDays > minShowDayLimit &&
                    <span className={toCss(s_showLess)}  onClick={showLess}>
                        Show Less
                    </span>
                }
            </div>
        </div>
    );
});