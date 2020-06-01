import { SubjectModel } from './../../../../firebase/model';
import { TaskSemantic } from './../../../../util/timeUtil';

export interface SubjectCheckedProps {
    rawTasks: TaskSemantic[];
    subject: SubjectModel;
    onTaskUnchecked(taskId: string, timestampSeconds: number): void;
}