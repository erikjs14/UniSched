import React from 'react';

import CSS from './SimpleSettingsRow.module.scss';
import { SimpleSettingsRowProps } from './SimpleSettingsRow.d';
import { toCss } from './../../../util/util';
import { findColorConfig } from '../../../config/colorChoices';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { mapToIcon } from './../../../util/iconUtil';
import { useHistory } from 'react-router-dom';
const {
    row: s_row,
    icon: s_icon,
    title: s_title,
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
            className={toCss(s_row)}
            style={{
                backgroundColor: colorConfig.value,
                color: colorConfig.textColor,
            }}
            onClick={clickHandler}
        >
            {props.icon && <FontAwesomeIcon className={toCss(s_icon)} icon={mapToIcon(props.icon)} />}
            <span className={toCss(s_title)} >{props.title}</span>
        </div>
    );
}