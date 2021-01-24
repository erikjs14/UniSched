import React from 'react';

import CSS from './PreferenceRows.module.scss';
import { PreferenceRowsProps } from './PreferenceRows.d';
import { toCss } from '../../util/util';
import PreferenceRow from './preferenceRow/PreferenceRow';
import useUnischedId from '../../hooks/useUnischedId';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: PreferenceRowsProps): JSX.Element {

    const unisched_id = useUnischedId();
    
    return (
        <div className={toCss(s_wrapper)}>
            {props.preferenceConfigs.map(config => {
                if (config.constraint) {
                    if (props.preferences[config.constraint.id] !== config.constraint.value
                        && ( (props.preferences[config.constraint.id] as { [id: string]: boolean })[unisched_id] !== config.constraint.value )
                        ) return null;
                }

                return (
                    <PreferenceRow
                        key={config.id}
                        config={config}
                        value={props.preferences[config.id]}
                        onChange={val => props.onChange(config.id, val)}
                        getIdsOfEmptyGroupItems={props.getIdsOfEmptyGroupItems}
                    />
                )
            })}
        </div>
    );
}