import { useReducer, useCallback, useState, useMemo } from 'react';
import { SubjectDataModel, ExamModel, TaskModel, EventModel, ExamModelWithId, EventModelWithId, TaskModelWithId, SubjectDataModelWithId } from './../firebase/model';
import { fetchExams, fetchEvents, fetchTasks, fetchExam, fetchEvent, fetchTask, addExam, addTask, addEvent, updateExam, updateTask, updateEvent, deleteExam, deleteTask, deleteEvent } from './../firebase/firestore';
import { removeKey } from './../util/util';

export type DataTypeId = 'exam' | 'task' | 'event';

const g_fetchAllData = (type: DataTypeId, subjectId: string): Promise<SubjectDataModelWithId[]> => {
    switch (type) {
        case 'exam':    return fetchExams(subjectId);
        case 'task':    return fetchTasks(subjectId);
        case 'event':   return fetchEvents(subjectId);
    }
}
const g_fetchData = (type: DataTypeId, subjectId: string, dataId: string): Promise<SubjectDataModelWithId> => {
    switch (type) {
        case 'exam':    return fetchExam(subjectId, dataId);
        case 'task':    return fetchTask(subjectId, dataId);
        case 'event':   return fetchEvent(subjectId, dataId);
    }
}
const g_deleteData = (type: DataTypeId, subjectId: string, dataId: string): Promise<void> => {
    switch (type) {
        case 'exam':    return deleteExam(subjectId, dataId);
        case 'task':    return deleteTask(subjectId, dataId);
        case 'event':   return deleteEvent(subjectId, dataId);
    }
}
const g_addData = <T extends SubjectDataModel>(type: DataTypeId, subjectId: string, data: T): Promise<string> => {
    switch (type) {
        case 'exam':    return addExam(subjectId, data as unknown as ExamModel);
        case 'task':    return addTask(subjectId, data as unknown as TaskModel);
        case 'event':   return addEvent(subjectId, data as unknown as EventModel);
    }
}
const g_updateData = <
    T extends SubjectDataModel, 
    D extends keyof T
>(
    type: DataTypeId, 
    subjectId: string, 
    dataId: string, 
    data: Pick<T, D>
    ): Promise<void> => {
    switch (type) {
        case 'exam':    return updateExam(subjectId, dataId, data as unknown as ExamModel);
        case 'task':    return updateTask(subjectId, dataId, data as unknown as TaskModel);
        case 'event':   return updateEvent(subjectId, dataId, data as unknown as EventModel);
    }
}

interface AllDataModel {
    [id: string]: SubjectDataModel,
}
interface StateModel {
    loading:    boolean;
    saving: boolean;
    error:      string | null;
    data: AllDataModel;
    dataChanged: Set<string>; // set of ids
    hasEmptyTitle: boolean;
}
const initialState: StateModel = {
    loading: true,
    saving: false,
    error: null,
    data: {},
    dataChanged: new Set(),
    hasEmptyTitle: false,
};

interface ActionModel {
    type: string;
}

const ACTION_START_FETCH_REQUEST = 'START_FETCH_REQUEST';
const ACTION_START_SAVE_REQUEST = 'START_SAVE_REQUEST';
const ACTION_END_REQUEST = 'END_REQUEST';
const ACTION_SET_ALL_DATA_AFTER_REQUEST = 'SET_ALL_DATA_AFTER_REQUEST';
const ACTION_SET_DATA_AFTER_REQUEST = 'SET_DATA_AFTER_REQUEST';
const ACTION_ADD_DATA_AFTER_REQUEST = 'ADD_DATA_AFTER_REQUEST';
const ACTION_SET_ERROR_AFTER_REQUEST = 'SET_ERROR_AFTER_REQUEST';
const ACTION_REMOVE_DATA_AFTER_REQUEST = 'REMOVE_DATA_AFTER_REQUEST';
const ACTION_SET_DATA_PROPERTY = 'SET_DATA_PROPERTY';
const ACTION_ADD_NEW = 'ADD_NEW';
const ACTION_REMOVE_DATUM = 'REMOVE_DATUM';
const ACTION_REPLACE_ID = 'REPLACE_ID';
const ACTION_RESET_CHANGED = 'RESET_CHANGED';

interface ResetChangedActionModel extends ActionModel {
    datumIds: string[];
}
const resetChanged = (datumIds: string[]): ResetChangedActionModel => {
    return {
        type: ACTION_RESET_CHANGED,
        datumIds,
    };
}


