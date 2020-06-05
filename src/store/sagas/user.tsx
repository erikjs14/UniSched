import { put, take } from 'redux-saga/effects';
import * as actions from '../actions';
import * as actionTypes from '../actions/actionTypes';

import firebase from 'firebase';
import { fetchSubjectsShallow, updateUser, addUser } from '../../firebase/firestore';
import { fetchUser } from './../../firebase/firestore';
import { getTimestampFromSeconds, getTimestampFromDate } from '../../util/timeUtil';
import { getSecondsFromDate } from './../../util/timeUtil';
import { PostUserDataAC, AddUserAndDataAC } from '../actions/user.d';

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
    try {
        yield take(actionTypes.USER_SET_SIGNED_IN);
        const data = yield fetchUser();
        if (data.timeCreated) {
            yield put(actions.setUserData(data.timeCreated));
        } else {
            yield put(actions.postUserData(getTimestampFromSeconds(getSecondsFromDate(new Date()))));
        }        
    } catch (error) {
        // user doc does not exist yet
        yield put(actions.addUserAndData(getTimestampFromDate(new Date())));
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
        yield addUser({timeCreated});
        yield put(actions.setUserData(timeCreated));
    } catch (error) {}
}