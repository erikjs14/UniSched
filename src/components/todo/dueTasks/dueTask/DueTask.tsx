import React, { useEffect, useState, Fragment, useCallback } from 'react';

import CSS from './DueTask.module.scss';
import { DueTaskProps } from './DueTask.d';
import { toCss } from './../../../../util/util';
import Input from '../../../ui/input/Input';
import { findColorConfig } from './../../../../config/colorChoices';
import AnimateHeight from 'react-animate-height';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faInfoCircle, faStar, faPen, faClock, faBell } from '@fortawesome/free-solid-svg-icons';
import { useHistory } from 'react-router-dom';
import { toaster } from 'evergreen-ui';
import { formatDateTimeOutput, formatTimeOutput } from '../../../../util/timeUtil';
import MarkdownDialog from '../../../dialogs/MarkdownDialog';
const {
    wrapper: s_wrapper,
    fadeOut: s_fadeOut,
    checkWrapper: s_checkWrapper,
    titleSub: s_titleSub,
    titleTask: s_titleTask,
    dueAt: s_dueAt,
    moreInfo: s_moreInfo,
    change: s_change,
    options: s_options,
    small: s_small,
    additionalText: s_additionalText,
    bell: s_bell,
} = CSS;

export default React.memo(function(props: DueTaskProps): JSX.Element {

    const [additionalTextDialogShown, setAdditionalTextDialogShown] = useState(false);

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

    const history = useHistory();

    const showTaskMetaInfo = useCallback((): void => {
        toaster.notify(
            `Due at ${formatDateTimeOutput(props.taskSemantic.dueAt)}`, {
                id: 'unique',
            }
        );
    }, [props.taskSemantic.dueAt]);

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
                {props.bell && <FontAwesomeIcon className={s_bell} icon={faBell} />}
                
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
                    {props.bell && <Fragment><FontAwesomeIcon icon={faBell} /> &nbsp;</Fragment>}
                    {props.taskSemantic.name}
                </span>

                {!props.small &&
                    <Fragment>
                        <span className={toCss(s_titleSub)}>
                            {props.subjectDisplayName}
                        </span>

                        <span className={toCss(s_dueAt)}>
                            {props.showExactTime                                
                                ? formatTimeOutput(props.taskSemantic.dueAt)
                                : props.taskSemantic.dueString
                            }
                        </span>

                        <div className={toCss(s_options)} >
                            <span
                                className={toCss(s_change)} 
                                onClick={() => history.push(`/subjects/${props.taskSemantic.subjectId}?unctid=${props.taskSemantic.taskId}`)}
                            >
                                <FontAwesomeIcon icon={faPen} />
                            </span>

                            {props.taskSemantic.additionalInfo?.text && (
                                <Fragment>
                                    <span 
                                        className={toCss(s_additionalText)}
                                        onClick={() => setAdditionalTextDialogShown(true)}
                                    >
                                        <FontAwesomeIcon icon={faInfoCircle} />
                                    </span>

                                    { additionalTextDialogShown && (
                                        <MarkdownDialog
                                            show={additionalTextDialogShown}
                                            title={'Additional Info for "'+props.taskSemantic.name+'"'}
                                            onClose={(changed, md) => {
                                                setAdditionalTextDialogShown(false)
                                                if (changed) {
                                                    props.onChangeMarkdown(md);
                                                }
                                            }}
                                            rawMarkdown={props.taskSemantic.additionalInfo?.text}
                                            editModeDisabled
                                        />
                                    )}
                                </Fragment>
                            )}

                            <span 
                                className={toCss(s_moreInfo)}
                                onClick={() => showTaskMetaInfo()}
                            >
                                <FontAwesomeIcon icon={faClock} />
                            </span>
                        </div>
                    </Fragment>
                }
            </div>
        </AnimateHeight>
    );
});