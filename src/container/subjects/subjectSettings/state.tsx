import { SubjectModelWithId, EventModelWithId, ExamModelWithId, TaskModelWithId, Timestamp } from './../../../firebase/model';
import { Color, findColorConfig, defaultColorConfig } from './../../../config/colorChoices';
import { NO_GROUP_ASSIGNMENT_VAL } from '../../../config/userPreferences';

interface ColorConfig {
    newColor: Color;
    oldColor: Color;
}
interface DataModel {
    events: EventModelWithId[];
    exams: ExamModelWithId[];
    tasks: TaskModelWithId[];
}
interface StateModel {
    subject: {
        id: string;
        name: string;
        spaceId: string;
        color: ColorConfig;
        excludeTasksFromAll: boolean;
        additionalInfo: string;
        archiveId: string;
        timeCreated: Timestamp | undefined;
        changed: boolean;
    } | null;
    initialData: DataModel | null;
    loading: boolean;
    error: string | null;
    saving: boolean;
}

interface ActionModel {
    type: string;
}

interface SetArchiveIdActionModel extends ActionModel {
    archiveId: string;
}
const ACTION_SET_ARCHIVE_ID = 'ACTION_SET_ARCHIVE_ID';
export const setArchiveId = (archiveId: string): SetArchiveIdActionModel => {
    return {
        type: ACTION_SET_ARCHIVE_ID,
        archiveId,
    };
}

interface SetSpaceActionModel extends ActionModel {
    spaceId: string;
}
const ACTION_SET_SPACE = 'ACTION_SET_SPACE';
export const setSpace = (spaceId: string): SetSpaceActionModel => {
    return {
        type: ACTION_SET_SPACE,
        spaceId,
    };
}

interface SetSubjectActionModel extends ActionModel {
    subject: SubjectModelWithId;
    initialData: DataModel;
}
const ACTION_SET_SUBJECT = 'SET_SUBJECT';
export const setSubject = (subject: SubjectModelWithId, initialData: DataModel): SetSubjectActionModel => {
    return {
        type: ACTION_SET_SUBJECT,
        subject,
        initialData,
    };
}

interface SetErrorActionModel extends ActionModel {
    error: string;
}
const ACTION_SET_ERROR = 'SET_ERROR';
export const setError = (error: string): SetErrorActionModel => {
    return {
        type: ACTION_SET_ERROR,
        error,
    };
}

interface SetLoadingActionModel extends ActionModel {
    loading: boolean;
}
const ACTION_SET_LOADING = 'SET_LOADING';
export const setLoading = (loading: boolean): SetLoadingActionModel => {
    return {
        type: ACTION_SET_LOADING,
        loading,
    }
}

interface ChangeNameActionModel extends ActionModel {
    name: string;
}
const ACTION_CHANGE_NAME = 'CHANGE_NAME';
export const changeName = (name: string): ChangeNameActionModel => {
    return {
        type: ACTION_CHANGE_NAME,
        name,
    };
}

interface ChangeExcludeTasksFromAllActionModel extends ActionModel {
    val: boolean;
}
const ACTION_CHANGE_EXCLUDE_TASK_FROM_ALL = 'CHANGE_EXCLUDE_TASK_FROM_ALL';
export const changeExcludeTasksFromAll = (val: boolean): ChangeExcludeTasksFromAllActionModel => {
    return {
        type: ACTION_CHANGE_EXCLUDE_TASK_FROM_ALL,
        val,
    };
}

interface ChangeAdditionalInfoActionModel extends ActionModel {
    val: string;
}
const ACTION_CHANGE_ADDITIONAL_INFO = 'ACTION_CHANGE_ADDITIONAL_INFO';
export const changeAdditionalInfo = (val: string): ChangeAdditionalInfoActionModel => {
    return {
        type: ACTION_CHANGE_ADDITIONAL_INFO,
        val,
    }
}

interface ChangeColorActionModel extends ActionModel {
    color: string;
}
const ACTION_CHANGE_COLOR = 'CHANGE_COLOR';
export const changeColor = (color: string): ChangeColorActionModel => {
    return {
        type: ACTION_CHANGE_COLOR,
        color,
    };
}

const ACTION_START_SAVING = 'START_SAVING';
export const startSaving = (): ActionModel => {
    return {
        type: ACTION_START_SAVING,
    }
}

const ACTION_SAVED = 'SAVED';
export const setSaved = (): ActionModel => {
    return {
        type: ACTION_SAVED,
    }
}

export const initialState: StateModel = {
    subject: null,
    initialData: null,
    loading: true,
    error: null,
    saving: false,
};
export const initialStateNew = (spaceId: string): StateModel => ({
    subject: {
        name: '',
        color: {
            newColor: defaultColorConfig(),
            oldColor: defaultColorConfig(),
        },
        changed: false,
        id: '',
        timeCreated: undefined,
        spaceId: spaceId,
        excludeTasksFromAll: false,
        additionalInfo: '',
        archiveId: NO_GROUP_ASSIGNMENT_VAL,
    },
    initialData: {
        events: [],
        exams: [],
        tasks: [],
    },
    error: null,
    loading: false,
    saving: false,
});

export const reducer = (state: StateModel, action: ActionModel & any): StateModel => {
    switch (action.type) {
        case ACTION_SET_SUBJECT: 
            const colorConf = findColorConfig(action.subject.color);
            return {
                ...state,
                loading: false,
                error: null,
                subject: {
                    ...action.subject,
                    color: {
                        newColor: colorConf,
                        oldColor: colorConf,
                    },
                    changed: false,
                },
                initialData: action.initialData,
            }
        case ACTION_SET_ARCHIVE_ID:
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    archiveId: action.archiveId,
                    changed: true,
                },
            };
        case ACTION_SET_SPACE:
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    spaceId: action.spaceId,
                    changed: true,
                },
            };
        case ACTION_SET_ERROR: return {
            ...state,
            loading: false,
            subject: null,
            error: action.error,
        }
        case ACTION_SET_LOADING: return {
            ...state,
            loading: action.loading,
        }
        case ACTION_CHANGE_NAME: 
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    name: action.name,
                    changed: true,
                }
            };
        case ACTION_CHANGE_EXCLUDE_TASK_FROM_ALL:
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    excludeTasksFromAll: action.val,
                    changed: true,
                },
            };
        case ACTION_CHANGE_ADDITIONAL_INFO:
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    additionalInfo: action.val,
                    changed: true,
                },
            };
        case ACTION_CHANGE_COLOR:
            if (!state.subject) return state;
            return {
                ...state,
                subject: {
                    ...state.subject,
                    color: {
                        newColor: findColorConfig(action.color),
                        oldColor: state.subject.color.newColor,
                    },
                    changed: true,
                }
            };
        case ACTION_START_SAVING: return {
            ...state,
            saving: true,
        }
        case ACTION_SAVED: 
            if (!state.subject) {
                return {
                    ...state,
                    saving: false,
                };
            } else {
                return {
                    ...state,
                    saving: false,
                    subject: {
                        ...state.subject,
                        changed: false,
                    },
                }
            }
        default: throw Error('Should not be reached!');
    }
}