export interface BasePreferenceConfig {
    id: string;
    description: string;
    name: string;
}

export interface BooleanPreferenceConfig extends BasePreferenceConfig{
    type: 'boolean';
    default: boolean;
}

export type PreferenceConfig = BooleanPreferenceConfig;

export const PREF_ID_ACTIVATE_RANDOM_AVATAR = 'activateRandomAvatar';
export const PREFERENCES_CONFIG: PreferenceConfig[] = [
    {
        id: PREF_ID_ACTIVATE_RANDOM_AVATAR,
        type: 'boolean',
        name: 'Force Random Avatar',
        description: 'If enabled, a random avatar will be shown instead of the profile picture.',
        default: false,
    }
]

const allIds = PREFERENCES_CONFIG.map(config => config.id);
export type PreferenceId = typeof allIds[number];
export type PreferenceVal = boolean;

export interface PreferencesState {
    [id: string]: boolean;
} 