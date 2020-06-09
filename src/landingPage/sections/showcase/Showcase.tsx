import React from 'react';

import CSS from './Showcase.module.scss';
import orderVideoUrl from '../../assets/video/order.mp4';
import { ShowcaseProps } from './Showcase.d';
import { toCss } from '../../../util/util';
import Case from '../../components/case/Case';
import CtaButton from '../../components/ctaButton/CtaButton';
const {
    wrapper: s_wrapper,
    ctaBtn: s_ctaBtn,
    orderVideo: s_orderVideo,
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
            >
                <div className={toCss(s_orderVideo)} >
                    <video autoPlay muted loop>
                        <source src={orderVideoUrl} type='video/mp4' />
                    </video>
                </div>
            </Case>

            <div className={toCss(s_ctaBtn)} >
                <CtaButton linkTo='/auth'> Sign Up Now </CtaButton>
            </div> 

        </section>
    );
}