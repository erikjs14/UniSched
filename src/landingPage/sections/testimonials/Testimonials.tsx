import React from 'react';

import CSS from './Testimonials.module.scss';
import { TestimonialsProps } from './Testimonials.d';
import Testimonial from '../../components/testimonial/Testimonial';
import globalCSS from '../../../style/global.module.scss';
import { toCss } from '../../../util/util';
const { layoutContainer: s_layoutContainer } = globalCSS;
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: TestimonialsProps): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>
            <div className={toCss(s_layoutContainer)}>

                <h2>Happy users say</h2>

                <Testimonial
                    quote='At first, I was suspicious given the colorful design. It seemed a little playful instead of useful. But now I absolutely love it. Seeing the color immediately lets me think of the specific subject. Never before have I been so organized. My life is better now.'
                    from='Very satisfied anonymous user'
                />
                <Testimonial
                    quote='The perfect app to organize all to-dos, schedules and exams! Makes a lot of fun using it and motivates me to finish my exercises. The usage is very easy and understandable, thus it doesn’t take you more than a few minutes to modify or add related information! I recommend this app to every student who wants to have a structured Uni-life 😁'
                    from='Another very satisfied anonymous user'
                />
            </div> 
        </section>
    );
}