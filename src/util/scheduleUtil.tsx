import { EventModel } from "../firebase/model";
import { getDateFromTimestamp, getSecondsFromIntervalType, getDateFromSeconds } from "./timeUtil";
import { ExamModel } from './../firebase/model';

export interface ConfigType {
    title: string;
    start: Date;
    end: Date;
}

export const getFullCalendarEventConfigFromEvent = (event: EventModel): ConfigType[] => {
    const duration = event.firstEnd.seconds - event.firstStart.seconds;
    if (event.interval === 'once') {

        return [{
            title: event.type,
            start: getDateFromTimestamp(event.firstStart),
            end: getDateFromTimestamp(event.firstEnd),
        }];

    } else {

        let curSecs = event.firstStart.seconds;
        const endSecs = event.endAt.seconds;
        const delta = getSecondsFromIntervalType(event.interval);

        const out = [];
        while (curSecs <= endSecs) {
            out.push({
                title: event.type,
                start: getDateFromSeconds(curSecs),
                end: getDateFromSeconds(curSecs + duration),
            });
            curSecs += delta;
        }
        return out;

    }
}

export const getFullCalendarConfigFromExam = (exam: ExamModel): ConfigType => {
    return {
        title: exam.type,
        start: getDateFromTimestamp(exam.start),
        end: getDateFromTimestamp(exam.start),
    };
}

export const getAllConfigFromEvents = (events: EventModel[]): Array<ConfigType> => {
    let out: ConfigType[] = [];
    events.forEach(event => {
        out = [
            ...out,
            ...getFullCalendarEventConfigFromEvent(event),
        ];
    });
    return out;
}
export const getAllConfigFromExams = (exams: ExamModel[]): Array<ConfigType> => {
    let out: ConfigType[] = [];
    exams.forEach(exam => {
        out = [
            ...out,
            getFullCalendarConfigFromExam(exam),
        ];
    });
    return out;
}

const leadZero = (time: number): string => time < 10 ? `0${time}` : ''+time;
export const getSubAndTitleAndTimeFromEventTitle = (event: any): {subjectName: string; eventName: string, startStr: string, endStr: string} => {
    const [first, second] = event.title.split(']');
    const start: Date = event.start;
    const end: Date = event.end;
    return {
        subjectName: first.slice(1),
        eventName: second,
        startStr: `${leadZero(start.getHours())}:${leadZero(start.getMinutes())}`,
        endStr: `${leadZero(end.getHours())}:${leadZero(end.getMinutes())}`,
    };
}