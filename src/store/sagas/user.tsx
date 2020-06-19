import { put, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as actionTypes from '../actions/actionTypes';

import firebase from 'firebase';
import { fetchSubjectsShallow, updateUser, addUser } from '../../firebase/firestore';
import { fetchUser, updatePreference } from './../../firebase/firestore';
import { getTimestampFromSeconds, getTimestampFromDate } from '../../util/timeUtil';
import { getSecondsFromDate } from './../../util/timeUtil';
import { PostUserDataAC, AddUserAndDataAC, SetUserPreferenceAC } from '../actions/user.d';

export function* signOut() {
    try {
        yield firebase.auth().signOut();
        yield put(actions.setSignedOut());
    } catch (err) {
        yield put(actions.signOutFail(err.message));
    }
}

export function* fetchShallowSubjects() {
    try {
        const data = yield fetchSubjectsShallow();
        yield put(actions.fetchShallowSubjectsSuccess(data));
    } catch (error) {
        yield put(actions.fetchShallowSubjectsFail(error.message));
    }
}

export function* fetchUserData() {
    yield take(actionTypes.USER_SET_SIGNED_IN);
    const trySignin = function*() {
        const data = yield fetchUser();
        if (data.timeCreated) {
            yield put(actions.setUserData(data.timeCreated, data.preferences));
        } else {
            yield put(actions.postUserData(getTimestampFromSeconds(getSecondsFromDate(new Date()))));
        }        
    }
    try {
        yield trySignin();
    } catch (error) {
        // try again once
        try {
            yield trySignin();
        } catch (error) {
            // user doc does not exist yet (probably)
            yield put(actions.addUserAndData(getTimestampFromDate(new Date())));
        }
    }
}

export function* postUserData(action: PostUserDataAC) {
    try {
        yield updateUser({timeCreated: action.timeCreated});
    } catch (error) {}
}

export function* addUserAndData(action: AddUserAndDataAC) {
    try {
        const timeCreated = action.timeCreated;
        yield addUser({timeCreated, preferences: {}});
        yield put(actions.setUserData(timeCreated, {}));
    } catch (error) {}
}

const inputTimeouts: {[id: string]: any} = {};
export function* setUserPreference(action: SetUserPreferenceAC) {
    try {
        if (inputTimeouts[action.id]) clearTimeout(inputTimeouts[action.id]);
        inputTimeouts[action.id] = setTimeout(() => {
            updatePreference(action.id, action.value);
        }, 500);
    } catch (error) {
        yield put(actions.setUserPreferenceFail('Something went wrong'));
    }
}