import React from 'react';

import CSS from './Showcase.module.scss';
import { ShowcaseProps } from './Showcase.d';
import { toCss } from '../../../util/util';
import Case from '../../components/case/Case';
import CtaButton from '../../components/ctaButton/CtaButton';
const {
    wrapper: s_wrapper,
    ctaBtn: s_ctaBtn,
} = CSS;

export default function(props: ShowcaseProps): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>
            <h4>You like...</h4>

            <Case
                text='Colorful Design'    
            />
            <Case
                left
                text='Intuitive Design'    
            />
            <Case
                text='And Order?'    
            />

            <div className={toCss(s_ctaBtn)} >
                <CtaButton linkTo='/auth'> Sign Up Now </CtaButton>
            </div> 

        </section>
    );
}