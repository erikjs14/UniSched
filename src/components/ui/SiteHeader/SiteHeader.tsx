import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSyncAlt } from '@fortawesome/free-solid-svg-icons';

import CSS from './SiteHeader.module.scss';
import { SiteHeaderProps } from './SiteHeader.d';
import { toCss } from './../../../util/util';
import { mapToIcon } from '../../../config/iconConfig';
const {
    header: s_header,
    icon: s_icon,
    title: s_title,
    refresh: s_refresh,
    refreshing: s_refreshing,
} = CSS;

export default function(props: SiteHeaderProps): JSX.Element {
    
    return (
        <header className={toCss(s_header)}>
            
            <FontAwesomeIcon 
                icon={mapToIcon(props.type)} 
                className={toCss(s_icon)}
            />

            <h1 className={toCss(s_title)}>
                {props.title}
                {props.subTitle &&
                    <span>{props.subTitle}</span>
                }
            </h1>

            {props.onRefresh ? 
                (
                    <FontAwesomeIcon 
                        icon={faSyncAlt} 
                        className={toCss(s_refresh, (props.refreshing ? s_refreshing : ''))}
                        onClick={() => props.onRefresh ? props.onRefresh() : null}
                    />
                )
                : null
            }
            

        </header>
    );
}