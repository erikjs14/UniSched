export interface ExclusionsDialogProps {
    show?: boolean;
    onCloseComplete?: Function;
    onChangeConfirmed(exclusions: Timestamp[]): void;
    availableDates: Timestamp[];
    selectedExclusions: Timestamp[];
}