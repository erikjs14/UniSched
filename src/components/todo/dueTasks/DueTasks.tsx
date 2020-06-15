import React, { useState, useEffect, useCallback } from 'react';

import WeekdaySeperator from './weekdaySeperator/WeekdaySeperator';
import Collapsible from '../../ui/collapsible/Collapsible';
import DueTask from './dueTask/DueTask';
import CSS from './DueTasks.module.scss';
import { DueTasksProps } from './DueTasks.d';
import { toCss } from './../../../util/util';
import { getRelevantTaskSemanticsGrouped, containsDay, endOf, allTasksOfOneDayContained, taskContained, sameDay, TaskSemantic, formatDateTimeOutput, getSecondsFromDate } from './../../../util/timeUtil';
import AnimateHeight from 'react-animate-height';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { toaster } from 'evergreen-ui';
const {
    wrapper: s_wrapper,
    dayWrapper: s_dayWrapper,
    noTodo: s_noTodo,
    fadeOutMargin: s_fadeOutMargin,
    noTodoToday: s_noTodoToday,
    animMargin: s_animMargin,
} = CSS;

export default React.memo(function(props: DueTasksProps): JSX.Element {

    const [fadeTaskOut, setFadeTaskOut] = useState<[string, number][]>([]);
    const [fadeDayOut, setFadeDayOut] = useState<Date[]>([])

    const semTasks = React.useMemo(() => getRelevantTaskSemanticsGrouped(props.dueTasks, false), [props.dueTasks]);
    
    useEffect(() => {
        for (const tasksOneDay of semTasks) {
            if (allTasksOfOneDayContained(tasksOneDay, fadeTaskOut)) {
                setFadeDayOut(prev => [...prev, tasksOneDay[0].dueAt]);
            }
        }
    }, [fadeTaskOut, semTasks]);

    const showTaskInfo = useCallback((task: TaskSemantic): void => {
        toaster.notify(
            `Due at ${formatDateTimeOutput(task.dueAt)}`,
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

    // if no tasks today or from past display that today all tasks are done
    const todayView = (
        <AnimateHeight
            height={semTasks[0][0].dueAt.getTime() > endOf(new Date()).getTime() ? 'auto' : 0}
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
    
    const allTasks = semTasks.map(tasksOneDay => {
        const dayContained = containsDay(fadeDayOut, tasksOneDay[0].dueAt);
        const dayInPast = tasksOneDay[0].dueAt.getTime() < endOf(new Date()).getTime();
        return (
            <AnimateHeight
                key={tasksOneDay[0].dueAt.getTime()} 
                height={dayContained ? 0 : 'auto'}
                duration={400}
                delay={1800}
                onAnimationEnd={params => params.newHeight === 0 ? setFadeDayOut(prev => prev.filter(d => !sameDay(d, tasksOneDay[0].dueAt))) : null}
            >
                <div className={toCss(s_dayWrapper, (dayContained ? s_fadeOutMargin : ''))}>
                    <Collapsible
                        header={(
                            <WeekdaySeperator
                                date={tasksOneDay[0].dueAt}
                                amount={tasksOneDay.length}
                                withClock={dayInPast}
                            />
                        )}
                        uncollapsed={endOf(new Date()).getTime() > tasksOneDay[0].dueAt.getTime()}
                        noBorder
                        fullWidthHeader
                        headerClickable
                    >
                            
                            {tasksOneDay.map(task => (
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
                                        setFadeTaskOut(prev => prev.filter(([id, ts]) => task.taskId !== id || task.dueAt.getTime() !== ts));
                                    }}
                                    backgroundColor={props.subjects[task.subjectId].color}
                                    infoClicked={() => showTaskInfo(task)}
                                />
                            ))}
                    </Collapsible>
                </div>
            </AnimateHeight>
        );
    });
    
    return (
        <div className={toCss(s_wrapper)}>
            {todayView}
            {allTasks}
        </div>
    );
});