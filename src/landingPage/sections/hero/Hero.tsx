import React, { Fragment, useRef } from 'react';

import CSS from './Hero.module.scss';
import { HeroProps } from './Hero.d';
import { toCss, scrollTo } from '../../../util/util';
import NameBrand from '../../components/nameBrand/NameBrand';
import CtaButton from '../../components/ctaButton/CtaButton';
import DeviceComposition from '../../components/deviceComposition/DeviceComposition';
import { Link } from 'react-router-dom';
import { laptopPngSet, laptopSizes, laptopWebpSet, laptopFallback, phonePngSet, phoneSizes, phoneWebpSet, phoneFallback, tabletPngSet, tabletSizes, tabletWebpSet, tabletFallback } from './Img';
import globalCSS from '../../../style/global.module.scss';
const { layoutContainer: s_layoutContainer } = globalCSS;
const {
    wrapper: s_wrapper,
    showcase: s_showcase,
    ctaArea: s_ctaArea,
    nameBrand: s_nameBrand,
    slogan: s_slogan,
    ctaBtn: s_ctaBtn,
    login: s_login,
    arrow: s_arrow,
    ctaAndLogin: s_ctaAndLogin,
    sloganMobile: s_sloganMobile,
    downArrow: s_downArrow,
} = CSS;



export default function(props: HeroProps): JSX.Element {

    const compositionRef = useRef(null);
    
    return (
        <Fragment>
            <header className={toCss(s_wrapper)}>

                <div className={toCss(s_layoutContainer)} >

                    <div className={toCss(s_nameBrand)} >
                        <NameBrand first='erik' last='schake' withBg/>
                    </div>

                    <div 
                        ref={compositionRef}
                        className={toCss(s_showcase)} 
                    >

                        <DeviceComposition
                            laptopPngSet={laptopPngSet} laptopWebpSet={laptopWebpSet} laptopFallback={laptopFallback}
                            laptopSizes={laptopSizes}
                            laptopAlt='Screenshot taken from the subject view in the todo webapp for university education on a laptop.'
                            tabletPngSet={tabletPngSet} tabletWebpSet={tabletWebpSet} tabletFallback={tabletFallback}
                            tabletSizes={tabletSizes}
                            tabletAlt='Screenshot taken from the subject view in the todo webapp for university education on a tablet.'
                            phonePngSet={phonePngSet} phoneWebpSet={phoneWebpSet} phoneFallback={phoneFallback}
                            phoneSizes={phoneSizes}
                            phoneAlt='Screenshot taken from the subject view in the todo webapp for university education on a phone.'
                        />

                    </div>

                    <div className={toCss(s_ctaArea)}>
                        <h1>Unisched<span className={toCss(s_arrow)}></span> </h1>
                        <div className={toCss(s_ctaAndLogin)} >
                            <div className={toCss(s_ctaBtn)} >
                                <CtaButton
                                    linkTo='/auth'
                                >
                                    Free Sign Up
                                </CtaButton>
                            </div>                
                            <p className={toCss(s_login)} ><Link to='/auth'>or Login</Link></p>    
                        </div>  
                        <span className={toCss(s_sloganMobile)}>The best tool to get organized!</span>
                        <span onClick={() => scrollTo(compositionRef)} className={toCss(s_downArrow)}></span>                    
                    </div> 
                </div>
            </header>
            <strong className={toCss(s_slogan)} >Get organized now!</strong>

        </Fragment> 
    );
}