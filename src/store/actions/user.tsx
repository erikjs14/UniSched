import * as actionTypes from './actionTypes';
import { SetSignedInAC, SetSignedOutAC, FetchShallowSubjectsSuccessAC, FetchShallowSubjectsFailAC, FetchShallowSubjectsAC, RemoveSubjectLocallyAC, AddSubjectLocallyAC, UpdateSubjectLocallyAC } from './user.d';
import { SubjectModelWithId } from '../../firebase/model';

export const setSignedIn = (user: firebase.User): SetSignedInAC => {
    return {
        type: actionTypes.USER_SET_SIGNED_IN,
        user
    };
};

export const setSignedOut = (): SetSignedOutAC => {
    return {
        type: actionTypes.USER_SET_SIGNED_OUT,
    };
};

export const startSignOut = () => {
    return {
        type: actionTypes.USER_START_SIGN_OUT,
    };
};

export const signOutFail = (error: string) => {
    return {
        type: actionTypes.USER_SIGN_OUT_FAIL,
        error,
    };
};

export const fetchShallowSubjects = (): FetchShallowSubjectsAC  => {
    return {
        type: actionTypes.FETCH_SHALLOW_SUBJECTS,
    };
};

export const fetchShallowSubjectsSuccess = (shallowSubjects: SubjectModelWithId[]): FetchShallowSubjectsSuccessAC => {
    return {
        type: actionTypes.FETCH_SHALLOW_SUBJECTS_SUCCESS,
        shallowSubjects,
    };
};

export const fetchShallowSubjectsFail = (error: string): FetchShallowSubjectsFailAC => {
    return {
        type: actionTypes.FETCH_SHALLOW_SUBJECTS_FAIL,
        error,
    };
};

export const removeSubjectLocally = (id: string): RemoveSubjectLocallyAC => {
    return {
        type: actionTypes.REMOVE_SUBJECT_LOCALLY,
        id,
    };
};

export const addSubjectLocally = (subject: SubjectModelWithId): AddSubjectLocallyAC => {
    return {
        type: actionTypes.ADD_SUBJECT_LOCALLY,
        subject,
    };
};

export const updateSubjectLocally = (subject: SubjectModelWithId): UpdateSubjectLocallyAC  => {
    return {
        type: actionTypes.UPDATE_SUBJECT_LOCALLY,
        subject,
    };
};