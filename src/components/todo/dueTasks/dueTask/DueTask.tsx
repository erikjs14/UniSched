import React, { useEffect } from 'react';

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
    title: s_title,
    dueAt: s_dueAt,
} = CSS;

export default React.memo(function(props: DueTaskProps): JSX.Element {
    if (props.taskSemantic.name.startsWith('watch')) console.log(props)

    const {fadeOut, onFadeOutComplete} = props;
    useEffect(() => {
        if (fadeOut && onFadeOutComplete) {
            setTimeout(() => {
                onFadeOutComplete();
            }, 3000);
        }   
    }, [onFadeOutComplete, fadeOut])

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

                <span className={toCss(s_title)}>
                    [{props.subjectDisplayName}] - {props.taskSemantic.name}
                </span>

                <span className={toCss(s_dueAt)}>
                    Due at: {props.taskSemantic.dueString}
                </span>

            </div>
        </AnimateHeight>
    );
});