interface ReplaceIdActionModel extends ActionModel {
    oldId: string;
    newId: string;
}
const replaceId = (oldId: string, newId: string): ReplaceIdActionModel => {
    return {
        type: ACTION_REPLACE_ID,
        oldId,
        newId,
    };
}

interface RemoveDatumActionModel extends ActionModel {
    dataId: string;
}
const removeDatum = (datumId: string): RemoveDatumActionModel => {
    return {
        type: ACTION_REMOVE_DATUM,
        dataId: datumId,
    };
}

interface AddNewActionModel<T extends SubjectDataModel> extends ActionModel {
    count: number;
    initialValue: T;
}
const addNew = <T extends SubjectDataModel>(curCount: number, initialValue: T): AddNewActionModel<T> => {
    return {
        type: ACTION_ADD_NEW,
        count: curCount,
        initialValue,
    };
}

interface RemoveDataActionModel extends ActionModel {
    dataId: string;
}
const removeDataAfterRequest = (dataId: string): RemoveDataActionModel => {
    return {
        type: ACTION_REMOVE_DATA_AFTER_REQUEST,
        dataId,
    };
}

interface SetAllDataActionModel extends ActionModel {
    allData: AllDataModel,
}
const setAllDataAfterRequest = (allData: AllDataModel): SetAllDataActionModel => {
    return {
        type: ACTION_SET_ALL_DATA_AFTER_REQUEST,
        allData,
    };
}

interface SetDataActionModel extends ActionModel {
    data: SubjectDataModel;
    dataId: string;
}
const setDataAfterRequest = (data: SubjectDataModel, id: string): SetDataActionModel => {
    return {
        type: ACTION_SET_DATA_AFTER_REQUEST,
        data,
        dataId: id,
    };
}

interface AddDataActionModel extends ActionModel {
    data: SubjectDataModel;
    dataId: string;
    localId: string;
}
const addDataAfterRequest = (data: SubjectDataModel, localId: string, newId: string): AddDataActionModel => {
    return {
        type: ACTION_ADD_DATA_AFTER_REQUEST,
        data,
        dataId: newId,
        localId,
    };
}

interface SetErrorActionModel extends ActionModel {
    error: string;
}
const setError = (error: string): SetErrorActionModel =>{
    return {
        type: ACTION_SET_ERROR_AFTER_REQUEST,
        error,
    };
}
interface SetDataPropertyActionModel<T extends object> extends ActionModel {
    dataId: string;
    key: keyof T;
    value: any; //ToDo find type for this
}
const setDataProperty = <T extends SubjectDataModel>(dataId: string, key: keyof T, value: any): SetDataPropertyActionModel<T> => {
    return {
        type: ACTION_SET_DATA_PROPERTY,
        dataId,
        key,
        value
    };
}

const hasEmptyTitle = (data: AllDataModel): boolean => {
    for (const key in data) {
        if (!data[key].type) {
            return true;
        }
    }
    return false;
}

