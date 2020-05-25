import React, { PropsWithChildren } from 'react';

import { SettingsCardProps } from './SettingsCard.d';
import Collapsible from '../../ui/collapsible/Collapsible';

export default function(props: PropsWithChildren<SettingsCardProps>): JSX.Element {
    
    return (
        <Collapsible
            header={props.header}
        >
            {props.children}
        </Collapsible>
    );
}