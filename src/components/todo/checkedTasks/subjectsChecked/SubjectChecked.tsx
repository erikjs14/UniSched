import React, { useState } from 'react';

import CSS from './SubjectChecked.module.scss';
import { SubjectCheckedProps } from './SubjectChecked.d';
import SimpleSettingsRow from '../../../subjects/SimpleSettingsRow/SimpleSettingsRow';
import Collapsible from '../../../ui/collapsible/Collapsible';
import UndueTask from './undueTask/UndueTask';
import { taskContained, getSecondsFromDate } from '../../../../util/timeUtil';
import { CONFIG__PAST_TASKS_LIMIT, CONFIG__EXPAND_PAST_TASKS } from '../../../../config/todoConfig';
import { toCss } from '../../../../util/util';
const {
    wrapper: s_wrapper,
    task: s_task,
    showMore: s_showMore,
} = CSS;

export default function(props: SubjectCheckedProps): JSX.Element | null {

    const [tasksShown, setTasksShown] = useState(CONFIG__PAST_TASKS_LIMIT);

    const [fadeTaskOut, setFadeTaskOut] = useState<[string, number][]>([]);

    if (!props.rawTasks || props.rawTasks === []) {
        return null;
    }
    
    const header = (
        <SimpleSettingsRow
            title={props.subject.name}
            bgColor={props.subject.color}
            noHover
            darkenBy={.3}
        />
    );

    const checkedTasks = props.rawTasks.slice(0, tasksShown).map(task => (
        <UndueTask
            key={task.taskId + task.dueString}
            taskSemantic={task}
            subjectDisplayName={props.subject.name}
            onUncheck={() => {
                if (!taskContained(task.taskId, task.dueAt.getTime(), fadeTaskOut)) {
                    setFadeTaskOut(prev => [...prev, [task.taskId, task.dueAt.getTime()]]);
                }
            }}
            fadeOut={taskContained(task.taskId, task.dueAt.getTime(), fadeTaskOut)}
            onFadeOutComplete={() => {
                props.onTaskUnchecked(task.taskId, getSecondsFromDate(task.dueAt));
                setFadeTaskOut(prev => prev.filter(([id, ts]) => task.taskId !== id || task.dueAt.getTime() !== ts));
            }}
            backgroundColor='soncrete'
            addCss={s_task}
        />
    ));

    const showMoreBtn = props.rawTasks.length > tasksShown 
            ? (
                <span
                    className={toCss(s_showMore)} 
                    onClick={() => setTasksShown(prev => prev + CONFIG__EXPAND_PAST_TASKS)}
                >Show more...</span>
            )
            : null;
    
    return (
        <Collapsible
            header={header}
            fullWidthHeader
            headerClickable
            noBorder
            addCss={s_wrapper}
        >
            {checkedTasks}
            {showMoreBtn}
        </Collapsible>
    );
}