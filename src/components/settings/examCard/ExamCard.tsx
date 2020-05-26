import React from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import { ExamCardProps } from './ExamCard.d';
import SettingsCard from '../settingsCard/SettingsCard';
import { Timestamp } from '../../../firebase/model';
import { getDateFromSeconds, getTimestampFromDate } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/settingsConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from './../customDateInputUI/CustomDateInputUI';
const {
    row: s_row,
} = CSS;

export default function(props: ExamCardProps): JSX.Element {

    return (
        <SettingsCard
            headerValue={props.data.type}
            onHeaderValueChange={newVal => props.onChange('type', newVal)}
            onRemoveClicked={props.onRemove}
        >

                <div className={toCss(s_row)}>
                    <span>Date</span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(props.data.start.seconds)}
                        onChange={date => props.onChange<Timestamp>('start', getTimestampFromDate(date || new Date()))}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                    />
                </div>

        </SettingsCard>
    );
}