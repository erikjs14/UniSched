import { Timestamp, TaskModel, IntervalType, TaskModelWithIdAndSubjectId } from './../firebase/model';
import { getResult } from './util';
import { format, formatDistanceToNow } from 'date-fns';
import { DEFAULT_DATE_FORMAT, DEFAULT_TIME_FORMAT } from './../config/timeConfig';

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

export const getRelevantTimestamps = (timestamps: Timestamp[], timestampsDone: Timestamp[], forceAppendFuture: boolean): Timestamp[] => {
    const now = Date.now() / 1000;

    // all timestamps from past that haven't been checked
    const relevantFromPast =  timestamps.reduce<Timestamp[]>((acc, cur) => {
        if (cur.seconds < now && !containsTimestamp(cur, timestampsDone)) {
            return [...acc, cur];
        }
        return acc;
    }, []);

    const firstInFuture: Timestamp | undefined = timestamps.find(t => t.seconds > now);

    if (forceAppendFuture) {
        // append first timestamp from future
        
        if (!firstInFuture) {
            return relevantFromPast;
        } else {
            return [
                ...relevantFromPast,
                firstInFuture
            ];
        }
    } else {
        if (!firstInFuture || containsTimestamp(firstInFuture, timestampsDone)) {
            return relevantFromPast;
        } else {
            return [
                ...relevantFromPast,
                firstInFuture,
            ];
        }
    }
}

export const formatDateOutput = (date: Date): string => format(date, DEFAULT_DATE_FORMAT);
export const formatTimeOutput = (date: Date): string => format(date, DEFAULT_TIME_FORMAT);
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
export const groupTaskSemanticsByDueDay = (sortedTasks: TaskSemantic[]): TaskSemantic[][] => {
    const out: TaskSemantic[][] = [];

    let prev = null;
    for (const ts of sortedTasks) {
        if (sameDay(prev, ts.dueAt)) {
            out[out.length-1].push(ts);
        } else {
            out.push([ts]);
        }
        prev = ts.dueAt;
    }

    return out;
}

// input must already be sorted by subject
export const groupTaskSemanticsBySubject = (sortedTasks: TaskSemantic[]): TaskSemantic[][] => {
    const out: TaskSemantic[][] = [];

    let prev: TaskSemantic | null = null;
    for (const ts of sortedTasks) {
        if (ts.subjectId === prev?.subjectId) {
            out[out.length-1].push(ts);
        } else {
            out.push([ts]);
        }
        prev = ts;
    }

    return out;
}

export const getRelevantTaskSemantics = (rawTasks: TaskModelWithIdAndSubjectId[], forceAppendFuture: boolean): TaskSemantic[] => {
    const out: TaskSemantic[][] = [];
    
    rawTasks.forEach(task => {
        out.push(
            getRelevantTimestamps(task.timestamps, task.timestampsDone, forceAppendFuture).map(tstamp => ({
                name: task.type,
                taskId: task.id,
                subjectId: task.subjectId,
                checked: containsTimestamp(tstamp, task.timestampsDone),
                dueString: formatDistanceOutput(getDateFromTimestamp(tstamp)),
                dueAt: getDateFromTimestamp(tstamp),
            }))
        )
    });

    return out.flat().sort((ts1, ts2) => ts1.dueAt.getTime() - ts2.dueAt.getTime());
}
export const getRelevantTaskSemanticsGrouped = (rawTasks: TaskModelWithIdAndSubjectId[], forceAppendFuture: boolean): TaskSemantic[][] => groupTaskSemanticsByDueDay(getRelevantTaskSemantics(rawTasks, forceAppendFuture));

