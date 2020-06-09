import React from 'react';
import { faCheckCircle, faFeather, faCalendarAlt } from '@fortawesome/free-solid-svg-icons';

import CSS from './Functions.module.scss';
import { FunctionsProps } from './Functions.d';
import { toCss } from '../../../util/util';
import FunctionCard from '../../components/functionCard/FunctionCard';
const {
    wrapper: s_wrapper,
    cards: s_cards,
    card: s_card,
} = CSS;

export default function(props: FunctionsProps): JSX.Element {
    
    return (
        <section className={toCss(s_wrapper)}>
            <div className={toCss(s_cards)} >
                
                <FunctionCard
                    icon={faCheckCircle}
                    header='ToDo'
                    text='Organize all work that needs to be done. Set deadlines, repeating tasks and check tasks satisfyingly.'
                    addCss={toCss(s_card)}
                />
                <FunctionCard
                    icon={faCalendarAlt}
                    header='Schedule'
                    text='Add events, such as lectures, exercises or whatever else is happening once, or repeatedly.'
                    addCss={toCss(s_card)}
                />
                <FunctionCard
                    icon={faFeather}
                    header='Exams'
                    text='Save all your future exams in one place and always know when which exam is going to happen.'
                    addCss={toCss(s_card)}
                />
            </div>
        </section>
    );
}