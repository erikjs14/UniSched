import { TaskModel, ExamModel, EventModel } from './../firebase/model';
import { getTimestampFromDate } from '../util/timeUtil';

export const TIME_INTERVAL_SELECT = 15;
export const TIME_FORMAT = 'HH:mm';
export const TIME_CAPTION = 'time';
export const DATE_FORMAT_SELECT = 'MMMM d, yyyy h:mm aa';

export const DATETIMEPICKER_DEFAULT_PROPS = {
    timeFormat: TIME_FORMAT,
    dateFormat: DATE_FORMAT_SELECT,
    timeIntervals: TIME_INTERVAL_SELECT,
    timeCaption: 'time',
    showTimeSelect: true,
}

export const EVENTS_START_STATE: EventModel = {
    firstStart: {seconds: Math.round(new Date().getTime() / 1000), nanoseconds: 0},
    firstEnd: {seconds: Math.round(new Date().getTime() / 1000 + 60 * 90), nanoseconds: 0},
    endAt: {seconds : Math.round(new Date().getTime() / 1000 + 60 * 60 * 24 * 7), nanoseconds: 0},
    interval: 'weekly',
    type: '',
};

export const EXAM_START_STATE: ExamModel = {
    type: '',
    start: {seconds: Math.round(new Date().getTime() / 1000), nanoseconds: 0},
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