import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
const {
    wrapper: s_wrapper,
    settingsCard: s_settingsCard,
    header: s_header,
    trashIcon: s_trashIcon,
} = CSS;

export default function(props: SubjectSettingsProps): JSX.Element {

    const [title, setTitle] = useState('');

    const style = {
        color: 'white',
    };
    
    return (
        <div style={style} className={toCss(s_wrapper, 'util-center-content')}>
            <div className={toCss(s_settingsCard)}>

                <div className={toCss(s_header)}>
                    <Input 
                        elementType='input-transparent'
                        value={title}
                        onChange={setTitle}
                        label='Title'
                    />
                    <div className={toCss(s_trashIcon)}>
                        <FontAwesomeIcon icon={faTrash} />
                    </div>
                </div>

            </div>
        </div>
    );
}