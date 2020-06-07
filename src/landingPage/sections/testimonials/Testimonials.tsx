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
                quote='Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren,'                
                from='Larry Bird'
            />
        </section> 
    );
}