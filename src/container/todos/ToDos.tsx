import React, { useState, useEffect, useCallback } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { TaskModelWithIdAndSubjectId, Timestamp } from '../../firebase/model';
import { fetchTasks, saveTaskChecked, saveTaskUnchecked } from './../../firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../..';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject } from '../../util/util';
import { getTimestampFromSeconds } from './../../util/timeUtil';
import FloatingButton from '../../components/ui/floatingButton/FloatingButton';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CheckedTasks from '../../components/todo/checkedTasks/CheckedTasks';

const getUpdatedTasksAfterCheck = (oldTasks: TaskModelWithIdAndSubjectId[], subjectId: string, taskId: string, timestampToCheck: Timestamp): TaskModelWithIdAndSubjectId[] => {
    const result = oldTasks.map(oldTask => {
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
    return result;
}
const getUpdatedTasksAfterUncheck = (oldTasks: TaskModelWithIdAndSubjectId[], subjectId: string, taskId: string, timestampToUncheck: Timestamp): TaskModelWithIdAndSubjectId[] => {
    const result =  oldTasks.map(oldTask => {
        if (oldTask.subjectId !== subjectId || oldTask.id !== taskId) {
            return oldTask;
        } else {
            return {
                ...oldTask,
                timestampsDone: oldTask.timestampsDone.filter(ts => ts.seconds !== timestampToUncheck.seconds || ts.nanoseconds !== timestampToUncheck.nanoseconds),
            };
        }
    })
    return result;
}

export default function() {

    const history = useHistory();

    const [tasks, setTasks] = useState<TaskModelWithIdAndSubjectId[]|null>(null);
    const [error, setError] = useState(false);

    const [refreshing, setRefreshing] = useState(false);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    // fetch all tasks
    useEffect(() => {
        if ((subjects && !tasks && !error) || (subjects && refreshing)) {
            Promise.all(
                subjects.map(sub => fetchTasks(sub.id))
            )
                .then(tasksPerSubject => {
                    setTasks(
                        tasksPerSubject.map(
                            (tasks, idx) => tasks.map(
                                task => (
                                    {...task, subjectId: subjects[idx].id}
                                )
                            )
                        ).flat()
                    );
                    setRefreshing(false);
                })
                .catch(err => setError(true));
        }
    }, [error, subjects, tasks, refreshing]);

    const checkTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number): void => {
        // called when animation to remove task ended
        const timestampToCheck = getTimestampFromSeconds(timestampSeconds);
        saveTaskChecked(subjectId, taskId, timestampToCheck)
            .then(() => {
                setTasks(prev => !prev ? null : getUpdatedTasksAfterCheck(prev, subjectId, taskId, timestampToCheck));
            })
            .catch(error => setError(true));
    }, []);

    const uncheckTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number) => {
        // called when animation to remove task ended
        const timestampToUncheck = getTimestampFromSeconds(timestampSeconds);
        saveTaskUnchecked(subjectId, taskId, timestampToUncheck)
            .then(() => {
                setTasks(prev => !prev ? null : getUpdatedTasksAfterUncheck(prev, subjectId, taskId, timestampToUncheck));
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
            
            <SiteHeader 
                type='todo' 
                title='ToDo'
                onRefresh={() => setRefreshing(true)}
                refreshing={refreshing}
            />

            <DueTasks
                dueTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskChecked={checkTaskHandler}
            />
                
            <FloatingButton 
                center
                onClick={() => history.push('/settings')}
                className='util-margin-bottom-medium' 
            >
                <FontAwesomeIcon style={{fontSize: '2rem'}} icon={faPlus} />
            </FloatingButton>

            <CheckedTasks
                rawTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskUnchecked={uncheckTaskHandler}
            />

        </div>
    )

}