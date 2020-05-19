import React, { useState } from 'react';

import CSS from './SubjectSettings.module.scss';
import { SubjectSettingsProps } from './SubjectSettings.d';
import { toCss } from './../../../util/util';
import Input from '../../../components/ui/input/Input';
const {
    wrapper: s_wrapper,
    settingsCard: s_settingsCard
} = CSS;

export default function(props: SubjectSettingsProps): JSX.Element {

    const [title, setTitle] = useState('');
    
    return (
        <div className={toCss(s_wrapper, 'util-center-content')}>
            <div className={toCss(s_settingsCard)}>

                <Input 
                    elementType='input-transparent'
                    value={title}
                    onChange={setTitle}
                    label='Title'
                />

            </div>
        </div>
    );
}