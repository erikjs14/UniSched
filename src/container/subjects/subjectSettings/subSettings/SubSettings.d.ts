import { SubjectDataModelWithId, SubjectDataModel } from './../../../../../firebase/model';
import { DataTypeId } from '../../../../hooks/useSubjectData';
import { SubjectDataCardProps } from '../../../../components/settings/settingsCard/SettingsCard.d';
import { IconType } from '../../../../config/globalTypes'

export interface SubSettingsProps<T extends SubjectDataModel, TId extends SubjectDataModelWithId> extends SubjectDataSettingsProps<TId>{
    dataTypeId: DataTypeId;
    dataStartState: T;
    iconType: IconType;
    areaTitle: string;
    cardComponent: (props: SubjectDataCardProps<SubjectDataModel>) => JSX.Element;
}

export interface SubjectDataSettingsProps<TId extends SubjectDataModelWithId> {
    subjectId: string;
    initialData?: TId[];
    onDataChanged: Function;
    onSaveStateChanged(newSaveState: boolean): void;
    onError(error: string): void;
}