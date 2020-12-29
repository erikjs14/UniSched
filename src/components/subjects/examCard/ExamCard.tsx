import React, { useState } from 'react';
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
import { Button } from 'evergreen-ui';
import MarkdownDialog from '../../dialogs/MarkdownDialog';
const {
    row: s_row,
    checkAddInfo: s_checkAddInfo
} = CSS;

export default function(props: SubjectDataCardProps<ExamModel>): JSX.Element {

    const { additionalInfo } = props.data;

    const [infoDialogShown, setInfoDialogShown] = useState(false);
    
    return (
        <SettingsCard
            headerValue={props.data.type}
            onHeaderValueChange={newVal => props.onChange('type', newVal)}
            onRemoveClicked={props.onRemove}
            markEmptyTitles={props.markEmptyTitles}
        >

                <div className={toCss(s_row)}>
                    <span>
                        Date
                        <Input
                            label=''
                            addClass={s_checkAddInfo} 
                            elementType='simple-checkbox'
                            value={props.data.start ? true : false}
                            onChange={val => {
                                props.onChange<Timestamp|null>('start', (
                                    !props.data.start
                                        ? getTimestampFromDate(new Date())
                                        : null
                                ));
                            }}
                        />
                    </span>
                    { props.data.start && (
                        <DateTimePicker
                            customInput={<CustomDateInputUI />}
                            showWeekNumbers
                            withPortal
                            selected={getDateFromSeconds(props.data.start.seconds)}
                            onChange={date => props.onChange<Timestamp>('start', getTimestampFromDate(date || new Date()))}
                            {...DATETIMEPICKER_DEFAULT_PROPS}
                        />
                    )}
                </div>

                <div className={toCss(s_row)} >
                    <span>Grade</span>
                    <Input
                        label=''
                        elementType='number'
                        elementConfig={{
                            width: '8rem',
                        }}
                        value={props.data.grade || 'none'}
                        onChange={val => {
                            props.onChange<number|null>('grade', (val as number|null) || null);
                        }}
                    />
                </div>

                <div className={toCss(s_row)} >
                    <span>Weight of Grade</span>
                    <Input
                        label=''
                        elementType='number'
                        elementConfig={{
                            min: 0,
                            width: '8rem',
                        }}
                        value={props.data.gradeWeight}
                        onChange={val => {
                            props.onChange<number>('gradeWeight', (val as number) || 1);
                        }}
                    />
                </div>

                <div className={toCss(s_row)} >
                    <span>
                        Add Info
                    </span>
                    <Button
                        iconBefore='edit'
                        onClick={() => setInfoDialogShown(prev => !prev)}
                    >
                        Edit
                    </Button>
                    { infoDialogShown && (
                        <MarkdownDialog
                            title={'Additional Info for "'+props.data.type+'"'}
                            show={infoDialogShown}
                            onClose={() => setInfoDialogShown(false)}
                            rawMarkdown={additionalInfo?.text || ''}
                            onRawMarkdownChange={newText => props.onChange('additionalInfo', {text: newText})}
                            editMode={true}
                        />
                    )}
                </div>

        </SettingsCard>
    );
}