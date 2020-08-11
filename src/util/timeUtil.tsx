import { Timestamp, TaskModel, IntervalType, TaskModelWithId } from './../firebase/model';
import { getResult } from './util';
import { format, formatDistanceToNow } from 'date-fns';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT, TIME_INTERVAL_SELECT, DEFAULT_DATETIME_FORMAT } from './../config/timeConfig';

export const containsTimestamp = (toCheck: Timestamp, array: Timestamp[]): boolean => {
    let contained = false;
    for (const t of array) {
        if (t.seconds === toCheck.seconds && t.nanoseconds === toCheck.nanoseconds) {
            contained = true;
            break;
        }
    }
    return contained;
}

export const removeTimestamp = (toRemove: Timestamp, array: Timestamp[]): Timestamp[] => {
    return array.reduce<Timestamp[]>((acc, cur) => {
        if (cur.seconds !== toRemove.seconds || cur.nanoseconds !== toRemove.nanoseconds) {
            return [...acc, cur];
        }
        return acc;
    }, []);
}

export const containsDay = (toCheck: Date[], date: Date): boolean => {
    if (toCheck.find(d => sameDay(d, date))) {
        return true;
    }
    return false;
}

export const getRelevantTimestamps = (
    timestamps: Timestamp[], 
    timestampsDone: Timestamp[], 
    forceAppendFuture: boolean,
    onlyRelevantTasks: boolean = false,
    forceShowXDaysInFuture: number | undefined = undefined,
): Timestamp[] => {
    const now = Date.now() / 1000;

    if (onlyRelevantTasks) {
        // all timestamps from past that haven't been checked
        const relevantFromPast =  timestamps.reduce<Timestamp[]>((acc, cur) => {
            if (cur.seconds < now && !containsTimestamp(cur, timestampsDone)) {
                return [...acc, cur];
            }
            return acc;
        }, []);

        const firstInFuture: Timestamp | undefined = timestamps.find(t => t.seconds > now);

        let toAdd: Timestamp[] = [];
        if (forceShowXDaysInFuture) {
            const limitSeconds = getSecondsFromDate(addDays(endOf(new Date()), forceShowXDaysInFuture));
            toAdd = timestamps.filter(ts => (
                firstInFuture?.seconds !== ts.seconds && ts.seconds >= now && ts.seconds <= limitSeconds && !containsTimestamp(ts, timestampsDone)
            ));
        }

        if (forceAppendFuture) {
            // append first timestamp from future
            
            if (!firstInFuture) {
                return [
                    ...relevantFromPast,
                    ...toAdd,
                ];
            } else {
                return [
                    ...relevantFromPast,
                    firstInFuture,
                    ...toAdd,
                ];
            }
        } else {
            if (!firstInFuture || containsTimestamp(firstInFuture, timestampsDone)) {
                return [
                    ...relevantFromPast,
                    ...toAdd,
                ];
            } else {
                return [
                    ...relevantFromPast,
                    firstInFuture,
                    ...toAdd,
                ];
            }
        }

    } else {
        return timestamps.filter(ts => !containsTimestamp(ts, timestampsDone));
    }
}

export const formatDateOutput = (date: Date): string => format(date, DEFAULT_DATE_FORMAT);
export const formatTimeOutput = (date: Date): string => format(date, DEFAULT_TIME_FORMAT);
export const formatDateTimeOutput = (date: Date): string => format(date, DEFAULT_DATETIME_FORMAT);
export const formatDistanceOutput = (date: Date): string => formatDistanceToNow(date, {addSuffix: true});

export const sameDay = (d1: Date | null, d2: Date | null): boolean => {
    if (!d1 || !d2) return false;
    const date1 = typeof d1 === 'string' ? new Date(d1) : d1;
    const date2 = typeof d2 === 'string' ? new Date(d2) : d2;
    return date1.getFullYear() === date2.getFullYear() &&
            date1.getMonth() === date2.getMonth() &&
            date1.getDate() === date2.getDate();
}

