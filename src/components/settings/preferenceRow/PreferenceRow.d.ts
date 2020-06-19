import { PreferenceConfig, PreferenceVal } from "../../config/userPreferences";

export interface PreferenceRowProps {
    config: PreferenceConfig;
    value: PreferenceVal;
    onChange(newVal: PreferenceVal): void;
}