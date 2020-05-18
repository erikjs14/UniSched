import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { UserState } from './user.d';
import { BaseActionCreator, SetSignedInAC, StartSignOutAC } from '../actions/user.d';
import { SetSignedOutAC, SignOutFailAC } from './../actions/user.d';

const initialState: UserState = {
    username: null,
    globalLoading: true
};

export default (state: UserState = initialState, action: BaseActionCreator) => {
    switch (action.type) {
        case actionTypes.USER_SET_SIGNED_IN: return setSignedIn(state, action as SetSignedInAC);
        case actionTypes.USER_SET_SIGNED_OUT: return setSignedOut(state, action as SetSignedOutAC);
        case actionTypes.USER_START_SIGN_OUT: return startSignOut(state, action as StartSignOutAC);
        case actionTypes.USER_SIGN_OUT_FAIL: return signOutFail(state, action as SignOutFailAC);
        default: return state;
    }
}

const setSignedIn = (state: UserState, action: SetSignedInAC): UserState => {
    return updateObject(state, {
        username: action.user.displayName,
        globalLoading: false,
    });
};

const setSignedOut = (state: UserState, action: SetSignedOutAC): UserState => {
    return updateObject(state, {
        username: null,
        globalLoading: false,
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
    });
};