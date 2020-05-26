import { ExamModelWithId } from './../../../../../firebase/model';

export interface ExamsSettingsProps {
    subjectId: string;
    initialData?: ExamModelWithId[];
    onDataChanged: Function;
    onSaveStateChanged(newSaveState: boolean): void;
    onError(error: string): void;
}