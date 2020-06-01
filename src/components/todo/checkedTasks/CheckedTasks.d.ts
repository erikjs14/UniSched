import { TaskModelWithIdAndSubjectId } from './../../../firebase/model';

export interface CheckedTasksProps {
    rawTasks: TaskModelWithIdAndSubjectId[];
    subjects: {[id: string]: SubjectModel};
    onTaskUnchecked(subjectId: string, taskId: string, timestampSeconds: number): void;
}