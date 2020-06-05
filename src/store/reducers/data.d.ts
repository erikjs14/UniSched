import { TaskModelWithIdAndSubjectId } from './../../firebase/model';

export interface DataState {
    tasks: {
        data: TaskModelWithIdAndSubjectId[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
    };
}