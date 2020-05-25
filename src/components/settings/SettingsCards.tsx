import React, { PropsWithChildren } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';

import CSS from './SettingsCards.module.scss';
import { SettingsCardsProps } from './SettingsCards.d';
import FloatingButton from '../../components/ui/floatingButton/FloatingButton';
import { toCss } from './../../util/util';
import { mapToIcon } from '../../config/iconConfig';
const {
    wrapper: s_wrapper,
    header: s_header,
    content: s_content,
    addBtn: s_addBtn,
    icon: s_icon,
} = CSS;

export default function(props: PropsWithChildren<SettingsCardsProps>): JSX.Element {
    
    return (
        <div className={toCss(s_wrapper)}>

            <div className={toCss(s_header)}>

                {props.icon && <FontAwesomeIcon icon={mapToIcon(props.icon)} className={toCss(s_icon)} />}

                <h3>{props.title}</h3>

                <div className={toCss(s_addBtn)}>
                    <FloatingButton
                        onClick={() => props.onAddNew()}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </FloatingButton>
                </div>

            </div>

            <div className={toCss(s_content)}>
                {props.children}
            </div>

        </div>
    );
}