import { RouteProps } from 'react-router-dom';

export interface AntiProtectedRouteProps extends RouteProps {
    orElse: string;
}