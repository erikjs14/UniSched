import { SubjectModelWithId, Timestamp } from './../../firebase/model';
import { PreferenceId } from '../../config/userPreferences';
import { PreferencesState } from './../../config/userPreferences';

export interface BaseActionCreator {type: string}

export interface SetSignedInAC extends BaseActionCreator {user: firebase.User}
export interface SetSignedOutAC extends BaseActionCreator {}
export interface StartSignOutAC extends BaseActionCreator {}
export interface SignOutFailAC extends BaseActionCreator {error: string}
export interface FetchUserDataAC extends BaseActionCreator {}
export interface SetUserDataAC extends BaseActionCreator {timeCreated: Timestamp, preferences: PreferencesState}
export interface PostUserDataAC extends BaseActionCreator {timeCreated: Timestamp};
export interface AddUserAndDataAC extends BaseActionCreator {timeCreated: Timestamp};

export interface FetchShallowSubjectsAC extends BaseActionCreator {}
export interface FetchShallowSubjectsSuccessAC extends BaseActionCreator {shallowSubjects: SubjectModelWithId[]}
export interface FetchShallowSubjectsFailAC extends BaseActionCreator {error: string}

export interface RemoveSubjectLocallyAC extends BaseActionCreator {id: string}
export interface AddSubjectLocallyAC extends BaseActionCreator {subject: SubjectModelWithId}
export interface UpdateSubjectLocallyAC extends BaseActionCreator {subject: SubjectModelWithId}

export interface SetUserPreferenceAC extends BaseActionCreator {id: PreferenceId; value: any}
export interface SetUserPreferenceFailAC extends BaseActionCreator {error: string}