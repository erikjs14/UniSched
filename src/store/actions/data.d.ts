import { DataState } from './../reducers/data.d';
import { ExamModelWithId } from '../../firebase/model';
import { SubjectModelWithId } from './../../firebase/model';

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

export interface FetchExamsAC extends BaseActionCreator {}
export interface RefreshExamsAC extends BaseActionCreator {}
export interface FetchExamsSuccessAC extends BaseActionCreator {examsPerSubject: ExamModelWithId[][], subjects: SubjectModelWithId[]}
export interface FetchExamsFailAC extends BaseActionCreator {error: string}

export interface FetchEventsAC extends BaseActionCreator {}
export interface RefreshEventsAC extends BaseActionCreator {}
export interface FetchEventsSuccessAC extends BaseActionCreator {eventsPerSubject: EventModelWithId[][], subjects: SubjectModelWithId[]}
export interface FetchEventsFailAC extends BaseActionCreator {error: string}