// input must already been sorted by due day
export const groupTaskSemanticsByDueDay = (sortedTasks: TaskSemantic[]): [TaskSemantic[][], number[]] => {
    const out: TaskSemantic[][] = [];
    const starsPerSubject: number[] = [];

    let prev = null;
    for (const ts of sortedTasks) {
        if (sameDay(prev, ts.dueAt)) {
            out[out.length-1].push(ts);
            if (ts.star) starsPerSubject[out.length-1] += 1;
        } else {
            out.push([ts]);
            starsPerSubject.push(
                ts.star ? 1 : 0
            );
        }
        prev = ts.dueAt;
    }

    return [out, starsPerSubject];
}

// input must already be sorted by subject
export const groupTaskSemanticsBySubject = (sortedTasks: TaskSemantic[]): [TaskSemantic[][], number[]] => {
    const out: TaskSemantic[][] = [];
    const starsPerSubject: number[] = [];

    let prev: TaskSemantic | null = null;
    for (const ts of sortedTasks) {
        if (ts.subjectId === prev?.subjectId) {
            out[out.length-1].push(ts);
            if (ts.star) starsPerSubject[out.length-1] += 1;
        } else {
            out.push([ts]);
            starsPerSubject.push(
                ts.star ? 1 : 0
            );
        }
        prev = ts;
    }

    return [out, starsPerSubject];
}

export const dayIsInLimit = (date: Date, limitDaysInFuture: number): boolean => {
    const endOfLimitDay = endOf(addDays(new Date(), limitDaysInFuture));
    return endOfLimitDay.getTime() >= date.getTime();
}

export const getRelevantTaskSemantics = (
    rawTasks: TaskModelWithId[], 
    forceAppendFuture: boolean, 
    limitFutureBy: number | undefined = undefined, 
    onlyStars: boolean = false,
    onlyRelevantTasks: boolean = false,
    forceShowXDaysInFuture: number | undefined = undefined,
): TaskSemantic[] => {
    const out: TaskSemantic[][] = [];
    const endOfLimitDay = limitFutureBy === undefined ? undefined : endOf(addDays(new Date(), limitFutureBy));
    const limitInSec = endOfLimitDay ? getSecondsFromDate(endOfLimitDay) : undefined;
    
    rawTasks.forEach(task => {
        const stamps = endOfLimitDay && limitInSec
            ? task.timestamps.filter(ts => limitInSec >= ts.seconds)
            : task.timestamps;
        if (!onlyStars || task.star) { 
            out.push(
                getRelevantTimestamps(stamps, task.timestampsDone, forceAppendFuture, onlyRelevantTasks, forceShowXDaysInFuture).map(tstamp => ({
                    name: task.type,
                    taskId: task.id,
                    subjectId: task.subjectId,
                    checked: containsTimestamp(tstamp, task.timestampsDone),
                    dueString: formatDistanceOutput(getDateFromTimestamp(tstamp)),
                    dueAt: getDateFromTimestamp(tstamp),
                    star: task.star,
                    additionalInfo: task.additionalInfo,
                }))
            );
        }
    });

    return out.flat().sort((ts1, ts2) => ts1.dueAt.getTime() - ts2.dueAt.getTime());
}
export const getRelevantTaskSemanticsGrouped = (
    rawTasks: TaskModelWithId[], 
    forceAppendFuture: boolean, 
    limitFutureBy: number | undefined = undefined,
    onlyStars: boolean = false,
    onlyRelevantTasks: boolean = false,
    forceShowXDaysInFuture: number | undefined = undefined,
): [TaskSemantic[][], number[]] => groupTaskSemanticsByDueDay(getRelevantTaskSemantics(rawTasks, forceAppendFuture, limitFutureBy, onlyStars, onlyRelevantTasks, forceShowXDaysInFuture));

