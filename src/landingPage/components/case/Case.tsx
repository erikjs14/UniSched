import React, { PropsWithChildren } from 'react';

import CSS from './Case.module.scss';
import { CaseProps } from './Case.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    imgArea: s_imgArea,
    textArea: s_textArea,
    left: s_left,
    minHeight: s_minHeight,
} = CSS;

export default function(props: PropsWithChildren<CaseProps>): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper, (props.left ? s_left : ''))} >
            <div className={toCss(s_imgArea, (props.minHeight ? s_minHeight : ''))} >
                {props.children}
            </div>
            <div className={toCss(s_textArea)} >
                {props.text}
            </div>
        </div>
    );
}