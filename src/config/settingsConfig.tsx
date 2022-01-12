import { TaskModel, ExamModel, EventModel } from './../firebase/model';
import { getTimestampFromDate } from '../util/timeUtil';
import { nowAtDefault, DEFAULT_DURATION } from './timeConfig';


export const EVENTS_START_STATE: EventModel = {
    firstStart: {
        seconds: Math.round(nowAtDefault.getTime() / 1000),
        nanoseconds: 0
    },
    firstEnd: {
        seconds: Math.round(nowAtDefault.getTime() / 1000 + DEFAULT_DURATION * 60),
        nanoseconds: 0
    },
    endAt: {
        seconds: Math.round(nowAtDefault.getTime() / 1000 + 60 * 60 * 24 * 7),
        nanoseconds: 0
    },
    interval: 'weekly',
    type: '',
    timeCreated: undefined,
    exclusions: [],
    additionalInfo: null,
};

export const EXAM_START_STATE: ExamModel = {
    type: '',
    start: {
        seconds: Math.round(nowAtDefault.getTime() / 1000 + 60 * 60 * 24), 
        nanoseconds: 0
    },
    timeCreated: undefined,
    additionalInfo: null,
    grade: null,
    gradeWeight: 1,
}

export const TASK_START_STATE: TaskModel = {
    type: '',
    timestamps: [],
    timestampsDone: [],
    tasksTickedAt: [],
    timeCreated: undefined,
    star: false,
    reminder: false,
    additionalInfo: null,
    deleted: false,
    exclusions: [],
    notifications: [],
}
export const getTaskStartState = (): TaskModel => ({
    type: '',
    timestamps: [getTimestampFromDate((() => {
        const todayAtNine = new Date();
        todayAtNine.setHours(9);
        todayAtNine.setMinutes(0);
        todayAtNine.setSeconds(0);
        todayAtNine.setMilliseconds(0);
        return todayAtNine;
    })())],
    timestampsDone: [],
    tasksTickedAt: [{seconds:0,nanoseconds:0}],
    timeCreated: undefined,
    star: false,
    reminder: false,
    additionalInfo: null,
    deleted: false,
    exclusions: [],
    notifications: [],
});

export const TOASTER_SHOW_DURATION = 4;
export const DEFAULT_TOASTER_CONFIG = {
    id: 'unique',
    duration: TOASTER_SHOW_DURATION,
};