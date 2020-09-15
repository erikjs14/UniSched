import React, { useState, useEffect, useCallback, Fragment, useMemo } from 'react';

import WeekdaySeperator from './weekdaySeperator/WeekdaySeperator';
import Collapsible from '../../ui/collapsible/Collapsible';
import DueTask from './dueTask/DueTask';
import CSS from './DueTasks.module.scss';
import { DueTasksProps } from './DueTasks.d';
import { toCss } from './../../../util/util';
import { getRelevantTaskSemanticsGrouped, containsDay, endOf, allTasksOfOneDayContained, taskContained, TaskSemantic, formatDateTimeOutput, getSecondsFromDate, subtractHours, dayIsInLimit } from './../../../util/timeUtil';
import AnimateHeight from 'react-animate-height';
import { faSmileBeam, faStar } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toaster } from 'evergreen-ui';
const {
    wrapper: s_wrapper,
    dayWrapper: s_dayWrapper,
    noTodo: s_noTodo,
    fadeOutMargin: s_fadeOutMargin,
    noTodoToday: s_noTodoToday,
    animMargin: s_animMargin,
    small: s_small,
    showAll: s_showAll,
    filterStar: s_filterStar,
    enabled: s_enabled,
    amountStars: s_amountStars,
} = CSS;

export default React.memo(function(props: DueTasksProps): JSX.Element {

    const [fadeTaskOut, setFadeTaskOut] = useState<[string, number][]>([]);
    const [fadeDayOut, setFadeDayOut] = useState<Date[]>([])

    const [semTasks, starsPerDay] = React.useMemo(() => getRelevantTaskSemanticsGrouped(
            props.dueTasks, false, undefined, false, props.onlyRelevantTasks || false, props.forceShowAllTasksForXDays || undefined 
        ), [props.dueTasks, props.forceShowAllTasksForXDays, props.onlyRelevantTasks]);
    const containsStars = React.useMemo(() => {
        return starsPerDay.some(nr => nr > 0);
    }, [starsPerDay]);
    const amountStars = React.useMemo(() => {
        return starsPerDay.reduce((prev, cur) => prev + cur, 0);
    }, [starsPerDay]);

    const minShowDayLimit = useMemo((() => {
        if (!props.limitDaysInFuture) 
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

    const showTaskInfo = useCallback((task: TaskSemantic): void => {
        toaster.notify(
            `Due at ${formatDateTimeOutput(task.dueAt)}`, {
                id: 'unique',
                description: task.additionalInfo?.text,
            }
        );
    }, []);

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
    
    const allTasks = semTasks.map((tasksOneDay, idx) => {
        //check if limit reached
        if (idx + 1 > showDays) return null;
        //check for stars
        if (onlyStars && starsPerDay[idx] < 1) return null;

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
                                amountStars={starsPerDay[idx]}
                                dayStartsAtHour={props.dayStartsAtHour}
                            />
                        )}
                        uncollapsed={onlyStars
                            || props.expandAllVisibleDays 
                            || endOf(subtractHours(new Date(), props.dayStartsAtHour || 0)).getTime() >= endOf(tasksOneDay[0].dueAt).getTime()
                        }
                        noBorder
                        fullWidthHeader
                        headerClickable
                    >
                            
                            {tasksOneDay.map(task => (
                                (!onlyStars || (onlyStars && task.star)) ?
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
                                        infoClicked={() => showTaskInfo(task)}
                                        small={props.small}
                                        star={task.star}
                                        moreInfo={task.additionalInfo?.text ? true : false}
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
            {containsStars &&
                <Fragment>
                    <span className={toCss(s_amountStars)} >
                        <FontAwesomeIcon icon={faStar} />
                        { amountStars }
                    </span>
                    <span className={toCss(s_filterStar, (onlyStars ? s_enabled : ''))} onClick={() => setOnlyStars(prev => !prev)}>Only stars</span>
                </Fragment>
            }
            {todayView}
            {allTasks}
            {showDays < semTasks.length - 1 &&
                <span className={toCss(s_showAll)}  onClick={showMore}>
                    Show More
                </span>
            }
            {showDays > minShowDayLimit &&
                <span className={toCss(s_showAll)}  onClick={showLess}>
                    Show Less
                </span>
            }
        </div>
    );
});