const reducer = <T extends SubjectDataModel>(state: StateModel, action: ActionModel): StateModel => {
    
    let changedIds: Set<string>;
    let dataId: string;
    let data: SubjectDataModel;
    let changedData: AllDataModel;
    switch (action.type) {
        case ACTION_START_FETCH_REQUEST: return {
            ...state,
            loading: true,
            error: null,
        };
        case ACTION_START_SAVE_REQUEST: return {
            ...state,
            saving: true,
            error: null,
        };
        case ACTION_END_REQUEST: return {
            ...state,
            saving: false,
            loading: false,
        };
        case ACTION_SET_ALL_DATA_AFTER_REQUEST: return {
            ...state,
            loading: false,
            error: null,
            data: (action as unknown as SetAllDataActionModel).allData,
            dataChanged: new Set(),
            hasEmptyTitle: hasEmptyTitle((action as unknown as SetAllDataActionModel).allData),
        };
        case ACTION_SET_DATA_AFTER_REQUEST: 
            dataId = (action as unknown as SetDataActionModel).dataId;
            data = (action as unknown as SetDataActionModel).data;
            changedIds = new Set(state.dataChanged);
            changedIds.delete(dataId);
            changedData = {
                ...state.data,
                [dataId]: data,
            };
            return {
                ...state,
                loading: false,
                error: null,
                data: changedData,
                dataChanged: changedIds,
                hasEmptyTitle: hasEmptyTitle(changedData),
            };
        case ACTION_ADD_DATA_AFTER_REQUEST:
            dataId = (action as unknown as AddDataActionModel).dataId;
            data = (action as unknown as AddDataActionModel).data;
            changedIds = new Set(state.dataChanged);
            changedIds.delete((action as unknown as AddDataActionModel).localId);
            changedData = {
                ...state.data,
                [dataId]: data,
            };
            return {
                ...state,
                saving: false,
                error: null,
                data: changedData,
                dataChanged: changedIds,
                hasEmptyTitle: hasEmptyTitle(changedData),
            }
        case ACTION_SET_ERROR_AFTER_REQUEST: return {
            ...state,
            data: { ...state.data },
            error: (action as unknown as SetErrorActionModel).error,
            loading: false,
            saving: false,
        };
        case ACTION_REMOVE_DATA_AFTER_REQUEST: 
            changedIds = new Set(state.dataChanged);
            changedIds.delete((action as unknown as RemoveDataActionModel).dataId);
            changedData = removeKey(
                (action as unknown as RemoveDataActionModel).dataId,
                state.data
            ) as AllDataModel;
            return {
                ...state,
                error: null,
                dataChanged: changedIds,
                saving: false,
                data: changedData,
                hasEmptyTitle: hasEmptyTitle(changedData),
            };
        case ACTION_SET_DATA_PROPERTY: 
            if (!state.data) return state;
            dataId = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).dataId;
            const key = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).key;
            const value = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).value;
            changedIds = new Set(state.dataChanged);
            changedIds.add(dataId);

            changedData = {
                ...state.data,
                [dataId]: {
                    ...state.data[dataId],
                    [key]: value,
                }
            };
            return {
                ...state,
                data: changedData,
                dataChanged: changedIds,
                hasEmptyTitle: hasEmptyTitle(changedData),
            };
        case ACTION_ADD_NEW:
            const addNewAction = (action as unknown as AddNewActionModel<T>);
            changedIds = new Set(state.dataChanged);
            const newId = getNewIdfor(addNewAction.count);
            changedIds.add(newId);
            changedData = {
                [newId]: addNewAction.initialValue,
                ...state.data,
            };
            return {
                ...state,
                dataChanged: changedIds,
                data: changedData,
                hasEmptyTitle: hasEmptyTitle(changedData),
            };
        case ACTION_REMOVE_DATUM:
            const removeAction = (action as unknown as RemoveDatumActionModel);
            changedIds = new Set(state.dataChanged);
            if (removeAction.dataId.startsWith('NEW_')) changedIds.delete(removeAction.dataId);
            else changedIds.add(removeAction.dataId);
            changedData = removeKey(
                removeAction.dataId,
                state.data
            ) as AllDataModel;
            return {
                ...state,
                dataChanged: changedIds,
                data: changedData,
                hasEmptyTitle: hasEmptyTitle(changedData),
            };
        case ACTION_REPLACE_ID:
            const replaceAction = (action as unknown as ReplaceIdActionModel);
            const allData = {...state.data};
            const toRenameData = allData[replaceAction.oldId];
            delete allData[replaceAction.oldId];
            allData[replaceAction.newId] = toRenameData;
            changedIds = new Set(state.dataChanged);
            if (changedIds.has(replaceAction.oldId)) {
                changedIds.delete(replaceAction.oldId);
                changedIds.add(replaceAction.newId);
            }
            return {
                ...state,
                data: allData,
                dataChanged: changedIds,
            };
        case ACTION_RESET_CHANGED:
            const resetAction = (action as unknown as ResetChangedActionModel);
            changedIds = new Set(state.dataChanged);
            resetAction.datumIds.forEach(id => changedIds.delete(id));
            return {
                ...state,
                dataChanged: changedIds,
            };
        default: throw Error('Should not be reached!');
    }
}

// ToDo find better way to type this (or implement this more efficiently)
const mapDataArrayToObject = (dataTypeId: DataTypeId, dataArray: Array<SubjectDataModel>): AllDataModel => {
    const out: AllDataModel = {};
    
    switch (dataTypeId) {
        case 'event':
            dataArray.forEach(datum => {
                const event: EventModelWithId = (datum as EventModelWithId);
                const data: EventModel = {
                    type: event.type,
                    firstStart: event.firstStart,
                    firstEnd: event.firstEnd,
                    endAt: event.endAt,
                    interval: event.interval,
                    timeCreated: event.timeCreated,
                    exclusions: event.exclusions,
                    additionalInfo: event.additionalInfo,
                };
                out[event.id] = data;
            });
            break;
        case 'exam':
            dataArray.forEach(datum => {
                const exam: ExamModelWithId = (datum as ExamModelWithId);
                const data: ExamModel = {
                    type: exam.type,
                    start: exam.start,
                    timeCreated: exam.timeCreated,
                    additionalInfo: exam.additionalInfo,
                    grade: exam.grade,
                    gradeWeight: exam.gradeWeight,
                };
                out[exam.id] = data;
            });
            break;
        case 'task':
            dataArray.forEach(datum => {
                const task: TaskModelWithId = (datum as TaskModelWithId);
                const data: TaskModel = {
                    type: task.type,
                    timestamps: task.timestamps,
                    timestampsDone: task.timestampsDone,
                    tasksTickedAt: task.tasksTickedAt,
                    timeCreated: task.timeCreated,
                    star: task.star,
                    reminder: task.reminder,
                    additionalInfo: task.additionalInfo,
                    deleted: task.deleted,
                    exclusions: task.exclusions,
                    notifications: task.notifications,
                };
                out[task.id] = data;
            });
            break;
    }

    return out;
}

