/******** Data model used in firestore db **********/

export interface WithId {
    id: string;
}

export interface BaseModel {}
export interface Timestamp {seconds: number, nanoseconds: number}

export interface UserModel extends BaseModel {

}
export interface UserModelWithId extends UserModel, WithId {}

export interface SubjectModel extends BaseModel {
    color: string;
    name: string;
}
export interface SubjectModelWithId extends SubjectModel, WithId {}

export interface DeepSubjectModel {
    id: string,
    color: string,
    name: string,
    tasks: TaskModelWithId[],
    exams: ExamModelWithId[],
    events: EventModelWithId[],
}

export interface EventModel extends BaseModel {
    firstStart: Timestamp;
    firstEnd: Timestamp;
    endAt: Timestamp;
    interval: 'weekly' | 'biweekly' | 'daily';
    type: string;
}
export interface EventModelWithId extends EventModel, WithId {}

export interface ExamModel extends BaseModel {
    start: Timestamp;
    type: string;
}
export interface ExamModelWithId extends ExamModel, WithId {}

export interface TaskModel extends BaseModel {
    timestamps: Timestamp[];
    timestampsDone: Timestamp[];
    type: string;
}
export interface TaskModelWithId extends TaskModel, WithId {}