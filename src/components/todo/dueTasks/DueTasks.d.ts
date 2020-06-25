import { TaskModelWithIdAndSubjectId, SubjectModel } from './../../../firebase/model';

export interface DueTasksProps {
    dueTasks: TaskModelWithIdAndSubjectId[];  
    subjects: {[id: string]: SubjectModel};
    onTaskChecked(subjectId: string, taskId: string, timestampSeconds: number): void;
    limitDaysInFuture?: number;
    small?: boolean;
    onlyStars?: boolean;
    dayStartsAtHour?: number;
}