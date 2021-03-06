import React, { useCallback, Fragment, useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import PreferenceRows from '../../components/settings/PreferenceRows';
import * as actions from '../../store/actions';

import { PREFERENCES_CONFIG, PreferenceId, PreferenceVal, getIdsOfEmptyGroupItems, GroupItem, } from '../../config/userPreferences';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { ICON_SETTINGS_ALT } from './../../config/globalTypes.d';
import AddSpace from './addSpace/AddSpace';
import DeleteSpace from './deleteSpace/DeleteSpace';
import AlterSpace from './alterSpace/AlterSpace';

import CSS from './Settings.module.scss';
import { toCss } from '../../util/util';
import { PreferencesState } from './../../config/userPreferences';
import { fetchSubjectsShallow } from './../../firebase/firestore';
import { SubjectModelWithId } from '../../firebase/model';
const {
    row: s_row,
} = CSS;

export default function(): JSX.Element {

    const preferences: PreferencesState | null = useSelector((state: RootState) => state.user.preferences);
    const error = useSelector((state: RootState) => state.user.preferenceError);
    const dispatch = useDispatch();

    const preferenceChangedHandler = useCallback((id: PreferenceId, value: PreferenceVal) => {
        dispatch(actions.setUserPreference(id, value));
    }, [dispatch]);

    const getGroupItems = useCallback((groupId: string) => {
        return preferences?.[groupId] as GroupItem[];
    }, [preferences]);

    const [allShallowSubjects, setAllShallowSubjects] = useState<SubjectModelWithId[] | null>(null);
    useEffect(() => {
        fetchSubjectsShallow(false)
            .then(subs => setAllShallowSubjects(subs))
    }, []);
    
    return (
        <div>
            
            <SiteHeader
                title='Settings'
                type={ICON_SETTINGS_ALT}
            />

            {error || preferences === null ? <h3>Something went wrong. Try refreshing the page.</h3>
                : (
                    <Fragment>
                        <PreferenceRows
                            preferences={preferences}
                            preferenceConfigs={PREFERENCES_CONFIG}
                            onChange={preferenceChangedHandler}
                            getIdsOfEmptyGroupItems={(groupId, subjectIdName) => getIdsOfEmptyGroupItems(subjectIdName, getGroupItems(groupId), allShallowSubjects || [])}
                        />

                        <AddSpace       wrapCss={toCss(s_row)} />
                        <DeleteSpace    wrapCss={toCss(s_row)} />
                        <AlterSpace     wrapCss={toCss(s_row)} />
                    </Fragment>
                )}

        </div>
    );
}