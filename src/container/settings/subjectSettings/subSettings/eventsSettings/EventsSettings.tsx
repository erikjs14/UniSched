import React from 'react';

import CSS from './EventsSettings.module.scss';
import { EventsSettingsProps } from './EventsSettings.d';
import SettingsCards from '../../../../../components/settings/SettingsCards';
// import { toCss } from './../../../../../util/util';
// const {
//     wrapper: s_wrapper,
// } = CSS;

export default function(props: EventsSettingsProps): JSX.Element {
    
    return (
        <SettingsCards 
            title='Events'
        />
    );
}