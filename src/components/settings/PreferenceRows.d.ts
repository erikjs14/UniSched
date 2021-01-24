import { PreferencesState, PreferenceConfig, PreferenceId } from '../../config/userPreferences';
import { SubjectModel } from './../../firebase/model';

export interface PreferenceRowsProps {
    preferences: PreferencesState;
    preferenceConfigs: PreferenceConfig[];
    onChange(id: PreferenceId, value: boolean): void;
    getIdsOfEmptyGroupItems: ((groupId: string, subjectIdName: keyof SubjectModel) => string[]);
}