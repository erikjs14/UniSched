import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell as fasBell, faSyncAlt } from '@fortawesome/free-solid-svg-icons';
import { faBell as farBell } from '@fortawesome/free-regular-svg-icons';

import CSS from './SiteHeader.module.scss';
import { SiteHeaderProps } from './SiteHeader.d';
import { toCss } from './../../../util/util';
import { mapToIcon } from '../../../config/iconConfig';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
const {
    header: s_header,
    icon: s_icon,
    title: s_title,
    buttonRow: s_buttonRow,
    refresh: s_refresh,
    bell: s_bell,
    refreshing: s_refreshing,
} = CSS;

export default function(props: SiteHeaderProps): JSX.Element {
    
    return (
        <>
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

            </header>
            {props.onRefresh || props.onBellClicked ? 
                (
                    <div className={toCss(s_buttonRow)}>
                        {props.onBellClicked && (
                            <FontAwesomeIcon 
                                icon={(props.bellSelected ? fasBell : farBell) as IconProp} 
                                className={toCss(s_bell)}
                                onClick={() => props.onBellClicked ? props.onBellClicked() : null}
                            />
                        )}
                        {props.onRefresh && (
                            <FontAwesomeIcon 
                                icon={faSyncAlt} 
                                className={toCss(s_refresh, (props.refreshing ? s_refreshing : ''))}
                                onClick={() => props.onRefresh ? props.onRefresh() : null}
                            />
                        )}
                    </div>
                )
                : null
            }
        </>
    );
}