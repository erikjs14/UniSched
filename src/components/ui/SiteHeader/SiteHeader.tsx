import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import CSS from './SiteHeader.module.scss';
import { SiteHeaderProps } from './SiteHeader.d';
import { toCss } from './../../../util/util';
import { mapToIcon } from '../../../util/iconUtil';
const {
    header: s_header,
    icon: s_icon,
    title: s_title,
} = CSS;

export default function(props: SiteHeaderProps): JSX.Element {
    
    return (
        <header className={toCss(s_header)}>
            
            <FontAwesomeIcon 
                icon={mapToIcon(props.type)} 
                className={toCss(s_icon)}
            />

            <h1 className={toCss(s_title)}>{props.title}</h1>

        </header>
    );
}