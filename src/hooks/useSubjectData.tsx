import { useReducer, useCallback } from 'react';
import { SubjectDataModel, ExamModel, TaskModel, EventModel, ModelWithId, ExamModelWithId, EventModelWithId, TaskModelWithId } from './../firebase/model';
import { fetchExams, fetchEvents, fetchTasks, fetchExam, fetchEvent, fetchTask, addExam, addTask, addEvent, updateExam, updateTask, updateEvent, deleteExam, deleteTask, deleteEvent } from './../firebase/firestore';
import { removeKey } from './../util/util';

type DataTypeId = 'exam' | 'task' | 'event';

const g_fetchAllData = (type: DataTypeId, subjectId: string): Promise<ModelWithId[]> => {
    switch (type) {
        case 'exam':    return fetchExams(subjectId);
        case 'task':    return fetchTasks(subjectId);
        case 'event':   return fetchEvents(subjectId);
    }
}
const g_fetchData = (type: DataTypeId, subjectId: string, dataId: string): Promise<ModelWithId> => {
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
    error:      string | null;
    data: AllDataModel,
    dataChanged: boolean;
}
const initialState: StateModel = {
    loading: false,
    error: null,
    data: {},
    dataChanged: false,
};

interface ActionModel {
    type: string;
}

const ACTION_START_REQUEST = 'START_REQUEST';
const ACTION_SET_ALL_DATA_AFTER_REQUEST = 'SET_ALL_DATA_AFTER_REQUEST';
const ACTION_SET_DATA_AFTER_REQUEST = 'SET_DATA_AFTER_REQUEST';
const ACTION_ADD_DATA_AFTER_REQUEST = 'ADD_DATA_AFTER_REQUEST';
const ACTION_SET_ERROR_AFTER_REQUEST = 'SET_ERROR_AFTER_REQUEST';
const ACTION_REMOVE_DATA_AFTER_REQUEST = 'REMOVE_DATA_AFTER_REQUEST';
const ACTION_SET_DATA_CHANGED = 'SET_DATA_CHANGED';
const ACTION_RESET_DATA_CHANGED = 'RESET_DATA_CHANGED';
const ACTION_SET_DATA_PROPERTY = 'SET_DATA_PROPERTY';

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
}
const addDataAfterRequest = (data: SubjectDataModel, id: string): AddDataActionModel => {
    return {
        type: ACTION_ADD_DATA_AFTER_REQUEST,
        data,
        dataId: id,
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

const reducer = (state: StateModel, action: ActionModel): StateModel => {
    switch (action.type) {
        case ACTION_START_REQUEST: return {
            ...state,
            loading: true,
            error: null,
        };
        case ACTION_SET_ALL_DATA_AFTER_REQUEST: return {
            ...state,
            loading: false,
            error: null,
            data: (action as unknown as SetAllDataActionModel).allData,
            dataChanged: false,
        };
        case ACTION_SET_DATA_AFTER_REQUEST: 
            let dataId = (action as unknown as SetDataActionModel).dataId;
            let data = (action as unknown as SetDataActionModel).data;
            return {
                ...state,
                loading: false,
                error: null,
                data: {
                    ...state.data,
                    [dataId]: data,
                },
                dataChanged: false,
            };
        case ACTION_ADD_DATA_AFTER_REQUEST:
            dataId = (action as unknown as AddDataActionModel).dataId;
            data = (action as unknown as AddDataActionModel).data;
            return {
                ...state,
                loading: false,
                error: null,
                data: {
                    ...state.data,
                    [dataId]: data,
                },
                dataChanged: false,
            }
        case ACTION_SET_ERROR_AFTER_REQUEST: return {
            ...state,
            data: { ...state.data },
            error: (action as unknown as SetErrorActionModel).error,
            loading: false,
        };
        case ACTION_REMOVE_DATA_AFTER_REQUEST: return {
            ...state,
            loading: false,
            error: null,
            dataChanged: false,
            data: (removeKey(
                (action as unknown as RemoveDataActionModel).dataId,
                state.data
            ) as AllDataModel),
        };
        case ACTION_SET_DATA_CHANGED: 
            if (!state.data) return state;
            return {
                ...state,
                data: { ...state.data },
                dataChanged: true,
            };
        case ACTION_RESET_DATA_CHANGED:
            if (!state.data) return state;
            return {
                ...state,
                data: { ...state.data },
                dataChanged: true,
            };
        case ACTION_SET_DATA_PROPERTY: 
            if (!state.data) return state;
            dataId = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).dataId;
            const key = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).key;
            const value = (action as unknown as SetDataPropertyActionModel<SubjectDataModel>).value;
            return {
                ...state,
                data: {
                    ...state.data,
                    [dataId]: {
                        ...state.data[dataId],
                        [key]: value,
                    }
                },
                dataChanged: true,
            };
        default: throw Error('Should not be reached!');
    }
}

