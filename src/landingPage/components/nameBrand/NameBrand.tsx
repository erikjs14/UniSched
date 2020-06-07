import React from 'react';

import CSS from './NameBrand.module.scss';
import { NameBrandProps } from './NameBrand.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    first: s_first,
    last: s_last,
    withBg: s_withBg,
    whiteText: s_whiteText,
} = CSS;

export default function(props: NameBrandProps): JSX.Element {
    
    return (
        <div 
            className={toCss(s_wrapper, (props.withBg ? s_withBg : ''), (props.whiteText ? s_whiteText : ''))}
        >
            <div className={toCss(s_first)} >
                {props.first}
            </div>
            <div className={toCss(s_last)} >
                {props.last}
            </div>
        </div>
    );
}