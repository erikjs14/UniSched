import * as actionTypes from './actionTypes';
import { SetSignedInAC, SetSignedOutAC, FetchShallowSubjectsSuccessAC, FetchShallowSubjectsFailAC, FetchShallowSubjectsAC, RemoveSubjectLocallyAC, AddSubjectLocallyAC, UpdateSubjectLocallyAC, FetchUserDataAC, SetUserDataAC, PostUserDataAC, AddUserAndDataAC, SetUserPreferenceAC, SetUserPreferenceFailAC, SetSpaceAC, FetchSpacesAC, FetchSpacesSuccessAC, FetchSpacesFailAC, AddSpaceLocallyAC, RemoveSpaceLocallyAC, AlterSpaceLocallyAC, ResetPermissionPreferencesAC } from './user.d';
import { SubjectModelWithId, Timestamp, SpaceModelWithId } from '../../firebase/model';
import { PreferenceId } from '../../config/userPreferences';
import { PreferencesState } from './../../config/userPreferences';

export const fetchSpaces = (selectedSpace: string | undefined): FetchSpacesAC  => {
    return {
        type: actionTypes.FETCH_SPACES,
        selectedSpace,
    };
};

export const fetchSpacesSuccess = (spaces: SpaceModelWithId[], selectedSpace: string | undefined): FetchSpacesSuccessAC => {
    return {
        type: actionTypes.FETCH_SPACES_SUCCESS,
        spaces,
        selectedSpace,
    };
};

export const fetchSpacesFail = (error: string): FetchSpacesFailAC => {
    return {
        type: actionTypes.FETCH_SPACES_FAIL,
        error,
    };
};

export const setSpace = (space: string): SetSpaceAC => {
    return {
        type: actionTypes.SET_SPACE,
        space,
    };
};

export const addSpaceLocally = (space: SpaceModelWithId): AddSpaceLocallyAC => {
    return {
        type: actionTypes.ADD_SPACE_LOCALLY,
        space,
    };
};

export const removeSpaceLocally = (spaceId: string): RemoveSpaceLocallyAC => {
    return {
        type: actionTypes.REMOVE_SPACE_LOCALLY,
        spaceId,
    };
};

export const alterSpaceLocally = (space: SpaceModelWithId): AlterSpaceLocallyAC => {
    return {
        type: actionTypes.ALTER_SPACE_LOCALLY,
        space,
    };
};

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

export const fetchUserData = (): FetchUserDataAC => {
    return {
        type: actionTypes.FETCH_USER_DATA,
    };
};

export const setUserData = (timeCreated: Timestamp, preferences: PreferencesState): SetUserDataAC => {
    return {
        type: actionTypes.SET_USER_DATA,
        timeCreated,
        preferences,
    };
};

export const postUserData = (timeCreated: Timestamp): PostUserDataAC => {
    return {
        type: actionTypes.POST_USER_DATA,
        timeCreated,
    };
};

export const addUserAndData = (timeCreated: Timestamp): AddUserAndDataAC => {
    return {
        type: actionTypes.ADD_USER_AND_DATA,
        timeCreated,
    };
};

export const setUserPreference = (id: PreferenceId, value: any): SetUserPreferenceAC => {
    return {
        type: actionTypes.SET_USER_PREFERENCE,
        id,
        value,
    };
};

export const setUserPreferenceFail = (error: string): SetUserPreferenceFailAC => {
    return {
        type: actionTypes.SET_USER_PREFERENCE_FAIL,
        error,
    };
};

export const resetPermissionPreferences = (): ResetPermissionPreferencesAC => {
    return {
        type: actionTypes.RESET_PERMISSION_PREFERENCES,
    };
};