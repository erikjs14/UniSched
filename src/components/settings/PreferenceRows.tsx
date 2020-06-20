import React from 'react';

import CSS from './PreferenceRows.module.scss';
import { PreferenceRowsProps } from './PreferenceRows.d';
import { toCss } from '../../util/util';
import PreferenceRow from './preferenceRow/PreferenceRow';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: PreferenceRowsProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>
            {props.preferenceConfigs.map(config => (
                <PreferenceRow
                    key={config.id}
                    config={config}
                    value={props.preferences[config.id]}
                    onChange={val => props.onChange(config.id, val)}
                />
            ))}
        </div>
    );
}