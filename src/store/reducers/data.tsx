import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { DataState } from './data.d';
import { BaseActionCreator, FetchTasksAC, FetchTasksFailAC, SetTasksLocallyAC, DataSetErrorAC, FetchExamsSuccessAC, FetchExamsFailAC, RefreshTasksAC, FetchTasksSuccessAC, FetchExamsAC, FetchEventsAC, FetchEventsSuccessAC, FetchEventsFailAC, RefreshExamsAC, RefreshEventsAC, ForceRefreshAC, AddAndSaveNewTaskAC, AddAndSaveNewTaskFailAC, AddAndSaveNewTaskSuccessAC, RemoveTaskLocallyAC, RemoveEventLocallyAC, RemoveExamLocallyAC } from '../actions/data.d';
import { ExamModelWithId, EventModelWithId } from '../../firebase/model';
import { getAllConfigFromExams, getAllConfigFromEvents, ConfigType } from '../../util/scheduleUtil';
import { findColorConfig } from '../../config/colorChoices';
import { SubjectModelWithId } from './../../firebase/model';

const initialState: DataState = {
    tasks: {
        data: null,
        loading: true,
        refreshing: false,
        error: null,
        timestamp: 0,
    },
    exams: {
        dataPerSubject: null,
        config: null,
        loading: true,
        refreshing: false,
        error: null,
        timestamp: 0,
    },
    events: {
        dataPerSubject: null,
        config: null,
        loading: true,
        refreshing: false,
        error: null,
        timestamp: 0,
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
        case actionTypes.REFRESH_EXAMS: return refreshExams(state, action as RefreshExamsAC);
        case actionTypes.FETCH_EXAMS_SUCCESS: return fetchExamsSuccess(state, action as FetchExamsSuccessAC);
        case actionTypes.FETCH_EXAMS_FAIL: return fetchExamsFail(state, action as FetchExamsFailAC);
        case actionTypes.FETCH_EVENTS: return fetchEvents(state, action as FetchEventsAC);
        case actionTypes.REFRESH_EVENTS: return refreshEvents(state, action as RefreshEventsAC);
        case actionTypes.FETCH_EVENTS_SUCCESS: return fetchEventsSuccess(state, action as FetchEventsSuccessAC);
        case actionTypes.FETCH_EVENTS_FAIL: return fetchEventsFail(state, action as FetchEventsFailAC);
        case actionTypes.FORCE_REFRESH: return forceRefresh(state, action as ForceRefreshAC);
        case actionTypes.ADD_AND_SAVE_NEW_TASK: return addAndSaveNewTask(state, action as AddAndSaveNewTaskAC);
        case actionTypes.ADD_AND_SAVE_NEW_TASK_SUCCESS: return addAndSaveNewTaskSuccess(state, action as AddAndSaveNewTaskSuccessAC);
        case actionTypes.ADD_AND_SAVE_NEW_TASK_FAIL: return addAndSaveNewTaskFail(state, action as AddAndSaveNewTaskFailAC);
        case actionTypes.REMOVE_TASK_LOCALLY: return removeTaskLocally(state, action as RemoveTaskLocallyAC);
        case actionTypes.REMOVE_EVENT_LOCALLY: return removeEventLocally(state, action as RemoveEventLocallyAC);
        case actionTypes.REMOVE_EXAM_LOCALLY: return removeExamLocally(state, action as RemoveExamLocallyAC);
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
            timestamp: Date.now(),
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

const refreshExams = (state: DataState, action: RefreshExamsAC): DataState => {
    return updateObject(state, {
        exams: updateObject(state.exams, {
            refreshing: true,
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
            timestamp: Date.now(),
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

const fetchEvents = (state: DataState, action: FetchEventsAC): DataState => {
    return updateObject(state, {
        events: updateObject(state.events, {
            loading: true,
        }),
    });
};

const refreshEvents = (state: DataState, action: RefreshEventsAC): DataState => {
    return updateObject(state, {
        events: updateObject(state.events, {
            refreshing: true,
        }),
    });
};

const fetchEventsSuccess = (state: DataState, action: FetchEventsSuccessAC): DataState => {
    return updateObject(state, {
        events: updateObject(state.events, {
            data: action.eventsPerSubject,
            config: mapEventsPerSubjectToConfig(action.eventsPerSubject, action.subjects),
            loading: false,
            refreshing: false,
            error: null,
            timestamp: Date.now(),
        }),
    });
};

const fetchEventsFail = (state: DataState, action: FetchEventsFailAC): DataState => {
    return updateObject(state, {
        events: updateObject(state.events, {
            data: null,
            config: null,
            loading: false,
            refreshing: false,
            error: action.error,
        }),
    });
};

const forceRefresh = (state: DataState, action: ForceRefreshAC): DataState => {
    const dataField: keyof DataState = action.dataTypeId+'s' as keyof DataState;
    return updateObject(state, {
        [dataField]: updateObject(state[dataField], {
            timestamp: 0,
        }),
    });
};

const addAndSaveNewTask = (state: DataState, action: AddAndSaveNewTaskAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            loading: true,
        }),
    });
};

const addAndSaveNewTaskSuccess = (state: DataState, action: AddAndSaveNewTaskSuccessAC): DataState => {
    if (state.tasks.data) {
        return updateObject(state, {
            tasks: updateObject(state.tasks, {
                loading: false,
                error: null,
                data: [
                    ...state.tasks.data,
                    action.task,
                ],
            }),
        });
    } else {
        return updateObject(state, {
            tasks: updateObject(state.tasks, {
                loading: false,
                error: null,
                data: [
                    action.task,
                ],
            }),
        });
    }
};

const addAndSaveNewTaskFail = (state: DataState, action: AddAndSaveNewTaskFailAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            loading: false,
            error: action.error,
        }),
    });
};

