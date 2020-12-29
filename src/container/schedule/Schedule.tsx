import React, { useState, useEffect, useRef, useCallback, useMemo } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import Loader from '../../components/ui/loader/Loader';
import { toaster } from 'evergreen-ui';
import * as actions from '../../store/actions';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

//calendar styles
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import '../../style/override.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { toCss, filterSubjectsForSpace } from './../../util/util';

import CSS from './Schedule.module.scss';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import Input from '../../components/ui/input/Input';
import { DEFAULT_SCHEDULE_CALENDAR_PROPS } from '../../config/timeConfig'
import { TIME_BEFORE_DATA_REFRESH_MS } from '../../config/generalConfig';
import { getSubAndTitleAndTimeFromEventTitle } from '../../util/scheduleUtil';
import MarkdownDialog from '../../components/dialogs/MarkdownDialog';
const {
    wrapperCalendar: s_wrapperCalendar,
    viewToggle: s_viewToggle,
} = CSS;

const availableViews: {[id: string]: string} = {
    timeGridDay: 'Day',
    timeGridWeek: 'Week',
    dayGridMonth: 'Month',
    listWeek: 'List',
};
export default function() {

    const [additionalInfo, setAdditionalInfo] = useState<{
        title: string;
        markdown: string;
    }|null>(null);

    const spaces = useSelector((state: RootState) => state.user.spaces);
    const selectedSpaceId = useSelector((state: RootState) => state.user.selectedSpace);

    const [calendarView, setCalendarView] = useState(window.innerWidth < 600 ? 'timeGridDay' : 'timeGridWeek');
    const calAspectRatio = React.useMemo(() => window.innerWidth < 900 ? undefined : 2.2, []);
    const calRef = useRef<FullCalendar>(null);

    useEffect(() => {
        calRef.current?.getApi().changeView(calendarView);
    }, [calendarView]);

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

    const filteredSubjects = useMemo(() => subjects ? filterSubjectsForSpace(subjects, selectedSpaceId) : null, [selectedSpaceId, subjects]);
    const filteredExamsConfig = useMemo(() => filteredSubjects && examsConfig ? examsConfig.filter(e => filteredSubjects.some(s => s.id === e.subjectId)) : null, [examsConfig, filteredSubjects]);
    const filteredEventsConfig = useMemo(() => filteredSubjects && eventsConfig ? eventsConfig.filter(e => filteredSubjects.some(s => s.id === e.subjectId)) : null, [eventsConfig, filteredSubjects]);

    const dispatch = useDispatch();

    // when site stays open, refresh every x ms and clear interval when component is exited
    useEffect(() => {
        const id = setInterval(() => {
            dispatch(actions.refreshEvents());
            dispatch(actions.refreshExams());
        }, TIME_BEFORE_DATA_REFRESH_MS);
        return () => clearInterval(id);
    }, [dispatch]);

    const refreshHandler = useCallback(() => {
        dispatch(actions.refreshEvents());
        dispatch(actions.refreshExams());
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

    const eventClickHandler = useCallback(({event}) => {
        const {subjectName, eventName, timeStr} = getSubAndTitleAndTimeFromEventTitle(event);
        const addInfoText = event.extendedProps?.additionalInfoText;

        if (addInfoText) {
            setAdditionalInfo({
                title: `${timeStr}: ${subjectName} - ${eventName}`,
                markdown: addInfoText || '',
            });
        } else {
            toaster.notify(
                `${timeStr}: ${subjectName} - ${eventName}`,
                { id: 'unique', duration: 2 }
            )
        }
    }, []);

    if (eventsLoading || examsLoading) {
        return <Loader />;
    } else if (eventsError || examsError || !filteredSubjects || !filteredEventsConfig || !filteredExamsConfig) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='schedule' 
                title='Schedule'
                subTitle={spaces && selectedSpaceId !== 'all' ? spaces.find(s => s.id === selectedSpaceId).name : undefined} 
                onRefresh={refreshHandler}
                refreshing={eventsRefreshing || examsRefreshing} 
            />

            <Input
                elementType='select-visual'
                value={availableViews[calendarView]}
                onChange={newView => setCalendarView(Object.keys(availableViews).find(key => availableViews[key] === newView) || 'timeGridWeek')}
                label='Views'
                options={Object.values(availableViews)}
                addClass={toCss(s_viewToggle)}
                minSize
            />

            <div className={toCss(s_wrapperCalendar)}>
                <FullCalendar
                    ref={calRef}
                    defaultView={calendarView}
                    minTime='06:00'
                    plugins={[dayGridPlugin, timeGridPlugin, listPlugin]}
                    nowIndicator
                    aspectRatio={calAspectRatio}
                    events={[...filteredEventsConfig, ...filteredExamsConfig]}
                    eventClick={eventClickHandler}
                    {...DEFAULT_SCHEDULE_CALENDAR_PROPS}
                />

                { additionalInfo && (
                    <MarkdownDialog
                        show={additionalInfo !== null}
                        title={additionalInfo.title}
                        rawMarkdown={additionalInfo.markdown}
                        onClose={() => setAdditionalInfo(null)}
                        editModeDisabled
                    />
                )}
            </div>

        </div>
    )

}