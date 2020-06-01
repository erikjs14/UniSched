export interface UndueTaskProps {
    taskSemantic: TaskSemantic;
    subjectDisplayName: string;
    onUncheck: Function;
    fadeOut?: boolean;
    onFadeOutComplete?: Function;
    backgroundColor?: string;
    addCss?: string;
}