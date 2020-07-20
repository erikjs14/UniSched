import { TaskModel } from '../../../firebase/model';

export interface AddTaskDialogProps {
    isShown: boolean;
    onCloseComplete: Function;
    onTaskAdded(task: TaskModel): void;
}