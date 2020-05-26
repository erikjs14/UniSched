import React, { useEffect, forwardRef, useImperativeHandle, useCallback, Fragment, useState } from 'react';
import Loader from '../../../../../components/ui/loader/Loader';

// import CSS from './EventsSettings.module.scss';
import { ExamsSettingsProps } from './ExamsSettings.d';
// import { toCss } from './../../../../../util/util';
import useSubjectData from './../../../../../hooks/useSubjectData';
import { ExamModelWithId, ExamModel } from './../../../../../firebase/model';
import SettingsCards from '../../../../../components/settings/SettingsCards';
import ExamCard from '../../../../../components/settings/examCard/ExamCard';
import { EXAM_START_STATE } from '../../../../../config/settingsConfig';
import { Dialog } from 'evergreen-ui';
import { ICON_EXAMS_TYPE } from './../../../../../config/globalTypes.d';
// const {
//     wrapper: s_wrapper,
// } = CSS;

export default React.memo(forwardRef(function(props: ExamsSettingsProps, ref): JSX.Element {

    const {
        fetchAllData,
        addNewDatum,
        updateValue,
        deleteData,
        saveChanges,
        data
    } = useSubjectData<ExamModel>('exam', props.subjectId, props.initialData || null);

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
        addNewDatum(EXAM_START_STATE);
        props.onDataChanged();
    }, [addNewDatum, props]);

    const valChangedHandler = useCallback(<K extends keyof ExamModel, T extends any>(dataId: string, key: K, newVal: T | null): void => {
        
        if (newVal === null) return;

        updateValue(dataId, key, newVal);
        props.onDataChanged();

    }, [props, updateValue]);

    if (data.loading) {
        return <Loader />;
    }

    const events = data.items.map(el => {
        return (
            <ExamCard
                key={el.id}
                data={el as ExamModelWithId}
                onChange={(key: keyof ExamModel, newVal) => valChangedHandler(el.id, key, newVal)}
                onRemove={() => setWantDelete(el.id)}
            />
        )
    })
    
    return (
        <Fragment>
            <SettingsCards 
                title='EVENTS'
                icon={ICON_EXAMS_TYPE}
                onAddNew={addNewEventHandler}
            >
                {events}
            </SettingsCards>

            <Dialog
                isShown={wantDelete ? true : false}
                isConfirmLoading={deleting}
                title={`Delete event ${(data.items.find(el => el.id === wantDelete) as ExamModelWithId)?.type}`}
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