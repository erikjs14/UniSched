import { getResult } from './../util/util';

export interface BasePreferenceConfig {
    id: string;
    description: string;
    name: string;
}

export interface BooleanPreferenceConfig extends BasePreferenceConfig {
    type: 'boolean';
    default: boolean;
}
export interface IntegerPreferenceConfig extends BasePreferenceConfig {
    type: 'integer';
    default: number;
    min?: number;
    max?: number;
    step?: number;
}

export type PreferenceConfig = BooleanPreferenceConfig | IntegerPreferenceConfig;

export const PREF_ID_ACTIVATE_RANDOM_AVATAR = 'activateRandomAvatar';
export const PREF_ID_SHOW_ONLY_FUTURE_EXAMS = 'showOnlyFutureExams';
export const PREF_ID_DAYS_BEFORE_TASK_DELETION = 'daysBeforeTaskDeletion';
export const PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT = 'futureTasksTodoViewLimit';

/***** INSERT PREFERENCES CONFIG HERE *****/
export const PREFERENCES_CONFIG: PreferenceConfig[] = [
    {
        id: PREF_ID_ACTIVATE_RANDOM_AVATAR,
        type: 'boolean',
        name: 'Force Random Avatar',
        description: 'If enabled, a random avatar will be shown instead of the profile picture.',
        default: false,
    },
    {
        id: PREF_ID_SHOW_ONLY_FUTURE_EXAMS,
        type: 'boolean',
        name: 'Only show future exams',
        description: 'If enabled, only future exams will be shown in the exams view.',
        default: false,
    },
    {
        id: PREF_ID_DAYS_BEFORE_TASK_DELETION,
        type: 'integer',
        name: 'Days until task deletion',
        description: 'The number of days after the last task of a task definition, when the task will get deleted. Only applies to tasks, which are entirely done.',
        default: 5,
        min: 1,
        max: 1000,
        step: 1,
    },
    {
        id: PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT,
        type: 'integer',
        name: 'Limit future tasks in todo view',
        description: 'The number of days into the future for which tasks shall be shown in the todo view.',
        default: 3,
        min: 0,
        max: 1000,
        step: 1,
    }
]

const allIds = PREFERENCES_CONFIG.map(config => config.id);
export type PreferenceId = typeof allIds[number];
export type PreferenceVal = PreferenceConfig['default'];

export interface PreferencesState {
    [id: string]: PreferenceVal;
}
export const DEFAULT_PREFERENCES_STATE: PreferencesState = getResult(() => {
    const p: PreferencesState = {};
    PREFERENCES_CONFIG.forEach(conf => p[conf.id] = conf.default);
    return p;
});