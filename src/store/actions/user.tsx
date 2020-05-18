import * as actionTypes from './actionTypes';
import { SetSignedInAC, SetSignedOutAC } from './user.d';

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

export const signOutFail = () => {
    return {
        type: actionTypes.USER_SIGN_OUT_FAIL,
    };
};