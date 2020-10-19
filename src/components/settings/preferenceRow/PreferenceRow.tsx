import React, { useState} from 'react';
import { useDispatch } from 'react-redux';
import { Switch, Tooltip, InfoSignIcon, CornerDialog } from 'evergreen-ui';

import CSS from './PreferenceRow.module.scss';
import { PreferenceRowProps } from './PreferenceRow.d';
import { toCss } from '../../../util/util';
import { registerNotificationsWorker } from '../../../util/subscription';
import { resetPermissionPreferences } from '../../../store/actions';
const {
    wrapper: s_wrapper,
    name: s_name,
    input: s_input,
    info: s_info,
} = CSS;

let pressedConfirm = false;
export default function(props: PreferenceRowProps): JSX.Element | null {

    const [showNotificationDialog, setShowNotificationDialog] = useState(false);

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
                            setShowNotificationDialog(true);
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
                isShown={showNotificationDialog}
                onCloseComplete={() => {
                    setShowNotificationDialog(false);
                    if (!pressedConfirm) {
                        dispatch(resetPermissionPreferences());
                    }
                    pressedConfirm = false;
                }}
                onCancel={(close) => {
                    // dispatch(resetPermissionPreferences());
                    close();
                }}
                onConfirm={(close) => {
                    pressedConfirm = true;
                    registerNotificationsWorker()
                    .then(success => {
                        if (!success) dispatch(resetPermissionPreferences());
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