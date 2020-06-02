import React, { useState, useEffect } from 'react';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import FullCalendar from '@fullcalendar/react';
import Loader from '../../components/ui/loader/Loader';
import listPlugin from '@fullcalendar/list';
import { useSelector } from 'react-redux';
import { RootState } from '../..';
import { fetchExams } from '../../firebase/firestore';
import { getAllConfigFromExams } from '../../util/scheduleUtil';
import { findColorConfig } from '../../config/colorChoices';

import CSS from './Exams.module.scss';
import { toCss } from '../../util/util';
import { CALENDAR_DEFAULT_TIME_FORMAT } from '../../config/timeConfig';
const {
    wrapperCalendar: s_wrapperCalendar,
    smallRow: s_smallRow,
} = CSS;

export default function() {

    const calAspectRatio = React.useMemo(() => window.innerWidth < 900 ? undefined : 2.2, []);
    
    const [examsConfig, setExamsConfig] = useState<object[]|null>(null);
    const [error, setError] = useState(false);

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);

    useEffect(() => {
        if (subjects && !examsConfig) {
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
                            className: s_smallRow,
                            end: '', // unset end
                        })),
                    ];
                });
                setExamsConfig(newExamsConfig);
            })
            .catch(error => setError(true));
        }
    }, [examsConfig, subjects]);

    if (!examsConfig) {
        return <Loader />;
    } else if (error) {
        return <h2>An unexpected error has occurred. Try reloading the page.</h2>
    }

    return (
        <div>
            
            <SiteHeader type='exams' title='Exams' />

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