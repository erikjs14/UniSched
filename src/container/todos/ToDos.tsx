import React, { useEffect, useCallback } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject } from '../../util/util';
import FloatingButton from '../../components/ui/floatingButton/FloatingButton';
import { useHistory } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import CheckedTasks from '../../components/todo/checkedTasks/CheckedTasks';
import * as actions from '../../store/actions';
import { TIME_BEFORE_DATA_REFRESH_MS } from './../../config/generalConfig';

export default function() {

    const history = useHistory();

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const {
        loading,
        refreshing,
        error,
        data: tasks,
        timestamp,
    } = useSelector((state: RootState) => state.data.tasks);
    const dispatch = useDispatch();

    // when site stays open, refresh every x ms and clear interval when component is exited
    useEffect(() => {
        const id = setInterval(() => dispatch(actions.refreshTasks()), TIME_BEFORE_DATA_REFRESH_MS);
        return () => clearInterval(id);
    }, [dispatch]);

    // fetch all tasks
    useEffect(() => {
        if ((subjects && !tasks && !error) || (!loading && Date.now() - timestamp > TIME_BEFORE_DATA_REFRESH_MS)) { //fetch on first mount and when timespan has elapsed
            dispatch(actions.fetchTasks());
        }
    }, [error, subjects, tasks, dispatch, timestamp, loading]);

    const checkTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number): void => {
        // called when animation to remove task ended
        dispatch(actions.checkTask(subjectId, taskId, timestampSeconds));
    }, [dispatch]);

    const uncheckTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number) => {
        // called when animation to remove task ended
        dispatch(actions.uncheckTask(subjectId, taskId, timestampSeconds));
    }, [dispatch]);

    const refreshHandler = useCallback(() => dispatch(actions.refreshTasks()), [dispatch]);

    if (loading) {
        return <Loader />;
    } else if (error || !tasks || !subjects) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='todo' 
                title='ToDo'
                onRefresh={refreshHandler}
                refreshing={refreshing}
            />

            <DueTasks
                dueTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskChecked={checkTaskHandler}
            />
                
            <FloatingButton 
                center
                onClick={() => history.push('/subjects')}
                className='util-margin-bottom-medium' 
            >
                <FontAwesomeIcon style={{fontSize: '2rem'}} icon={faPlus} />
            </FloatingButton>

            <CheckedTasks
                rawTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskUnchecked={uncheckTaskHandler}
            />

        </div>
    )

}