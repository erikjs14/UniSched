import React, { useEffect, forwardRef, useImperativeHandle, useCallback, Fragment, useState } from 'react';
import Loader from '../../../../components/ui/loader/Loader';

import { SubSettingsProps } from './SubSettings.d';
import useSubjectData from './../../../../hooks/useSubjectData';
import SettingsCards from '../../../../components/settings/SettingsCards';
import { Dialog } from 'evergreen-ui';
import { SubjectDataModelWithId, SubjectDataModel } from './../../../../firebase/model';
import { removeKey } from '../../../../util/util';

export default React.memo(
    forwardRef(
        <M extends SubjectDataModel, MId extends SubjectDataModelWithId>(
            props: SubSettingsProps<M, MId>, 
            ref: React.Ref<any>
        )
    : JSX.Element => {

    const {
        fetchAllData,
        addNewDatum,
        updateValue,
        deleteData,
        saveChanges,
        remove,
        hasEmptyTitle: stateHasEmptyTitle,
        data
    } = useSubjectData<M>(props.dataTypeId, props.subjectId, props.initialData || null);

    const [wantDelete, setWantDelete] = useState<string|null>(null);
    const [deleting, setDeleting] = useState(false);

    // fetch data after mount if not provided by initialData
    useEffect(() => {
        if (!props.initialData) fetchAllData();
    }, [fetchAllData, props.initialData]);

    useEffect(() => {
        props.onSaveStateChanged(data.saving);
    }, [data.saving, props]);

    // ToDo implement batch solution for firebase
    function save(newSubjectId: string | undefined = undefined) {
        saveChanges(newSubjectId);
    }
    function isSaving(): boolean {
        return data.saving;
    }
    function hasEmptyTitle(): boolean {
        return stateHasEmptyTitle();
    }
    useImperativeHandle(
        ref,
        () => ({save, isSaving, hasEmptyTitle})
    );

    const addNewEventHandler = useCallback(() => {
        addNewDatum(props.dataStartState);
        props.onDataChanged();
    }, [addNewDatum, props]);

    const valChangedHandler = useCallback(<K extends keyof M, T extends any>(dataId: string, key: K, newVal: T | null): void => {
        
        if (newVal === null) return;

        updateValue(dataId, key, newVal);
        props.onDataChanged();

    }, [props, updateValue]);

    if (data.loading) {
        return <Loader />;
    }

    const Card = props.cardComponent;
    const cards = data.items.map(dataItem => (
        <Card
            key={dataItem.id}
            data={removeKey('id', dataItem) as M}
            onChange={(key: keyof M, newVal) => valChangedHandler(dataItem.id, key, newVal)}
            onRemove={() => setWantDelete(dataItem.id)}
            new={dataItem.id.startsWith('NEW_')}
        />
    ));
    
    return (
        <Fragment>
            <SettingsCards 
                title={props.areaTitle}
                icon={props.iconType}
                onAddNew={addNewEventHandler}
            >
                {cards}
            </SettingsCards>

            <Dialog
                isShown={wantDelete ? true : false}
                isConfirmLoading={deleting}
                title={`Delete event ${(data.items.find(el => el.id === wantDelete) as MId)?.type}`}
                confirmLabel='Confirm'
                onCancel={close => {
                    setWantDelete(null);
                    close();
                }}
                onConfirm={close => {
                    if (!wantDelete) {
                        props.onError('Unexpected error.');
                    } else {
                        setDeleting(true);

                        if (wantDelete.startsWith('NEW_')) {
                            console.log(data)
                            remove(wantDelete);
                            setDeleting(false);
                            setWantDelete(null);
                            console.log(data)
                        } else {
                            deleteData(wantDelete)
                                .then(() => {
                                    close();
                                })
                                .catch(error => {
                                    props.onError(error);
                                })
                                .finally(() => {
                                    setWantDelete(null);
                                })
                        }
                    }
                }}
                onCloseComplete={() => { //closed in another way
                    setWantDelete(null);
                }}
            >
                Are you sure you want to delete this event?
            </Dialog>
        </Fragment>
    );
}));