export const getUncheckedTaskSemantics = (rawTasks: TaskModelWithId[]): TaskSemantic[] => {
    const out: TaskSemantic[][] = [];

    rawTasks.forEach(task => {
        out.push(
            task.timestampsDone.map(tsDone => ({
                name: task.type,
                taskId: task.id,
                subjectId: task.subjectId,
                checked: true,
                dueString: formatDateOutput(getDateFromTimestamp(tsDone)),
                dueAt: getDateFromTimestamp(tsDone),
                star: task.star,
                additionalInfo: task.additionalInfo,
            }))
        )
    });

    return out.flat().sort((ts1, ts2) => ts1.subjectId.localeCompare(ts2.subjectId));
}
export const getUncheckedTaskSemanticsGrouped = (rawTasks: TaskModelWithId[]): [TaskSemantic[][], number[]] => groupTaskSemanticsBySubject(getUncheckedTaskSemantics(rawTasks));
export const getUncheckedTaskSemanticsGroupedObject = (rawTasks: TaskModelWithId[]): {[subjectId: string]: TaskSemantic[]} => {
    const out: {[subjectId: string]: TaskSemantic[]} = {};

    for (const semPerSubject of getUncheckedTaskSemanticsGrouped(rawTasks)[0]) {
        out[semPerSubject[0].subjectId] = semPerSubject.sort((ts1, ts2) => ts2.dueAt.getTime() - ts1.dueAt.getTime());
    }

    return out;
}

export interface TaskSemantic {
    name: string;
    dueString: string;
    taskId: string;
    subjectId: string;
    checked: boolean;
    star: boolean;
    additionalInfo: {
        text: string;
    } | null;
    dueAt: Date;
}

export const checkTask = (timestamp: Timestamp, task: TaskModel): TaskModel => {
    if (!containsTimestamp(timestamp, task.timestamps)) return task;

    const timestamps = [...task.timestamps];
    const timestampsDone = [...task.timestampsDone, timestamp];
    
    return {
        ...task,
        timestamps,
        timestampsDone,
    }
}

export const uncheckTask = (timestamp: Timestamp, task: TaskModel): TaskModel => {
    if (containsTimestamp(timestamp, task.timestampsDone) || !containsTimestamp(timestamp, task.timestamps)) return task;

    return {
        ...task,
        timestamps: [...task.timestamps],
        timestampsDone: removeTimestamp(timestamp, task.timestampsDone),
    };
}

export const todaysTimestamp = (): Timestamp => {
    const today = new Date();
    today.setHours(23);
    today.setMinutes(59);
    return {
        seconds: Math.round(today.getTime() / 1000), 
        nanoseconds: 0
    }
};
export const startOf = (date: Date): Date => {
    const out = new Date(date);
    out.setHours(0);
    out.setMinutes(0);
    out.setSeconds(0);
    out.setMilliseconds(0);
    return out;
}
export const endOf = (date: Date): Date => {
    const out = new Date(date);
    out.setHours(23);
    out.setMinutes(59);
    out.setSeconds(0);
    out.setMilliseconds(0);
    return out;
}
export const subtractDays = (date: Date, days: number): Date => new Date(date.getTime() - days * 1000 * DAY_IN_SEC);
export const addDays = (date: Date, days: number): Date => subtractDays(date, -days);
export const addHours = (date: Date, hours: number): Date => new Date(date.getTime() + hours * 60 * 60 * 1000);
export const subtractHours = (date: Date, hours: number): Date => new Date(date.getTime() - hours * 60 * 60 * 1000);
export const addSeconds = (date: Date, seconds: number): Date => new Date(date.getTime() + seconds * 1000);
export const subtractSeconds = (date: Date, seconds: number): Date => subtractSeconds(date, -seconds);

export const isInFuture = (d: Date): boolean => Date.now() < d.getTime();

export const getTimestampFromSeconds = (secs: number): Timestamp => ({seconds: secs, nanoseconds: 0});
export const getSecondsFromDate = (date: Date): number => Math.round(date.getTime() / 1000);
export const getDateFromSeconds = (secs: number): Date => new Date(secs * 1000);
export const getDateFromTimestamp = (t: Timestamp): Date => getDateFromSeconds(t.seconds);
export const getTimestampFromDate = (date: Date): Timestamp => ({seconds: Math.round(date.getTime() / 1000), nanoseconds: 0});

export const getIntervalTypeFromSeconds = (secs: number): IntervalType => {
    switch (secs) {
        case 0: return 'once';
        case DAY_IN_SEC: return 'daily';
        case 2*DAY_IN_SEC: return 'twice-daily';
        case WEEK_IN_SEC: return 'weekly';
        case BIWEEK_IN_SEC: return 'biweekly';
        default: throw new Error('Malformed timestamps.');
    }
}

