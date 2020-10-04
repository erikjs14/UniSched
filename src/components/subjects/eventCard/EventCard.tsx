import React, { useState } from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import Input from '../../ui/input/Input';
import { EventModel, IntervalType, IntervalOptions, Timestamp } from '../../../firebase/model';
import { getFilterForInterval, getDateFromSeconds, getTimestampFromDate, getTimestampFromSeconds, getSecondsFromDate, sameDay, getExcludedTimes, findNextDayForInterval } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS, DATEPICKER_DEFAULT_PROPS } from './../../../config/timeConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from '../customDateInputUI/CustomDateInputUI';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import { Tooltip, InfoSignIcon, Button } from 'evergreen-ui';
import ExclusionsDialog from '../exclusionsDialog/ExclusionsDialog';
import { getAllTimestampsFromEvent } from '../../../util/scheduleUtil';
const {
    row: s_row,
    intervalOptions: s_intervalOptions,
    infoIcon: s_infoIcon,
    checkAddInfo: s_checkAddInfo,
    addInfoTextarea: s_addInfoTextarea,
} = CSS;

export default function(props: SubjectDataCardProps<EventModel>): JSX.Element {
    
    const { additionalInfo } = props.data;
    const [exclDialogShown, setExclDialogShown] = useState(false);

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
                        onChange={date => {
                            if (date) {
                                const oldDiffFirstEnd = props.data.firstEnd.seconds - props.data.firstStart.seconds;
                                const oldDiffLastEvent = props.data.endAt.seconds - props.data.firstStart.seconds;
                                const sec = getSecondsFromDate(date);
                                props.onChange<Timestamp>('firstStart', getTimestampFromDate(date || new Date()));
                                props.onChange<Timestamp>('firstEnd', getTimestampFromSeconds(sec + oldDiffFirstEnd));
                                props.onChange<Timestamp>('endAt', getTimestampFromSeconds(sec + oldDiffLastEvent));
                            }
                        }}
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
                        excludeTimes={sameDay(getDateFromSeconds(props.data.firstEnd.seconds), getDateFromSeconds(props.data.firstStart.seconds)) ? getExcludedTimes(getDateFromSeconds(props.data.firstStart.seconds)) : undefined}
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
                        onChange={date => {
                            props.onChange<Timestamp>('endAt', getTimestampFromDate(date || new Date()));
                            if (sameDay(date, getDateFromSeconds(props.data.firstEnd.seconds)) && props.data.interval !== 'once') {
                                props.onChange<IntervalType>('interval', 'once');
                            }
                        }}
                        minDate={getDateFromSeconds(props.data.firstEnd.seconds)}
                        filterDate={getFilterForInterval(props.data.firstStart.seconds, props.data.interval)}
                        {...DATEPICKER_DEFAULT_PROPS}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>Interval</span>
                    <Input
                        label='Interval'
                        elementType='select-visual'
                        value={props.data.interval}
                        onChange={newInterval => {
                            props.onChange<IntervalType>('interval', newInterval as IntervalType);
                            props.onChange<Timestamp>(
                                'endAt', 
                                getTimestampFromDate(
                                    findNextDayForInterval(
                                        getDateFromSeconds(props.data.firstStart.seconds), 
                                        getDateFromSeconds(props.data.endAt.seconds), 
                                        newInterval as IntervalType
                                    )
                                )
                            );
                        }}
                        options={IntervalOptions}
                        addClass={toCss(s_intervalOptions)}
                    />
                </div>

                {props.data.interval !== 'once' &&
                    <div className={toCss(s_row)} >
                        <span>
                            Exclusions
                            <Tooltip content='Select dates that you wish to be excluded.'>
                                <InfoSignIcon className={toCss(s_infoIcon)} />
                            </Tooltip>
                        </span>
                        <Button
                            iconBefore='edit'
                            onClick={() => setExclDialogShown(prev => !prev)}
                        >
                            Edit
                        </Button>
                        <ExclusionsDialog 
                            show={exclDialogShown} 
                            onCloseComplete={() => setExclDialogShown(false)}
                            availableDates={getAllTimestampsFromEvent(props.data)}
                            selectedExclusions={props.data.exclusions}
                            onChangeConfirmed={exclusions => props.onChange<Timestamp[]>('exclusions', exclusions)}
                        />
                    </div>
                }

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