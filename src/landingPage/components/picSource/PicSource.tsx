import React from 'react';

import CSS from './PicSource.module.scss';
import { PicSourceProps } from './PicSource.d';
import { toCss } from '../../../util/util';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/opacity.css';
const {
    picture: s_picture,
} = CSS;

export default function(props: PicSourceProps): JSX.Element {
    
    return (
        <picture className={toCss(s_picture, props.figClass)}>
            <source
                srcSet={props.item.webpSet}
                sizes={props.item.sizes}
                type='image/webp'
            />
            <source
                srcSet={props.item.fallbackSet}
                sizes={props.item.sizes}
                type={props.item.fallbackType}
            />
            <LazyLoadImage
                scrollPosition={props.scrollPosition}
                src={props.item.fallback}
                alt={props.alt}
                effect='opacity'
                className={props.imgClass ? toCss(props.imgClass) : undefined} 
            />
        </picture>
    );
}