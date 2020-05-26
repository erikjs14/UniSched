import { SubjectDataModel } from "../../../firebase/model";

export interface SettingsCardProps {
    headerValue: string;
    onHeaderValueChange(newVal: string): void;
    onRemoveClicked: Function;
}

export interface SubjectDataCardProps<M extends SubjectDataModel> {
    data: M;
    onChange<T>(key: keyof M, newVal: T | null): void;
    onRemove: Function;
}