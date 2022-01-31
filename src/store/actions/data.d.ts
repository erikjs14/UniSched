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
export interface AddAndSaveNewTaskAC extends BaseActionCreator {task: TaskModel, subjectId: string, close?: Function, reset?: Function}
export interface AddAndSaveNewTaskSuccessAC extends BaseActionCreator {task: TaskModelWithIdAndSubjectId, close?: Function, reset?: Function}
export interface AddAndSaveNewTaskFailAC extends BaseActionCreator {error: string}

export interface CheckTaskAC extends BaseActionCreator {
    subjectId: string;
    taskId: string; 
    timestampSeconds: number;
    tickedAtSeconds: number;
    tickedAtMilliseconds: number;
}
export interface CheckTaskWithoutUpdateAC extends CheckTaskAC {}

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

export interface ForceRefreshAC extends BaseActionCreator {dataTypeId: DataTypeId}

export interface RemoveTaskLocallyAC extends BaseActionCreator {taskId: string}
export interface RemoveExamLocallyAC extends BaseActionCreator {examId: string}
export interface RemoveEventLocallyAC extends BaseActionCreator {eventId: string}

export interface UpdateTaskAC extends BaseActionCreator { subjectId: string; taskId: string; newValues: Partial<TaskModel> };
export interface UpdateTaskSuccessAC extends BaseActionCreator {};
export interface UpdateTaskFailAC extends BaseActionCreator { error: string };