const mapDataObjectToArray = (dataTypeId: DataTypeId, dataObject: AllDataModel, subjectId: string): Array<SubjectDataModelWithId> => {
    const out: Array<SubjectDataModelWithId> = [];

    switch (dataTypeId) {
        case 'event':
            for (const id in dataObject) {
                const datum = (dataObject[id] as EventModel);
                const data: EventModelWithId = {
                    id,
                    subjectId,
                    type: datum.type,
                    firstStart: datum.firstStart,
                    firstEnd: datum.firstEnd,
                    endAt: datum.endAt,
                    interval: datum.interval,
                    timeCreated: datum.timeCreated,
                    exclusions: datum.exclusions,
                    additionalInfo: datum.additionalInfo,
                };
                out.push(data);
            }
            return (out as EventModelWithId[]).sort((d1, d2) => (
                !d1.type && d2.type ? -1
                    : d1.type && !d2.type ? 1
                        : d1.firstStart.seconds > d2.firstStart.seconds ? 1
                            : d1.firstStart.seconds === d2.firstStart.seconds 
                                ? ( d1.type > d2.type ? 1 : d1.type === d2.type ? 0 : -1 )
                                : -1
            ));
        case 'exam':
            for (const id in dataObject) {
                const datum = (dataObject[id] as ExamModel);
                const data: ExamModelWithId = {
                    id,
                    subjectId,
                    type: datum.type,
                    start: datum.start,
                    timeCreated: datum.timeCreated,
                    additionalInfo: datum.additionalInfo,
                    grade: datum.grade,
                    gradeWeight: datum.gradeWeight,
                };
                out.push(data);
            }
            return (out as ExamModelWithId[]).sort((d1, d2) => (
                !d1.type && d2.type ? -1
                    : d1.type && !d2.type ? 1
                        : d1.start && !d2.start ? 1
                            : d2.start && !d1.start ? -1
                                : !d1.start || !d2.start ? (d1.type > d2.type ? 1 : d1.type === d2.type ? 0 : -1)
                                    : (d1.start.seconds > d2.start.seconds ? 1 : (d1.start.seconds === d2.start.seconds ? (d1.type > d2.type ? 1 : d1.type === d2.type ? 0 : -1) : -1))                
            ));
        case 'task':
            for (const id in dataObject) {
                const datum = (dataObject[id] as TaskModel);
                const data: TaskModelWithId = {
                    id,
                    subjectId,
                    type: datum.type,
                    timestamps: datum.timestamps,
                    timestampsDone: datum.timestampsDone,
                    tasksTickedAt: datum.tasksTickedAt,
                    timeCreated: datum.timeCreated,
                    star: datum.star,
                    reminder: datum.reminder,
                    additionalInfo: datum.additionalInfo,
                    deleted: datum.deleted,
                    exclusions: datum.exclusions,
                    notifications: datum.notifications,
                };
                out.push(data);
            }
            return out.sort((d1, d2) => (
                d1.timeCreated && !d2.timeCreated ? 1
                    : d2.timeCreated && !d1.timeCreated ? -1
                        : !d1.timeCreated || !d2.timeCreated ? 0
                            : d2.timeCreated.seconds - d1.timeCreated.seconds
            ));
    }
    return out;
}

const getNewIdfor = (count: number): string => {
    return 'NEW_' + count;
}

