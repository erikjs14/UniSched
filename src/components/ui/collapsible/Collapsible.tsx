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
    headerContent: s_headerContent,
} = CSS;

export default function(props: React.PropsWithChildren<CollapsibleProps>): JSX.Element {

    const [collapsed, setCollapsed] = useState(true);
    
    return (
        <div 
            className={collapsed
                ? toCss(s_wrapper, s_collapsed, (props.addCss ? props.addCss : ''))
                : toCss(s_wrapper, (props.addCss ? props.addCss : ''))
            }
        >

            <div 
                className={toCss(s_header)}
                onClick={() => collapsed ? setCollapsed(prev => !prev) : null}
            >
                <div className={toCss(s_headerContent)}>
                    {props.header}

                    <FontAwesomeIcon onClick={() => !collapsed ? setCollapsed(prev => !prev) : null} icon={faAngleUp} className={toCss(s_arrow)} />
                </div>
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