/******** Data model used in firestore db **********/

export interface WithId {
    id: string;
}

export interface BaseModel {}

export interface UserModel extends BaseModel {

}
export interface UserModelWithId extends UserModel, WithId {}

export interface SubjectModel extends BaseModel {
    color: string | undefined;
    name: string | undefined;
}
export interface SubjectModelWithId extends SubjectModel, WithId {}

export interface EventModel extends BaseModel {
    firstStart: number | undefined;
    firstEnd: number | undefined;
    endAt: number | undefined;
    interval: 'weekly' | 'biweekly' | 'daily' | undefined;
    type: string | undefined;
}
export interface EventModelWithId extends EventModel, WithId {}

export interface ExamModel extends BaseModel {
    start: number | undefined;
    type: string | undefined;
}
export interface ExamModelWithId extends ExamModel, WithId {}

export interface TaskModel extends BaseModel {
    timestamps: number[] | undefined;
    timestampsDone: number[] | undefined;
    type: string | undefined;
}
export interface TaskModelWithId extends TaskModel, WithId {}