import React, { useEffect, forwardRef, useImperativeHandle, useCallback } from 'react';
import Loader from '../../../../../components/ui/loader/Loader';

// import CSS from './EventsSettings.module.scss';
import { EventsSettingsProps } from './EventsSettings.d';
// import { toCss } from './../../../../../util/util';
import useSubjectData from './../../../../../hooks/useSubjectData';
import { EventModelWithId, EventModel, Timestamp } from './../../../../../firebase/model';
import SettingsCards from '../../../../../components/settings/SettingsCards';
import EventCard from '../../../../../components/settings/eventCard/EventCard';
// const {
//     wrapper: s_wrapper,
// } = CSS;

export default React.memo(forwardRef(function(props: EventsSettingsProps, ref): JSX.Element {

    const {
        fetchAllData,
        addNewDatum,
        updateValue,
        // remove,
        saveChanges,
        data
    } = useSubjectData<EventModel>('event', props.subjectId, props.initialData || null);

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
        addNewDatum({
            firstStart: {seconds: new Date().getTime(), nanoseconds: 0},
            firstEnd: {seconds: new Date().getTime() + 60 * 60, nanoseconds: 0},
            endAt: {seconds : new Date().getTime() + 60 * 60 * 24 * 7, nanoseconds: 0},
            interval: 'weekly',
            type: 'NEW',
        });
    }, [addNewDatum]);

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
            />
        )
    })
    
    return (
        <SettingsCards 
            title='EVENTS'
            onAddNew={addNewEventHandler}
        >
            {events}
        </SettingsCards>
    );
}));