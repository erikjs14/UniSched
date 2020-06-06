import React from 'react';
import { Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../../index';
import { ProtectedRouteProps } from './ProtectedRoute.d';
import { removeKey } from './../../../util/util';
import Layout from '../../../hoc/layout/Layout';

export default function(props: ProtectedRouteProps) {
    
    const isAuthenticated: boolean = useSelector((state: RootState) => state.user?.username !== null);

    if (isAuthenticated) {
        if (props.withLayout) {
            return (
                <Layout>
                    <Route {...removeKey('orElse', props)} />
                </Layout>
            )
        }
        else
            return <Route {...removeKey('orElse', props)} />;
    } else {
        return <Redirect exact to={props.orElse} />
    }
}