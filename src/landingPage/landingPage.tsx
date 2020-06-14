import React, { useRef, useEffect } from 'react';
import Hero from './sections/hero/Hero';
import Functions from './sections/functions/Functions';
import Testimonials from './sections/testimonials/Testimonials';
import Showcase from './sections/showcase/Showcase';
import Footer from './sections/footer/Footer';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '..';
import CSS from './landingPage.module.scss';
import { toCss } from '../util/util';
import { useHistory } from 'react-router-dom';
import BackTop from '../components/backtop/BackTop';
import * as actions from '../store/actions';
const {
    toAppContainer: s_toAppContainer,
    wrapper: s_wrapper,
} = CSS;

export default function(): JSX.Element {

    const isSignedIn = useSelector((state: RootState) => state.user.username !== null);
    const history = useHistory();

    const dispatch = useDispatch();
    const scrollContainerRef = useRef(null);
    useEffect(() => {
        dispatch(actions.setScrollContainerRef(null));
    }, [dispatch]);

    return (
        <div ref={scrollContainerRef} className={toCss(s_wrapper)} >

            {isSignedIn ? (
                <div 
                    onClick={() => history.push('/todo')}
                    className={toCss(s_toAppContainer)} 
                >
                    <span>&rarr;</span>
                    To App
                </div>
            ) : null}
            
            <Hero

            />

            <Functions

            />

            <Testimonials

            />

            <Showcase

            />

            <Footer

            />

            <BackTop />

        </div>
    )
}