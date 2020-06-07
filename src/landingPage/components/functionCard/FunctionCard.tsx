import React from 'react';

import CSS from './FunctionCard.module.scss';
import { FunctionCardProps } from './FunctionCard.d';
import { toCss } from '../../../util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const {
    wrapper: s_wrapper,
    icon: s_icon,
    header: s_header,
    body: s_body,
} = CSS;

export default function(props: FunctionCardProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper, (props.addCss ? props.addCss : ''))} >
            <FontAwesomeIcon icon={props.icon} className={toCss(s_icon)} />
            <h3 className={toCss(s_header)} >{props.header}</h3>
            <p className={toCss(s_body)}>{props.text}</p> 
        </div>
    );
}