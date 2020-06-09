import React from 'react';
// import laptopSubjectSettingsBlue from '../../assets/img/gallery/laptop-subject-settings-blue.png';
import laptopSubjectSettingsGreen from '../../assets/img/gallery/laptop-subject-settings-green.png';
// import laptopSubjectSettingsPurple from '../../assets/img/gallery/laptop-subject-settings-purple.png';
import laptopSubjects from '../../assets/img/gallery/laptop-subjects.png';
// import laptopTodo from '../../assets/img/gallery/laptop-todo.png';
import phoneExams from '../../assets/img/gallery/phone-exams.png';
// import phoneScheduleMonth from '../../assets/img/gallery/phone-schedule-month.png';
import phoneScheduleDay from '../../assets/img/gallery/phone-schedule-day.png';
// import phoneSubjects from '../../assets/img/gallery/phone-subjects.png';
import phoneTodo from '../../assets/img/gallery/phone-todo.png';
// import tabLandExams from '../../assets/img/gallery/tab-land-exams.png';
import tabLandScheduleMonth from '../../assets/img/gallery/tab-land-schedule-month.png';
// import tabLandScheduleWeek from '../../assets/img/gallery/tab-land-schedule-week.png';
import tabLandSubjectSettingsRed from '../../assets/img/gallery/tab-land-subject-settings-red.png';
// import tabLandSubjects from '../../assets/img/gallery/tab-land-subjects.png';
import tabLandTodo from '../../assets/img/gallery/tab-land-todo.png';
// import tabPortExams from '../../assets/img/gallery/tab-port-exams.png';
import tabPortMenu from '../../assets/img/gallery/tab-port-menu.png';
// import tabPortScheduleList from '../../assets/img/gallery/tab-port-schedule-list.png';
// import tabPortScheduleMonth from '../../assets/img/gallery/tab-port-schedule-month.png';
// import tabPortScheduleWeek from '../../assets/img/gallery/tab-port-schedule-week.png';
import tabPortSubjectSettingsBlue from '../../assets/img/gallery/tab-port-subject-settings-blue.png';
// import tabPortSubjects from '../../assets/img/gallery/tab-port-subjects.png';
import tabPortTodo from '../../assets/img/gallery/tab-port-todo.png';

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
    gallery: s_gallery,
    colorful: s_colorful,
    intuitive: s_intuitive,
    image: s_image,
    item1: s_item1,
    item2: s_item2,
    item3: s_item3,
    item4: s_item4,
    item5: s_item5,
    item6: s_item6,
    item7: s_item7,
} = CSS;

export default function(props: ShowcaseProps): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>
            <h4>You like...</h4>

            <Case
                text='Colorful Design'    
            >
                <div className={toCss(s_gallery, s_colorful)} >
                    <figure className={toCss(s_item1)}><img src={laptopSubjects} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item2)}><img src={phoneTodo} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item3)}><img src={tabLandScheduleMonth} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item4)}><img src={tabPortSubjectSettingsBlue} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item5)}><img src={tabLandSubjectSettingsRed} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item6)}><img src={laptopSubjectSettingsGreen} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item7)}><img src={tabLandTodo} alt='' className={toCss(s_image)} /></figure>
                </div>
            </Case>

            <Case
                left
                text='Intuitive Design'    
            >
                <div className={toCss(s_gallery, s_intuitive)} >
                    <figure className={toCss(s_item1)}><img src={phoneExams} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item2)}><img src={phoneScheduleDay} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item3)}><img src={tabLandScheduleMonth} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item4)}><img src={tabPortTodo} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item5)}><img src={tabPortMenu} alt='' className={toCss(s_image)} /></figure> 
                    <figure className={toCss(s_item6)}><img src={laptopSubjectSettingsGreen} alt='' className={toCss(s_image)} /></figure>
                    <figure className={toCss(s_item7)}><img src={tabLandTodo} alt='' className={toCss(s_image)} /></figure>
                </div>
            </Case>

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