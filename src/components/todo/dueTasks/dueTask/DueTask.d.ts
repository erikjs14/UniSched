import { TaskSemantic } from './../../../../util/timeUtil';

export interface DueTaskProps {
    taskSemantic: TaskSemantic;
    subjectDisplayName: string;
    onCheck: Function;
    fadeOut?: boolean;
    onFadeOutComplete?: Function;
    backgroundColor?: string;
    infoClicked?: Function;
}