import { RouteProps } from 'react-router-dom';

export interface ProtectedRouteProps extends RouteProps{
    orElse: string;
}