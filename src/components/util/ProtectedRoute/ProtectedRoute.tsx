import React from 'react';
import { RouteProps, Route } from 'react-router-dom';

export default function(routeProps: RouteProps) {
    //for the moment just return the route component
    return <Route {...routeProps} />;
}