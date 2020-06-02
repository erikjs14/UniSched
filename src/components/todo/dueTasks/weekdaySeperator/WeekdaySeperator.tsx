import React from 'react';

import CSS from './WeekdaySeperator.module.scss';
import { WeekdaySeperatorProps } from './WeekdaySeperator.d';
import { toCss } from './../../../../util/util';
import { formatDateOutput, isToday } from '../../../../util/timeUtil';
import { getDayIdentifier } from './../../../../util/timeUtil';
const {
    wrapper: s_wrapper,
    weekday: s_weekday,
    date: s_date,
    amount: s_amount,
    today: s_today,
} = CSS;

export default function(props: WeekdaySeperatorProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>
            <h3 className={toCss(s_weekday, (isToday(props.date) ? s_today : ''))}>
                {props.withClock ? <span role='img' aria-label='clock'> 🕑 </span> : null} 
                {getDayIdentifier(props.date)}
            </h3>
            <span className={toCss(s_date)}>
                {formatDateOutput(props.date)}
            </span>
            <span className={toCss(s_amount)}>
                ToDo: {props.amount}
            </span>
        </div>
    );
}