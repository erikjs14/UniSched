export interface ToggleProps {
    toggled: boolean;
    onClick(event: MouseEvent<HTMLDivElement, MouseEvent>): void;
}