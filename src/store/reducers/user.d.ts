import { SubjectModelWithId } from './../../firebase/model';

export interface UserState {
    username: string | null;
    timeCreated: Timestamp | undefined;
    userImgUrl: string | null;
    globalLoading: boolean;
    shallowSubjects: SubjectModelWithId[] | null;
    error: string | null;
}