// ToDo find better way to type this (or implement this more efficiently)
const mapDataArrayToObject = (dataTypeId: DataTypeId, dataArray: Array<ModelWithId>): AllDataModel => {
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
                };
                out[task.id] = data;
            });
            break;
    }

    return out;
}

const mapDataObjectToArray = (dataTypeId: DataTypeId, dataObject: AllDataModel): Array<ModelWithId> => {
    const out: Array<ModelWithId> = [];

    switch (dataTypeId) {
        case 'event':
            for (const id in dataObject) {
                const datum = (dataObject[id] as EventModel);
                const data: EventModelWithId = {
                    id,
                    type: datum.type,
                    firstStart: datum.firstStart,
                    firstEnd: datum.firstEnd,
                    endAt: datum.endAt,
                    interval: datum.interval,
                };
                out.push(data);
            }
            break;
        case 'exam':
            for (const id in dataObject) {
                const datum = (dataObject[id] as ExamModel);
                const data: ExamModelWithId = {
                    id,
                    type: datum.type,
                    start: datum.start,
                };
                out.push(data);
            }
            break;
        case 'task':
            for (const id in dataObject) {
                const datum = (dataObject[id] as TaskModel);
                const data: TaskModelWithId = {
                    id,
                    type: datum.type,
                    timestamps: datum.timestamps,
                    timestampsDone: datum.timestampsDone,
                };
                out.push(data);
            }
            break;
    }

    return out;
}

const useSubjectData = <T extends SubjectDataModel>(
    dataTypeId: DataTypeId,
    subjectId: string,
) => {

    const [state, dispatch] = useReducer(reducer, initialState);

    const fetchAllData = useCallback((): void => {

        dispatch({type: ACTION_START_REQUEST});

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

        dispatch({ type: ACTION_START_REQUEST });

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

    const deleteData = useCallback((dataId: string): void => {

        dispatch({ type: ACTION_START_REQUEST });

        g_deleteData(dataTypeId, subjectId, dataId)
            .then(() => {
                dispatch(removeDataAfterRequest(dataId));
            })
            .catch(error => {
                dispatch(setError(error.message));
            });

    }, [dataTypeId, subjectId]);

    const updateData = useCallback(<D extends keyof T>(dataId: string, data: Pick<T, D>) => {

        dispatch({ type: ACTION_START_REQUEST });

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

    const addData = useCallback((data: T): void => {

        dispatch({type: ACTION_START_REQUEST});

        g_addData<T>(dataTypeId, subjectId, data)
            .then(newId => {
                dispatch(addDataAfterRequest(data, newId));
            })
            .catch(error => {
                dispatch(setError(error.message));
            });

    }, [dataTypeId, subjectId]);

    return {
        fetchAllData,
        fetchData,
        deleteData,
        updateData,
        addData,
        data: {
            loading: state.loading,
            error: state.error,
            changed: state.dataChanged,
            items: mapDataObjectToArray(dataTypeId, state.data),
        },
    };

};

export default useSubjectData;