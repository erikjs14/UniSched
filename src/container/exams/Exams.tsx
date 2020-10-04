import React, { useEffect, useCallback, useState, useRef, useMemo, Fragment } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import FullCalendar from '@fullcalendar/react';
import Loader from '../../components/ui/loader/Loader';
import listPlugin from '@fullcalendar/list';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import * as actions from '../../store/actions';

import CSS from './Exams.module.scss';
import { toCss, filterSubjectsForSpace } from '../../util/util';
import { CALENDAR_DEFAULT_TIME_FORMAT } from '../../config/timeConfig';
import { TIME_BEFORE_DATA_REFRESH_MS } from '../../config/generalConfig';

//calendar styles
import '@fullcalendar/core/main.css';
import '@fullcalendar/list/main.css';
import '../../style/override.scss';
import 'react-datepicker/dist/react-datepicker.css';
import { ExamConfigType } from '../../store/reducers/data';
import { isInFuture } from '../../util/timeUtil';
import { PREF_ID_SHOW_ONLY_FUTURE_EXAMS } from './../../config/userPreferences';
import Input from '../../components/ui/input/Input';
import { getSubAndTitleAndTimeFromEventTitle } from '../../util/scheduleUtil';
import { toaster } from 'evergreen-ui';

const {
    wrapperCalendar: s_wrapperCalendar,
    viewToggle: s_viewToggle,
} = CSS;

const availableViews: {[id: string]: string} = {
    listMonth: 'Month',
    listYear: 'Year',
};

export default function() {

    const spaces = useSelector((state: RootState) => state.user.spaces);
    const selectedSpaceId = useSelector((state: RootState) => state.user.selectedSpace);

    const [calendarView, setCalendarView] = useState('listMonth');
    const calAspectRatio = React.useMemo(() => window.innerWidth < 900 ? undefined : 2.2, []);
    const calRef = useRef<FullCalendar>(null);

    useEffect(() => {
        calRef.current?.getApi().changeView(calendarView);
    }, [calendarView]);

    const {
        loading,
        refreshing,
        error,
        config: examsConfig,
        timestamp,
    } = useSelector((state: RootState) => state.data.exams);
    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    
    const filteredSubjects = useMemo(() => subjects ? filterSubjectsForSpace(subjects, selectedSpaceId) : null, [selectedSpaceId, subjects]);
    const filteredExamsConfig = useMemo(() => filteredSubjects && examsConfig ? examsConfig.filter(e => filteredSubjects.some(s => s.id === e.subjectId)) : null, [examsConfig, filteredSubjects]);

    const dispatch = useDispatch();

    // when site stays open, refresh every x ms and clear interval when component is exited
    useEffect(() => {
        const id = setInterval(() => dispatch(actions.refreshExams()), TIME_BEFORE_DATA_REFRESH_MS);
        return () => clearInterval(id);
    }, [dispatch]);

    const refreshHandler = useCallback(() => dispatch(actions.refreshExams()), [dispatch]);

    useEffect(() => {
        if ((subjects && !examsConfig) || (!loading && Date.now() - timestamp > TIME_BEFORE_DATA_REFRESH_MS)) {
            dispatch(actions.fetchExams());
        }
    }, [dispatch, examsConfig, loading, subjects, timestamp]);

    const userPrefersOnlyFutureExams = useSelector((state: RootState) => state.user.preferences?.[PREF_ID_SHOW_ONLY_FUTURE_EXAMS]);

    const eventClickHandler = useCallback(({event}) => {
        const {subjectName, eventName, timeStr} = getSubAndTitleAndTimeFromEventTitle(event);
        const addInfoText = event.extendedProps?.additionalInfoText;

        const descr = (
            <Fragment>
                <p> {`${timeStr} ${subjectName}`} </p>
                {addInfoText && <p>{addInfoText}</p>}
            </Fragment>
        );

        toaster.notify(
            eventName, 
            {
                id: 'unique',
                duration: 2,
                description: descr,
            }
        );
    }, []);

    if (loading) {
        return <Loader />;
    } else if (error || !filteredSubjects || !filteredExamsConfig) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='exams' 
                title='Exams' 
                subTitle={spaces && selectedSpaceId !== 'all' ? spaces.find(s => s.id === selectedSpaceId).name : undefined} 
                onRefresh={refreshHandler}
                refreshing={refreshing} 
            />

            <Input
                elementType='select-visual'
                value={availableViews[calendarView]}
                onChange={newView => setCalendarView(Object.keys(availableViews).find(key => availableViews[key] === newView) || 'listMonth')}
                label='Views'
                options={Object.values(availableViews)}
                addClass={toCss(s_viewToggle)}
                minSize
            />

            <div className={toCss(s_wrapperCalendar)}>
                <FullCalendar
                    ref={calRef}
                    defaultView={calendarView}
                    plugins={[listPlugin]}
                    nowIndicator
                    aspectRatio={calAspectRatio}
                    events={userPrefersOnlyFutureExams
                        ? filteredExamsConfig.filter(examConfig => isInFuture((examConfig as ExamConfigType).start))
                        : filteredExamsConfig 
                    }
                    eventClick={eventClickHandler}
                    eventTimeFormat={CALENDAR_DEFAULT_TIME_FORMAT}
                />
            </div>

        </div>
    )

}