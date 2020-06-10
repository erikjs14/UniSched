import React from 'react';
import { faCheckCircle, faFeather, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import CSS from './Functions.module.scss';
import { FunctionsProps } from './Functions.d';
import { toCss } from '../../../util/util';
import FunctionCard from '../../components/functionCard/FunctionCard';
import { LazyLoadComponent } from 'react-lazy-load-image-component';
const {
    wrapper: s_wrapper,
    cards: s_cards,
    card: s_card,
} = CSS;

export default function(props: FunctionsProps): JSX.Element {
    
    return (
        <LazyLoadComponent>
            <section className={toCss(s_wrapper)}>

                    <h2>Functionality</h2>
                
                    <div className={toCss(s_cards)} >
                        
                        <FunctionCard
                            icon={faCheckCircle}
                            header='ToDo'
                            text="Organize all work that needs to be done. Set deadlines, repeating tasks and start planning your days the right way. With style. It's easy."
                            addCss={toCss(s_card)}
                        />
                        <FunctionCard
                            icon={faCalendarAlt}
                            header='Schedule'
                            text='Add events, such as lectures, exercises or whatever else is happening once, or repeatedly. View them in a structured schedule view.'
                            addCss={toCss(s_card)}
                        />
                        <FunctionCard
                            icon={faFeather}
                            header='Exams'
                            text='Save all your future exams in one place and always know when which exam is going to happen. Start to organize your exam preparation.'
                            addCss={toCss(s_card)}
                        />
                    </div>
            </section>
        </LazyLoadComponent>
    );
}