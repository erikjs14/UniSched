import React, { useEffect, Suspense } from 'react';
import './App.scss';
import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';
import './firebase/firebase'; // init firebase
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/ui/loader/Loader';

import LandingPage from './landingPage/landingPage';
import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import * as actions from './store/actions';
import { RootState } from '.';
import SubjectSettings from "./container/subjects/subjectSettings/SubjectSettings";
import Layout from './hoc/layout/Layout';
import AnimatedSwitch from './hoc/AnimatedRoutes/AnimatedSwitch';
import Imprint from './legal/Imprint';
import Tos from './legal/Tos';
import PrivacyPolicy from './legal/PrivacyPolicy';

const ToDos     = React.lazy(() => import('./container/todos/ToDos'));
const Schedule  = React.lazy(() => import('./container/schedule/Schedule'));
const Subjects  = React.lazy(() => import('./container/subjects/Subjects'));
const Exams     = React.lazy(() => import('./container/exams/Exams'));
const Auth      = React.lazy(() => import('./container/auth/Auth'));
const Settings  = React.lazy(() => import('./container/settings/Settings'));


function App() {

    const dispatch = useDispatch();

    // set listener once
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(actions.fetchUserData());
                dispatch(actions.setSignedIn(user))
                dispatch(actions.fetchShallowSubjects());
            } else {
                dispatch(actions.setSignedOut());
            }
        })
    }, [dispatch]);

    const location = useLocation();

    const loading = useSelector((state: RootState) => state.user?.globalLoading);
    if (loading && location.pathname !== '/') {
        // display global page load animation here
        return <h1>LOADING...</h1>;
    }

    const routes = (
        <Suspense fallback={<h1>LOADING...</h1>}>
            <Switch>
                {/* Non-protected routes */}
                <AntiProtectedRoute exact path='/' component={LandingPage} orElse='/todo' />
                <Route exact path='/auth' component={Auth} />
                <Route exact path='/legal-details' component={Imprint} />
                <Route exact path='/tos' component={Tos} />
                <Route exact path='/privacy' component={PrivacyPolicy} />

                {/* Any other routes */}
                <Route path='/' render={() => (
                    <Layout>
                        <Suspense fallback={<Loader />}>
                            <AnimatedSwitch>
                                <ProtectedRoute exact path='/todo'       component={ToDos}       orElse='/auth' />
                                <ProtectedRoute exact path='/schedule'   component={Schedule}    orElse='/auth' />
                                <ProtectedRoute exact path='/exams'      component={Exams}       orElse='/auth' />
                                <ProtectedRoute exact path='/subjects'   component={Subjects}    orElse='/auth' />
                                <ProtectedRoute exact path='/subjects/new' render={() => <SubjectSettings new />} orElse='/auth' />
                                <ProtectedRoute       path='/subjects/:id' render={(props) => <SubjectSettings subjectId={props.match.params.id}/>} orElse='/auth' />
                                <ProtectedRoute exact path='/settings'   component={Settings}    orElse='/auth' />

                                <Redirect to='/' />
                            </AnimatedSwitch>
                        </Suspense>
                    </Layout>
                )} />
            </Switch>
        </Suspense>
    );

    return (
        <div className="App">
            {routes}
        </div>
    );
}

export default App;
