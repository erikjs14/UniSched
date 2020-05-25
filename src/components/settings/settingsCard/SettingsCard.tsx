import React, { PropsWithChildren } from 'react';

import { SettingsCardProps } from './SettingsCard.d';
import Collapsible from '../../ui/collapsible/Collapsible';
import CSS from './SettingsCard.module.scss';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: PropsWithChildren<SettingsCardProps>): JSX.Element {
    
    return (
        <Collapsible
            header={props.header}
            addCss={s_wrapper}
        >
            {props.children}
        </Collapsible>
    );
}