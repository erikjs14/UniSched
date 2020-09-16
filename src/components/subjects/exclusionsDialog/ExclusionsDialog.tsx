import React, { useCallback, useState } from 'react';

import CSS from './ExclusionsDialog.module.scss';
import { ExclusionsDialogProps } from './ExclusionsDialog.d';
import { Dialog } from 'evergreen-ui';
import { toCss } from '../../../util/util';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { containsTimestamp, formatDateOutput, getDateFromTimestamp, getWeekDay } from '../../../util/timeUtil';
import { Timestamp } from '../../../firebase/model';
const {
    wrapper: s_wrapper,
    row: s_row,
    disabled: s_disabled,
    selector: s_selector,
    label: s_label,
} = CSS;

export default function(props: ExclusionsDialogProps): JSX.Element {

    const getInitialState = useCallback(() => (
        props.availableDates.reduce((prev, cur) => {
            if (containsTimestamp(cur, props.selectedExclusions)) {
                return [...prev, true];
            } else {
                return [...prev, false];
            }
        }, [])
    ), [props.availableDates, props.selectedExclusions]);

    const [exclusionsAtIdc, setExclusionsAtIdc] = useState<boolean[]>(getInitialState());

    const changeHandler = useCallback(idx => {
        setExclusionsAtIdc(prev => {
            const newExcl = [...prev];
            newExcl[idx] = !prev[idx];
            return newExcl;
        });
    }, []);

    const onCancel = useCallback(() => {
        //reset state
        setExclusionsAtIdc(getInitialState());
    }, [getInitialState]);

    const onConfirm = useCallback(() => {
        const exclusions: Timestamp[] = [];
        exclusionsAtIdc.forEach((excluded, idx) => {
            if (excluded) exclusions.push(props.availableDates[idx]);
        });
        props.onChangeConfirmed(exclusions);
    }, [exclusionsAtIdc, props]);

    const rows = props.availableDates.map((date, idx) => (
        <div 
            className={toCss(s_row, (exclusionsAtIdc[idx] ? s_disabled : ''))} 
            onClick={() => changeHandler(idx)}
        >
            <FontAwesomeIcon
                className={toCss(s_selector)}
                icon={faCheck}
            />
            <span className={toCss(s_label)} >
                {getWeekDay(getDateFromTimestamp(date)) + ', ' + formatDateOutput(getDateFromTimestamp(date))}
            </span>
        </div>
    ))
    
    return (
        <Dialog
            shouldCloseOnEscapePress={false}
            shouldCloseOnOverlayClick={false}
            isShown={props.show}
            title='Exclude Dates'
            onConfirm={close => {
                close();
                onConfirm();
            }}
            confirmLabel='Confirm'
            onCancel={close => {
                close();
                onCancel();
            }}
            cancelLabel='Cancel'
            onCloseComplete={() => {
                props.onCloseComplete?.();
            }}
        >
            <div className={toCss(s_wrapper)} >
                {rows}
            </div>
        </Dialog>
    );
}