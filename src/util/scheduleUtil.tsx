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
        title: 'Exam: ' + exam.type,
        start: getDateFromTimestamp(exam.start),
        end: getDateFromSeconds(exam.start.seconds + 3600)
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