const useSubjectData = <T extends SubjectDataModel>(
    dataTypeId: DataTypeId,
    subjectId: string,
    initialData: SubjectDataModel[] | null,
) => {

    const initialStateWithData: StateModel = useMemo(() => ({
        ...initialState,
        data: initialData ? mapDataArrayToObject(dataTypeId, initialData) : {},
        loading: initialData ? false : true,
        hasEmptyTitle: !initialData || initialData.length === 0 ? false : initialData.every(val => val.type) ? false : true, // check for empty title
    }), [dataTypeId, initialData]);

    const [state, dispatch] = useReducer(reducer, initialStateWithData);

    const [newDataId, setNewDataId] = useState(0);

    const fetchAllData = useCallback((): void => {

        dispatch({type: ACTION_START_FETCH_REQUEST});

        g_fetchAllData(dataTypeId, subjectId)
            .then(dataArray => {
                dispatch(setAllDataAfterRequest(
                    mapDataArrayToObject(dataTypeId, dataArray)
                ));
            })
            .catch(error => {
                dispatch(setError(error.message));
            });

    }, [dataTypeId, subjectId]);

    const fetchData = useCallback((dataId: string): void => {

        dispatch({ type: ACTION_START_FETCH_REQUEST });

        g_fetchData(dataTypeId, subjectId, dataId)
            .then(datum => {
                dispatch(setDataAfterRequest(
                    (removeKey('id', datum) as T), 
                    datum.id
                ));
            })
            .catch(error => {
                dispatch(setError(error.message));
            })

    }, [dataTypeId, subjectId]);

    const deleteData = useCallback(async (dataId: string): Promise<void> => {

        dispatch({ type: ACTION_START_SAVE_REQUEST });

        try {
            await g_deleteData(dataTypeId, subjectId, dataId)
            dispatch(removeDataAfterRequest(dataId));
        } catch (error) {
            dispatch(setError(error.message));
            throw new Error(error);
        }
    }, [dataTypeId, subjectId]);

    const updateData = useCallback(<D extends keyof T>(dataId: string, data: Pick<T, D>) => {

        dispatch({ type: ACTION_START_SAVE_REQUEST });

        g_updateData(dataTypeId, subjectId, dataId, data)
            .then(() => {
                for (const key in data) {
                    dispatch(setDataProperty<T>(dataId, key, data[key]));
                }
            })
            .catch(error => {
                dispatch(setError(error.message));
            })

    }, [dataTypeId, subjectId]);

    const addData = useCallback((data: T, localId: string): void => {

        dispatch({type: ACTION_START_SAVE_REQUEST});

        g_addData<T>(dataTypeId, subjectId, data)
            .then(newId => {
                dispatch(addDataAfterRequest(data, localId, newId));
            })
            .catch(error => {
                dispatch(setError(error.message));
            });

    }, [dataTypeId, subjectId]);

    const updateValue = useCallback((dataId: string, key: keyof T, value: any) => {
        dispatch(setDataProperty(dataId, key, value));
    }, []);

    const addNewDatum = useCallback((initialValue: T): string => {
        dispatch(addNew(newDataId, initialValue));
        setNewDataId(prev => prev + 1);
        return getNewIdfor(newDataId);
    }, [newDataId]);

    const remove = useCallback((datumId: string): void => {
        dispatch(removeDatum(datumId));
    }, []);

    const saveChanges = useCallback((newSubjectId: string | undefined = undefined): void => {
        dispatch({ type: ACTION_START_SAVE_REQUEST });

        const ids = Object.keys(state.data);

        const allRequests = (): Promise<string|void>[] => {
            const out = [];
            for (const datumId of ids) {
                if (state.dataChanged.has(datumId)) {
                    if (datumId.startsWith('NEW_')) {
                        out.push(g_addData(dataTypeId, newSubjectId || subjectId, state.data[datumId]));
                    } else {
                        out.push(g_updateData(dataTypeId, newSubjectId || subjectId, datumId, state.data[datumId]));
                    }
                }
            }
            return out;
        }


        Promise.all(allRequests())
            .then(results => {
                results.forEach((newId, idx) => {
                    if (newId) { // add new operation
                        dispatch(replaceId(ids[idx], newId));
                        dispatch(resetChanged([newId]));
                    } else { // update operation
                        dispatch(resetChanged([ids[idx]]));
                    }
                })
                dispatch({ type: ACTION_END_REQUEST });
            })
            .catch(error => {
                dispatch(setError(error));
            });

    }, [dataTypeId, state.data, state.dataChanged, subjectId]);

    const hasEmptyTitle = useCallback((): boolean => state.hasEmptyTitle, [state.hasEmptyTitle]);

    return {
        fetchAllData,
        fetchData,
        deleteData,
        updateData,
        addData,
        addNewDatum,
        updateValue,
        remove,
        saveChanges,
        hasEmptyTitle,
        data: {
            loading: state.loading,
            saving: state.saving,
            error: state.error,
            changed: state.dataChanged,
            items: mapDataObjectToArray(dataTypeId, state.data, subjectId),
        },
    };

};

export default useSubjectData;