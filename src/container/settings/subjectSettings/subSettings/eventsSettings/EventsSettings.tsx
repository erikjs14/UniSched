import React, { useEffect, forwardRef, useImperativeHandle, useCallback, Fragment, useState } from 'react';
import Loader from '../../../../../components/ui/loader/Loader';

// import CSS from './EventsSettings.module.scss';
import { EventsSettingsProps } from './EventsSettings.d';
// import { toCss } from './../../../../../util/util';
import useSubjectData from './../../../../../hooks/useSubjectData';
import { EventModelWithId, EventModel, Timestamp } from './../../../../../firebase/model';
import SettingsCards from '../../../../../components/settings/SettingsCards';
import EventCard from '../../../../../components/settings/eventCard/EventCard';
import { EVENTS_START_STATE } from '../../../../../config/settingsConfig';
import { Dialog } from 'evergreen-ui';
// const {
//     wrapper: s_wrapper,
// } = CSS;

export default React.memo(forwardRef(function(props: EventsSettingsProps, ref): JSX.Element {

    const {
        fetchAllData,
        addNewDatum,
        updateValue,
        deleteData,
        saveChanges,
        data
    } = useSubjectData<EventModel>('event', props.subjectId, props.initialData || null);

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
    function save() {
        saveChanges();
    }
    function isSaving(): boolean {
        return data.saving;
    }
    useImperativeHandle(
        ref,
        () => ({save, isSaving})
    );

    const addNewEventHandler = useCallback(() => {
        addNewDatum(EVENTS_START_STATE);
        props.onDataChanged();
    }, [addNewDatum, props]);

    const valChangedHandler = useCallback(<K extends keyof EventModel, T extends any>(dataId: string, key: K, newVal: T | null): void => {
        if (!newVal) return;
        if (key === 'firstStart') {// update end if before start
            const datum = (data.items.find(datum => datum.id === dataId));
            if (datum) {
                const event = datum as EventModelWithId;
                if ((newVal as unknown as Timestamp).seconds > event.firstStart.seconds) {
                    updateValue(
                        dataId,
                        'firstEnd',
                        {seconds: (newVal as unknown as Timestamp).seconds + (event.firstEnd.seconds - event.firstStart.seconds), nanoseconds: 0},
                    )
                }
            }
        }
        if (key === 'firstEnd') {// update end if before start
            const datum = (data.items.find(datum => datum.id === dataId));
            if (datum) {
                const event = datum as EventModelWithId;
                if ((newVal as unknown as Timestamp).seconds < event.firstStart.seconds) {
                    updateValue(
                        dataId,
                        'firstStart',
                        {seconds: (newVal as unknown as Timestamp).seconds - (event.firstEnd.seconds - event.firstStart.seconds), nanoseconds: 0},
                    )
                }
            }
        }
        updateValue(dataId, key, newVal);
        props.onDataChanged();
    }, [data.items, props, updateValue]);

    if (data.loading) {
        return <Loader />;
    }

    const events = data.items.map(el => {
        return (
            <EventCard
                key={el.id}
                data={el as EventModelWithId}
                onChange={(key: keyof EventModel, newVal) => valChangedHandler(el.id, key, newVal)}
                onRemove={() => setWantDelete(el.id)}
            />
        )
    })
    
    return (
        <Fragment>
            <SettingsCards 
                title='EVENTS'
                onAddNew={addNewEventHandler}
            >
                {events}
            </SettingsCards>

            <Dialog
                isShown={wantDelete ? true : false}
                isConfirmLoading={deleting}
                title={`Delete event ${(data.items.find(el => el.id === wantDelete) as EventModelWithId)?.type}`}
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