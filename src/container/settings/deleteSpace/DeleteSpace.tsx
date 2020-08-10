import React, { useState, useCallback, Fragment } from 'react';

import CSS from './DeleteSpace.module.scss';
import { DeleteSpaceProps } from './DeleteSpace.d';
import { toCss } from '../../../util/util';
import { Combobox, Button, toaster, Dialog } from 'evergreen-ui';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../..';
import { deleteSpace } from '../../../firebase/firestore';
import { removeSpaceLocally } from '../../../store/actions/user';
import { fetchTasks, fetchExams, fetchEvents } from '../../../store/actions';
const {
    wrapper: s_wrapper,
    select: s_select,
    btn: s_btn,
} = CSS;

export default function(props: DeleteSpaceProps): JSX.Element | null {
    
    const spaces = useSelector((state: RootState) => state.user.spaces);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const [selectedSpace, setSelectedSpace] = useState(spaces?.[0]);
    const [loading, setLoading] = useState(false);

    const [doConfirm, setDoConfirm] = useState<null|string>(null);

    const dispatch = useDispatch();

    const deleteSpaceHandler = useCallback((spaceId: string, checkContainsSubjects: boolean) => {
        if (spaceId === 'mainSpace') {
            toaster.warning(
                'You cannot delete this space.',
                {
                    id: 'unique',
                    description: 'This is the default space and must not be deleted.'
                }
            );
            return;
        }

        if (checkContainsSubjects) {
            if (subjects?.some(s => s.spaceId === spaceId)) {
                setDoConfirm(spaceId);
                return;
            }
        }

        setLoading(true);
        deleteSpace(spaceId, subjects?.filter(s => s.spaceId === spaceId).map(s => s.id) || [])
        .then(() => {
            setLoading(false);
            setSelectedSpace(undefined);
            dispatch(removeSpaceLocally(spaceId));
            dispatch(fetchTasks());
            dispatch(fetchExams());
            dispatch(fetchEvents());
            // dispatch(forceRefresh('task')); Why does this not work???
            toaster.success(
                'Space removed successfully.',
                {
                    id: 'unique',
                }
            );
        })
        .catch(error => {
            setLoading(false);
            toaster.danger(
                'Something went wrong trying to delete the space.',
                {
                    id: 'unique',
                }
            );
        })
    }, [dispatch, subjects]);
    
    if (!spaces) return null;

    return (
        <Fragment>
            <div className={toCss(s_wrapper, props.wrapCss ? props.wrapCss : '')} >
                <Combobox
                    className={toCss(s_select)}
                    items={spaces}
                    itemToString={item => item.name}
                    initialSelectedItem={selectedSpace}
                    onChange={sel => setSelectedSpace(sel)}
                />
                <Button
                    className={toCss(s_btn)} 
                    isLoading={loading}
                    disabled={selectedSpace === undefined || selectedSpace === null}
                    onClick={() => deleteSpaceHandler(selectedSpace.id, true)}
                    iconBefore='trash'
                    intent='danger'
                >Remove Space</Button>
            </div>

            <Dialog
                isShown={doConfirm !== null}
                title='Delete space'
                confirmLabel='Confirm'
                onCancel={close => {
                    setDoConfirm(null);
                    close();
                }}
                onConfirm={close => {
                    if (doConfirm) deleteSpaceHandler(doConfirm, false);
                    close();
                }}
                onCloseComplete={() => { //closed in another way
                    setDoConfirm(null);
                }}
            >
                Are you sure you want to delete this space including all subjects with tasks, exams and events?
            </Dialog>
            
        </Fragment>
    );
}