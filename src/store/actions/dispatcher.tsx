import * as actions from './index';
import { Dispatch } from 'react';

export const logout = (dispatch: Dispatch<any>) => dispatch(actions.startSignOut());