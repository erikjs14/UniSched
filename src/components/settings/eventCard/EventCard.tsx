import React from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from './EventCard.module.scss';
import { EventCardProps } from './EventCard.d';
import SettingsCard from '../settingsCard/SettingsCard';
import Input from '../../ui/input/Input';
import { Timestamp, IntervalType, IntervalOptions } from '../../../firebase/model';
import { getDateFromSeconds, getTimestampFromDate } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/settingsConfig';
import Button from '../../../components/ui/button/Button';
import { toCss } from './../../../util/util';
const {
    header: s_header,
    content: s_content,
    row: s_row,
    datetimepicker: s_datetimepicker,
    removeBtn: s_removeBtn,
    btnRow: s_btnRow,
    intervalOptions: s_intervalOptions,
} = CSS;

export default function(props: EventCardProps): JSX.Element {

    const header = (
        <div className={toCss(s_header)}>
            <Input
                elementType='input-transparent'
                value={props.data.type}
                onChange={newVal => props.onChange<string>('type', newVal)}
                label='Insert title here'
            />
        </div>
    );

    const CustomDateInput = ({ value, onClick}: any) => (
        <div onClick={onClick} className={toCss(s_datetimepicker)}>
            {value}
        </div>
    );

    return (
        <SettingsCard
            header={header}
        >
            <div className={toCss(s_content)}>

                <div className={toCss(s_row)}>
                    <span>First Start</span>
                    <DateTimePicker
                        customInput={<CustomDateInput />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.firstStart.seconds)}
                        onChange={date => props.onChange<Timestamp>('firstStart', getTimestampFromDate(date || new Date()))}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>First End</span>
                    <DateTimePicker
                        customInput={<CustomDateInput />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.firstEnd.seconds)}
                        onChange={date => props.onChange<Timestamp>('firstEnd', getTimestampFromDate(date || new Date()))}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                        minDate={getDateFromSeconds(props.data.firstStart.seconds)}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>End at</span>
                    <DateTimePicker
                        customInput={<CustomDateInput />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.endAt.seconds)}
                        onChange={date => props.onChange<Timestamp>('endAt', getTimestampFromDate(date || new Date()))}
                        minDate={getDateFromSeconds(props.data.firstEnd.seconds)}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>Interval</span>
                    <Input
                        label='Interval'
                        elementType='select-visual'
                        value={props.data.interval}
                        onChange={newInterval => props.onChange<IntervalType>('interval', newInterval as IntervalType)}
                        options={IntervalOptions}
                        addClass={toCss(s_intervalOptions)}
                    />
                </div>

                <div className={toCss(s_btnRow)}>
                    <Button
                        danger
                        fontSize='.8em'
                        onClick={() => props.onRemove()}
                        className={toCss(s_removeBtn)}
                    >
                        Remove
                    </Button>
                </div>

            </div>

        </SettingsCard>
    );
}