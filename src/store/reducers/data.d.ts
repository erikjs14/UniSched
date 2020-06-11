import { TaskModelWithIdAndSubjectId, ExamModelWithId, EventModelWithId } from './../../firebase/model';
import {EventConfigType, ExamConfigType} from './data';

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
        config: ExamConfigType[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
        timestamp: number;
    };
    events: {
        dataPerSubject: EventModelWithId[] | null;
        config: EventConfigType[] | null;
        loading: boolean;
        refreshing: boolean;
        error: string | null;
        timestamp: number;
    }
}