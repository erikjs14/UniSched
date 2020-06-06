import React, { useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import PreferenceRows from '../../components/settings/PreferenceRows';
import * as actions from '../../store/actions';

import { PREFERENCES_CONFIG, PreferenceId, PreferenceVal } from '../../config/userPreferences';
import SiteHeader from '../../components/ui/SiteHeader/SiteHeader';
import { ICON_SETTINGS_ALT } from './../../config/globalTypes.d';


export default function(): JSX.Element {

    const preferences = useSelector((state: RootState) => state.user.preferences);
    const error = useSelector((state: RootState) => state.user.preferenceError);
    const dispatch = useDispatch();

    const preferenceChangedHandler = useCallback((id: PreferenceId, value: PreferenceVal) => {
        dispatch(actions.setUserPreference(id, value));
    }, [dispatch]);
    
    return (
        <div>
            
            <SiteHeader
                title='Settings'
                type={ICON_SETTINGS_ALT}
            />

            {error || preferences === null ? <h3>Something went wrong. Try refreshing the page.</h3>
                : (
                    <PreferenceRows
                        preferences={preferences}
                        preferenceConfigs={PREFERENCES_CONFIG}
                        onChange={preferenceChangedHandler}
                    />
                )}

        </div>
    );
}