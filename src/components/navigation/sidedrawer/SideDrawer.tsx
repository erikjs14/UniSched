import React, { useState } from 'react';
import { SideDrawerProps } from './SideDrawer.d';
import Toggle from './toggle/Toggle';
import { ReactComponent as BlankUserIcon } from '../../../assets/user_blank.svg';
import Button from '../../ui/button/Button';

import CSS from './SideDrawer.module.scss';
import { toCss } from './../../../util/util';
import NavigationItems from '../navigationItems/NavigationItems';
import { useDispatch } from 'react-redux';
import { logout } from './../../../store/actions/dispatcher';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
const {
    drawer: s_drawer,
    toggled: s_toggled,
    toggle: s_toggle,
    menu: s_menu,
    userArea: s_userArea,
    userImg: s_userImg,
    username: s_username,
    backdrop: s_backdrop,
    bottomArea: s_bottomArea,
    settingsIcon: s_settingsIcon,
} = CSS;

export default React.memo(function(props: SideDrawerProps): JSX.Element {

    const dispatch = useDispatch();
    const history = useHistory();

    const [toggled, setToggled] = useState(false);

    const drawerCSS = toggled ? toCss(s_drawer, s_toggled) : toCss(s_drawer);

    return (
        <div className={drawerCSS}>
            <div className={toCss(s_toggle)}>
                <Toggle 
                    onClick={() => setToggled(prevToggled => !prevToggled)}
                    toggled={toggled}  
                />
            </div>
            
            <div 
                onClick={() => setToggled(false)}
                className={toCss(s_backdrop)}
            ></div>

            <div className={toCss(s_menu)}>
                <div className={toCss(s_userArea)}>
                    {props.imgUrl
                        ? <img src={props.imgUrl} alt='User icon' className={toCss(s_userImg)} />
                        : <BlankUserIcon className={toCss(s_userImg)} />
                    }
                    <span className={toCss(s_username)}>{props.displayName}</span>
                </div>

                <NavigationItems 
                    items={props.navItems} 
                    onItemClicked={() => setToggled(prevToggled => !prevToggled)}    
                />

                <div className={toCss(s_bottomArea)}>
                    <div className={toCss(s_settingsIcon)} onClick={() => {history.push('/settings'); setToggled(prev => !prev);}}>
                        <FontAwesomeIcon icon={faCog} />
                    </div>
                    <Button onClick={() => logout(dispatch)}>Sign out</Button>
                </div>
            </div>
        </div>
    )
});