import { put, all, select } from 'redux-saga/effects';
import * as actions from '../actions';
import { SubjectModelWithId, TaskModelWithId, Timestamp, ExamModelWithId, EventModelWithId } from '../../firebase/model';
import { fetchTasks as fetchTasks_firestore, fetchExams as fetchExams_firestore, fetchEvents as fetchEvents_firestore, saveTaskUnchecked } from '../../firebase/firestore';
import { CheckTaskAC, UncheckTaskAC, AddAndSaveNewTaskAC } from './../actions/data.d';
import { getTimestampFromSeconds, getCurrentTimestamp } from '../../util/timeUtil';
import { saveTaskChecked, addTask } from './../../firebase/firestore';

export function* fetchExams() {
    const subjects: SubjectModelWithId[] | null = yield select(state => state.user.shallowSubjects);

    if (subjects === null) {
        yield put(actions.fetchExamsFail('Subjects not set'));
    } else {
        try {
            const examsPerSubject: ExamModelWithId[][] = yield all(
                subjects.map(sub => fetchExams_firestore(sub.id))
            );
            yield put(actions.fetchExamsSuccess(examsPerSubject, subjects));
        } catch (error) {
            yield put(actions.fetchExamsFail(error.message || 'Something went wrong'));
        }
    }
}

export function* fetchEvents() {
    const subjects: SubjectModelWithId[] | null = yield select(state => state.user.shallowSubjects);

    if (subjects === null) {
        yield put(actions.fetchEventsFail('Subjects not set'));
    } else {
        try {
            const eventsPerSubject: EventModelWithId[][] = yield all(
                subjects.map(sub => fetchEvents_firestore(sub.id))
            );
            yield put(actions.fetchEventsSuccess(eventsPerSubject, subjects));
        } catch (error) {
            yield put(actions.fetchEventsFail(error.message || 'Something went wrong'));
        }
    }
}

export function* fetchTasks() {
    const subjects: SubjectModelWithId[] | null = yield select(state => state.user.shallowSubjects);
    if (subjects === null) {
        yield put(actions.fetchTasksFail('Subjects not set'));
    } else {
        try {
            const tasksPerSubject: TaskModelWithId[][] = yield all(
                subjects.map(sub => fetchTasks_firestore(sub.id))
            );
            const tasks = tasksPerSubject.map(
                (tasks, idx) => tasks.map(
                    task => (
                        {...task, subjectId: subjects[idx].id}
                    )
                )
            ).flat();
            yield put(actions.fetchTasksSuccess(tasks));
        } catch (error) {
            yield put(actions.fetchTasksFail(error.message || 'Something went wrong'));
        }
    }
}

export function* checkTask(action: CheckTaskAC) {
    try {
        const oldTasks = yield select(state => state.data.tasks.data);
        const timestampToCheck = getTimestampFromSeconds(action.timestampSeconds);
        const tickedAtTs = {seconds: action.tickedAtSeconds, nanoseconds: action.tickedAtMilliseconds*1000 + Math.round(Math.random()*1000)};
        yield saveTaskChecked(action.subjectId, action.taskId, timestampToCheck, tickedAtTs);
        yield put(actions.setTasksLocally(
            getUpdatedTasksAfterCheck(
                oldTasks,
                action.subjectId,
                action.taskId,
                timestampToCheck,
                tickedAtTs,
            )
        ));
    } catch (error) {
        yield put(actions.dataSetError('Failed checking the task', 'tasks'));
    } 
}

export function* uncheckTask(action: UncheckTaskAC) {
    try {
        const oldTasks = yield select(state => state.data.tasks.data);
        const timestampToUncheck = getTimestampFromSeconds(action.timestampSeconds);
        const taskToChange: TaskModelWithId = oldTasks.find((t: TaskModelWithId) => t.subjectId === action.subjectId && t.id === action.taskId);
        const taskTickedAt = taskToChange.tasksTickedAt.find((ts, idx) => taskToChange.timestampsDone[idx].seconds===timestampToUncheck.seconds && taskToChange.timestampsDone[idx].nanoseconds===timestampToUncheck.nanoseconds);
        if (!taskTickedAt) throw Error('timestampsDone and tasksTickedAt dimensions do not match');
        yield saveTaskUnchecked(action.subjectId, action.taskId, timestampToUncheck, taskTickedAt);
        yield put(actions.setTasksLocally(
            getUpdatedTasksAfterUncheck(
                oldTasks,
                action.subjectId,
                action.taskId,
                timestampToUncheck,
            )
        ));
    } catch (error) {
        yield put(actions.dataSetError('Failed unchecking the task', 'tasks'));
    }
}

export function* addAndSaveNewTask(action: AddAndSaveNewTaskAC) {
    try {
        const newId = yield addTask(action.subjectId, {
            ...action.task,
            timeCreated: getCurrentTimestamp(),
        });
        if (!newId) throw Error('Server did not return an id.');
        yield put(actions.addAndSaveNewTaskSuccess({
            ...action.task,
            subjectId: action.subjectId,
            id: newId,
        }, undefined, undefined));
        action.close?.();
        action.reset?.();
    } catch (error) {
        yield put(actions.addAndSaveNewTaskFail(error.message || error));
    }
}

const getUpdatedTasksAfterCheck = (oldTasks: TaskModelWithId[], subjectId: string, taskId: string, timestampToCheck: Timestamp, tickedAt: Timestamp): TaskModelWithId[] => {
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
                tasksTickedAt: [
                    ...oldTask.tasksTickedAt,
                    tickedAt,
                ],
            };
        }
    })
    return result;
}
const getUpdatedTasksAfterUncheck = (oldTasks: TaskModelWithId[], subjectId: string, taskId: string, timestampToUncheck: Timestamp): TaskModelWithId[] => {
    const result =  oldTasks.map(oldTask => {
        if (oldTask.subjectId !== subjectId || oldTask.id !== taskId) {
            return oldTask;
        } else {
            return {
                ...oldTask,
                timestampsDone: oldTask.timestampsDone.filter(ts => ts.seconds !== timestampToUncheck.seconds || ts.nanoseconds !== timestampToUncheck.nanoseconds),
                tasksTickedAt: oldTask.tasksTickedAt.filter((ts, idx) => oldTask.timestampsDone[idx].seconds !== timestampToUncheck.seconds || oldTask.timestampsDone[idx].nanoseconds !== timestampToUncheck.nanoseconds),
            };
        }
    })
    return result;
}
