import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { UserState } from './user.d';
import { BaseActionCreator, SetSignedInAC, StartSignOutAC, FetchShallowSubjectsAC, FetchShallowSubjectsFailAC, AddSubjectLocallyAC, UpdateSubjectLocallyAC } from '../actions/user.d';
import { SetSignedOutAC, SignOutFailAC, FetchShallowSubjectsSuccessAC, RemoveSubjectLocallyAC } from './../actions/user.d';

const initialState: UserState = {
    username: null,
    userImgUrl: null,
    globalLoading: true,
    shallowSubjects: null,
    error: null,
};

export default (state: UserState = initialState, action: BaseActionCreator) => {
    switch (action.type) {
        case actionTypes.USER_SET_SIGNED_IN: return setSignedIn(state, action as SetSignedInAC);
        case actionTypes.USER_SET_SIGNED_OUT: return setSignedOut(state, action as SetSignedOutAC);
        case actionTypes.USER_START_SIGN_OUT: return startSignOut(state, action as StartSignOutAC);
        case actionTypes.USER_SIGN_OUT_FAIL: return signOutFail(state, action as SignOutFailAC);
        case actionTypes.FETCH_SHALLOW_SUBJECTS: return fetchShallowSubjects(state, action as FetchShallowSubjectsAC);
        case actionTypes.FETCH_SHALLOW_SUBJECTS_SUCCESS: return fetchShallowSubjectsSuccess(state, action as FetchShallowSubjectsSuccessAC);
        case actionTypes.FETCH_SHALLOW_SUBJECTS_FAIL: return fetchShallowSubjectsFail(state, action as FetchShallowSubjectsFailAC);
        case actionTypes.REMOVE_SUBJECT_LOCALLY: return removeSubjectLocally(state, action as RemoveSubjectLocallyAC);
        case actionTypes.ADD_SUBJECT_LOCALLY: return addSubjectLocally(state, action as AddSubjectLocallyAC);
        case actionTypes.UPDATE_SUBJECT_LOCALLY: return updateSubjectLocally(state, action as UpdateSubjectLocallyAC);
        default: return state;
    }
}

const setSignedIn = (state: UserState, action: SetSignedInAC): UserState => {
    return updateObject(state, {
        username: action.user.displayName,
        userImgUrl: action.user.photoURL,
        globalLoading: state.shallowSubjects ? false : true,
        error: null,
    });
};

const setSignedOut = (state: UserState, action: SetSignedOutAC): UserState => {
    return updateObject(state, {
        username: null,
        globalLoading: false,
        error: null,
    });
};

const startSignOut = (state: UserState, action: StartSignOutAC) => {
    return updateObject(state, {
        globalLoading: true,
    });
};

const signOutFail = (state: UserState, action: SignOutFailAC) => {
    return updateObject(state, {
        globalLoading: false,
        error: action.error,
    });
};

const fetchShallowSubjects = (state: UserState, action: FetchShallowSubjectsAC): UserState => {
    return updateObject(state, {
        globalLoading: true,
    });
};

const fetchShallowSubjectsSuccess = (state: UserState, action: FetchShallowSubjectsSuccessAC): UserState => {
    return updateObject(state, {
        globalLoading: state.username ? false : true,
        shallowSubjects: action.shallowSubjects,
        error: null,
    });
};

const fetchShallowSubjectsFail = (state: UserState, action: FetchShallowSubjectsFailAC): UserState => {
    return updateObject(state, {
        globalLoading: false,
        error: action.error,
    });
};

const removeSubjectLocally = (state: UserState, action: RemoveSubjectLocallyAC): UserState => {
    return updateObject(state, {
        shallowSubjects: state.shallowSubjects?.filter(sub => sub.id !== action.id),
    });
};

const addSubjectLocally = (state: UserState, action: AddSubjectLocallyAC): UserState => {
    return updateObject(state, {
        shallowSubjects: state.shallowSubjects ? [...state.shallowSubjects, action.subject] : [action.subject],
    });
};

const updateSubjectLocally = (state: UserState, action: UpdateSubjectLocallyAC): UserState => {
    return updateObject(state, {
        shallowSubjects: state.shallowSubjects 
            ? state.shallowSubjects.map(sub => sub.id === action.subject.id ? action.subject : sub)
            : [action.subject],
    });
};