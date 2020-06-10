import React, { useEffect, Suspense } from 'react';
import './App.scss';
import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';
import './firebase/firebase'; // init firebase
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/ui/loader/Loader';

import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import {fetchUserData, setSignedIn, fetchShallowSubjects, setSignedOut} from './store/actions';
import { RootState } from '.';

const Layout = React.lazy(() => import('./hoc/layout/Layout'));
const AnimatedSwitch = React.lazy(() => import('./hoc/AnimatedRoutes/AnimatedSwitch'));

const LandingPage    = React.lazy(() => import('./landingPage/landingPage'));
const Tos            = React.lazy(() => import('./legal/Tos'));
const Imprint        = React.lazy(() => import('./legal/Imprint'));
const PrivacyPolicy  = React.lazy(() => import('./legal/PrivacyPolicy'));

const ToDos     = React.lazy(() => import('./container/todos/ToDos'));
const Schedule  = React.lazy(() => import('./container/schedule/Schedule'));
const Subjects  = React.lazy(() => import('./container/subjects/Subjects'));
const Exams     = React.lazy(() => import('./container/exams/Exams'));
const Auth      = React.lazy(() => import('./container/auth/Auth'));
const Settings  = React.lazy(() => import('./container/settings/Settings'));
const SubjectSettings  = React.lazy(() => import('./container/subjects/subjectSettings/SubjectSettings'));


function App() {

    const dispatch = useDispatch();

    // set listener once
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {
                dispatch(fetchUserData());
                dispatch(setSignedIn(user))
                dispatch(fetchShallowSubjects());
            } else {
                dispatch(setSignedOut());
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
        <Suspense fallback={<Loader />}>
            <Switch>
                {/* Non-protected routes */}
                <Route exact path='/' component={LandingPage} />
                <AntiProtectedRoute exact path='/auth' component={Auth} orElse='/todo' />
                <Route exact path='/legal-details' component={Imprint} />
                <Route exact path='/tos' component={Tos} />
                <Route exact path='/privacy' component={PrivacyPolicy} />

                {/* Any other routes */}
                <Route path='/' render={() => (
                    <Suspense fallback={<Loader />}>
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
                    </Suspense>
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
