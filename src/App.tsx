import React from 'react';
import './App.scss';
import { Switch, Redirect, Route } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';
import './firebase/firebase'; // init firebase
import firebase from 'firebase';
import { useDispatch } from 'react-redux';

import LandingPage from './container/landingPage/LandingPage';
import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import ToDos from './container/todos/ToDos';
import Schedule from './container/schedule/Schdule';
import Settings from './container/settings/Settings';
import Exams from './container/exams/Exams';
import Auth from './container/auth/Auth';
import * as actions from './store/actions';

function App() {

    const dispatch = useDispatch();

    // set user status
    firebase.auth().onAuthStateChanged(user => {
        if (user) {
            dispatch(actions.setSignedIn(user))
        } else {
            dispatch(actions.setSignedOut());
        }
    });

    const routes = (
        <Switch>
            <AntiProtectedRoute exact path='/' component={LandingPage} />
            <ProtectedRoute exact path='/todos' component={ToDos} />
            <ProtectedRoute exact path='/schedule' component={Schedule} />
            <ProtectedRoute exact path='/exams' component={Exams} />
            <ProtectedRoute exact path='/settings' component={Settings} />
            <Route exact path='/auth' component={Auth} />
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
