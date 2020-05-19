import React from 'react';

import CSS from './Collapsible.module.scss';
import { toCss } from '../../../util/util';
import { CollapsibleProps } from './Collapsible.d';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: CollapsibleProps): JSX.Element {
  
    return (
        <div className={toCss(s_wrapper)}>
            <h3>Collapse Head</h3>
        </div>
    );
}