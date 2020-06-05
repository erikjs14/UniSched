import { TaskModelWithIdAndSubjectId, ExamModelWithId, EventModelWithId } from './../../firebase/model';

export interface DataState {
    tasks: {
        data: TaskModelWithIdAndSubjectId[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
        timestamp: number; //ms !!!!!!!!!!!
    };
    exams: {
        dataPerSubject: ExamModelWithId[][] | null;
        config: object[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
        timestamp: number;
    };
    events: {
        dataPerSubject: EventModelWithId[] | null;
        config: object[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
        timestamp: number;
    }
}