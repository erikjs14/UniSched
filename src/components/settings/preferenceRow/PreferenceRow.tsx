import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Tooltip, InfoSignIcon, CornerDialog, Button } from 'evergreen-ui';

import CSS from './PreferenceRow.module.scss';
import { PreferenceRowProps } from './PreferenceRow.d';
import { toCss } from '../../../util/util';
import { registerNotificationsWorker } from '../../../util/subscription';
import { resetPermissionPreferences } from '../../../store/actions';
import useUnischedId from '../../../hooks/useUnischedId';
import GroupingDailog from '../groupingDialog/GroupingDailog';
import { PREF_ID_ARCHIVES } from '../../../config/userPreferences';
const {
    wrapper: s_wrapper,
    name: s_name,
    input: s_input,
    info: s_info,
} = CSS;

export default function(props: PreferenceRowProps): JSX.Element | null {

    const unisched_id = useUnischedId();

    const [showNotificationDialog, setShowNotificationDialog] = useState({
        shown: false,
        idChanged: '',
        newVal: null,
        keepTrue: false,
    });
    const [archiveDialogShown, setArchiveDialogShown] = useState(false);

    const dispatch = useDispatch();

    let inputEl;
    switch (props.config.type) {
        case 'boolean':
            inputEl = (
                <Switch
                    checked={props.value}
                    onChange={e => {
                        props.onChange(e.target.checked);
                        if (props.config.uponActivation === 'activateNotifications' && e.target.checked && Notification.permission !== 'granted') {
                            setShowNotificationDialog(prev => ({...prev, show: true}));
                        }
                    }}
                />
            );
            break;
        case 'deviceBoolean':
            inputEl = (
                <Switch
                    checked={showNotificationDialog.shown || showNotificationDialog.keepTrue || props.value[unisched_id] || false}
                    onChange={e => {
                        if (props.config.uponActivation === 'activateNotifications' && e.target.checked && Notification.permission !== 'granted') {
                            setShowNotificationDialog({
                                shown: true,
                                idChanged: props.config.id,
                                newVal: {
                                    ...props.value,
                                    [unisched_id]: e.target.checked
                                },
                                keepTrue: false,
                            });
                        } else {
                            props.onChange(
                                {
                                    ...props.value,
                                    [unisched_id]: e.target.checked
                                }
                            );
                        }
                    }}
                />
            );
            break;
        case 'integer':
            inputEl = (
                <input
                    type='number'
                    id={props.config.id}
                    name={props.config.id}
                    min={props.config.min ?? undefined}
                    max={props.config.max ?? undefined}
                    step={props.config.step ?? undefined}
                    value={props.value}
                    onChange={e => props.onChange(parseInt(e.target.value))}
                />
            );
            break;
        case 'optionalGrouping':
            inputEl = (
                <>

                    <Button
                        appearance='minimal'
                        iconBefore='edit'
                        onClick={() => setArchiveDialogShown(prev => !prev)}
                    >
                        Edit
                    </Button>

                    { archiveDialogShown && (
                        <GroupingDailog 
                            {...props}
                            onCloseComplete={() => setArchiveDialogShown(false)}
                            title='Edit Archives'
                            idsOfEmptyGroupItems={props.getIdsOfEmptyGroupItems?.(PREF_ID_ARCHIVES, props.config.subjectIdName) || []} //unsauber...
                        />
                    )}
                </>
            )
            break;
        default:
            inputEl = null;
            break;
    }

    if (!inputEl) return null;
    
    return (
        <React.Fragment>

            <div className={toCss(s_wrapper)}>
                
                <div className={toCss(s_name)}>
                    {props.config.name}
                    <Tooltip content={props.config.description}>
                        <InfoSignIcon className={toCss(s_info)}/>
                    </Tooltip>
                </div>

                <div className={toCss(s_input)}>
                    {inputEl}
                </div>

            </div>

            <CornerDialog
                title={Notification.permission === 'denied' ? 'Permission permanently denied' : 'Request permission to send notifications'}
                confirmLabel='Alright!'
                isShown={showNotificationDialog.shown}
                onCloseComplete={() => {
                    setShowNotificationDialog(prev => ({...prev, shown: false}));
                }}
                onCancel={(close) => {
                    // dispatch(resetPermissionPreferences());
                    close();
                }}
                onConfirm={(close) => {
                    setShowNotificationDialog(prev => ({...prev, keepTrue: true}));
                    registerNotificationsWorker()
                    .then(success => {
                        if (!success) dispatch(resetPermissionPreferences());
                        else props.onChange(showNotificationDialog.newVal);
                        setShowNotificationDialog(({
                            shown: false,
                            keepTrue: false,
                            idChanged: '',
                            newVal: null,
                        }));
                    });
                    close();
                }}
            >
                {Notification.permission === 'denied'
                    ? 'You have permanently denied this website to send notification to you. If you want to receive notifications, you have to manually revoke the ban in your browser.'
                    : 'For this feature to work, the browser will ask you to grant permission to this website.'
                }
            </CornerDialog>

        </React.Fragment>
    );
}