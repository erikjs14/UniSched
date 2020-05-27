import React, { useState, useEffect, useCallback } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { TaskModelWithIdAndSubjectId, Timestamp } from '../../firebase/model';
import { fetchTasks, saveTaskChecked } from './../../firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../..';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject } from '../../util/util';
import { getTimestampFromSeconds } from './../../util/timeUtil';

const getUpdatedTasks = (oldTasks: TaskModelWithIdAndSubjectId[], subjectId: string, taskId: string, timestampToCheck: Timestamp): TaskModelWithIdAndSubjectId[] => {
    return oldTasks.map(oldTask => {
        if (oldTask.subjectId !== subjectId || oldTask.id !== taskId) {
            return oldTask;
        } else {
            return {
                ...oldTask,
                timestampsDone: [
                    ...oldTask.timestampsDone,
                    timestampToCheck,
                ],
            };
        }
    })
}

export default function() {

    const [tasks, setTasks] = useState<TaskModelWithIdAndSubjectId[]|null>(null);
    const [error, setError] = useState(false);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    // fetch all tasks
    useEffect(() => {
        if (subjects && !tasks && !error) {
            Promise.all(
                subjects.map(sub => fetchTasks(sub.id))
            )
                .then(tasksPerSubject => setTasks(
                    tasksPerSubject.map(
                        (tasks, idx) => tasks.map(
                            task => (
                                {...task, subjectId: subjects[idx].id}
                            )
                        )
                    ).flat()
                ))
                .catch(err => setError(true));
        }
    }, [error, subjects, tasks]);

    const checkTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number): void => {
        // called when animation to remove task ended
        const timestampToCheck = getTimestampFromSeconds(timestampSeconds);
        saveTaskChecked(subjectId, taskId, timestampToCheck)
            .then(() => {
                setTasks(prev => !prev ? null : getUpdatedTasks(prev, subjectId, taskId, timestampToCheck));
            })
            .catch(error => setError(true));
    }, []);

    if (error) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    } else if (!tasks || !subjects) {
        return <Loader />;
    }

    return (
        <div>
            
            <SiteHeader type='todo' title='ToDo' />

            <DueTasks
                dueTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskChecked={checkTaskHandler}
            />

        </div>
    )

}