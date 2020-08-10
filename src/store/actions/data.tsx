import * as actionTypes from './actionTypes';
import { FetchTasksAC, FetchTasksFailAC, FetchTasksSuccessAC, RefreshTasksAC, CheckTaskAC, UncheckTaskAC, SetTasksLocallyAC, DataSetErrorAC, FetchExamsAC, FetchExamsSuccessAC, FetchExamsFailAC, FetchEventsAC, FetchEventsSuccessAC, FetchEventsFailAC, RefreshExamsAC, RefreshEventsAC, ForceRefreshAC, AddAndSaveNewTaskSuccessAC, AddAndSaveNewTaskAC, AddAndSaveNewTaskFailAC, RemoveTaskLocallyAC, RemoveEventLocallyAC, RemoveExamLocallyAC } from './data.d';
import { ExamModelWithId, EventModelWithId, TaskModel } from '../../firebase/model';
import { DataState } from './../reducers/data.d';
import { SubjectModelWithId, TaskModelWithIdAndSubjectId } from './../../firebase/model';
import { DataTypeId } from '../../hooks/useSubjectData';

export const fetchTasks = (): FetchTasksAC => {
    return {
        type: actionTypes.FETCH_TASKS,
    };
};

export const refreshTasks = (): RefreshTasksAC => {
    return {
        type: actionTypes.REFRESH_TASKS,
    };
};

export const fetchTasksSuccess = (tasks: TaskModelWithIdAndSubjectId[]): FetchTasksSuccessAC => {
    return {
        type: actionTypes.FETCH_TASKS_SUCCESS,
        tasks,
    };
};

export const fetchTasksFail = (error: string): FetchTasksFailAC => {
    return {
        type: actionTypes.FETCH_TASKS_FAIL,
        error,
    }
};

export const dataSetError = (error: string, at: keyof DataState): DataSetErrorAC => {
    return {
        type: actionTypes.DATA_SET_ERROR,
        error,
        at,
    };
};

export const checkTask = (subjectId: string, taskId: string, timestampSeconds: number): CheckTaskAC => {
    return {
        type: actionTypes.CHECK_TASK,
        subjectId,
        taskId,
        timestampSeconds,
    };
};

export const uncheckTask = (subjectId: string, taskId: string, timestampSeconds: number): UncheckTaskAC => {
    return {
        type: actionTypes.UNCHECK_TASK,
        subjectId,
        taskId,
        timestampSeconds,
    };
};

export const setTasksLocally = (tasks: TaskModelWithIdAndSubjectId[]): SetTasksLocallyAC => {
    return {
        type: actionTypes.SET_TASKS_LOCALLY,
        tasks,
    };
};

export const fetchExams = (): FetchExamsAC => {
    return {
        type: actionTypes.FETCH_EXAMS,
    };
};

export const refreshExams = (): RefreshExamsAC => {
    return {
        type: actionTypes.REFRESH_EXAMS,
    };
};

export const fetchExamsSuccess = (examsPerSubject: ExamModelWithId[][], subjects: SubjectModelWithId[]): FetchExamsSuccessAC => {
    return {
        type: actionTypes.FETCH_EXAMS_SUCCESS,
        examsPerSubject,
        subjects,
    };
};

export const fetchExamsFail = (error: string): FetchExamsFailAC => {
    return {
        type: actionTypes.FETCH_EXAMS_FAIL,
        error,
    };
};

export const fetchEvents = (): FetchEventsAC => {
    return {
        type: actionTypes.FETCH_EVENTS,
    };
};

export const refreshEvents = (): RefreshEventsAC => {
    return {
        type: actionTypes.REFRESH_EVENTS,
    };
};

export const fetchEventsSuccess = (eventsPerSubject: EventModelWithId[][], subjects: SubjectModelWithId[]): FetchEventsSuccessAC => {
    return {
        type: actionTypes.FETCH_EVENTS_SUCCESS,
        eventsPerSubject,
        subjects,
    };
};

export const fetchEventsFail = (error: string): FetchEventsFailAC => {
    return {
        type: actionTypes.FETCH_EVENTS_FAIL,
        error,
    };
};

export const forceRefresh = (dataTypeId: DataTypeId): ForceRefreshAC => {
    return {
        type: actionTypes.FORCE_REFRESH,
        dataTypeId,
    };
};

export const addAndSaveNewTask = (task: TaskModel, subjectId: string, close: Function | undefined, reset: Function | undefined): AddAndSaveNewTaskAC => {
    return {
        type: actionTypes.ADD_AND_SAVE_NEW_TASK,
        task,
        subjectId,
        close,
        reset,
    };
};

export const addAndSaveNewTaskSuccess = (task: TaskModelWithIdAndSubjectId, close: Function | undefined, reset: Function | undefined): AddAndSaveNewTaskSuccessAC => {
    return {
        type: actionTypes.ADD_AND_SAVE_NEW_TASK_SUCCESS,
        task,
        close,
        reset,
    };
};

export const addAndSaveNewTaskFail = (error: string): AddAndSaveNewTaskFailAC => {
    return {
        type: actionTypes.ADD_AND_SAVE_NEW_TASK_FAIL,
        error,
    };
};

export const removeTaskLocally = (taskId: string): RemoveTaskLocallyAC => {
    return {
        type: actionTypes.REMOVE_TASK_LOCALLY,
        taskId,
    };
};

export const removeExamLocally = (examId: string): RemoveExamLocallyAC => {
    return {
        type: actionTypes.REMOVE_EXAM_LOCALLY,
        examId,
    };
};

export const removeEventLocally = (eventId: string): RemoveEventLocallyAC => {
    return {
        type: actionTypes.REMOVE_EVENT_LOCALLY,
        eventId,
    };
};