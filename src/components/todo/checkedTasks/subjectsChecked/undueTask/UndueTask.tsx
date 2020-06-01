import React, { useEffect, useState } from 'react';

import CSS from './UndueTask.module.scss';
import AnimateHeight from 'react-animate-height';
import Input from '../../../../ui/input/Input';
import { UndueTaskProps } from './UndueTask.d';
import { findColorConfig } from '../../../../../config/colorChoices';
import { toCss } from '../../../../../util/util';
const {
    wrapper: s_wrapper,
    fadeOut: s_fadeOut,
    checkWrapper: s_checkWrapper,
    titleTask: s_titleTask,
    dueAt: s_dueAt,
} = CSS;

export default function(props: UndueTaskProps): JSX.Element {

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
            className={props.addCss ? props.addCss : undefined}
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
                        value={!props.fadeOut && true}
                        onChange={() => props.onUncheck()}
                    />
                </div>

                <span className={toCss(s_titleTask)}>
                {props.taskSemantic.name}
                </span>

                <span className={toCss(s_dueAt)}>
                    Due at: {props.taskSemantic.dueString}
                </span>

            </div>
        </AnimateHeight>
    );
}