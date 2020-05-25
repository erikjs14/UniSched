import { EventModelWithId } from './../../../../../firebase/model';

export interface EventsSettingsProps {
    subjectId: string;
    initialData?: EventModelWithId[];
    onDataChanged: Function;
    onSaveStateChanged(newSaveState: boolean): void;
    onError(error: string): void;
}