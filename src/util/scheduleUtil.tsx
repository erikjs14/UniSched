import { EventModel, EventModelWithId, ExamModelWithId, Timestamp } from "../firebase/model";
import { getDateFromTimestamp, getSecondsFromIntervalType, getDateFromSeconds, containsTimestamp, getTimestampFromSeconds } from "./timeUtil";

export interface ConfigType {
    title: string;
    start: Date;
    end: Date;
    subjectId: string;
    additionalInfoText: string|null|undefined;
}

export const getAllTimestampsFromEvent = (event: EventModel): Timestamp[] => {
    if (event.interval === 'once') {
        return [event.firstStart];
    } else {

        let curSecs = event.firstStart.seconds;
        const endSecs = event.endAt.seconds;
        const delta = getSecondsFromIntervalType(event.interval);

        const out = [];
        while (curSecs <= endSecs) {
            out.push(getTimestampFromSeconds(curSecs));
            curSecs += delta;
        }
        return out;

    }
}

export const getFullCalendarEventConfigFromEvent = (event: EventModelWithId): ConfigType[] => {
    const duration = event.firstEnd.seconds - event.firstStart.seconds;
    if (event.interval === 'once') {

        return [{
            title: event.type,
            start: getDateFromTimestamp(event.firstStart),
            end: getDateFromTimestamp(event.firstEnd),
            subjectId: event.subjectId,
            additionalInfoText: event.additionalInfo?.text,
        }];

    } else {

        let curSecs = event.firstStart.seconds;
        const endSecs = event.endAt.seconds;
        const delta = getSecondsFromIntervalType(event.interval);

        const additionalInfoText = event.additionalInfo?.text;

        const out = [];
        while (curSecs <= endSecs) {
            if (!containsTimestamp(getTimestampFromSeconds(curSecs), event.exclusions))
                out.push({
                    title: event.type,
                    start: getDateFromSeconds(curSecs),
                    end: getDateFromSeconds(curSecs + duration),
                    subjectId: event.subjectId,
                    additionalInfoText,
                });
            curSecs += delta;
        }
        return out;

    }
}

export const getFullCalendarConfigFromExam = (exam: ExamModelWithId): ConfigType => {
    return {
        title: exam.type,
        start: getDateFromTimestamp(exam.start),
        end: getDateFromTimestamp(exam.start),
        subjectId: exam.subjectId,
        additionalInfoText: exam.additionalInfo?.text,
    };
}

export const getAllConfigFromEvents = (events: EventModelWithId[]): Array<ConfigType> => {
    let out: ConfigType[] = [];
    events.forEach(event => {
        out = [
            ...out,
            ...getFullCalendarEventConfigFromEvent(event),
        ];
    });
    return out;
}
export const getAllConfigFromExams = (exams: ExamModelWithId[]): Array<ConfigType> => {
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
export const getSubAndTitleAndTimeFromEventTitle = (event: any): {subjectName: string; eventName: string, timeStr: string} => {
    const [first, second] = event.title.split(']');
    const start: Date = event.start;
    const startStr = `${leadZero(start.getHours())}:${leadZero(start.getMinutes())}`;
    const end: Date = event.end;

    const timeStr = end
        ? startStr + ` - ${leadZero(end.getHours())}:${leadZero(end.getMinutes())}`
        : startStr;
    return {
        subjectName: first.slice(1),
        eventName: second,
        timeStr,
    };
}