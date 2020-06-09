import React from 'react';
import { faQuoteLeft } from '@fortawesome/free-solid-svg-icons';

import CSS from './Testimonial.module.scss';
import { TestimonialProps } from './Testimonial.d';
import { toCss } from '../../../util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
const {
    wrapper: s_wrapper,
    quote: s_quote,
    body: s_body,
    from: s_from,
} = CSS;

export default function(props: TestimonialProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>
            <FontAwesomeIcon icon={faQuoteLeft} className={toCss(s_quote)} /> 
            <p className={toCss(s_body)} >{props.quote}</p>
            <aside className={toCss(s_from)} >{props.from}</aside>
        </div>
    );
}