import { TaskModelWithIdAndSubjectId, ExamModelWithId } from './../../firebase/model';

export interface DataState {
    tasks: {
        data: TaskModelWithIdAndSubjectId[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
    };
    exams: {
        dataPerSubject: ExamModelWithId[][] | null;
        config: object[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
    }
}