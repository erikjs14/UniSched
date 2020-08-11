import { getResult } from './../util/util';

export interface BasePreferenceConfig {
    id: string;
    description: string;
    name: string;
    constraint?: {
        id: string;
        value: PreferenceConfig['default'];
    }
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
export const PREF_ID_EXPAND_ALL_VISIBLE_DAYS = 'expandAllVisibleDays';
export const PREF_ID_DAYS_BEFORE_TASK_DELETION = 'daysBeforeTaskDeletion';
export const PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT = 'futureTasksTodoViewLimit';
export const PREF_ID_DAY_STARTS_AT = 'dayStartsAt';
export const PREF_ID_SHOW_ONLY_RELEVANT_TASKS = 'showOnlyRelevantTasks';
export const PREF_ID_SHOW_ALL_TASKS_FOR_X_DAYS = 'showAllTasksForXDays';

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
        id: PREF_ID_EXPAND_ALL_VISIBLE_DAYS,
        type: 'boolean',
        name: 'Expand all visible days',
        description: 'If enabled, all days that are visible in the todo view, will be expanded.',
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
    },
    {
        id: PREF_ID_DAY_STARTS_AT,
        type: 'integer',
        name: 'Day starts at',
        description: 'Depicts the hour, at which you want to start seeing the tasks for this day.',
        default: 0,
        min: 0,
        max: 23,
        step: 1,
    },
    {
        id: PREF_ID_SHOW_ONLY_RELEVANT_TASKS,
        type: 'boolean',
        name: 'Show only relevant tasks.',
        description: 'If enabled, only relevant tasks will be shown, i.e. tasks from today and the past that have not been checked, and the respective next instance from the future that is not checked.',
        default: false,
    },
    {
        id: PREF_ID_SHOW_ALL_TASKS_FOR_X_DAYS,
        type: 'integer',
        name: 'Show all tasks for x days',
        description: 'Only takes effect if "Show only relevant tasks" is enabled. This forces all tasks to be displayed for the next x days.',
        default: 0,
        min: 0,
        step: 1,
        constraint: {
            id: PREF_ID_SHOW_ONLY_RELEVANT_TASKS,
            value: true,
        }
    },
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