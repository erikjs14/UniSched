import { put } from 'redux-saga/effects';
import * as actions from '../actions';

import firebase from 'firebase';

export function* signOut() {
    try {
        yield firebase.auth().signOut();
        yield put(actions.setSignedOut());
    } catch (err) {
        console.log(err);
        yield put(actions.signOutFail());
    }
}