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
        seconds: Math.round(nowAtDefault.getTime() / 1000 + DEFAULT_DURATION * 60 * 24 * 7),
        nanoseconds: 0
    },
    interval: 'weekly',
    type: '',
};

export const EXAM_START_STATE: ExamModel = {
    type: '',
    start: {
        seconds: Math.round(nowAtDefault.getTime() / 1000 + 60 * 60 * 24), 
        nanoseconds: 0
    },
}

export const TASK_START_STATE: TaskModel = {
    type: '',
    timestamps: [],
    timestampsDone: [],
}
export const getTaskStartState = (): TaskModel => ({
    type: '',
    timestamps: [getTimestampFromDate(new Date())],
    timestampsDone: [],
});

export const TOASTER_SHOW_DURATION = 4;
export const DEFAULT_TOASTER_CONFIG = {
    id: 'unique',
    duration: TOASTER_SHOW_DURATION,
};