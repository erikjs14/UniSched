import React from 'react';

import { g1item1, g1item2, g1item3, g1item4, g1item5, g1item6, g1item7 } from './ImgG1';
import { g2item1, g2item2, g2item4, g2item5, g2item6 } from './ImgG2';

import CSS from './Showcase.module.scss';
import orderVideoMp4Url from '../../assets/video/order.mp4';
import orderVideoWebmUrl from '../../assets/video/order.webm';
import { ShowcaseProps } from './Showcase.d';
import { toCss, isMobile } from '../../../util/util';
import Case from '../../components/case/Case';
import CtaButton from '../../components/ctaButton/CtaButton';
import PicSource from '../../components/picSource/PicSource';
import { fallbackImgItem } from './Img';
import { LazyLoadComponent, trackWindowScroll, ScrollPosition } from 'react-lazy-load-image-component';
const {
    wrapper: s_wrapper,
    ctaBtn: s_ctaBtn,
    orderVideo: s_orderVideo,
    gallery: s_gallery,
    colorful: s_colorful,
    intuitive: s_intuitive,
    video: s_video,
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
                    {!isMobile() ? (
                        <LazyLoadComponent>
                            <video className={toCss(s_video)}  autoPlay muted loop>
                                <source src={orderVideoMp4Url} type='video/mp4' />
                                <source src={orderVideoWebmUrl} type='video/webm' />
                            </video>
                        </LazyLoadComponent>
                    ) : <PicSource scrollPosition={props.scrollPosition} item={fallbackImgItem} figClass={toCss(s_fallbackImg)} alt='A structured desk with writing stuff and a laptop' />}
                </div>
            </Case>

            <div className={toCss(s_ctaBtn)} >
                <CtaButton linkTo='/auth'> Sign Up Now </CtaButton>
            </div> 

        </section>
    );
});