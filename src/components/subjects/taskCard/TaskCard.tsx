import React, { useCallback, useMemo, useState } from 'react';
import DateTimePicker from 'react-datepicker';

import CSS from '../settingsCard/SettingsCard.module.scss';
import SettingsCard from '../settingsCard/SettingsCard';
import { TaskModel, IntervalOptions, Timestamp } from '../../../firebase/model';
import { TaskConfig, getEditedTimestamps, getFilterForInterval, sameDay, getDateFromTimestamp, getTimestampFromDate, getDateFromSeconds, getConfigDataFromTimestamps, setTimeTo, allTasksChecked, naturalToTimePeriod, periodToNatural } from './../../../util/timeUtil';
import { DATETIMEPICKER_DEFAULT_PROPS } from './../../../config/timeConfig';
import { toCss } from './../../../util/util';
import { CustomDateInputUI } from './../customDateInputUI/CustomDateInputUI';
import { SubjectDataCardProps } from '../settingsCard/SettingsCard.d';
import Input from '../../ui/input/Input';
import { toaster, Button, Tooltip, InfoSignIcon, IconButton } from 'evergreen-ui';
import ExclusionsDialog from '../exclusionsDialog/ExclusionsDialog';
import { useSelector } from 'react-redux';
import { RootState } from '../../..';
import { PREF_ID_ENABLE_BEFORE_TASK_NOTIFICATIONS } from './../../../config/userPreferences';
import MarkdownDialog from '../../dialogs/MarkdownDialog';
const {
    row: s_row,
    intervalOptions: s_intervalOptions,
    infoIcon: s_infoIcon,
    notificationsTextInput: s_notificationsTextInput,
    addNotificationsArea: s_addNotificationsArea,
    notRow: s_notRow,
    notRowNots: s_notRowNots,
    not: s_not,
} = CSS;

export default function(props: SubjectDataCardProps<TaskModel>): JSX.Element {
    
    const [notificationsText, setNotificationsText] = useState('');

    const [inputTouched, setInputTouched] = useState(false);
    const [exclDialogShown, setExclDialogShown] = useState(false);
    const [infoDialogShown, setInfoDialogShown] = useState(false);

    const { onChange } = props;
    const { timestamps: oldTimestamps, timestampsDone: oldTimestampsDone, tasksTickedAt: oldTasksTickedAt, star, additionalInfo, exclusions, notifications } = props.data;
    const changeHandler = useCallback((config: TaskConfig) => {
        const [timestamps, timestampsDone, tasksTickedAt] = getEditedTimestamps(config, oldTimestamps, oldTimestampsDone, oldTasksTickedAt);
        onChange('timestamps', timestamps);
        onChange('timestampsDone', timestampsDone);
        onChange('tasksTickedAt', tasksTickedAt);
    }, [onChange, oldTimestamps, oldTimestampsDone, oldTasksTickedAt]);

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

    const userPrefersEnableTaskNotifications = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_ENABLE_BEFORE_TASK_NOTIFICATIONS] as (boolean|undefined));
    
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

            {interval !== 'once' &&
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
                        availableDates={oldTimestamps}
                        selectedExclusions={exclusions}
                        onChangeConfirmed={exclusions => props.onChange<Timestamp[]>('exclusions', exclusions)}
                    />
                </div>
            }

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
                        onRawMarkdownChange={newText => onChange('additionalInfo', {text: newText})}
                        editMode={true}
                    />
                )}
            </div>

            { userPrefersEnableTaskNotifications &&
                <div className={toCss(s_row)}>
                    <span>Notifications</span>
                    <Tooltip content='Enter text to specify the amount of time prior to the event(s), when you want a notification to be sent. Use numbers (not as text) and units. You can also comma-seperate them to combine them. E.g. "2 hours, 15 minutes".'>
                        <InfoSignIcon className={toCss(s_infoIcon)} />
                    </Tooltip>
                    <div className={toCss(s_addNotificationsArea)} >
                        <div className={toCss(s_notRow)}>
                            <Input
                                label=''
                                elementType='input'
                                value={notificationsText}
                                onChange={val => setNotificationsText(val as string)}
                                addClass={toCss(s_notificationsTextInput)}
                            />
                            <Button
                                iconBefore='plus'
                                onClick={() => {
                                    const period = naturalToTimePeriod(notificationsText);
                                    if (notifications.some(not => not === period))
                                        toaster.notify('Notification for this time already exists!');
                                    else
                                        props.onChange<number[]>('notifications', [...notifications, period]);
                                }}
                            >
                                Add
                            </Button>
                        </div>
                        <div className={toCss(s_notRow, s_notRowNots)} >
                            {notifications.map((not, idx) => (
                                <div className={toCss(s_not)} >
                                    <span>{periodToNatural(not)}</span>
                                    <IconButton    
                                        appearance="minimal"
                                        height={24}
                                        icon='cross'
                                        onClick={() => {
                                            const newNots = [...notifications];
                                            newNots.splice(idx, 1);
                                            props.onChange<number[]>('notifications', newNots);
                                        }}
                                    />
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            }

        </SettingsCard>
    );
}