import React, { PropsWithChildren } from 'react';

import { SettingsCardProps } from './SettingsCard.d';
import Collapsible from '../../ui/collapsible/Collapsible';
import CSS from './SettingsCard.module.scss';
import { toCss } from '../../../util/util';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar as fasStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as farStar } from '@fortawesome/free-regular-svg-icons';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
const {
    wrapper: s_wrapper,
    header: s_header,
    content: s_content,
    btnRow: s_btnRow,
    removeBtn: s_removeBtn,
    star: s_star,
} = CSS;

export default function(props: PropsWithChildren<SettingsCardProps>): JSX.Element {

    const header = (
        <div className={toCss(s_header)}>
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
            <Input
                elementType='input-transparent'
                value={props.headerValue}
                onChange={newVal => props.onHeaderValueChange(newVal as string)}
                label='Insert title here'
                markWhenEmpty={props.markEmptyTitles}
            />
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