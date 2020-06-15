export interface CustomColorDialogProps {
    show?: boolean;
    onConfirm(hex: string): void;
    onClose: Function;
    initialCol: string;
}