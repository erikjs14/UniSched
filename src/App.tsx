import React, { useEffect } from 'react';
import './App.scss';
import { Switch, Redirect, Route } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';
import './firebase/firebase'; // init firebase
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';

import LandingPage from './container/landingPage/LandingPage';
import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import ToDos from './container/todos/ToDos';
import Schedule from './container/schedule/Schdule';
import Settings from './container/settings/Settings';
import Exams from './container/exams/Exams';
import Auth from './container/auth/Auth';
import * as actions from './store/actions';
import { RootState } from '.';
import Layout from './components/ui/layout/Layout';

function App() {

    const dispatch = useDispatch();

    // set listener once
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(actions.setSignedIn(user))
            } else {
                dispatch(actions.setSignedOut());
            }
        })
    }, [dispatch]);

    const loading = useSelector((state: RootState) => state.user?.globalLoading);
    if (loading) {
        // display global page load animation here
        return <h1>LOADING...</h1>;
    }

    const routes = (
        <Switch>
            <AntiProtectedRoute exact path='/' component={LandingPage} orElse='/todo' />
            <Route exact path='/auth' component={Auth} orElse='/todo' />

            <ProtectedRoute exact path='/todo' render={() => <Layout><ToDos/></Layout>} orElse='/auth' />
            <ProtectedRoute exact path='/schedule' render={() => <Layout><Schedule/></Layout>} orElse='/auth' />
            <ProtectedRoute exact path='/exams' render={() => <Layout><Exams/></Layout>} orElse='/auth' />
            <ProtectedRoute exact path='/settings' render={() => <Layout><Settings/></Layout>} orElse='/auth' />

            <Redirect to='/' />
        </Switch>
    );

    return (
        <div className="App">
            {routes}
        </div>
    );
}

export default App;
