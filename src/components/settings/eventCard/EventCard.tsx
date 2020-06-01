import React from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import Input from '../../ui/input/Input';
import { Timestamp, IntervalType, IntervalOptions } from '../../../firebase/model';
import { getDateFromSeconds, getTimestampFromDate, getFilterForInterval } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/settingsConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from '../customDateInputUI/CustomDateInputUI';
import { EventModel } from './../../../firebase/model';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import { Tooltip, InfoSignIcon } from 'evergreen-ui';
const {
    row: s_row,
    intervalOptions: s_intervalOptions,
    infoIcon: s_infoIcon,
} = CSS;

export default function(props: SubjectDataCardProps<EventModel>): JSX.Element {

    return (
        <SettingsCard
            headerValue={props.data.type}
            onHeaderValueChange={newVal => props.onChange<string>('type', newVal)}
            onRemoveClicked={props.onRemove}
            markEmptyTitles={props.markEmptyTitles}
        >

                <div className={toCss(s_row)}>
                    <span>
                        First Start
                        <Tooltip content='Select the start (date and time) of the first event of this type.'>
                            <InfoSignIcon className={toCss(s_infoIcon)} />
                        </Tooltip>
                    </span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.firstStart.seconds)}
                        onChange={date => props.onChange<Timestamp>('firstStart', getTimestampFromDate(date || new Date()))}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>
                        First End
                        <Tooltip content='Select the end (date and time) of the first event of this type.'>
                            <InfoSignIcon className={toCss(s_infoIcon)} />
                        </Tooltip>
                    </span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.firstEnd.seconds)}
                        onChange={date => props.onChange<Timestamp>('firstEnd', getTimestampFromDate(date || new Date()))}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                        minDate={getDateFromSeconds(props.data.firstStart.seconds)}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>
                        Last Event
                        <Tooltip content='Select the day when this event will happen for the last time.'>
                            <InfoSignIcon className={toCss(s_infoIcon)} />
                        </Tooltip>
                    </span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.endAt.seconds)}
                        onChange={date => props.onChange<Timestamp>('endAt', getTimestampFromDate(date || new Date()))}
                        minDate={getDateFromSeconds(props.data.firstEnd.seconds)}
                        filterDate={getFilterForInterval(props.data.firstStart.seconds, props.data.interval)}
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

        </SettingsCard>
    );
}