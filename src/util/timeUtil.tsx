import { Timestamp, TaskModel, IntervalType } from './../firebase/model';
import { getResult } from './util';

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

export const getRelevantTimestamps = (timestamps: Timestamp[], timestampsDone: Timestamp[]): Timestamp[] => {
    const now = Date.now() / 1000;

    // all timestamps from past that haven't been checked
    const relevantFromPast =  timestamps.reduce<Timestamp[]>((acc, cur) => {
        if (cur.seconds < now && !containsTimestamp(cur, timestampsDone)) {
            return [...acc, cur];
        }
        return acc;
    }, []);

    // append first timestamp from future
    const firstInFuture: Timestamp | undefined = timestamps.find(t => t.seconds > now);
    
    if (!firstInFuture) {
        return relevantFromPast;
    } else {
        return [
            ...relevantFromPast,
            firstInFuture
        ];
    }
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
export const getTimestampFromDate = (date: Date): Timestamp => ({seconds: Math.round(date.getTime() / 1000), nanoseconds: 0});

export const getIntervalTypeFromSeconds = (secs: number): IntervalType => {
    switch (secs) {
        case 0: return 'once';
        case DAY_IN_SEC: return 'daily';
        case WEEK_IN_SEC: return 'weekly';
        case BIWEEK_IN_SEC: return 'biweekly';
        default: throw new Error('Malformed timestamps.');
    }
}
export const getSecondsFromIntervalType = (interval: IntervalType): number => {
    switch (interval) {
        case 'once': return 0;
        case 'daily': return DAY_IN_SEC;
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
            const intervalSeconds = timestamps[1].seconds - timestamps[0].seconds;
            return getIntervalTypeFromSeconds(intervalSeconds);
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
    const today = todaysTimestamp();
    const pastTimestamps = timestampsOld.filter(t => t.seconds < today.seconds); //keep past timestamps
    const pastTimestampsDone = timestampsDoneOld.filter(t => t.seconds < today.seconds);

    // whether next due task is already checked --> keep in updated version.
    const nextTimestamp = timestampsOld.find(t => t.seconds > todaysTimestamp().seconds);
    const checkFirstInFuture = nextTimestamp
        ? containsTimestamp(nextTimestamp, timestampsDoneOld)
        : false;
    const shift = nextTimestamp && timestampsOld.length > 0
        ? newConfig.firstDeadline.seconds - timestampsOld[0].seconds
        : 0;
    
    const newFutureTimestamps = getTimestampsFromConfig({
        firstDeadline: newConfig.firstDeadline,
        lastDeadline: newConfig.lastDeadline,
        interval: newConfig.interval,
    });

    const timestampsOut = [...pastTimestamps, ...newFutureTimestamps];
    let timestampsDoneOut = [...pastTimestampsDone];
    if (checkFirstInFuture && nextTimestamp) timestampsDoneOut.push(
        getTimestampFromSeconds(
            nextTimestamp.seconds + shift
        )
    );

    // if only one timestamp is contained and interval it not 'once' --> add one extra timestamp
    if (timestampsOut.length === 1) {
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
        switch (interval) {
            case 'once':        return plusMinus(difference_s, 3600);
            case 'daily':       return plusMinus(difference_s % DAY_IN_SEC, 3600);
            case 'weekly':      return plusMinus(difference_s % WEEK_IN_SEC, 3600);
            case 'biweekly':    return plusMinus(difference_s % BIWEEK_IN_SEC, 3600);
            default: return true;
        }
    }
}