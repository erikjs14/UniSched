import { Timestamp, TaskModel } from './../firebase/model';

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

    // all timestamps from pasts that haven't been checked
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

export const getSecondsFromDate = (date: Date): number => Math.round(date.getTime() / 1000);
export const getDateFromSeconds = (secs: number): Date => new Date(secs * 1000);
export const getTimestampFromDate = (date: Date): Timestamp => ({seconds: Math.round(date.getTime() / 1000), nanoseconds: 0});