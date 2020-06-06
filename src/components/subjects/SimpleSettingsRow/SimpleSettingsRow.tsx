import React from 'react';

import CSS from './SimpleSettingsRow.module.scss';
import { SimpleSettingsRowProps } from './SimpleSettingsRow.d';
import { toCss, hex2rgba } from '../../../util/util';
import { findColorConfig } from '../../../config/colorChoices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mapToIcon } from '../../../config/iconConfig';
import { useHistory } from 'react-router-dom';
const {
    row: s_row,
    icon: s_icon,
    title: s_title,
    noHover: s_noHover,
} = CSS;

export default function(props: SimpleSettingsRowProps): JSX.Element {

    const history = useHistory();
    
    const colorConfig = findColorConfig(props.bgColor);

    const clickHandler = () => {
        if (props.linkTo) {
            history.push(props.linkTo);
        }
    }

    return (
        <div 
            className={toCss(s_row, (props.noHover ? s_noHover : ''))}
            style={{
                backgroundColor: hex2rgba(colorConfig.value, props.darkenBy ? props.darkenBy : 1),
                backgroundImage: props.darkenBy ? 'linear-gradient(to bottom right, rgba(0,0,0,.2), rgba(0,0,0,.3))' : undefined,
                color: colorConfig.textColor,
            }}
            onClick={clickHandler}
        >
            {props.icon && <FontAwesomeIcon className={toCss(s_icon)} icon={mapToIcon(props.icon)} />}
            <span className={toCss(s_title)} >{props.title}</span>
        </div>
    );
}