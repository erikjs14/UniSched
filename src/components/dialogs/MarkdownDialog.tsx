import React, { useMemo, useState } from 'react';
import ReactMarkdown from 'react-markdown';
// @ts-ignore
import { listItem as defaultListItem } from "react-markdown/lib/renderers";
import gfm from 'remark-gfm';

import { Dialog, Textarea, Pane, Text, Button } from 'evergreen-ui';
import CSS from './MarkdownDialog.module.scss';
import { toCss, updateMdOnEnter } from '../../util/util';
import Input from '../ui/input/Input';
const { resetForMarkdown: s_resetForMarkdown } = CSS;

interface MarkdownDialogProps {
    title: string;
    show: boolean;
    onClose(markdownChanged: boolean, markdown: string): void;
    onCheck?(): void;
    rawMarkdown: string;
    onRawMarkdownChange?(val: string): void;
    editMode?: boolean;
    editModeDisabled?: boolean;
    left?: string;
}

const markdownChecked = "- [x]";
const markdownUnchecked = "- [ ]";
const WrapCheckBox = (props: any) => {
    const { markdown, setMarkdown, node, checked, children } = props;
    return (
      <div
        onClick={(e) => {
          e.stopPropagation();
          const lineIndex = node.start.line - 1;
          const lines = markdown.split("\n");
          const find = checked ? markdownChecked : markdownUnchecked;
          const replace = checked ? markdownUnchecked : markdownChecked;
          lines[lineIndex] = lines[lineIndex].replace(find, replace);
          setMarkdown(lines.join("\n"));
        }}
        style={{ cursor: 'pointer'}}
      >
        {children}
      </div>
    );
  };

export const getMdRenderers = (markdown: string, setMarkdown: (md: any) => void) => ({
    listItem: (props: any) => {
      if (typeof props.checked === "boolean") {
        const { checked, node } = props;
        return (
          <WrapCheckBox
            markdown={markdown}
            setMarkdown={setMarkdown}
            checked={checked}
            node={node.position}
          >
            {defaultListItem(props)}
          </WrapCheckBox>
        );
      }
      return defaultListItem(props);
    }
  });

export default (props: MarkdownDialogProps) => {

    const [editMode, setEditMode] = useState(props.editMode);
    const [markdown, setMarkdown] = useState(props.rawMarkdown || '');

    const [markdownChanged, setMarkdownChanged] = useState(false);
    const [checked, setChecked] = useState(false);

    const onChangeMarkdown = (newText: string, selectionStart: number, target: any) => {
        setMarkdown(prev => {
            const [updated, caretIdx] = updateMdOnEnter(prev, newText, selectionStart)
            window.requestAnimationFrame(() => target.setSelectionRange(caretIdx, caretIdx))
            setMarkdownChanged(true)
            return updated;
        })
    }

    const dialogWidth = useMemo(() => {
        const maxLineLength = markdown?.split('\n').reduce<number>((prev, cur) => cur.length > prev ? cur.length : prev, 0);
        if (maxLineLength > 60) {
            return `min(95vw, ${560 + (maxLineLength - 60) * 5}px)`;
        } else {
            return undefined;
        }
    }, [markdown])

    if (!props.show) return null;

    return (
        <Dialog
            isShown={props.show}
            title={props.title}
            onCloseComplete={() => props.onClose(markdownChanged, markdown)}
            onConfirm={(close) => {
                close();
                if (!props.editModeDisabled) { 
                    props.onRawMarkdownChange?.(markdown);
                }
            }}
            hasCancel={props.editMode || false}
            confirmLabel={(props.editMode ? 'Confirm' : 'OK')}
            width={!editMode ? dialogWidth : undefined}
        >
            {({close}) => (
                <Pane
                    minHeight='50vh'
                    display='flex'
                    flexDirection='column'
                    alignItems='stretch'
                    className={toCss(s_resetForMarkdown)}
                >
                    {!props.editModeDisabled && (
                        <Pane>
                            <Button 
                                marginLeft='auto'
                                appearance='minimal'
                                iconBefore={editMode ? 'eye-open' : 'edit'}
                                onClick={() => setEditMode(prev => !prev)}
                            >
                                {editMode ? 'View' : 'Edit'}
                            </Button>
                        </Pane>
                    )}
                    <Pane
                        flex='1'
                        padding='1rem'
                        display='flex'
                        justifyContent='flex-end'
                        flexDirection='column'
                    >
                        { editMode && !props.editModeDisabled
                            ? (
                                <Textarea
                                    value={markdown}
                                    onChange={(e: any) => onChangeMarkdown(e.target.value, e.target.selectionStart, e.target)}
                                    flex='1'
                                />
                            ) : (
                                <Text 
                                    flex='1'
                                    onDoubleClick={() => setEditMode(prev => !prev)}
                                >
                                    <ReactMarkdown
                                        plugins={[gfm]} 
                                        children={markdown || '*The formatted markdown will appear here*'}
                                        renderers={getMdRenderers(markdown, (md) => {
                                            setMarkdown(md);
                                            setMarkdownChanged(true);
                                        })}
                                    />
                                </Text>
                            )}
                        {!props.editModeDisabled && (
                            <Text fontSize='.8em'>You can use markdown in this text. <a target=':_blank' rel="noopener noreferrer" href="https://commonmark.org/help/">More info</a> (<a target='_blank' rel="noopener noreferrer" href='https://github.com/remarkjs/remark-gfm'>gfm</a> is also supported).</Text>
                        )}
                        {props.onCheck && (
                            <Input 
                                elementType='checkbox' 
                                value={checked} 
                                onChange={newVal => {
                                    setChecked(newVal as boolean);
                                    if (newVal) {
                                        setTimeout(() => {
                                            props.onCheck?.();
                                            close();
                                        }, 1000);
                                    }
                                }} 
                                label='Completed' 
                                left={props.left || undefined}
                            />
                        )}
                    </Pane>
                </Pane>
            )}
        </Dialog>
    );
}