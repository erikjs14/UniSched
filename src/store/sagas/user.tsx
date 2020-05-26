import { put } from 'redux-saga/effects';
import * as actions from '../actions';

import firebase from 'firebase';
import { fetchSubjectsShallow } from '../../firebase/firestore';

export function* signOut() {
    try {
        yield firebase.auth().signOut();
        yield put(actions.setSignedOut());
    } catch (err) {
        console.log(err);
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