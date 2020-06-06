import React from 'react';

import CSS from './AnimatedSwitch.module.scss';
import { AnimatedSwitchProps } from './AnimatedSwitch.d';
import { Switch, withRouter } from 'react-router-dom';
import TransitionGroup from 'react-transition-group/TransitionGroup';
import { CSSTransition } from 'react-transition-group';

export default withRouter(function(props: React.PropsWithChildren<AnimatedSwitchProps> & {location: any}): JSX.Element {
    
    return (
        <TransitionGroup className={CSS.transitionGroupClass}>
            <CSSTransition 
                key={props.location.key} 
                classNames={{...CSS}}
                timeout={300}
            >
                <div className={CSS.switchWrapper}>
                    <Switch location={props.location}>
                        {props.children}
                    </Switch>
                </div>
            </CSSTransition>
        </TransitionGroup>
    );
});