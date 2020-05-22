export const SETTINGS_TYPE = 'settings';
export const TODO_TYPE = 'todo';
export const SCHEDULE_TYPE = 'schedule';
export const EXAMS_TYPE = 'exams';

export interface SiteHeaderProps {
    type: SETTINGS_TYPE | TODO_TYPE | SCHEDULE_TYPE | EXAMS_TYPE;
    title: string;
}