import React, { useEffect, useCallback } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import FullCalendar from '@fullcalendar/react';
import Loader from '../../components/ui/loader/Loader';
import listPlugin from '@fullcalendar/list';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import * as actions from '../../store/actions';

import CSS from './Exams.module.scss';
import { toCss } from '../../util/util';
import { CALENDAR_DEFAULT_TIME_FORMAT } from '../../config/timeConfig';
const {
    wrapperCalendar: s_wrapperCalendar,
} = CSS;

export default function() {

    const calAspectRatio = React.useMemo(() => window.innerWidth < 900 ? undefined : 2.2, []);
    
    const {
        loading,
        refreshing,
        error,
        config: examsConfig
    } = useSelector((state: RootState) => state.data.exams);
    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    const dispatch = useDispatch();

    const refreshHandler = useCallback(() => dispatch(actions.refreshExams()), [dispatch]);

    useEffect(() => {
        if (subjects && !examsConfig) {
            dispatch(actions.fetchExams());
        }
    }, [dispatch, examsConfig, subjects]);

    if (loading) {
        return <Loader />;
    } else if (error || !examsConfig) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader 
                type='exams' 
                title='Exams' 
                onRefresh={refreshHandler}
                refreshing={refreshing} 
            />

            <div className={toCss(s_wrapperCalendar)}>
                <FullCalendar
                    defaultView={'listMonth'}
                    plugins={[listPlugin]}
                    nowIndicator
                    aspectRatio={calAspectRatio}
                    events={examsConfig}
                    eventTimeFormat={CALENDAR_DEFAULT_TIME_FORMAT}
                />
            </div>

        </div>
    )

}