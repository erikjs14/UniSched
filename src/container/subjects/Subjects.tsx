import React from 'react';

import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { useHistory } from 'react-router-dom';
import SimpleSettingsRow from '../../components/subjects/SimpleSettingsRow/SimpleSettingsRow';
import CSS from './Subjects.module.scss';
import { toCss, filterSubjectsForSpace } from '../../util/util';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import FloatingButton from '../../components/ui/floatingButton/FloatingButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { ICON_SETTINGS_TYPE } from '../../config/globalTypes.d';
import { useSelector } from 'react-redux';
import { RootState } from '../..';
import SpaceSelector from '../spaceSelector/SpaceSelector';
const {
    container: s_container,
    subjects: s_subjects,
    wrapper: s_wrapper,
    noElementsText: s_noElementsText,
    addBtn: s_addBtn,
    mobileOnly: s_mobileOnly,
    noSubjects: s_noSubjects,
} = CSS;

export default function(): JSX.Element {

    const history = useHistory();

    const subjects = useSelector((state: RootState) => state.user.shallowSubjects);
    const spaces = useSelector((state: RootState) => state.user.spaces);
    const selectedSpaceId = useSelector((state: RootState) => state.user.selectedSpace);

    let content;
    if (!subjects || subjects.length === 0) { 
        
        content = (
            <div className={toCss(s_wrapper)}>
                <span className={toCss(s_noElementsText)}>
                    It looks as if you haven't saved any subjects yet. <br />
                    Do it now!
                </span>
                <FloatingButton onClick={() => history.push('/subjects/new')}><FontAwesomeIcon icon={faPlus} /></FloatingButton>
            </div>
        );

    } else {
        const elements = 
            filterSubjectsForSpace(subjects, selectedSpaceId)
            .map(subject => (
                <SimpleSettingsRow 
                    key={subject.id}
                    title={subject.name}
                    bgColor={subject.color}
                    linkTo={createLink(subject.id)}
                />
        ));
        content = (
            <div className={toCss(s_subjects)}>
                {elements.length > 0 ? elements : <h3 className={toCss(s_noSubjects)} >There are no subjects in this space.</h3>}
                <div className={toCss(s_addBtn)}>
                    <FloatingButton onClick={() => history.push('/subjects/new')}><FontAwesomeIcon icon={faPlus} /></FloatingButton>
                </div>
            </div>
        )
    }

    return (
        <div className={toCss(s_container)}>
            
            <SiteHeader 
                type={ICON_SETTINGS_TYPE} 
                title='Subjects' 
                subTitle={spaces && selectedSpaceId !== 'all' ? spaces.find(s => s.id === selectedSpaceId).name : undefined} 
            />

            <SpaceSelector 
                wrapCss={toCss(s_mobileOnly)}
            />

            {content}

        </div>
    )

}

const createLink = (subjectId: string): string => {
    return `/subjects/${subjectId}`;
}