import React, { useEffect, useState, Fragment } from 'react';

import CSS from './DueTask.module.scss';
import { DueTaskProps } from './DueTask.d';
import { toCss } from './../../../../util/util';
import Input from '../../../ui/input/Input';
import { findColorConfig } from './../../../../config/colorChoices';
import AnimateHeight from 'react-animate-height';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faStar } from '@fortawesome/free-solid-svg-icons';
const {
    wrapper: s_wrapper,
    fadeOut: s_fadeOut,
    checkWrapper: s_checkWrapper,
    titleSub: s_titleSub,
    titleTask: s_titleTask,
    dueAt: s_dueAt,
    moreInfo: s_moreInfo,
    small: s_small,
    highlight: s_highlight,
} = CSS;

export default React.memo(function(props: DueTaskProps): JSX.Element {

    const [fadingOut, setFadingOut] = useState(false);

    const {fadeOut, onFadeOutComplete} = props;
    useEffect(() => {
        if (!fadingOut && fadeOut && onFadeOutComplete) {
            setFadingOut(true);
            setTimeout(() => {
                onFadeOutComplete();
            }, 3000);
        }   
    }, [onFadeOutComplete, fadeOut, fadingOut]);

    return (
        <AnimateHeight
            duration={800}
            height={props.fadeOut ? 0 : 'auto'}
            delay={1500}
            animateOpacity={true}
        >
            <div
                className={toCss(s_wrapper, (props.fadeOut ? s_fadeOut : ''), (props.small ? s_small : ''))}
                style={props.backgroundColor 
                    ? {
                        backgroundColor: findColorConfig(props.backgroundColor).value,
                        color: findColorConfig(props.backgroundColor).textColor,
                    } 
                    : undefined
                }
            >
                
                <div className={toCss(s_checkWrapper)}>
                    <Input
                        elementType='checkbox'
                        label={props.taskSemantic.name}
                        value={props.fadeOut || false}
                        onChange={() => props.onCheck()}
                    />
                </div>

                <span className={toCss(s_titleTask)}>
                    {props.star && <Fragment><FontAwesomeIcon icon={faStar} /> &nbsp;</Fragment>}
                    {props.taskSemantic.name}
                </span>

                {!props.small &&
                    <Fragment>
                        <span className={toCss(s_titleSub)}>
                            {props.subjectDisplayName}
                        </span>

                        <span className={toCss(s_dueAt)}>
                            {props.taskSemantic.dueString}
                        </span>

                        <span 
                            className={toCss(s_moreInfo, (props.moreInfo ? s_highlight : ''))} 
                            onClick={() => props.infoClicked?.()}
                        >
                            <FontAwesomeIcon icon={faInfoCircle} />
                        </span>
                    </Fragment>
                }
            </div>
        </AnimateHeight>
    );
});