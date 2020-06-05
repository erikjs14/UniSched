import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { DataState } from './data.d';
import { BaseActionCreator, FetchTasksAC, FetchTasksFailAC, SetTasksLocallyAC, DataSetErrorAC } from '../actions/data.d';
import { FetchTasksSuccessAC, RefreshTasksAC } from './../actions/data.d';

const initialState: DataState = {
    tasks: {
        data: null,
        loading: false,
        refreshing: false,
        error: null,
    },
};

export default (state: DataState = initialState, action: BaseActionCreator) => {
    switch (action.type) {
        case actionTypes.FETCH_TASKS: return fetchTasks(state, action as FetchTasksAC);
        case actionTypes.REFRESH_TASKS: return refreshTasks(state, action as RefreshTasksAC);
        case actionTypes.FETCH_TASKS_SUCCESS: return fetchTasksSuccess(state, action as FetchTasksSuccessAC);
        case actionTypes.FETCH_TASKS_FAIL: return fetchTasksFail(state, action as FetchTasksFailAC);
        case actionTypes.SET_TASKS_LOCALLY: return setTasksLocally(state, action as SetTasksLocallyAC);
        case actionTypes.DATA_SET_ERROR: return dataSetError(state, action as DataSetErrorAC);
        default: return state;
    }
}

const fetchTasks = (state: DataState, action: FetchTasksAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            loading: true,
        }),
    });
};

const refreshTasks = (state: DataState, action: RefreshTasksAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            refreshing: true,
        }),
    });
};

const fetchTasksSuccess = (state: DataState, action: FetchTasksSuccessAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            loading: false,
            refreshing: false,
            error: null,
            data: action.tasks,
        }),
    });
};

const fetchTasksFail = (state: DataState, action: FetchTasksFailAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            loading: false,
            refreshing: false,
            error: action.error,
            data: null,
        }),
    });
};

const setTasksLocally = (state: DataState, action: SetTasksLocallyAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            data: action.tasks,
        })
    });
};

const dataSetError = (state: DataState, action: DataSetErrorAC): DataState => {
    return updateObject(state, {
        [action.at]: updateObject(state[action.at], {
            error: action.error,
        })
    });
};