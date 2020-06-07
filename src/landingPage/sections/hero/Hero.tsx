import React from 'react';

import laptopUrl from '../../assets/img/subjects_macbook.png';
import tabletUrl from '../../assets/img/subjects_ipad_port.png';
import phoneUrl from '../../assets/img/subjects_iphone.png';

import CSS from './Hero.module.scss';
import { HeroProps } from './Hero.d';
import { toCss } from '../../../util/util';
import {ReactComponent as Wave} from '../../assets/svg/wave.svg';
import NameBrand from '../../components/nameBrand/NameBrand';
import CtaButton from '../../components/ctaButton/CtaButton';
import DeviceComposition from '../../components/deviceComposition/DeviceComposition';
const {
    wrapper: s_wrapper,
    wave: s_wave,
    showcase: s_showcase,
    ctaArea: s_ctaArea,
    nameBrand: s_nameBrand,
    by: s_by,
} = CSS;

export default function(props: HeroProps): JSX.Element {
    
    return (
        <header className={toCss(s_wrapper)}>

            <div className={toCss(s_showcase)} >

                <DeviceComposition
                    laptopUrl={laptopUrl}
                    laptopAlt='Screenshot taken from the subject view in the todo webapp for university education on a laptop.'
                    tabletUrl={tabletUrl}
                    tabletAlt='Screenshot taken from the subject view in the todo webapp for university education on a tablet.'
                    phoneUrl={phoneUrl}
                    phoneAlt='Screenshot taken from the subject view in the todo webapp for university education on a phone.'
                />

            </div>

            <div className={toCss(s_ctaArea)}>
                <h1>Unisched</h1>
                <div className={toCss(s_nameBrand)} >
                    <div className={toCss(s_by)} >
                        by
                    </div>
                    <NameBrand first='erik' last='schake' withBg/>
                </div>
                <CtaButton
                    linkTo='/auth'
                >
                    Sign Up
                </CtaButton>
            </div> 

            <Wave className={toCss(s_wave)} />
        </header>
    );
}