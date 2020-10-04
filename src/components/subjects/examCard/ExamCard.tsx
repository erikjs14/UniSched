import React from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import { Timestamp, ExamModel } from '../../../firebase/model';
import { getDateFromSeconds, getTimestampFromDate } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/timeConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from './../customDateInputUI/CustomDateInputUI';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import Input from '../../ui/input/Input';
const {
    row: s_row,
    checkAddInfo: s_checkAddInfo,
    addInfoTextarea: s_addInfoTextarea,
} = CSS;

export default function(props: SubjectDataCardProps<ExamModel>): JSX.Element {

    const { additionalInfo } = props.data;
    
    return (
        <SettingsCard
            headerValue={props.data.type}
            onHeaderValueChange={newVal => props.onChange('type', newVal)}
            onRemoveClicked={props.onRemove}
            markEmptyTitles={props.markEmptyTitles}
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

                <div className={toCss(s_row)} >
                    <span>
                        Add Info
                        <Input 
                            addClass={s_checkAddInfo} 
                            label='' 
                            elementType='simple-checkbox' 
                            value={additionalInfo ? true : false} 
                            onChange={() => !additionalInfo ? props.onChange<{text: string;}|null>('additionalInfo', {text: ''}) : props.onChange<{text: string;}|null>('additionalInfo', null)} 
                        />
                    </span>
                    {additionalInfo && 
                        <Input
                            addClass={s_addInfoTextarea} 
                            label='Add Info'
                            elementType='text-area'
                            value={additionalInfo.text}
                            onChange={newText => props.onChange<{text: string;}|null>('additionalInfo', {text: newText as string})}
                        />
                    }
                </div>

        </SettingsCard>
    );
}