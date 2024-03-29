import { TaskModelWithIdAndSubjectId, SubjectModel } from './../../../firebase/model';

interface TaskSlice { 
    subjectId: string;
    taskId: string;
    timestampSeconds: number;
}
export interface DueTasksProps {
    dueTasks: TaskModelWithIdAndSubjectId[];  
    subjects: {[id: string]: SubjectModel};
    onTaskChecked(subjectId: string, taskId: string, timestampSeconds: number): void;
    onTasksChecked?(tasks: Array<TaskSlice>): void;
    onTaskMarkdownChange(subjectId: string, taskId: string, markdown: string): void;
    limitDaysInFuture?: number;
    small?: boolean;
    onlyStars?: boolean;
    dayStartsAtHour?: number;
    expandAllVisibleDays?: boolean;
    onlyRelevantTasks?: boolean;
    forceShowAllTasksForXDays?: number;
    showTimeForTasks?: boolean;
    showTimeForStarredTasks?: boolean;
    excludeReminders?: boolean;
    onlyReminders?: boolean;
    headline?: string;
    iterateReminders?: boolean;
}