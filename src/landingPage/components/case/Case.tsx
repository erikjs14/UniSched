import React from 'react';

import CSS from './Case.module.scss';
import { CaseProps } from './Case.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    imgArea: s_imgArea,
    textArea: s_textArea,
    left: s_left,
} = CSS;

export default function(props: CaseProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper, (props.left ? s_left : ''))} >
            <div className={toCss(s_imgArea)} >
                
            </div>
            <div className={toCss(s_textArea)} >
                {props.text}
            </div>
        </div>
    );
}