export const getSecondsFromIntervalType = (interval: IntervalType): number => {
    switch (interval) {
        case 'once': return 0;
        case 'daily': return DAY_IN_SEC;
        case 'twice-daily': return 2*DAY_IN_SEC;
        case 'weekly': return WEEK_IN_SEC;
        case 'biweekly': return BIWEEK_IN_SEC;
        default: throw new Error('Prohibited by typescript');
    }
}

export const DAY_IN_SEC = 60 * 60 * 24;
export const WEEK_IN_SEC = DAY_IN_SEC * 7;
export const BIWEEK_IN_SEC = WEEK_IN_SEC * 2;

export interface TaskConfig {
    firstDeadline: Timestamp;
    lastDeadline: Timestamp;
    interval: IntervalType;
}
export const getConfigDataFromTimestamps = (timestamps: Timestamp[], timestampsDone: Timestamp[]): TaskConfig => ({
    firstDeadline: timestamps.length > 0 ? timestamps[0] : todaysTimestamp(),
    lastDeadline:  timestamps.length > 0 ? timestamps[timestamps.length - 1] : todaysTimestamp(),
    interval: getResult((): IntervalType => {
        if (timestamps.length < 2) {
            return 'once';
        } else {
            const today = todaysTimestamp();
            if (timestamps[timestamps.length - 1].seconds < today.seconds) {
                return 'daily';
            } else {
                const intervalSeconds = timestamps[timestamps.length-1].seconds - timestamps[timestamps.length-2].seconds;
                return getIntervalTypeFromSeconds(intervalSeconds);
            }
        }
    }),
});

export const getTimestampsFromConfig = ({firstDeadline, lastDeadline, interval}: TaskConfig): Timestamp[] => {
    const timestamps: Timestamp[] = [];

    if (interval === 'once') return [getTimestampFromSeconds(firstDeadline.seconds)];

    const intervalSeconds = getSecondsFromIntervalType(interval);
    let cur = firstDeadline.seconds;
    while (cur <= lastDeadline.seconds) {
        timestamps.push(getTimestampFromSeconds(cur));
        cur += intervalSeconds;
    }

    return timestamps;
}

export const getEditedTimestamps = (newConfig: TaskConfig, timestampsOld: Timestamp[], timestampsDoneOld: Timestamp[]): [Timestamp[], Timestamp[]] => {
    const timestampsOut = getTimestampsFromConfig({
        firstDeadline: newConfig.firstDeadline,
        lastDeadline: newConfig.lastDeadline.seconds < newConfig.firstDeadline.seconds ? newConfig.firstDeadline : newConfig.lastDeadline,
        interval: newConfig.interval,
    });

    const shift = timestampsOld.length > 0 && timestampsOut.length > 0
        ? timestampsOld[0].seconds - timestampsOut[0].seconds
        : 0;

    const timestampsDoneOut = timestampsDoneOld
        .map(ts => getTimestampFromSeconds(ts.seconds - shift))
        .filter(ts => containsTimestamp(ts, timestampsOut));

    // if only one timestamp is contained and interval it not 'once' --> add one extra timestamp
    if (newConfig.interval !== 'once' && timestampsOut.length === 1) {
        timestampsOut.push(
            getTimestampFromSeconds(
                timestampsOut[0].seconds + getSecondsFromIntervalType(newConfig.interval)
            )
        );
    }

    return [timestampsOut, timestampsDoneOut];
}

const plusMinus = (nr: number, range: number): boolean => {
    return -range <= nr && range >= nr;
}

export const getFilterForInterval = (startSecs: number, interval: IntervalType): (d: Date) => boolean => {
    return (d: Date): boolean => {
        const startDate = startOf(getDateFromSeconds(startSecs));
        const dateToCheck = startOf(d);
        const difference_s = Math.round((dateToCheck.getTime() - startDate.getTime()) / 1000);

        // check for range plus minus one hour due to daylight savings
        if (interval === 'once')
            return plusMinus(difference_s, 3600);
        else
            return plusMinus(difference_s % getSecondsFromIntervalType(interval), 3600);
    }
}

export const getNDatesAsSecondsForInterval = (excludedStartDateSeconds: number, interval: IntervalType, n: number): number[] => {
    if (interval === 'once') return [];
    const out = [];
    const secsToAdd = getSecondsFromIntervalType(interval);
    for (let i = 1; i <= n; i++) {
        out.push(
            excludedStartDateSeconds + i * secsToAdd
        );
    }
    return out;
}

