import React, { useState, useEffect, useRef } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import Loader from '../../components/ui/loader/Loader';
import { toaster } from 'evergreen-ui';

import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';

//calendar styles
import '@fullcalendar/core/main.css';
import '@fullcalendar/daygrid/main.css';
import '@fullcalendar/timegrid/main.css';
import '@fullcalendar/list/main.css';
import { toCss } from './../../util/util';

import CSS from './Schedule.module.scss';
import { fetchEvents, fetchExams } from './../../firebase/firestore';
import { useSelector } from 'react-redux';
import { RootState } from '../..';
import { getAllConfigFromEvents, getAllConfigFromExams } from '../../util/scheduleUtil';
import { findColorConfig } from './../../config/colorChoices';
import Input from '../../components/ui/input/Input';
import { DEFAULT_SCHEDULE_CALENDAR_PROPS } from '../../config/timeConfig';
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

    const [calendarView, setCalendarView] = useState(window.innerWidth < 600 ? 'timeGridDay' : 'timeGridWeek');
    const calAspectRatio = React.useMemo(() => window.innerWidth < 900 ? undefined : 2.2, []);
    const calRef = useRef<FullCalendar>(null);

    useEffect(() => {
        calRef.current?.getApi().changeView(calendarView);
    }, [calendarView]);

    const [eventsConfig, setEventsConfig] = useState<object[]|null>(null);
    const [examsConfig, setExamsConfig] = useState<object[]|null>(null);
    const [error, setError] = useState(false);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    useEffect(() => {
        if (subjects && !eventsConfig && !error) {
            Promise.all(
                subjects.map(sub => fetchEvents(sub.id))
            )
            .then(eventsPerSubject => {
                let newEventsConfig: object[] = [];
                eventsPerSubject.forEach((events, idx) => {
                    newEventsConfig = [
                        ...newEventsConfig,
                        ...getAllConfigFromEvents(events).map(conf => ({
                            ...conf,
                            title: '[' + subjects[idx].name.toUpperCase() + '] ' + conf.title,
                            backgroundColor: findColorConfig(subjects[idx].color).value,
                        })),
                    ];
                });
                setEventsConfig(newEventsConfig);
            })
            .catch(error => {
                setError(true);
            })
        }
    }, [error, eventsConfig, subjects]);
    useEffect(() => {
        if (subjects && !examsConfig && !error) {
            Promise.all(
                subjects.map(sub => fetchExams(sub.id))
            )
            .then(examsPerSubject => {
                let newExamsConfig: object[] = [];
                examsPerSubject.forEach((exams, idx) => {
                    newExamsConfig = [
                        ...newExamsConfig,
                        ...getAllConfigFromExams(exams).map(conf => ({
                            ...conf,
                            title: '[' + subjects[idx].name.toUpperCase() + '] ' + conf.title,
                            backgroundColor: findColorConfig(subjects[idx].color).value,
                        })),
                    ];
                });
                setExamsConfig(newExamsConfig);
            })
            .catch(error => setError(true));
        }
    }, [error, examsConfig, subjects]);

    if (error) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    } else if (!eventsConfig || !examsConfig) {
        return <Loader />;
    }

    return (
        <div>
            
            <SiteHeader type='schedule' title='Schedule' />

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
                    events={[...eventsConfig, ...examsConfig]}
                    eventClick={({event}) => toaster.notify(event.title, {
                        id: 'unique',
                        duration: 2,
                    })}
                    {...DEFAULT_SCHEDULE_CALENDAR_PROPS}
                />
            </div>

        </div>
    )

}