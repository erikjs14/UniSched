import React from 'react';
import { Switch, Tooltip, InfoSignIcon } from 'evergreen-ui';

import CSS from './PreferenceRow.module.scss';
import { PreferenceRowProps } from './PreferenceRow.d';
import { toCss } from '../../../util/util';
import { registerNotificationsWorker } from '../../../util/subscription';
const {
    wrapper: s_wrapper,
    name: s_name,
    input: s_input,
    info: s_info,
} = CSS;

export default function(props: PreferenceRowProps): JSX.Element | null {

    let inputEl;
    switch (props.config.type) {
        case 'boolean':
            inputEl = (
                <Switch
                    checked={props.value}
                    onChange={e => {
                        props.onChange(e.target.checked);
                        if (props.config.uponActivation && e.target.checked) {
                            registerNotificationsWorker();
                        }
                    }}
                />
            );
            break;
        case 'integer':
            inputEl = (
                <input
                    type='number'
                    id={props.config.id}
                    name={props.config.id}
                    min={props.config.min ?? undefined}
                    max={props.config.max ?? undefined}
                    step={props.config.step ?? undefined}
                    value={props.value}
                    onChange={e => props.onChange(parseInt(e.target.value))}
                />
            );
            break;
        default:
            inputEl = null;
            break;
    }

    if (!inputEl) return null;
    
    return (
        <div className={toCss(s_wrapper)}>
            
            <div className={toCss(s_name)}>
                {props.config.name}
                <Tooltip content={props.config.description}>
                    <InfoSignIcon className={toCss(s_info)}/>
                </Tooltip>
            </div>

            <div className={toCss(s_input)}>
                {inputEl}
            </div>

        </div>
    );
}