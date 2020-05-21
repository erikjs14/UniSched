/******** Data model used in firestore db **********/

export interface BaseModel {
    id: string;
}

export interface UserModel extends BaseModel {

}

export interface SubjectModel extends BaseModel {
    color: string | undefined;
    name: string | undefined;
}

export interface EventModel extends BaseModel {
    firstStart: number | undefined;
    firstEnd: number | undefined;
    endAt: number | undefined;
    interval: 'weekly' | 'biweekly' | 'daily' | undefined;
    type: string | undefined;
}

export interface ExamModel extends BaseModel {
    start: number | undefined;
    type: string | undefined;
}

export interface TaskModel extends BaseModel {
    timestamps: number[] | undefined;
    timestampsDone: number[] | undefined;
    type: string | undefined;
}