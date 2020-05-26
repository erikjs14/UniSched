import { SubjectModelWithId } from './../../firebase/model';

export interface BaseActionCreator {type: string}

export interface SetSignedInAC extends BaseActionCreator {user: firebase.User}
export interface SetSignedOutAC extends BaseActionCreator {}
export interface StartSignOutAC extends BaseActionCreator {}
export interface SignOutFailAC extends BaseActionCreator {error: string}

export interface FetchShallowSubjectsAC extends BaseActionCreator {}
export interface FetchShallowSubjectsSuccessAC extends BaseActionCreator {shallowSubjects: SubjectModelWithId[]}
export interface FetchShallowSubjectsFailAC extends BaseActionCreator {error: string}