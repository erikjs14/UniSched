import React, { useCallback, useState } from 'react';
import { Dialog, Text, TextInput, IconButton, Pane, toaster, Tooltip, TrashIcon } from 'evergreen-ui';

import { GroupingDialogProps } from './GroupingDialog.d';
import { GroupItem } from '../../../config/userPreferences';
import { getPseudoRandomIdByTime } from './../../../util/util';

// Dialog always shown when comp is rendered
export default function(props: GroupingDialogProps): JSX.Element {
    
    const [prefVal, setPrefVal] = useState<GroupItem[]>(props.value);
    const [newArchiveName, setNewArchiveName] = useState('');
    const [editingNameId, setEditingNameId] = useState<string|null>(null);

    const addItemHandler = useCallback((name: string) => {
        setPrefVal(prev => {
            if (prev.find(item => item.name.trim() === name.trim())) {
                toaster.notify(
                    'Name already exists',
                    { id: 'unique', duration: 3 }
                );
                return [...prev];
            } else {
                setNewArchiveName('');
                return [
                    ...prev,
                    { id: getPseudoRandomIdByTime(), name }
                ];
            }
        });
    }, []);

    const removeItemHandler = useCallback((id: string) => {
        if (props.value.findIndex((item: GroupItem) => item.id === id) < 0 || props.idsOfEmptyGroupItems.find(emptyId => emptyId === id)) {
            setPrefVal(prev => prev.filter(item => item.id !== id));
        };
        return; // shall never be reached
    }, [props.idsOfEmptyGroupItems, props.value]);

    const editItemHandler = useCallback((id: string, newName: string) => {
        setPrefVal(prev => prev.map(item => {
            if (item.id === id) {
                return {
                    id,
                    name: newName,
                };
            } else {
                return item;
            }
        }))
    }, []); 

    return (
        <Dialog
            isShown={true}
            title={props.title}
            onCloseComplete={props.onCloseComplete}
            onConfirm={close => {
                close();
                props.onChange(prefVal);
            }}
        >
            <Pane
                display='flex'
                marginBottom='3rem'
            >
                <TextInput
                    value={newArchiveName}
                    onChange={(e: { target: { value: React.SetStateAction<string>; }; }) => setNewArchiveName(e.target.value)}
                    placeholder='New Archive Name'
                    width='30rem'
                />
                <IconButton
                    appearance='minimal'
                    icon='add'
                    marginLeft='2rem'
                    onClick={() => addItemHandler(newArchiveName)}
                    disabled={newArchiveName.trim().length < 1}
                >
                    Add
                </IconButton>
            </Pane>

            <Pane
                display='flex'
                flexDirection='column'
            >
                { prefVal.length === 0 ? (
                    <Text>No Group Created Yet.</Text>
                ) : (
                    prefVal.map(groupItem => (
                        <Pane
                            marginY='.5rem'
                            display='flex'
                        >
                            <TextInput
                                value={groupItem.name}
                                onChange={(e: { target: { value: string; }; }) => editItemHandler(groupItem.id, e.target.value)}
                                disabled={editingNameId !== groupItem.id}
                                width='25rem'
                            />
                            <IconButton 
                                appearance='minimal'
                                icon={editingNameId === groupItem.id ? 'tick' : 'edit'}
                                onClick={() => setEditingNameId(prev => editingNameId === groupItem.id ? null : groupItem.id)}
                                marginX='1rem'
                            />
                            {(() => {
                                const disabled = props.value.findIndex((item: GroupItem) => item.id === groupItem.id) > -1 && props.idsOfEmptyGroupItems.findIndex(emptyId => emptyId === groupItem.id) < 0;
                                const trashButton = (
                                    <IconButton
                                        appearance='minimal'
                                        intent='danger'
                                        icon='trash'
                                        onClick={() => removeItemHandler(groupItem.id)}
                                        disabled={disabled}
                                    />
                                );
                                if (disabled) {
                                    return (
                                        <Tooltip content='Non-deletable when subjects are assigned to this group.'>
                                            <Pane
                                                height={32}
                                                width={32}
                                                display='flex'
                                                justifyContent='center'
                                                alignItems='center'
                                            >
                                                <TrashIcon color='disabled' size={14} />
                                            </Pane>
                                        </Tooltip>
                                    );
                                } else {
                                    return trashButton;
                                }
                            })()}
                        </Pane>
                    ))
                )}
            </Pane>

        </Dialog>
    );
}