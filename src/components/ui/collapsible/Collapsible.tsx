import React, { useState } from 'react';
import AnimateHeight from 'react-animate-height';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

import CSS from './Collapsible.module.scss';
import { CollapsibleProps } from './Collapsible.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    header: s_header,
    content: s_content,
    collapsed: s_collapsed,
    arrow: s_arrow,
} = CSS;

export default function(props: React.PropsWithChildren<CollapsibleProps>): JSX.Element {

    const [collapsed, setCollapsed] = useState(true);
    
    return (
        <div 
            className={collapsed
                ? toCss(s_wrapper, s_collapsed)
                : toCss(s_wrapper)
            }
        >

            <div 
                className={toCss(s_header)}
                onClick={() => setCollapsed(prev => !prev)}
            >
                {props.header}

                <FontAwesomeIcon icon={faAngleUp} className={toCss(s_arrow)} />
            </div>

            <AnimateHeight
                duration={500}
                height={collapsed ? 0 : 'auto'}
            >
                <div className={toCss(s_content)}>
                    {props.children}
                </div>
            </AnimateHeight>
            
        </div>
    );
}