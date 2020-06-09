import React from 'react';

import CSS from './DeviceComposition.module.scss';
import { DeviceCompositionProps } from './DeviceComposition.d';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
    device: s_device,
    laptop: s_laptop,
    tablet: s_tablet,
    phone: s_phone,
} = CSS;

export default function(props: DeviceCompositionProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)} >
            
            <img
                src={props.laptopUrl}
                alt={props.laptopAlt}
                className={toCss(s_device, s_laptop)} 
            />

            <img
                src={props.tabletUrl}
                alt={props.tabletAlt}
                className={toCss(s_device, s_tablet)} 
            />

            <img
                src={props.phoneUrl}
                alt={props.phoneAlt}
                className={toCss(s_device, s_phone)} 
            />

        </div>
    );
}