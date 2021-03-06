import React, { forwardRef } from 'react';

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
    outline: s_outline,
} = CSS;

export default forwardRef(function(props: SimpleSettingsRowProps, ref: any): JSX.Element {

    const history = useHistory();
    
    const colorConfig = findColorConfig(props.bgColor);

    const clickHandler = () => {
        if (props.linkTo) {
            history.push(props.linkTo);
        }
        if (props.onClick) {
            props.onClick();
        }
    }

    const bgCol = hex2rgba(colorConfig.value, props.darkenBy ? props.darkenBy : 1);

    return (
        <div 
            className={toCss(s_row, (props.noHover ? s_noHover : ''), (props.outline ? s_outline : ''))}
            style={{
                backgroundColor: bgCol,
                backgroundImage: props.darkenBy ? 'linear-gradient(to bottom right, rgba(0,0,0,.2), rgba(0,0,0,.3))' : undefined,
                color: colorConfig.textColor,
            }}
            onClick={clickHandler}
            ref={ref}
        >
            {props.icon && <FontAwesomeIcon className={toCss(s_icon)} icon={mapToIcon(props.icon)} />}
            <span className={toCss(s_title)} >{props.title}</span>
        </div>
    );
});