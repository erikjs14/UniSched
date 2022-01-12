import React, { useMemo, useState } from 'react';
import { dateToHTMLString } from '../../../util/timeUtil';
import MarkdownDialog from '../../dialogs/MarkdownDialog';
import {IterateRemindersProps} from './IterateReminders.d';

const {
} = CSS;

export default React.memo(function(props: IterateRemindersProps): JSX.Element {

    const reminders = useMemo(() => props.tasks.reduce((prev, cur, curIdx) => {
        return [
            ...prev,
            ...(cur.filter(t => t.reminder))
        ]
    }, []), [props.tasks]);

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