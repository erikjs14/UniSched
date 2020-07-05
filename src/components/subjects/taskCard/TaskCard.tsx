import React, { useCallback, useMemo, useState } from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import { TaskModel, IntervalOptions } from '../../../firebase/model';
import { TaskConfig, getEditedTimestamps, getFilterForInterval, sameDay, getDateFromTimestamp, getTimestampFromDate, getDateFromSeconds, getConfigDataFromTimestamps, setTimeTo, allTasksChecked } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/timeConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from './../customDateInputUI/CustomDateInputUI';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import Input from '../../ui/input/Input';
import { toaster } from 'evergreen-ui';
const {
    row: s_row,
    intervalOptions: s_intervalOptions,
    checkAddInfo: s_checkAddInfo,
    addInfoTextarea: s_addInfoTextarea,
} = CSS;

export default function(props: SubjectDataCardProps<TaskModel>): JSX.Element {

    const [inputTouched, setInputTouched] = useState(false);

    const { onChange } = props;
    const { timestamps: oldTimestamps, timestampsDone: oldTimestampsDone, star, additionalInfo } = props.data;
    const changeHandler = useCallback((config: TaskConfig) => {
        const [timestamps, timestampsDone] = getEditedTimestamps(config, oldTimestamps, oldTimestampsDone);
        onChange('timestamps', timestamps);
        onChange('timestampsDone', timestampsDone);
    }, [onChange, oldTimestamps, oldTimestampsDone]);

    const {firstDeadline, lastDeadline, interval} = getConfigDataFromTimestamps(oldTimestamps, oldTimestampsDone);

    const notifyNotNew = useMemo(() => {
        return () => {
            toaster.notify('Only time and end date can be modified on non-new non-once tasks.', {
                id: 'unique',
                duration: 3,
            });
        }
    }, []);
    const notifyOnce = useMemo(() => {
        return () => {
            toaster.notify('Once saved, the date can be changed, but not the interval.', {
                id: 'unique',
                duration: 3,
            });
        }
    }, []);

    return (
        <SettingsCard
            headerValue={props.data.type}
            onHeaderValueChange={newVal => props.onChange('type', newVal)}
            onRemoveClicked={props.onRemove}
            markEmptyTitles={props.markEmptyTitles}
            star={{
                selected: star,
                starClicked: () => onChange('star', !star),
            }}
            uncollapsed={props.uncollapsed}
            checked={allTasksChecked(oldTimestamps, oldTimestampsDone)}
        >

                <div className={toCss(s_row)}>
                    <span>First Deadline</span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={props.new && !inputTouched ? setTimeTo(getDateFromSeconds(firstDeadline.seconds), 9, 0) : getDateFromSeconds(firstDeadline.seconds)}
                        onChange={date => {
                            if (date) {
                                changeHandler({firstDeadline: getTimestampFromDate(date), lastDeadline, interval});
                                setInputTouched(true);
                            }
                        }}
                        minDate={new Date()}
                        filterDate={!props.new && interval !== 'once' ? date => sameDay(date, getDateFromTimestamp(firstDeadline)) : undefined}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                        onInputClick={!props.new && interval !== 'once' ? () => notifyNotNew() : undefined}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>
                        Last Deadline
                    </span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={props.new && !inputTouched ? setTimeTo(getDateFromSeconds(lastDeadline.seconds), 9, 0) : getDateFromSeconds(lastDeadline.seconds)}
                        onChange={date => {
                            if (date) {
                                changeHandler({firstDeadline, lastDeadline: getTimestampFromDate(date), interval});
                                setInputTouched(true);
                            }
                        }}
                        minDate={getDateFromSeconds(firstDeadline.seconds)}
                        filterDate={interval === 'daily' ? undefined : getFilterForInterval(firstDeadline.seconds, interval)}
                        readOnly={interval === 'once'}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                        showTimeSelect={false}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>Interval</span>
                    <Input
                        label='Interval'
                        elementType='select-visual'
                        value={interval}
                        onChange={newInterval => !props.new
                            ? interval === 'once' ? notifyOnce() : notifyNotNew()
                            : changeHandler({firstDeadline, lastDeadline, interval: newInterval as string})
                        }
                        options={IntervalOptions}
                        addClass={toCss(s_intervalOptions)}
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
                                onChange={() => !additionalInfo ? onChange('additionalInfo', {text: ''}) : onChange('additionalInfo', null)} 
                            />
                        </span>
                        {additionalInfo && 
                            <Input
                                addClass={s_addInfoTextarea} 
                                label='Add Info'
                                elementType='text-area'
                                value={additionalInfo.text}
                                onChange={newText => onChange('additionalInfo', {text: newText})}
                            />
                        }
                    </div>

        </SettingsCard>
    );
}