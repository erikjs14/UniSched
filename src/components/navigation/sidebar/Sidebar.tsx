import React from 'react';
import { SidebarProps } from './Sidebar.d';

import CSS from './Sidebar.module.scss';
import { toCss } from './../../../util/util';
import Button from '../../ui/button/Button';
import { ReactComponent as BlankUserIcon } from '../../../assets/user_blank.svg';
import NavigationItems from '../navigationItems/NavigationItems';
import { logout } from '../../../store/actions/dispatcher';
import { useDispatch } from 'react-redux';
import { Clock } from 'grommet';
const {
    sidebar: s_sidebar,
    userArea: s_userArea,
    userImg: s_userImg,
    username: s_username,
    navArea: s_navArea,
    logoutArea: s_logoutArea,
    clock: s_clock,
} = CSS;

export default React.memo(function(props: SidebarProps): JSX.Element {

    const dispatch = useDispatch();

    return (
        <div className={toCss(s_sidebar)}>

            <Clock type='digital' alignSelf='center' precision='seconds' className={toCss(s_clock)}/>

            <div className={toCss(s_userArea)}>
                {props.imgUrl
                    ? <img src={props.imgUrl} alt='User icon' className={toCss(s_userImg)} />
                    : <BlankUserIcon className={toCss(s_userImg)} />
                }
                <span className={toCss(s_username)}>{props.displayName}</span>
            </div>

            <div className={toCss(s_navArea)}>
                <NavigationItems 
                    items={props.navItems}   
                />
            </div>

            <div className={toCss(s_logoutArea)}>
                <Button onClick={() => logout(dispatch)}>Sign out</Button>
            </div>
        </div>
    )
});