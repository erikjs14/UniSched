import React, { useCallback, useMemo } from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import { TaskModel, IntervalOptions } from '../../../firebase/model';
import { TaskConfig, getEditedTimestamps, getConfigDataFromTimestamps, getDateFromSeconds, getTimestampFromDate, getFilterForInterval } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/settingsConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from './../customDateInputUI/CustomDateInputUI';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import Input from '../../ui/input/Input';
import { toaster } from 'evergreen-ui';
const {
    row: s_row,
    intervalOptions: s_intervalOptions,
} = CSS;

export default function(props: SubjectDataCardProps<TaskModel>): JSX.Element {

    const { onChange } = props;
    const { timestamps: oldTimestamps, timestampsDone: oldTimestampsDone } = props.data;
    const changeHandler = useCallback((config: TaskConfig) => {
        const [timestamps, timestampsDone] = getEditedTimestamps(config, oldTimestamps, oldTimestampsDone);
        onChange('timestamps', timestamps);
        onChange('timestampsDone', timestampsDone);
    }, [onChange, oldTimestamps, oldTimestampsDone]);

    const {firstDeadline, lastDeadline, interval} = getConfigDataFromTimestamps(oldTimestamps, oldTimestampsDone);

    const notifyNotNew = useMemo(() => {
        return () => {
            toaster.notify('Only the end date can be modified on non-new tasks.', {
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
        >

                <div className={toCss(s_row)}>
                    <span>First Deadline</span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(firstDeadline.seconds)}
                        onChange={date => date ? changeHandler({firstDeadline: getTimestampFromDate(date), lastDeadline, interval}) : null}
                        minDate={new Date()}
                        {...DATETIMEPICKER_DEFAULT_PROPS}
                        disabled={!props.new}
                        onInputClick={props.new ? undefined : () => notifyNotNew()}
                    />
                </div>

                <div className={toCss(s_row)}>
                    <span>Last deadline</span>
                    <DateTimePicker
                        customInput={<CustomDateInputUI />}
                        showWeekNumbers
                        withPortal
                        selected={getDateFromSeconds(lastDeadline.seconds)}
                        onChange={date => date ? changeHandler({firstDeadline, lastDeadline: getTimestampFromDate(date), interval}) : null}
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
                            ? notifyNotNew()
                            : changeHandler({firstDeadline, lastDeadline, interval: newInterval as string})
                        }
                        options={IntervalOptions}
                        addClass={toCss(s_intervalOptions)}
                    />
                </div>

        </SettingsCard>
    );
}