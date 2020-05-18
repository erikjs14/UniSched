import React from 'react';
// import CSS from './Button.module.scss';

export interface ButtonProps extends React.ComponentProps<'button'> {}

export default function(props: ButtonProps): JSX.Element {
    return <button {...props} />;
}