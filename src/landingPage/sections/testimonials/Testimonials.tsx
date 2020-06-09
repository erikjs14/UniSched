import React from 'react';

import CSS from './Testimonials.module.scss';
import { TestimonialsProps } from './Testimonials.d';
import Testimonial from '../../components/testimonial/Testimonial';
import { toCss } from '../../../util/util';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: TestimonialsProps): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>
            <Testimonial
                quote='At first, I was suspicious given the colorful design. It seemed a little playful instead of useful. But now I absolutely love it. Seeing the color immediately lets me think of the specific subject. Never before have I been so organized. My life is better now.'
                from='Very satisfied anonymous user'
            />
        </section> 
    );
}