import { PreferenceConfig, PreferenceVal } from "../../config/userPreferences";
import { SubjectModel } from './../../../firebase/model';

export interface PreferenceRowProps {
    config: PreferenceConfig;
    value: PreferenceVal;
    onChange(newVal: PreferenceVal): void;
    getIdsOfEmptyGroupItems: ((groupId: string, subjectIdName: keyof SubjectModel) => string[]) | undefined; //unsauber...
}