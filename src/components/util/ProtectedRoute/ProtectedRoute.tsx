import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../index';
import { ProtectedRouteProps } from './ProtectedRoute.d';
import { removeKey } from './../../../util/util';

export default function(props: ProtectedRouteProps) {
    
    const isAuthenticated: boolean = useSelector((state: RootState) => state.user?.username !== null);

    if (isAuthenticated) {
        return <Route {...removeKey('orElse', props)} />;
    } else {
        return <Redirect exact to={props.orElse} />
    }
}