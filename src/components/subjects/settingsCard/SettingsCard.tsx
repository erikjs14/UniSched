import React, { PropsWithChildren } from 'react';

import { SettingsCardProps } from './SettingsCard.d';
import Collapsible from '../../ui/collapsible/Collapsible';
import CSS from './SettingsCard.module.scss';
import { toCss } from '../../../util/util';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar, faBell as fasBell, faCheck } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar, faBell as farBell } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
const {
    wrapper: s_wrapper,
    header: s_header,
    content: s_content,
    btnRow: s_btnRow,
    removeBtn: s_removeBtn,
    star: s_star,
    reminder: s_reminder,
    inputWrapper: s_inputWrapper,
    checked: s_checked,
    checkmark: s_checkmark,

} = CSS;

export default function(props: PropsWithChildren<SettingsCardProps>): JSX.Element {

    const header = (
        <div className={toCss(s_header, (props.checked ? s_checked : ''))}>
            {props.star && 
                <FontAwesomeIcon 
                    className={toCss(s_star)}  
                    icon={(props.star.selected ? fasStar : farStar) as IconProp} 
                    onClick={event => {
                        event.stopPropagation();
                        props.star?.starClicked?.();
                    }}
                />
            }
            {props.reminder && 
                <FontAwesomeIcon 
                    className={toCss(s_reminder)}  
                    icon={(props.reminder.selected ? fasBell : farBell) as IconProp} 
                    onClick={event => {
                        event.stopPropagation();
                        props.reminder?.reminderClicked?.();
                    }}
                />
            }
            <Input
                elementType='input-transparent'
                value={props.headerValue}
                onChange={newVal => props.onHeaderValueChange(newVal as string)}
                label='Insert title here'
                markWhenEmpty={props.markEmptyTitles}
                addClass={toCss(s_inputWrapper)}
            />
            {props.checked &&
                <FontAwesomeIcon
                    icon={faCheck}
                    className={toCss(s_checkmark)} 
                />
            }
        </div>
    );
    
    return (
        <Collapsible
            header={header}
            addCss={s_wrapper}
            uncollapsed={props.uncollapsed}
        >
            <div className={toCss(s_content)}>
                {props.children}

                <div className={toCss(s_btnRow)}>
                    <Button
                        danger
                        fontSize='.8em'
                        onClick={() => props.onRemoveClicked()}
                        className={toCss(s_removeBtn)}
                    >
                        Remove
                    </Button>
                </div>

            </div>

        </Collapsible>
    );
}