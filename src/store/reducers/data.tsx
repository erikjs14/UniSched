import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { DataState } from './data.d';
import { BaseActionCreator, FetchTasksAC, FetchTasksFailAC, SetTasksLocallyAC, DataSetErrorAC, FetchExamsSuccessAC, FetchExamsFailAC, RefreshTasksAC, FetchTasksSuccessAC, FetchExamsAC } from '../actions/data.d';
import { ExamModelWithId } from '../../firebase/model';
import { getAllConfigFromExams } from '../../util/scheduleUtil';
import { findColorConfig } from '../../config/colorChoices';
import { SubjectModelWithId } from './../../firebase/model';

const initialState: DataState = {
    tasks: {
        data: null,
        loading: true,
        refreshing: false,
        error: null,
    },
    exams: {
        dataPerSubject: null,
        config: null,
        loading: true,
        refreshing: false,
        error: null,
    }
};

export default (state: DataState = initialState, action: BaseActionCreator) => {
    switch (action.type) {
        case actionTypes.FETCH_TASKS: return fetchTasks(state, action as FetchTasksAC);
        case actionTypes.REFRESH_TASKS: return refreshTasks(state, action as RefreshTasksAC);
        case actionTypes.FETCH_TASKS_SUCCESS: return fetchTasksSuccess(state, action as FetchTasksSuccessAC);
        case actionTypes.FETCH_TASKS_FAIL: return fetchTasksFail(state, action as FetchTasksFailAC);
        case actionTypes.SET_TASKS_LOCALLY: return setTasksLocally(state, action as SetTasksLocallyAC);
        case actionTypes.DATA_SET_ERROR: return dataSetError(state, action as DataSetErrorAC);
        case actionTypes.FETCH_EXAMS: return fetchExams(state, action as FetchExamsAC);
        case actionTypes.FETCH_EXAMS_SUCCESS: return fetchExamsSuccess(state, action as FetchExamsSuccessAC);
        case actionTypes.FETCH_EXAMS_FAIL: return fetchExamsFail(state, action as FetchExamsFailAC);
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

const fetchExams = (state: DataState, action: FetchExamsAC): DataState => {
    return updateObject(state, {
        exams: updateObject(state.exams, {
            loading: true,
        }),
    });
};

const fetchExamsSuccess = (state: DataState, action: FetchExamsSuccessAC): DataState => {
    return updateObject(state, {
        exams: updateObject(state.exams, {
            data: action.examsPerSubject,
            config: mapExamsPerSubjectToConfig(action.examsPerSubject, action.subjects),
            loading: false,
            refreshing: false,
            error: null,
        }),
    });
};

const fetchExamsFail = (state: DataState, action: FetchExamsFailAC): DataState => {
    return updateObject(state, {
        exams: updateObject(state.exams, {
            data: null,
            config: null,
            loading: false,
            refreshing: false,
            error: action.error,
        }),
    });
};


const mapExamsPerSubjectToConfig = (examsPerSubject: ExamModelWithId[][], subjects: SubjectModelWithId[]): object[] => {
    let newExamsConfig: object[] = [];
    examsPerSubject.forEach((exams, idx) => {
        newExamsConfig = [
            ...newExamsConfig,
            ...getAllConfigFromExams(exams).map(conf => ({
                ...conf,
                title: '[' + subjects[idx].name.toUpperCase() + '] ' + conf.title,
                backgroundColor: findColorConfig(subjects[idx].color).value,
                end: '', // unset end
            })),
        ];
    });
    return newExamsConfig;
}