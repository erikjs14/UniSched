import React from 'react';
import DateTimePicker from 'react-datepicker';

// import CSS from './EventCard.module.scss';
import { EventCardProps } from './EventCard.d';
import SettingsCard from '../settingsCard/SettingsCard';
import Input from '../../ui/input/Input';
import { Timestamp, IntervalType, IntervalOptions } from '../../../firebase/model';
import { getDateFromSeconds, getTimestampFromDate } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/settingsConfig';
// const {
    
// } = CSS;

export default function(props: EventCardProps): JSX.Element {

    const header = (
        <div>
            <Input
                elementType='input-transparent'
                value={props.data.type}
                onChange={newVal => props.onChange<string>('type', newVal)}
                label='Insert title here'
            />
        </div>
    );

    return (
        <SettingsCard 
            header={header}
        >

            <span>First Start</span>
            <DateTimePicker
                selected={getDateFromSeconds(props.data.firstStart.seconds)}
                onChange={date => props.onChange<Timestamp>('firstStart', getTimestampFromDate(date || new Date()))}
                {...DATETIMEPICKER_DEFAULT_PROPS}
            />

            <span>First End</span>
            <DateTimePicker
                selected={getDateFromSeconds(props.data.firstEnd.seconds)}
                onChange={date => props.onChange<Timestamp>('firstEnd', getTimestampFromDate(date || new Date()))}
                {...DATETIMEPICKER_DEFAULT_PROPS}
                minDate={getDateFromSeconds(props.data.firstStart.seconds)}
            />

            <span>End at</span>
            <DateTimePicker
                selected={getDateFromSeconds(props.data.endAt.seconds)}
                onChange={date => props.onChange<Timestamp>('endAt', getTimestampFromDate(date || new Date()))}
                minDate={getDateFromSeconds(props.data.firstEnd.seconds)}
            />

            <span>Interval</span>
            <Input
                label='Interval'
                elementType='select-visual'
                value={props.data.interval}
                onChange={newInterval => props.onChange<IntervalType>('interval', newInterval as IntervalType)}
                options={IntervalOptions}
            />

        </SettingsCard>
    );
}