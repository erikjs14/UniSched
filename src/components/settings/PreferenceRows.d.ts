import { PreferencesState, PreferenceConfig, PreferenceId } from '../../config/userPreferences';

export interface PreferenceRowsProps {
    preferences: PreferencesState;
    preferenceConfigs: PreferenceConfig[];
    onChange(id: PreferenceId, value: boolean): void;
}