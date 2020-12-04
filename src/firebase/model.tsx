/******** Data model used in firestore db **********/
import firebase from 'firebase/app';
import { PreferencesState } from './../config/userPreferences';

export interface ModelWithId {
    id: string;
}
export interface ModelWithSubjectId {
    subjectId: string;
}

export interface BaseModel {
    timeCreated: Timestamp | undefined;
}
export interface Timestamp {seconds: number, nanoseconds: number}

export interface SpaceModel extends BaseModel {
    name: string;
}
export interface SpaceModelWithId extends SpaceModel, ModelWithId {}

export interface UserModel extends BaseModel {
    preferences: PreferencesState | null;
}
export interface UserModelWithId extends UserModel, ModelWithId {}

export interface SubjectModel extends BaseModel {
    color: string;
    name: string;
    spaceId?: string;
    excludeTasksFromAll: boolean; // whether to exclude tasks from the "All" spaces view in Todos
}
export interface SubjectModelWithId extends SubjectModel, ModelWithId {}

export interface DeepSubjectModel extends SubjectModelWithId{
    tasks: TaskModelWithId[],
    exams: ExamModelWithId[],
    events: EventModelWithId[],
}

export interface SubjectDataModel extends BaseModel {
    type: string;
    additionalInfo: {
        text: string;
    } | null;
}

export interface SubjectDataModelWithId extends SubjectDataModel, ModelWithId, ModelWithSubjectId {}

export const IntervalOptions = ['monthly', 'weekly', 'biweekly', 'daily', 'twice-daily', 'once'];
export type IntervalType = typeof IntervalOptions[number]; //'monthly' | 'weekly' | 'biweekly' | 'daily' | 'twice-daily' | 'once';
export interface EventModel extends SubjectDataModel {
    firstStart: Timestamp;
    firstEnd: Timestamp;
    endAt: Timestamp;
    interval: IntervalType;
    exclusions: Timestamp[];
}
export interface EventModelWithId extends EventModel, SubjectDataModelWithId {}

export interface ExamModel extends SubjectDataModel {
    start: Timestamp;
    grade: number | null;
    gradeWeight: number;
}
export interface ExamModelWithId extends ExamModel, SubjectDataModelWithId {}

export interface TaskModel extends SubjectDataModel {
    timestamps: Timestamp[];
    timestampsDone: Timestamp[];
    tasksTickedAt: Timestamp[];
    star: boolean;
    deleted: boolean;
    exclusions: Timestamp[];
    notifications: number[]; // as number of seconds before task
}
export interface TaskModelWithId extends TaskModel, SubjectDataModelWithId {}

export interface ModelWithUserId extends BaseModel {
    userId: string;
}
export const withUserId = (data: any): ModelWithUserId => {
    if (data.userId) return data;
    return {
        ...data,
        userId: firebase.auth().currentUser?.uid,
    };
}