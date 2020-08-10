import React, { useEffect, useCallback, useMemo } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject, filterSubjectsForSpace } from '../../util/util';
import CheckedTasks from '../../components/todo/checkedTasks/CheckedTasks';
import * as actions from '../../store/actions';
import { TIME_BEFORE_DATA_REFRESH_MS } from './../../config/generalConfig';
import { PREF_ID_FUTURE_TASKS_TODO_VIEW_LIMIT, PREF_ID_DAY_STARTS_AT } from '../../config/userPreferences';
import { PREF_ID_EXPAND_ALL_VISIBLE_DAYS } from './../../config/userPreferences';

export default function() {

    const spaces = useSelector((state: RootState) => state.user.spaces);
    const selectedSpaceId = useSelector((state: RootState) => state.user.selectedSpace);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const {
        loading,
        refreshing,
        error,
        data: tasks,
        timestamp,
    } = useSelector((state: RootState) => state.data.tasks);

    const filteredSubjects = useMemo(() => subjects ? filterSubjectsForSpace(subjects, selectedSpaceId) : null, [selectedSpaceId, subjects]);
    const filteredTasks = useMemo(() => filteredSubjects && tasks ? tasks.filter(t => filteredSubjects.some(s => s.id === t.subjectId)) : null, [filteredSubjects, tasks]);

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
    } else if (error || !filteredTasks || !filteredSubjects) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='todo' 
                title='ToDo'
                subTitle={spaces && selectedSpaceId !== 'all' ? spaces.find(s => s.id === selectedSpaceId).name : undefined} 
                onRefresh={refreshHandler}
                refreshing={refreshing}
            />

            <DueTasks
                dueTasks={filteredTasks}
                subjects={subjectsToObject(filteredSubjects)}
                onTaskChecked={checkTaskHandler}
                limitDaysInFuture={userPrefersLimitTasksInFuture}
                dayStartsAtHour={userPrefersDayStartsAtHour}
                expandAllVisibleDays={userPrefersExpandAllVisibleDays}
            />

            <CheckedTasks
                rawTasks={filteredTasks}
                subjects={subjectsToObject(filteredSubjects)}
                onTaskUnchecked={uncheckTaskHandler}
            />

        </div>
    )

}