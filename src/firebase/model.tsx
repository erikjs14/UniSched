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
    color: string | undefined;
    name: string | undefined;
}
export interface SubjectModelWithId extends SubjectModel, WithId {}

export interface EventModel extends BaseModel {
    firstStart: Timestamp | undefined;
    firstEnd: Timestamp | undefined;
    endAt: Timestamp | undefined;
    interval: 'weekly' | 'biweekly' | 'daily' | undefined;
    type: string | undefined;
}
export interface EventModelWithId extends EventModel, WithId {}

export interface ExamModel extends BaseModel {
    start: Timestamp | undefined;
    type: string | undefined;
}
export interface ExamModelWithId extends ExamModel, WithId {}

export interface TaskModel extends BaseModel {
    timestamps: Timestamp[] | undefined;
    timestampsDone: Timestamp[] | undefined;
    type: string | undefined;
}
export interface TaskModelWithId extends TaskModel, WithId {}