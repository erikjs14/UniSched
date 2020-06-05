import * as userSagas from './user';
import * as actionTypes from '../actions/actionTypes';

import { all, takeEvery } from 'redux-saga/effects';

export function* userWatcher() {
    yield all([
        takeEvery(actionTypes.USER_START_SIGN_OUT, userSagas.signOut),
        takeEvery(actionTypes.FETCH_SHALLOW_SUBJECTS, userSagas.fetchShallowSubjects),
        takeEvery(actionTypes.FETCH_USER_DATA, userSagas.fetchUserData),
        takeEvery(actionTypes.POST_USER_DATA, userSagas.postUserData),
        takeEvery(actionTypes.ADD_USER_AND_DATA, userSagas.addUserAndData)
    ]);
}