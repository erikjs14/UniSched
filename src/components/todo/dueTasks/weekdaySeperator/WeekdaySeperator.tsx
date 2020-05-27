import React from 'react';

import CSS from './WeekdaySeperator.module.scss';
import { WeekdaySeperatorProps } from './WeekdaySeperator.d';
import { toCss } from './../../../../util/util';
import { getWeekDay, formatDateOutput } from '../../../../util/timeUtil';
const {
    wrapper: s_wrapper,
    weekday: s_weekday,
    date: s_date,
    amount: s_amount,
} = CSS;

export default function(props: WeekdaySeperatorProps): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>
            <h3 className={toCss(s_weekday)}>
                {getWeekDay(props.date)}
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