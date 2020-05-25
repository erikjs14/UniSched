import React, { useEffect, useState } from 'react';

import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useHistory } from 'react-router-dom';
import Loader from '../../components/ui/loader/Loader';
import { fetchSubjectsShallow } from '../../firebase/firestore';
import { SubjectModelWithId } from './../../firebase/model';
import SimpleSettingsRow from '../../components/ui/SimpleSettingsRow/SimpleSettingsRow';
import CSS from './Settings.module.scss';
import { toCss } from './../../util/util';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FloatingButton from '../../components/ui/floatingButton/FloatingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_SETTINGS_TYPE, ICON_SETTINGS_ALT } from './../../config/globalTypes.d';
const {
    container: s_container,
    subjects: s_subjects,
    wrapper: s_wrapper,
    noElementsText: s_noElementsText,
    addBtn: s_addBtn,
} = CSS;

export default function(): JSX.Element {

    const history = useHistory();

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
    } else if (subjects.length === 0) { 
        
        content = (
            <div className={toCss(s_wrapper)}>
                <span className={toCss(s_noElementsText)}>
                    It looks as if you haven't saved any subjects yet. <br />
                    Do it now!
                </span>
                <FloatingButton onClick={() => history.push('/settings/new')}><FontAwesomeIcon icon={faPlus} /></FloatingButton>
            </div>
        );

    } else {
        const elements = subjects.map(subject => (
            <SimpleSettingsRow 
                key={subject.id}
                title={subject.name} 
                bgColor={subject.color} 
                icon={ICON_SETTINGS_ALT} 
                linkTo={createLink(subject.id)}
            />
        ));
        content = (
            <div className={toCss(s_subjects)}>
                {elements}
                <div className={toCss(s_addBtn)}>
                    <FloatingButton onClick={() => history.push('/settings/new')}><FontAwesomeIcon icon={faPlus} /></FloatingButton>
                </div>
            </div>
        )
    }

    return (
        <div className={toCss(s_container)}>
            
            <SiteHeader type={ICON_SETTINGS_TYPE} title='Settings' />

            {content}

        </div>
    )

}

const createLink = (subjectId: string): string => {
    return `/settings/${subjectId}`;
}