import React, { useState, useCallback } from 'react';

import CSS from './AlterSpace.module.scss';
import { AlterSpaceProps } from './AlterSpace.d';
import { toCss } from '../../../util/util';
import { Combobox, TextInput, Button, toaster } from 'evergreen-ui';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../..';
import { updateSpace } from './../../../firebase/firestore';
import { alterSpaceLocally } from '../../../store/actions';
const {
    wrapper: s_wrapper,
    select: s_select,
    textInput: s_textInput,
    btn: s_btn,
} = CSS;

export default function(props: AlterSpaceProps): JSX.Element | null {

    const spaces = useSelector((state: RootState) => state.user.spaces);

    const [selectedSpace, setSelectedSpace] = useState(spaces?.[0]);
    const [nameToChange, setNameToChange] = useState('');
    const [loading, setLoading] = useState(false);

    const dispatch = useDispatch();
    
    const alterSpaceHandler = useCallback((spaceId: string, newName: string) => {
        if (!spaces) return; 
        if (spaces?.some(s => s.name.trim() === newName.trim())) {
            toaster.warning(
                'Space with the same name already exists.',
                {
                    id: 'unique',
                }
            );
            return;
        }

        setLoading(true);
        updateSpace(spaceId, {name: newName})
        .then(() => {
            setLoading(false);
            dispatch(alterSpaceLocally({
                ...spaces.find(s => s.id === spaceId),
                name: newName,
            }));
            toaster.success(
                'Name changed successfully.',
                {
                    id: 'unique'
                }
            );
        })
        .catch(error => {
            setLoading(false);
            toaster.danger(
                'There was a problem changing the name.',
                {
                    id: 'unique'
                }
            );
        });
    }, [dispatch, spaces]);

    if (!spaces) return null;

    return (
        <div className={toCss(s_wrapper, props.wrapCss ? props.wrapCss : '')} >
            <Combobox
                className={toCss(s_select)}
                items={spaces}
                itemToString={item => item.name}
                initialSelectedItem={selectedSpace}
                onChange={sel => setSelectedSpace(sel)}
            />
            <TextInput
                className={toCss(s_textInput)}
                placeholder='New space name'
                value={nameToChange}
                onChange={(e: any) => setNameToChange(e.target.value)}
            />
            <Button
                className={toCss(s_btn)} 
                isLoading={loading}
                disabled={(selectedSpace === undefined || selectedSpace === null) || nameToChange.trim().length < 1}
                onClick={() => alterSpaceHandler(selectedSpace.id, nameToChange)}
                iconBefore='edit'
            >Change name</Button>
        </div>
    );
}