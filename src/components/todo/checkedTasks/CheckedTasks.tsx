import React, { useMemo } from 'react';

import CSS from './CheckedTasks.module.scss';
import { CheckedTasksProps } from './CheckedTasks.d';
import { toCss } from '../../../util/util';
import { getUncheckedTaskSemanticsGroupedObject } from '../../../util/timeUtil';
import SubjectChecked from './subjectsChecked/SubjectChecked';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: CheckedTasksProps): JSX.Element {

    const semTasks = useMemo(() => getUncheckedTaskSemanticsGroupedObject(props.rawTasks), [props.rawTasks]);

    const subjects = Object.keys(semTasks).map(subId => (
        <SubjectChecked 
            key={subId}
            rawTasks={semTasks[subId]}
            subject={props.subjects[subId]}
            onTaskUnchecked={(taskId, timestampSeconds) => props.onTaskUnchecked(subId, taskId, timestampSeconds)}
        />
    ))
    
    return (
        <div className={toCss(s_wrapper)}>
            <h3>Past tasks</h3>
            {subjects}
        </div>
    );
}