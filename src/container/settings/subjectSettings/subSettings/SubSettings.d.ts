import { ModelWithId, SubjectDataModel } from './../../../../../firebase/model';
import { DataTypeId } from '../../../../hooks/useSubjectData';
import { SubjectDataCardProps } from '../../../../components/settings/settingsCard/SettingsCard.d';
import { IconType } from '../../../../config/globalTypes';

export interface SubSettingsProps<T extends SubjectDataModel, TId extends ModelWithId> extends SubjectDataSettingsProps<TId>{
    dataTypeId: DataTypeId;
    dataStartState: T;
    iconType: IconType;
    cardComponent: (props: SubjectDataCardProps<T>) => JSX.Element;
}

export interface SubjectDataSettingsProps<TId extends ModelWithId> {
    subjectId: string;
    initialData?: TId[];
    onDataChanged: Function;
    onSaveStateChanged(newSaveState: boolean): void;
    onError(error: string): void;
}