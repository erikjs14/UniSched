/******** Data model used in firestore db **********/
import { PreferencesState } from './../config/userPreferences';

export interface ModelWithId {
    id: string;
}

export interface BaseModel {
    timeCreated: Timestamp | undefined;
}
export interface Timestamp {seconds: number, nanoseconds: number}

export interface UserModel extends BaseModel {
    preferences: PreferencesState | null;
}
export interface UserModelWithId extends UserModel, ModelWithId {}

export interface SubjectModel extends BaseModel {
    color: string;
    name: string;
}
export interface SubjectModelWithId extends SubjectModel, ModelWithId {}

export interface DeepSubjectModel extends SubjectModelWithId{
    tasks: TaskModelWithId[],
    exams: ExamModelWithId[],
    events: EventModelWithId[],
}

export interface SubjectDataModel extends BaseModel {
    type: string;
}

export interface SubjectDataModelWithId extends SubjectDataModel, ModelWithId {}

export const IntervalOptions = ['weekly', 'biweekly', 'daily', 'twice-daily', 'once'];
export type IntervalType = typeof IntervalOptions[number]; //'weekly' | 'biweekly' | 'daily' | 'twice-daily' | 'once';
export interface EventModel extends SubjectDataModel {
    firstStart: Timestamp;
    firstEnd: Timestamp;
    endAt: Timestamp;
    interval: IntervalType;
}
export interface EventModelWithId extends EventModel, SubjectDataModelWithId {}

export interface ExamModel extends SubjectDataModel {
    start: Timestamp;
}
export interface ExamModelWithId extends ExamModel, SubjectDataModelWithId {}

export interface TaskModel extends SubjectDataModel {
    timestamps: Timestamp[];
    timestampsDone: Timestamp[];
    star: boolean;
    additionalInfo: {
        text: string;
    } | null;
    deleted: boolean;
}
export interface TaskModelWithId extends TaskModel, SubjectDataModelWithId {}

export interface TaskModelWithIdAndSubjectId extends TaskModelWithId {subjectId: string}