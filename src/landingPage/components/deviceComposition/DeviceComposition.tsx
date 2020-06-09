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
            
            <picture className={toCss(s_device, s_laptop)}>
                <source
                    srcSet={props.laptopWebpSet}
                    sizes={props.laptopSizes}
                    type='image/webp'
                />
                <source
                    srcSet={props.laptopPngSet}
                    sizes={props.laptopSizes}
                    type='image/png'
                />
                <img
                    src={props.laptopFallback}
                    alt={props.laptopAlt}
                />
            </picture>
        
            <picture className={toCss(s_device, s_tablet)}>
                <source
                    srcSet={props.tabletWebpSet}
                    sizes={props.tabletSizes}
                    type='image/webp'
                />
                <source
                    srcSet={props.tabletPngSet}
                    sizes={props.tabletSizes}
                    type='image/png'
                />
                <img
                    src={props.tabletFallback}
                    alt={props.tabletAlt}
                />
            </picture>

            <picture className={toCss(s_device, s_phone)}>
                <source
                    srcSet={props.phoneWebpSet}
                    sizes={props.phoneSizes}
                    type='image/webp'
                />
                <source
                    srcSet={props.phonePngSet}
                    sizes={props.phoneSizes}
                    type='image/png'
                />
                <img
                    src={props.phoneFallback}
                    alt={props.phoneAlt}
                />
            </picture>

        </div>
    );
}