import { SubjectModelWithId } from './../../firebase/model';
import { PreferencesState } from './../../config/userPreferences';

export interface UserState {
    username: string | null;
    timeCreated: Timestamp | undefined;
    userImgUrl: string | null;
    globalLoading: boolean;
    shallowSubjects: SubjectModelWithId[] | null;
    error: string | null;
    preferences: PreferencesState | null;
    preferenceError: string | null;
}