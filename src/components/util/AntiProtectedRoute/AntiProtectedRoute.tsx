import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../index';
import { AntiProtectedRouteProps } from './AntiProtectedRoute.d';
import { removeKey } from './../../../util/util';

// dont let authenticated users use this route
export default function(props: AntiProtectedRouteProps) {
    
    const isNotAuthenticated: boolean = useSelector((state: RootState) => state.user?.username === null);

    if (isNotAuthenticated) {
        return <Route {...removeKey('orElse', props)} />;
    } else {
        return <Redirect exact to={props.orElse} />
    }
}