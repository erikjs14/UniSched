import React from 'react';
// import CSS from './Button.module.scss';

export interface ButtonProps {
    label: string;
    elementConfig: React.ComponentProps<'button'>;
}

export default function(props: ButtonProps): JSX.Element {
    return <button {...props.elementConfig}>{props.label}</button>;
}