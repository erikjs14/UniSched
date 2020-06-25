import React, { useEffect, useCallback } from 'react';

import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import * as actions from '../../store/actions';
import { TIME_BEFORE_DATA_REFRESH_MS } from '../../config/generalConfig';
import { getSubAndTitleAndTimeFromEventTitle } from '../../util/scheduleUtil';
import { toaster } from 'evergreen-ui';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import Loader from '../../components/ui/loader/Loader';
import DueTasks from '../../components/todo/dueTasks/DueTasks';
import { subjectsToObject, toCss } from '../../util/util';
import FullCalendar from '@fullcalendar/react';
import { DEFAULT_SCHEDULE_CALENDAR_PROPS, CALENDAR_DEFAULT_TIME_FORMAT } from '../../config/timeConfig';
import {Responsive, WidthProvider} from 'react-grid-layout';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import '@fullcalendar/core/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '../../style/override.scss';
import './override.scss';
import { isInFuture } from '../../util/timeUtil';
import { ExamConfigType } from '../../store/reducers/data';

import CSS from './Dashboard.module.scss';
import { PREF_ID_DAY_STARTS_AT } from './../../config/userPreferences';
const {
    tasksArea: s_tasksArea,
    eventsArea: s_eventsArea,
    examsArea: s_examsArea,
    gridArea: s_gridArea,
    grid: s_grid,
    areaHeader: s_areaHeader,
} = CSS;

const ResponsiveGridLayout = WidthProvider(Responsive);
const gridLayouts = {
    nm: [
        {i: 'tasks', x: 0, y: 0, w: 6, h: 5, minW: 3, minH: 3},
        {i: 'events', x: 0, y: 5, w: 3, h: 5, minW: 2, minH: 4},
        {i: 'exams', x: 3, y: 5, w: 3, h: 5, minW: 2, minH: 4},
    ],
    sm: [
        {i: 'tasks', x: 0, y: 0, w: 2, h: 5, minW: 2, minH: 3, isDraggable: false},
        {i: 'events', x: 0, y: 5, w: 2, h: 5, minW: 1, minH: 4, isDraggable: false},
        {i: 'exams', x: 0, y: 10, w: 2, h: 5, minW: 1, minH: 4, isDraggable: false},
    ],
}

