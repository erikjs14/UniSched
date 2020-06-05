import { DataState } from './../reducers/data.d';

export interface BaseActionCreator {type: string}

export interface FetchTasksAC extends BaseActionCreator {}
export interface RefreshTasksAC extends BaseActionCreator {}
export interface FetchTasksSuccessAC extends BaseActionCreator {tasks: TaskModelWithIdAndSubjectId[]}
export interface FetchTasksFailAC extends BaseActionCreator {error: string}
export interface SetTasksLocallyAC extends BaseActionCreator {tasks: TaskModelWithIdAndSubjectId[]}
export interface DataSetErrorAC extends BaseActionCreator {error: string, at: keyof DataState}

export interface CheckTaskAC extends BaseActionCreator {
    subjectId: string;
    taskId: string; 
    timestampSeconds: number;
}
export interface UncheckTaskAC extends BaseActionCreator {
    subjectId: string;
    taskId: string; 
    timestampSeconds: number;
}