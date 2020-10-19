import React, { useEffect, Suspense, useState } from 'react';
import './App.scss';
import { Switch, Redirect, Route, useLocation } from 'react-router-dom';
import AntiProtectedRoute from './components/util/AntiProtectedRoute/AntiProtectedRoute';
import './firebase/firebase'; // init firebase
import firebase from 'firebase';
import { useDispatch, useSelector } from 'react-redux';
import Loader from './components/ui/loader/Loader';
import { Helmet } from 'react-helmet';

import ProtectedRoute from './components/util/ProtectedRoute/ProtectedRoute';
import {fetchUserData, setSignedIn, fetchShallowSubjects, setSignedOut, fetchSpaces} from './store/actions';
import { RootState } from '.';
import { USER_COL } from './firebase/fields';
import { db } from './firebase/firebase';

const Layout = React.lazy(() => import('./hoc/layout/Layout'));
const AnimatedSwitch = React.lazy(() => import('./hoc/AnimatedRoutes/AnimatedSwitch'));

const LandingPage    = React.lazy(() => import('./landingPage/landingPage'));
const Tos            = React.lazy(() => import('./legal/Tos'));
const Imprint        = React.lazy(() => import('./legal/Imprint'));
const PrivacyPolicy  = React.lazy(() => import('./legal/PrivacyPolicy'));

const Dashboard = React.lazy(() => import('./container/dashboard/Dashboard'));
const ToDos     = React.lazy(() => import('./container/todos/ToDos'));
const Schedule  = React.lazy(() => import('./container/schedule/Schedule'));
const Subjects  = React.lazy(() => import('./container/subjects/Subjects'));
const Exams     = React.lazy(() => import('./container/exams/Exams'));
const Auth      = React.lazy(() => import('./container/auth/Auth'));
const Settings  = React.lazy(() => import('./container/settings/Settings'));
const SubjectSettings  = React.lazy(() => import('./container/subjects/subjectSettings/SubjectSettings'));


function App() {

    const dispatch = useDispatch();

    const [connError, setConnError] = useState(false);

    // set listener once
    useEffect(() => {
        firebase.auth().onAuthStateChanged(user => {
            if (user) {

                // Check if connection is stable, if not, some error has occurred
                db.collection(USER_COL).doc(firebase.auth().currentUser?.uid).get()
                .then((snap) => {
                    if (snap.exists && !snap.metadata.fromCache) {
                        dispatch(fetchUserData());
                        dispatch(setSignedIn(user));
                        dispatch(fetchShallowSubjects());
                        dispatch(fetchSpaces(undefined));
                    } else {
                        throw Error;
                    }
                })
                .catch(e => {
                    setConnError(true);
                })
            } else {
                dispatch(setSignedOut());
            }
        })
    }, [dispatch]);

    // set id to identify the device (almost unique)
    useEffect(() => {
        const unisched_id = localStorage.getItem('unisched_id');
        if (!unisched_id) {
            localStorage.setItem('unisched_id', 'usid_'+(new Date().getTime()));
        }
    }, []);

    const location = useLocation();
    const loading = useSelector((state: RootState) => state.user?.globalLoading);

    if (connError) {
        return <h4>Connection Error. Refresh page!</h4>
    }

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
                                    <ProtectedRoute exact path='/dashboard'  component={Dashboard}   orElse='/auth' />
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

    const helmet = (
        <Switch>
            <Route exact path='/'>
                <Helmet>
                    <title>UniSched - Stay organized!</title>
                </Helmet>
            </Route>
            <Route exact path='/tos'>
                <Helmet>
                    <title>UniSched - Terms of Service</title>
                </Helmet>
            </Route>
            <Route exact path='/privacy'>
                <Helmet>
                    <title>UniSched - Privacy Policy</title>
                </Helmet>
            </Route>
            <Route exact path='/legal-details'>
                <Helmet>
                    <title>UniSched - Legal Details</title>
                </Helmet>
            </Route>
            <Route exact path='/todo'>
                <Helmet>
                    <title>ToDos - Keep up with all your tasks!</title>
                </Helmet>
            </Route>
            <Route exact path='/schedule'>
                <Helmet>
                    <title>Schedule - Always know when what is happening</title>
                </Helmet>
            </Route>
            <Route exact path='/exams'>
                <Helmet>
                    <title>Exams - Study hard</title>
                </Helmet>
            </Route>
            <Route exact path='/subjects'>
                <Helmet>
                    <title>Subjects - Overview</title>
                </Helmet>
            </Route>
            <Route path='/subjects'>
                <Helmet>
                    <title>Edit Subject</title>
                </Helmet>
            </Route>
            <Route path='/settings'>
                <Helmet>
                    <title>Settings - UniSched</title>
                </Helmet>
            </Route>
        </Switch>
    );

    return (
        <div className="App">
            {helmet}
            {routes}
        </div>
    );
}

export default App;