export const getUncheckedTaskSemantics = (rawTasks: TaskModelWithIdAndSubjectId[]): TaskSemantic[] => {
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
            }))
        )
    });

    return out.flat().sort((ts1, ts2) => ts1.subjectId.localeCompare(ts2.subjectId));
}
export const getUncheckedTaskSemanticsGrouped = (rawTasks: TaskModelWithIdAndSubjectId[]): TaskSemantic[][] => groupTaskSemanticsBySubject(getUncheckedTaskSemantics(rawTasks));
export const getUncheckedTaskSemanticsGroupedObject = (rawTasks: TaskModelWithIdAndSubjectId[]): {[subjectId: string]: TaskSemantic[]} => {
    const out: {[subjectId: string]: TaskSemantic[]} = {};

    for (const semPerSubject of getUncheckedTaskSemanticsGrouped(rawTasks)) {
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
    out.setSeconds(59);
    out.setMilliseconds(999);
    return out;
}

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

// export const getEditedTimestamps = (newConfig: TaskConfig, timestampsOld: Timestamp[], timestampsDoneOld: Timestamp[]): [Timestamp[], Timestamp[]] => {
//     const today = todaysTimestamp();
//     const pastTimestamps = timestampsOld.filter(t => t.seconds < today.seconds); //keep past timestamps
//     const pastTimestampsDone = timestampsDoneOld.filter(t => t.seconds < today.seconds);

//     // whether next due task is already checked --> keep in updated version.
//     const nextTimestamp = timestampsOld.find(t => t.seconds > todaysTimestamp().seconds);
//     const checkFirstInFuture = nextTimestamp
//         ? containsTimestamp(nextTimestamp, timestampsDoneOld)
//         : false;
//     const shift = nextTimestamp && timestampsOld.length > 0
//         ? newConfig.firstDeadline.seconds - timestampsOld[0].seconds
//         : 0;

//     const newFutureTimestamps = getTimestampsFromConfig({
//         firstDeadline: newConfig.firstDeadline,
//         lastDeadline: newConfig.lastDeadline,
//         interval: newConfig.interval,
//     });
    
//     // let firstDeadlineInFuture = newConfig.firstDeadline.seconds;
//     // while (firstDeadlineInFuture < today.seconds && newConfig.interval !== 'once') {
//     //     firstDeadlineInFuture += getSecondsFromIntervalType(newConfig.interval);
//     // }
//     // const newFutureTimestamps = getTimestampsFromConfig({
//     //     firstDeadline: getTimestampFromSeconds(firstDeadlineInFuture),
//     //     lastDeadline: getResult(() => {
//     //         if (newConfig.lastDeadline.seconds < firstDeadlineInFuture) {
//     //             return getTimestampFromSeconds(firstDeadlineInFuture);
//     //         }
//     //         return newConfig.lastDeadline;
//     //     }),
//     //     interval: newConfig.interval,
//     // });

//     const timestampsOut = [...pastTimestamps, ...newFutureTimestamps];
//     let timestampsDoneOut = [...pastTimestampsDone];
//     if (checkFirstInFuture && nextTimestamp) timestampsDoneOut.push(
//         getTimestampFromSeconds(
//             nextTimestamp.seconds + shift
//         )
//     );

//     // if only one timestamp is contained and interval it not 'once' --> add one extra timestamp
//     if (newConfig.interval !== 'once' && timestampsOut.length === 1) {
//         timestampsOut.push(
//             getTimestampFromSeconds(
//                 timestampsOut[0].seconds + getSecondsFromIntervalType(newConfig.interval)
//             )
//         );
//     }

//     return [removeDuplicateTimestamps(timestampsOut), removeDuplicateTimestamps(timestampsDoneOut)];
// }

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
        // switch (interval) {
        //     case 'once':        return plusMinus(difference_s, 3600);
        //     case 'daily':       return plusMinus(difference_s % DAY_IN_SEC, 3600);
        //     case 'weekly':      return plusMinus(difference_s % WEEK_IN_SEC, 3600);
        //     case 'biweekly':    return plusMinus(difference_s % BIWEEK_IN_SEC, 3600);
        //     default: return true;
        // }
    }
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
export const isToday = (date: Date): boolean => sameDay(new Date(), date);
export const isYesterday = (date: Date): boolean => sameDay(new Date(new Date().getTime() - 1000*DAY_IN_SEC), date);
export const isTomorrow = (date: Date): boolean => sameDay(new Date(new Date().getTime() + 1000*DAY_IN_SEC), date);

export const getDayIdentifier = (date: Date): string => {
    if (isToday(date)) return 'today';
    else if (isTomorrow(date)) return 'tomorrow';
    else if (isYesterday(date)) return 'yesterday';
    else return getWeekDay(date);
}