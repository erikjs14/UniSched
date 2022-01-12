import { SubjectModel, SubjectModelWithId } from '../firebase/model';
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
    uponActivation?: Function | string;
}
export interface IntegerPreferenceConfig extends BasePreferenceConfig {
    type: 'integer';
    default: number;
    min?: number;
    max?: number;
    step?: number;
    minConstraint?: {
        id: string;
        value: number;
    };
    maxConstraint?: {
        id: string;
        value: number;
    }
}
export interface DeviceSpecificBoolPreferenceConfig extends BasePreferenceConfig {
    type: 'deviceBoolean';
    default: { [id: string]: boolean };
    uponActivation?: Function | string;
}
export type GroupItem = {
    id: string;
    name: string;
};
export interface OptionalGroupingPreferenceConfig extends BasePreferenceConfig {
    type: 'optionalGrouping';
    subjectIdName: string;
    default: GroupItem[];
}
export const NO_GROUP_ASSIGNMENT_VAL = '';

export type PreferenceConfig = BooleanPreferenceConfig | IntegerPreferenceConfig | DeviceSpecificBoolPreferenceConfig | OptionalGroupingPreferenceConfig;

export const PREF_ID_ACTIVATE_RANDOM_AVATAR = 'activateRandomAvatar';
export const PREF_ID_SHOW_ONLY_FUTURE_EXAMS = 'showOnlyFutureExams';
export const PREF_ID_EXPAND_ALL_VISIBLE_DAYS = 'expandAllVisibleDays';
export const PREF_ID_DAYS_BEFORE_TASK_DELETION = 'daysBeforeTaskDeletion';
export const PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT = 'futureTasksTodoViewLimit';
export const PREF_ID_DAY_STARTS_AT = 'dayStartsAt';
export const PREF_ID_SHOW_ONLY_RELEVANT_TASKS = 'showOnlyRelevantTasks';
export const PREF_ID_SHOW_ALL_TASKS_FOR_X_DAYS = 'showAllTasksForXDays';
export const PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EVENT = 'showReminderNotificationBeforeEvent';
export const PREF_ID_MINUTES_BEFORE_EVENT_NOTIFICATION = 'remindBeforeEvent';
export const PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EXAM = 'showReminderNotificationBeforeExam';
export const PREF_ID_HOURS_BEFORE_EXAM_NOTIFICATION = 'remindBeforeExam';
export const PREF_ID_ENABLE_BEFORE_TASK_NOTIFICATIONS = 'enableBeforeTaskNotifications';
export const PREF_ID_ENABLE_SHOW_TIME_FOR_TASKS = 'enableShowDateForTasks';
export const PREF_ID_ENABLE_SHOW_TIME_FOR_STARRED_TASKS = 'enableShowDateForStarredTasks';
export const PREF_ID_MIN_TIME_SCHEDULE = 'minTimeSchedule';
export const PREF_ID_MAX_TIME_SCHEDULE = 'maxTimeSchedule';
export const PREF_ID_ARCHIVES = 'archives';
export const PREF_ID_ENABLE_REMINDER_POPUPS = 'enableReminderPopups';

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
        id: PREF_ID_ENABLE_SHOW_TIME_FOR_TASKS,
        type: 'boolean',
        name: 'Show time on tasks',
        description: 'When enabled, tasks will show the exact time in the todo view, instead of "In 3 hours" (e.g.).',
        default: false,
    },
    {
        id: PREF_ID_ENABLE_SHOW_TIME_FOR_STARRED_TASKS,
        type: 'boolean',
        name: 'Show time on starred tasks',
        description: 'When enabled, tasks with a star will show the exact time in the todo view, instead of "In 3 days" (e.g.).',
        default: false,
        constraint: {
            id: PREF_ID_ENABLE_SHOW_TIME_FOR_TASKS,
            value: false,
        }
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
        description: 'Depicts the hour, at which you want to start seeing the tasks for this day. If set to 3 (i.e. 3am), e.g., the todo view will show tasks of the previous day until 3am and only then starts to switch to show the next day as "today".',
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
        // TODO: constraints are unhandled!!
        constraint: {
            id: PREF_ID_SHOW_ONLY_RELEVANT_TASKS,
            value: true,
        }
    },
    {
        id: PREF_ID_MIN_TIME_SCHEDULE,
        type: 'integer',
        name: 'Start schedule at',
        description: 'The hour of day at which the calendar views start to show events for each day.',
        default: 6,
        min: 0,
        max: 23,
        // TODO: constraints are unhandled!!
        maxConstraint: {
            id: PREF_ID_MAX_TIME_SCHEDULE,
            value: 1,
        }
    },
    {
        id: PREF_ID_MAX_TIME_SCHEDULE,
        type: 'integer',
        name: 'End schedule at',
        description: 'The hour of day at which the calendar views ends to show events for each day.',
        default: 24,
        min: 1,
        max: 24,
        minConstraint: {
            id: PREF_ID_MIN_TIME_SCHEDULE,
            value: 1,
        }
    },
    {
      id: PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EVENT,
      type: 'deviceBoolean',
      name: 'Get notifications before events',
      description: 'Push a notification to the user before every event',
      default: {},
      uponActivation: 'activateNotifications',
    },
    {
      id: PREF_ID_MINUTES_BEFORE_EVENT_NOTIFICATION,
      type: 'integer',
      name: 'Minutes to event',
      description: 'The amount of minutes before an event starts, when a reminding notification shall be pushed to the user.',
      default: 0,
      min: 0,
      step: 1,
      constraint: {
        id: PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EVENT,
        value: true
      },
    },
    {
      id: PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EXAM,
      type: 'deviceBoolean',
      name: 'Get notifications before exams',
      description: 'Push a notification to the user before every exam',
      default: {},
      uponActivation: 'activateNotifications',
    },
    {
      id: PREF_ID_HOURS_BEFORE_EXAM_NOTIFICATION,
      type: 'integer',
      name: 'Hours to exam',
      description: 'The amount of hours before an exam starts, when a reminding notification shall be pushed to the user.',
      default: 0,
      min: 0,
      step: 1,
      constraint: {
        id: PREF_ID_SHOW_REMINDER_NOTIFICATION_BEFORE_EXAM,
        value: true
      },
    },
    {
        id: PREF_ID_ENABLE_BEFORE_TASK_NOTIFICATIONS,
        type: 'deviceBoolean',
        name: 'Enable notifications for tasks',
        description: 'If enabled, notifications for tasks can be configured.',
        default: {},
        uponActivation: 'activateNotifications',
    },
    {
        id: PREF_ID_ENABLE_REMINDER_POPUPS,
        type: 'boolean',
        name: 'Enable reminder dialogs',
        description: 'If enabled, all open reminders will be iterated upon going to the ToDo page',
        default: true,
    },
    {
        id: PREF_ID_ARCHIVES,
        type: 'optionalGrouping',
        name: 'Define Archives',
        description: 'You can archive subjects into self-defined archives',
        default: [],
        subjectIdName: 'archiveId',
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

export const getIdsOfEmptyGroupItems = (groupId: keyof SubjectModel, groupItems: GroupItem[], subjects: SubjectModelWithId[]) => {
    if (!subjects || subjects.length < 1) return [];
    // init array with all group ids, then remove if subject is assigned to it
    let emptyGroupItemIds = groupItems.map(g => g.id);
    for (let sub of subjects) {
        const idx = emptyGroupItemIds.findIndex(eid => eid === sub[groupId]);
        if (idx > -1) {
            emptyGroupItemIds = emptyGroupItemIds.filter((id, i) => i !== idx);
        }
    }
    return emptyGroupItemIds;
}