export interface GroupingDialogProps {
    config: PreferenceConfig;
    value: PreferenceVal;
    onChange(newVal: PreferenceVal): void;
    title: string;
    onCloseComplete(): void;
    idsOfEmptyGroupItems: string[]; // groups, which no subjects are assigned to
}