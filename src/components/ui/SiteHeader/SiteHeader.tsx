import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faWrench, faCheckCircle, faFeather, faCalendarAlt, IconDefinition } from '@fortawesome/free-solid-svg-icons';

import CSS from './SiteHeader.module.scss';
import { SiteHeaderProps, SETTINGS_TYPE, TODO_TYPE, EXAMS_TYPE, SCHEDULE_TYPE } from './SiteHeader.d';
import { toCss } from './../../../util/util';
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

const mapToIcon = (name: SiteHeaderProps["type"]): IconDefinition => {
    switch (name) {
        case SETTINGS_TYPE: return faWrench;
        case TODO_TYPE: return faCheckCircle;
        case SCHEDULE_TYPE: return faCalendarAlt;
        case EXAMS_TYPE: return faFeather;
        default: return faCheckCircle;
    }
}