/******** Data model used in firestore db **********/

export interface ModelWithId {
    id: string;
}

export interface BaseModel {}
export interface Timestamp {seconds: number, nanoseconds: number}

export interface UserModel extends BaseModel {

}
export interface UserModelWithId extends UserModel, ModelWithId {}

export interface SubjectModel extends BaseModel {
    color: string;
    name: string;
}
export interface SubjectModelWithId extends SubjectModel, ModelWithId {}

export interface DeepSubjectModel {
    id: string,
    color: string,
    name: string,
    tasks: TaskModelWithId[],
    exams: ExamModelWithId[],
    events: EventModelWithId[],
}

export interface SubjectDataModel extends BaseModel {
    type: string;
}

export const IntervalOptions = ['weekly', 'biweekly', 'daily', 'once'];
export type IntervalType = typeof IntervalOptions[number]; //'weekly' | 'biweekly' | 'daily' | 'once';
export interface EventModel extends SubjectDataModel {
    firstStart: Timestamp;
    firstEnd: Timestamp;
    endAt: Timestamp;
    interval: IntervalType;
}
export interface EventModelWithId extends EventModel, ModelWithId {}

export interface ExamModel extends SubjectDataModel {
    start: Timestamp;
}
export interface ExamModelWithId extends ExamModel, ModelWithId {}

export interface TaskModel extends SubjectDataModel {
    timestamps: Timestamp[];
    timestampsDone: Timestamp[];
}
export interface TaskModelWithId extends TaskModel, ModelWithId {}