import { BooleanPreferenceConfig } from "../../config/userPreferences";

export interface PreferenceRowProps {
    config: BooleanPreferenceConfig;
    value: boolean;
    onChange(newVal: boolean): void;
}