export const removeDuplicateTimestamps = (array: Timestamp[]): Timestamp[] => {
    return array.reduce<Timestamp[]>((unique, o) => {
        if (!unique.some(ts => ts.seconds === o.seconds && ts.nanoseconds === o.nanoseconds)) {
            unique.push(o);
        }
        return unique;
    }, []);
}

export const setTimeTo = (date: Date, hours: number, minutes: number): Date => {
    const outDate = new Date(date);
    outDate.setHours(hours);
    outDate.setMinutes(minutes);
    return outDate;
}

export const taskContained = (taskId: string, seconds: number, array: [string, number][]): boolean => {
    let ret = false;
    array.forEach(([id, ts]) => {
        if (id === taskId && ts === seconds) {
            ret = true;
        }
    });
    return ret;
}

export const allTasksOfOneDayContained = (tasks: TaskSemantic[], toFadeOut: [string, number][]): boolean => {
    for (const task of tasks) {
        if (!toFadeOut.find(([id, ts]) => task.taskId === id && task.dueAt.getTime() === ts)) {
            return false;
        }
    }
    return true;
}

const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
export const getWeekDay = (date: Date): typeof days[number] => days[date.getDay()];
export const isToday = (date: Date, dayStartsAtHour: number): boolean => sameDay(subtractHours(new Date(), dayStartsAtHour), date);
export const isYesterday = (date: Date, dayStartsAtHour: number): boolean => sameDay(subtractHours(new Date(new Date().getTime() - 1000*DAY_IN_SEC), dayStartsAtHour), date);
export const isTomorrow = (date: Date, dayStartsAtHour: number): boolean => sameDay(subtractHours(new Date(new Date().getTime() + 1000*DAY_IN_SEC), dayStartsAtHour), date);

export const getDayIdentifier = (date: Date, dayStartsAtHour: number): string => {
    if (isToday(date, dayStartsAtHour)) return 'today';
    else if (isTomorrow(date, dayStartsAtHour)) return 'tomorrow';
    else if (isYesterday(date, dayStartsAtHour)) return 'yesterday';
    else return getWeekDay(date);
}

export const getExcludedTimes = (date: Date): Date[] => {
    const out = [];
    const secStartOf = getSecondsFromDate(startOf(date));
    const secTarget = getSecondsFromDate(date);
    const intervalSec = TIME_INTERVAL_SELECT * 60;

    let cur = secStartOf;
    while (cur < secTarget) {
        out.push(getDateFromSeconds(cur));
        cur += intervalSec;
    }

    return out;
}

export const findNextDayForInterval = (start: Date, cur: Date, interval: IntervalType): Date => {
    if (interval === 'once') return start;

    const startSec = getSecondsFromDate(startOf(start));
    let curSec = getSecondsFromDate(startOf(cur))
        + (sameDay(start, cur) ? DAY_IN_SEC : 0);

    while (((curSec - startSec) % getSecondsFromIntervalType(interval)) !== 0) {
        curSec += DAY_IN_SEC;
    }
    return getDateFromSeconds(curSec);
}

export const allTasksChecked = (timestamps: Timestamp[], timestampsDone: Timestamp[]): boolean => timestamps.every(ts => containsTimestamp(ts, timestampsDone));

export const dateToHTMLString = (date: Date): string => {
    const year = date.getFullYear();
    let month = ''+(date.getMonth() + 1);
    if (month.length === 1) month = '0' + month;
    let day = ''+(date.getDate());
    if (day.length === 1) day = '0' + day;
    return year+'-'+month+'-'+day;
}
export const HTMLStringToDate = (dateStr: string, hours: number, minutes: number): Date => {
    const [year, month, day] = dateStr.split('-');
    const out = new Date();
    out.setFullYear(parseInt(year));
    out.setMonth(parseInt(month) - 1);
    out.setDate(parseInt(day));
    out.setHours(hours);
    out.setMinutes(minutes);
    return out;
}

export const getCurrentTimestamp = (): Timestamp => getTimestampFromDate(new Date());