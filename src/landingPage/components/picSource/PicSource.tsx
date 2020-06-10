import React from 'react';

import CSS from './PicSource.module.scss';
import { PicSourceProps } from './PicSource.d';
import { toCss } from '../../../util/util';
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
                srcSet={props.item.pngSet}
                sizes={props.item.sizes}
                type='image/png'
            />
            <img
                src={props.item.fallback}
                alt={props.alt}
                className={toCss(props.imgClass)} 
            />
        </picture>
    );
}