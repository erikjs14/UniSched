import React, { useState, useEffect } from 'react';

import WeekdaySeperator from './weekdaySeperator/WeekdaySeperator';
import DueTask from './dueTask/DueTask';
import CSS from './DueTasks.module.scss';
import { DueTasksProps } from './DueTasks.d';
import { toCss } from './../../../util/util';
import { getRelevantTaskSemanticsGrouped, TaskSemantic, containsDay, getSecondsFromDate } from './../../../util/timeUtil';
import AnimateHeight from 'react-animate-height';
import { faSmileBeam } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const {
    wrapper: s_wrapper,
    dayWrapper: s_dayWrapper,
    noTodo: s_noTodo,
} = CSS;

const taskContained = (taskId: string, seconds: number, array: [string, number][]): boolean => {
    let ret = false;
    array.forEach(([id, ts]) => {
        if (id === taskId && ts === seconds) {
            ret = true;
        }
    });
    return ret;
}

const allTasksOfOneDayContained = (tasks: TaskSemantic[], toFadeOut: [string, number][]): boolean => {
    for (const task of tasks) {
        if (!toFadeOut.find(([id, ts]) => task.taskId === id && task.dueAt.getTime() === ts)) {
            return false;
        }
    }
    return true;
}

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

    // no tasks todo
    if (!semTasks || semTasks.length === 0) {
        return (
            <div className={toCss(s_noTodo)}>
                <FontAwesomeIcon icon={faSmileBeam} />
                <h2>Nothing on your list right now. Yeah!!</h2>
            </div>
        )
    }
    
    const allTasks = semTasks.map(tasksOneDay => (
        <AnimateHeight
            key={tasksOneDay[0].dueAt.getTime()} 
            height={containsDay(fadeDayOut, tasksOneDay[0].dueAt) ? 0 : 'auto'}
            duration={400}
            delay={1800}
            className={toCss(s_dayWrapper)}
        >
            <div>
                <WeekdaySeperator
                    date={tasksOneDay[0].dueAt}
                    amount={tasksOneDay.length}
                />
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
                        onFadeOutComplete={() => props.onTaskChecked(task.subjectId, task.taskId, getSecondsFromDate(task.dueAt))}
                        backgroundColor={props.subjects[task.subjectId].color}
                    />
                ))}
            </div>
        </AnimateHeight>
    ));
    
    return (
        <div className={toCss(s_wrapper)}>
            {allTasks}
        </div>
    );
});