const removeTaskLocally = (state: DataState, action: RemoveTaskLocallyAC): DataState => {
    return updateObject(state, {
        tasks: updateObject(state.tasks, {
            data: state.tasks.data?.filter(t => t.id !== action.taskId),
        }),
    });
};

const removeEventLocally = (state: DataState, action: RemoveEventLocallyAC): DataState => {
    return updateObject(state, {
        events: updateObject(state.events, {
            dataPerSubject: state.events.dataPerSubject?.filter(e => e.id !== action.eventId),
        }),
    });
};

const removeExamLocally = (state: DataState, action: RemoveExamLocallyAC): DataState => {
    return updateObject(state, {
        exams: updateObject(state.exams, {
            dataPerSubject: state.exams.dataPerSubject?.map(exams => exams.filter(e => e.id !== action.examId)),
        }),
    });
};

export interface ExamConfigType extends ConfigType {backgroundColor: string}
const mapExamsPerSubjectToConfig = (examsPerSubject: ExamModelWithId[][], subjects: SubjectModelWithId[]): ExamConfigType[] => {
    let newExamsConfig: ExamConfigType[] = [];
    examsPerSubject.forEach((exams, idx) => {
        newExamsConfig = [
            ...newExamsConfig,
            ...getAllConfigFromExams(exams).map(conf => ({
                ...conf,
                title: '[' + subjects[idx].name.toUpperCase() + '] ' + conf.title,
                backgroundColor: findColorConfig(subjects[idx].color).value,
                end: '', // unset end
            } as unknown as ExamConfigType)),
        ];
    });
    return newExamsConfig;
}

export interface EventConfigType extends ConfigType {backgroundColor: string}
const mapEventsPerSubjectToConfig = (eventsPerSubject: EventModelWithId[][], subjects: SubjectModelWithId[]): EventConfigType[] => {
    let newEventsConfig: EventConfigType[] = [];
    eventsPerSubject.forEach((events, idx) => {
        newEventsConfig = [
            ...newEventsConfig,
            ...getAllConfigFromEvents(events).map(conf => ({
                ...conf,
                title: '[' + subjects[idx].name.toUpperCase() + '] ' + conf.title,
                backgroundColor: findColorConfig(subjects[idx].color).value,
            } as unknown as EventConfigType)),
        ];
    });
    return newEventsConfig;
}