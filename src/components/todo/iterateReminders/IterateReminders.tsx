import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../..';
import { checkTaskWithoutUpdate, setTasksLocally } from '../../../store/actions';
import { getUpdatedTasksAfterCheck } from '../../../store/sagas/data';
import { dateToHTMLString, endOf, getSecondsFromDate, getTimestampFromDate } from '../../../util/timeUtil';
import MarkdownDialog from '../../dialogs/MarkdownDialog';
import {IterateRemindersProps} from './IterateReminders.d';
import * as actions from '../../../store/actions';

const updatePos = (oldPos: number) => {
    console.log('update')
    if (oldPos > 0.45)
        return Math.random() * 0.45;
    else 
        return Math.random() * 0.45 + 0.45;
}

export default React.memo(function(props: IterateRemindersProps): JSX.Element {

    const today = useMemo(() => endOf(new Date()), []);
    const reminders = useMemo(() => props.tasks.reduce((prev, cur, curIdx) => {
        return [
            ...prev,
            ...(cur.filter(t => t.reminder && new Date(t.dueAt).getTime() <= today.getTime()))
        ]
    }, []), [props.tasks, today]);

    const tasks = useSelector((state: RootState) => state.data.tasks.data);
    const [state, setState] = useState({ idx: 0, pos: .45, tasksToUpdateTo: tasks});

    const dispatch = useDispatch();
    useEffect(() => {
        if (state.idx >= reminders.length) {
            dispatch(setTasksLocally(state.tasksToUpdateTo || []));
        }
    }, [dispatch, reminders.length, state.idx, state.tasksToUpdateTo])

    const dialogs = useMemo(() => reminders.map((reminder, idx) => (
        <MarkdownDialog
            key={reminder.taskId}
            show={idx === state.idx}
            title={`Subject: ${props.subjects[reminder.subjectId].name}`}
            onClose={(changed, md) => {
                setState(prev => ({...prev, idx: prev.idx + 1, pos: updatePos(prev.pos)}));
                if (changed) {
                    dispatch(actions.updateTask(
                        reminder.subjectId,
                        reminder.taskId,
                        {additionalInfo: {text: md.split('---  \n\n').slice(1).join('---  \n\n')}}
                    ))
                }
            }}
            rawMarkdown={`## ${reminder.name.toUpperCase()} \n\n Due on: **${dateToHTMLString(new Date(reminder.dueAt))}**  \n${reminder.dueString} \n\n ---  \n\n` + reminder.additionalInfo?.text || ''}
            editModeDisabled
            onCheck={() => {
                dispatch(checkTaskWithoutUpdate(reminder.subjectId, reminder.taskId, getSecondsFromDate(reminder.dueAt)));
                setState(prev => ({
                    ...prev,
                    tasksToUpdateTo: getUpdatedTasksAfterCheck(
                        prev.tasksToUpdateTo || [],
                        reminder.subjectId,
                        reminder.taskId,
                        getTimestampFromDate(reminder.dueAt),
                        getTimestampFromDate(new Date()),
                    )
                }))
            }}
            left={`${state.pos * 100}%`}
        />
    )), [dispatch, props.subjects, reminders, state.idx, state.pos]);

    return (
        <>
            {dialogs}
        </>
    );
});