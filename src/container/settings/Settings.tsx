import React, { useEffect, useState } from 'react';

import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import Loader from '../../components/ui/loader/Loader';
import { fetchSubjectsShallow } from '../../firebase/firestore';
import { SubjectModelWithId } from './../../firebase/model';
import SimpleSettingsRow from '../../components/ui/SimpleSettingsRow/SimpleSettingsRow';
import { SETTINGS_ALT } from './../../util/globalTypes.d';
import CSS from './Settings.module.scss';
import { toCss } from './../../util/util';
const {
    subjects: s_subjects,
} = CSS;

export default function(): JSX.Element {

    const [subjects, setSubjects] = useState<SubjectModelWithId[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<any>(null);

    useEffect(() => {
        fetchSubjectsShallow()
            .then(subjects => {
                setSubjects(subjects);
                setError(null);
            })
            .catch(error => {
                setError(error);
                setSubjects([]);
            }).finally(() => {
                setLoading(false);
            })
    }, []);

    let content;
    if (loading) {
        content = <Loader />;
    } else if (error) { 
        content = 'ERROR. Refresh Page.'; // ToDo: nsert something more meaningful
    } else {
        const elements = subjects.map(subject => (
            <SimpleSettingsRow 
                key={subject.id}
                title={subject.name} 
                bgColor={subject.color} 
                icon={SETTINGS_ALT} 
                linkTo={createLink(subject.id)}
            />
        ));
        content = (
            <div className={toCss(s_subjects)}>
                {elements}
            </div>
        )
    }

    return (
        <div>
            
            <SiteHeader type='settings' title='Settings' />

            {content}

        </div>
    )

}

const createLink = (subjectId: string): string => {
    return `/settings/${subjectId}`;
}