import React, { useMemo, useState } from 'react';
import { dateToHTMLString, endOf } from '../../../util/timeUtil';
import MarkdownDialog from '../../dialogs/MarkdownDialog';
import {IterateRemindersProps} from './IterateReminders.d';

export default React.memo(function(props: IterateRemindersProps): JSX.Element {

    const today = useMemo(() => endOf(new Date()), []);
    const reminders = useMemo(() => props.tasks.reduce((prev, cur, curIdx) => {
        return [
            ...prev,
            ...(cur.filter(t => t.reminder && new Date(t.dueAt).getTime() <= today.getTime()))
        ]
    }, []), [props.tasks, today]);

    const [showIdx, setShowIdx] = useState(0);

    const dialogs = useMemo(() => reminders.map((reminder, idx) => (
        <MarkdownDialog
            key={reminder.taskId}
            show={idx === showIdx}
            title={`Subject: ${props.subjects[reminder.subjectId].name}`}
            onClose={() => setShowIdx(idx + 1)}
            rawMarkdown={`## ${reminder.name.toUpperCase()} \n\n Due on: **${dateToHTMLString(new Date(reminder.dueAt))}**  \n${reminder.dueString} \n\n ---  \n\n` + reminder.additionalInfo?.text || ''}
            editModeDisabled
        />
    )), [props.subjects, reminders, showIdx]);

    return (
        <>
            {dialogs}
        </>
    );
});