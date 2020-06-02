import React, { useEffect, useState } from 'react';

import CSS from './DueTask.module.scss';
import { DueTaskProps } from './DueTask.d';
import { toCss } from './../../../../util/util';
import Input from '../../../ui/input/Input';
import { findColorConfig } from './../../../../config/colorChoices';
import AnimateHeight from 'react-animate-height';
const {
    wrapper: s_wrapper,
    fadeOut: s_fadeOut,
    checkWrapper: s_checkWrapper,
    titleSub: s_titleSub,
    titleTask: s_titleTask,
    dueAt: s_dueAt,
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
    }, [onFadeOutComplete, fadeOut, fadingOut])

    return (
        <AnimateHeight
            duration={800}
            height={props.fadeOut ? 0 : 'auto'}
            delay={1500}
            animateOpacity={true}
        >
            <div
                className={toCss(s_wrapper, (props.fadeOut ? s_fadeOut : ''))}
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
                {props.taskSemantic.name}
                </span>

                <span className={toCss(s_titleSub)}>
                    {props.subjectDisplayName}
                </span>

                <span className={toCss(s_dueAt)}>
                    {props.taskSemantic.dueString}
                </span>

            </div>
        </AnimateHeight>
    );
});