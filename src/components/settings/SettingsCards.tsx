import React from 'react';

import CSS from './SettingsCards.module.scss';
import { SettingsCardsProps } from './SettingsCards.d';
import { toCss } from './../../util/util';
const {
    wrapper: s_wrapper,
    header: s_header,
} = CSS;

export default function(props: SettingsCardsProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>

            <h3 className={toCss(s_header)}>{props.title}</h3>

        </div>
    );
}