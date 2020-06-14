import React from 'react';

import CSS from './BackTop.module.scss';
import { BackTopProps } from './BackTop.d';
import { toCss } from '../../util/util';
import { useBackTop } from './../../hooks/useBackTop';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowCircleUp } from '@fortawesome/free-solid-svg-icons';
const {
    wrapper: s_wrapper,
    show: s_show,
    icon: s_icon,
} = CSS;

export default function(props: BackTopProps): JSX.Element {

    const {visible, scrollTop} = useBackTop(200);
    
    return (
        <div 
            className={toCss(s_wrapper, (visible ? s_show : ''))}  
            onClick={scrollTop}
        >
            <FontAwesomeIcon className={toCss(s_icon)} icon={faArrowCircleUp} />
        </div>
    );
}