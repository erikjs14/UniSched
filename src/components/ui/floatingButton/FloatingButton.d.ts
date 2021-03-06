import { PropsWithChildren } from 'react';

export type FloatingButtonProps =  PropsWithChildren<{
    onClick(event: React.MouseEvent<>): void;
    center?: boolean;
    className?: string;
}>;