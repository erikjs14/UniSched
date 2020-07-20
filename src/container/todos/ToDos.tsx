import React, { useEffect, useCallback } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject } from '../../util/util';
import CheckedTasks from '../../components/todo/checkedTasks/CheckedTasks';
import * as actions from '../../store/actions';
import { TIME_BEFORE_DATA_REFRESH_MS } from './../../config/generalConfig';
import { PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT, PREF_ID_DAY_STARTS_AT } from '../../config/userPreferences';
import { PREF_ID_EXPAND_ALL_VISIBLE_DAYS } from './../../config/userPreferences';

export default function() {

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

    const userPrefersLimitTasksInFuture = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT] as (number|undefined));
    const userPrefersDayStartsAtHour = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_DAY_STARTS_AT] as (number|undefined));
    const userPrefersExpandAllVisibleDays = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_EXPAND_ALL_VISIBLE_DAYS] as (boolean|undefined));

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
                limitDaysInFuture={userPrefersLimitTasksInFuture}
                dayStartsAtHour={userPrefersDayStartsAtHour}
                expandAllVisibleDays={userPrefersExpandAllVisibleDays}
            />

            <CheckedTasks
                rawTasks={tasks}
                subjects={subjectsToObject(subjects)}
                onTaskUnchecked={uncheckTaskHandler}
            />

        </div>
    )

}