export default function(): JSX.Element {

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const {
        loading: examsLoading,
        refreshing: examsRefreshing,
        error: examsError,
        config: examsConfig,
        timestamp: examsTimestamp,
    } = useSelector((state: RootState) => state.data.exams);
    const {
        loading: eventsLoading,
        refreshing: eventsRefreshing,
        error: eventsError,
        config: eventsConfig,
        timestamp: eventsTimestamp,
    } = useSelector((state: RootState) => state.data.events);
    const {
        loading: tasksLoading,
        refreshing: tasksRefreshing,
        error: tasksError,
        timestamp: tasksTimestamp,
        data: tasks,
    } = useSelector((state: RootState) => state.data.tasks);

    const dispatch = useDispatch();

    // when site stays open, refresh every x ms and clear interval when component is exited
    useEffect(() => {
        const id = setInterval(() => {
            dispatch(actions.refreshEvents());
            dispatch(actions.refreshExams());
            dispatch(actions.refreshTasks());
        }, TIME_BEFORE_DATA_REFRESH_MS);
        return () => clearInterval(id);
    }, [dispatch]);

    const refreshHandler = useCallback(() => {
        dispatch(actions.refreshEvents());
        dispatch(actions.refreshExams());
        dispatch(actions.refreshTasks());
    }, [dispatch]);

    useEffect(() => {
        if ((subjects && !eventsConfig && !eventsError) || (!eventsLoading && Date.now() - eventsTimestamp > TIME_BEFORE_DATA_REFRESH_MS)) {
            dispatch(actions.fetchEvents());
        }
    }, [dispatch, eventsConfig, eventsError, eventsLoading, eventsTimestamp, subjects]);
    useEffect(() => {
        if ((subjects && !examsConfig && !examsError) || (!examsLoading && Date.now() - examsTimestamp > TIME_BEFORE_DATA_REFRESH_MS)) {
            dispatch(actions.fetchExams());
        }
    }, [dispatch, examsConfig, examsError, examsLoading, examsTimestamp, subjects]);
    useEffect(() => {
        if ((subjects && !tasks && !tasksError) || (!tasksLoading && Date.now() - tasksTimestamp > TIME_BEFORE_DATA_REFRESH_MS)) {
            dispatch(actions.fetchTasks());
        }
    }, [dispatch, subjects, tasks, tasksError, tasksLoading, tasksTimestamp]);

    const checkTaskHandler = useCallback((subjectId: string, taskId: string, timestampSeconds: number): void => {
        // called when animation to remove task ended
        dispatch(actions.checkTask(subjectId, taskId, timestampSeconds));
    }, [dispatch]);
    
    const eventClickHandler = useCallback(({event}) => {
        const {subjectName, eventName, startStr, endStr} = getSubAndTitleAndTimeFromEventTitle(event)
        toaster.notify(
            eventName, 
            {
                id: 'unique',
                duration: 2,
                description: `${startStr} - ${endStr} ${subjectName}`,
            }
        );
    }, []);

    let thisLayouts;
    const storedLayouts = localStorage.getItem('dashboard_layouts_pref');
    if (storedLayouts) {
        thisLayouts = JSON.parse(storedLayouts);
    } else {
        thisLayouts = gridLayouts;
    }

    const userPrefersDayStartsAt = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_DAY_STARTS_AT] as (number|undefined));

    if (eventsLoading || examsLoading || tasksLoading) {
        return <Loader />;
    } else if (eventsError || examsError || tasksError || !eventsConfig || !examsConfig || !tasks || !subjects) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='dashboard' 
                title='Dashboard'
                onRefresh={refreshHandler}
                refreshing={eventsRefreshing || examsRefreshing || tasksRefreshing}
            />

            <ResponsiveGridLayout
                layouts={thisLayouts}
                breakpoints={{nm: 600, sm: 0}}
                cols={{nm: 6, sm: 2}}
                rowHeight={50}
                className={toCss(s_grid, 'gridClass')} 
                onLayoutChange={(cur, newLayouts) => localStorage.setItem('dashboard_layouts_pref', JSON.stringify(newLayouts))}
            >

                <div key='tasks' className={toCss(s_gridArea, s_tasksArea)} >
                    <h3 className={toCss(s_areaHeader)} >Check out your current tasks</h3>
                    <DueTasks
                        dueTasks={tasks}
                        subjects={subjectsToObject(subjects)}
                        onTaskChecked={checkTaskHandler}
                        limitDaysInFuture={0}
                        dayStartsAtHour={userPrefersDayStartsAt || 0}
                        small
                    />
                </div>

                <div key='events' className={toCss(s_gridArea, s_eventsArea)} >
                    <h3 className={toCss(s_areaHeader)}>Upcoming events</h3>
                    <FullCalendar
                        defaultView='timeGridDay'
                        allDaySlot={false}
                        minTime='06:00'
                        plugins={[timeGridPlugin]}
                        nowIndicator
                        height='auto'
                        events={[...eventsConfig, ...examsConfig]}
                        eventClick={eventClickHandler}
                        {...DEFAULT_SCHEDULE_CALENDAR_PROPS}
                    />
                </div>

                <div key='exams' className={toCss(s_gridArea, s_examsArea)} >
                    <h3 className={toCss(s_areaHeader)}>Upcoming exams</h3>
                    <FullCalendar
                        defaultView='listYear'
                        plugins={[listPlugin]}
                        nowIndicator
                        height='auto'
                        events={examsConfig.filter(examConfig => isInFuture((examConfig as ExamConfigType).start))}
                        eventTimeFormat={CALENDAR_DEFAULT_TIME_FORMAT}
                    />
                </div>

            </ResponsiveGridLayout>

        </div>
    );

}
