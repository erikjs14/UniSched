import React, { useState, useCallback } from 'react';

import CSS from './AddSpace.module.scss';
import { AddSpaceProps } from './AddSpace.d';
import { toCss } from '../../../util/util';
import { TextInput, Button, toaster } from 'evergreen-ui';
import { addSpace } from '../../../firebase/firestore';
import { getCurrentTimestamp } from '../../../util/timeUtil';
import { useDispatch, useSelector } from 'react-redux';
import { addSpaceLocally } from '../../../store/actions';
import { RootState } from '../../..';
const {
    wrapper: s_wrapper,
    textInput: s_textInput,
    btn: s_btn,
} = CSS;

export default function(props: AddSpaceProps): JSX.Element {

    const spaces = useSelector((state: RootState) => state.user.spaces);
    const dispatch = useDispatch();

    const [name, setName] = useState('');
    const [loading, setLoading] = useState(false);

    const addSpaceHandler = useCallback((name: string) => {
        if (spaces?.some(s => s.name.trim() === name.trim())) {
            toaster.warning(
                'Space with the same name already exists.',
                {
                    id: 'unique',
                }
            );
            return;
        }

        setLoading(true);
        const ct = getCurrentTimestamp();
        addSpace({
            name: name.trim(),
            timeCreated: ct,
        })
        .then((newId: string) => {
            setLoading(false);
            setName('');
            dispatch(addSpaceLocally({
                id: newId,
                name,
                timeCreated: ct,
            }));
            toaster.success(
                'New space added successfully.',
                {
                    id: 'unique',
                }
            );
        })
        .catch(error => {
            setLoading(false);
            toaster.danger(
                'Something went wrong trying to create the space.',
                {
                    id: 'unique',
                }
            );
        });
    }, [dispatch, spaces]);
    
    return (
        <div className={toCss(s_wrapper, props.wrapCss ? props.wrapCss : '')} >
            <TextInput
                className={toCss(s_textInput)}
                placeholder='Space name'
                value={name}
                onChange={(e: any) => setName(e.target.value)}
            />
            <Button
                className={toCss(s_btn)} 
                isLoading={loading}
                disabled={name.trim().length === 0}
                onClick={() => addSpaceHandler(name)}
                iconBefore='add'
            >Add Space</Button>
        </div>
    );
}