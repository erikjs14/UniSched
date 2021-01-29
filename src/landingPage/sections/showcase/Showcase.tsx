import React from 'react';

import { g1item1, g1item2, g1item3, g1item4, g1item5, g1item6, g1item7 } from './ImgG1';
import { g2item1, g2item2, g2item4, g2item5, g2item6 } from './ImgG2';

import CSS from './Showcase.module.scss';
import { ShowcaseProps } from './Showcase.d';
import { toCss } from '../../../util/util';
import Case from '../../components/case/Case';
import CtaButton from '../../components/ctaButton/CtaButton';
import PicSource from '../../components/picSource/PicSource';
import { fallbackImgItem } from './Img';
import { trackWindowScroll, ScrollPosition } from 'react-lazy-load-image-component';
import globalCSS from '../../../style/global.module.scss';
const { layoutContainer: s_layoutContainer } = globalCSS;
const {
    wrapper: s_wrapper,
    ctaBtn: s_ctaBtn,
    orderVideo: s_orderVideo,
    gallery: s_gallery,
    colorful: s_colorful,
    intuitive: s_intuitive,
    fallbackImg: s_fallbackImg,
    image: s_image,
    item1: s_item1,
    item2: s_item2,
    item3: s_item3,
    item4: s_item4,
    item5: s_item5,
    item6: s_item6,
    item7: s_item7,
} = CSS;

export default trackWindowScroll(function(props: ShowcaseProps&{scrollPosition: ScrollPosition|undefined}): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>

            <div className={toCss(s_layoutContainer)}>
                <h4>You like...</h4>

                <Case
                    text='Colorful Design'    
                >
                    <div className={toCss(s_gallery, s_colorful)} >
                        <PicSource scrollPosition={props.scrollPosition} item={g1item1} figClass={toCss(s_item1)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item2} figClass={toCss(s_item2)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item3} figClass={toCss(s_item3)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item4} figClass={toCss(s_item4)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item5} figClass={toCss(s_item5)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item6} figClass={toCss(s_item6)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item7} figClass={toCss(s_item7)} imgClass={s_image} alt='' />
                    </div>
                </Case>

                <Case
                    left
                    text='Intuitive Design'    
                >
                    <div className={toCss(s_gallery, s_intuitive)} >
                        <PicSource scrollPosition={props.scrollPosition} item={g2item1} figClass={toCss(s_item1)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g2item2} figClass={toCss(s_item2)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item3} figClass={toCss(s_item3)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g2item4} figClass={toCss(s_item4)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g2item5} figClass={toCss(s_item5)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g2item6} figClass={toCss(s_item6)} imgClass={s_image} alt='' />
                        <PicSource scrollPosition={props.scrollPosition} item={g1item7} figClass={toCss(s_item7)} imgClass={s_image} alt='' />
                    </div>
                </Case>

                <Case
                    text='And Order?'   
                    minHeight
                >
                    <div className={toCss(s_orderVideo)} >
                        <PicSource 
                            scrollPosition={props.scrollPosition} 
                            item={fallbackImgItem} 
                            figClass={toCss(s_fallbackImg)}
                            alt='A structured desk with writing stuff and a laptop' 
                        />
                    </div>
                </Case>

                <div className={toCss(s_ctaBtn)} >
                    <CtaButton linkTo='/auth'> Sign Up Now </CtaButton>
                </div> 
            </div>
        </section>
    );
});