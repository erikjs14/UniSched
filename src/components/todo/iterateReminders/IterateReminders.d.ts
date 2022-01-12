import { TaskSemantic } from '../../../util/timeUtil';
import { SubjectModel } from './../../../firebase/model';

export interface IterateRemindersProps {
    tasks: TaskSemantic[][];
    subjects: {[id: string]: SubjectModel}
}