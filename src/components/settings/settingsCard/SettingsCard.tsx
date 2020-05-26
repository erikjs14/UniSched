import React, { PropsWithChildren } from 'react';

import { SettingsCardProps } from './SettingsCard.d';
import Collapsible from '../../ui/collapsible/Collapsible';
import CSS from './SettingsCard.module.scss';
import { toCss } from '../../../util/util';
import Input from '../../ui/input/Input';
import Button from '../../ui/button/Button';
const {
    wrapper: s_wrapper,
    header: s_header,
    content: s_content,
    btnRow: s_btnRow,
    removeBtn: s_removeBtn,
} = CSS;

export default function(props: PropsWithChildren<SettingsCardProps>): JSX.Element {

    const header = (
        <div className={toCss(s_header)}>
            <Input
                elementType='input-transparent'
                value={props.headerValue}
                onChange={newVal => props.onHeaderValueChange(newVal)}
                label='Insert title here'
            />
        </div>
    );
    
    return (
        <Collapsible
            header={header}
            addCss={s_wrapper}
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