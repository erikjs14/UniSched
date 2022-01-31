import { TaskSemantic } from './../../../../util/timeUtil';

export interface DueTaskProps {
    taskSemantic: TaskSemantic;
    subjectDisplayName: string;
    onCheck: Function;
    fadeOut?: boolean;
    onFadeOutComplete?: Function;
    backgroundColor?: string;
    small?: boolean;
    star?: boolean;
    bell?: boolean;
    moreInfo?: boolean;
    showExactTime?: boolean;
    onChangeMarkdown(newMd: string): void;
}