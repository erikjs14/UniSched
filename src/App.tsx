import React from 'react';
import './App.scss';
import { Switch, Redirect, Route } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';

import LandingPage from './container/landingPage/LandingPage';
import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import ToDos from './container/todos/ToDos';
import Schedule from './container/schedule/Schdule';
import Settings from './container/settings/Settings';
import Exams from './container/exams/Exams';
import Auth from './container/auth/Auth';
import './firebase/firebase';

function App() {

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
