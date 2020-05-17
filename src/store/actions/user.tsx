import * as actionTypes from './actionTypes';
import { SetSignedInAC, SetSignedOutAC } from './user.d';

export const setSignedIn = (user: firebase.auth.UserCredential): SetSignedInAC => {
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