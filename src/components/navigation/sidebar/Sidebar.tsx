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
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog, faPlus } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import FloatingButton from '../../ui/floatingButton/FloatingButton';
const {
    sidebar: s_sidebar,
    userArea: s_userArea,
    userImg: s_userImg,
    username: s_username,
    navArea: s_navArea,
    bottomArea: s_bottomArea,
    clock: s_clock,
    settingsIcon: s_settingsIcon,
    plusBtn: s_plusBtn,
} = CSS;

export default React.memo(function(props: SidebarProps): JSX.Element {

    const dispatch = useDispatch();
    const history = useHistory();

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

                { props.showQuickAddToggle &&
                    <FloatingButton 
                        className={toCss(s_plusBtn)} 
                        onClick={() => props.onQuickAdd?.()}
                    >
                        <FontAwesomeIcon icon={faPlus} />
                    </FloatingButton>
                }

            </div>

            <div className={toCss(s_bottomArea)}>
                <div className={toCss(s_settingsIcon)} onClick={() => history.push('/settings')}>
                    <FontAwesomeIcon icon={faCog} />
                </div>
                <Button onClick={() => logout(dispatch)}>Sign out</Button>
            </div>
        </div>
    )
});