import React, { PropsWithChildren } from 'react';

export default function(props: PropsWithChildren<{}>): JSX.Element {
    return (
        <div>
            LAYOUT
            {props.children}
        </div>
    )
}