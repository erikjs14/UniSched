export interface SettingsCardProps {
    headerValue: string;
    onHeaderValueChange(newVal: string): void;
    onRemoveClicked: Function;
}