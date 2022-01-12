import React, { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';

import { Dialog, Textarea, Pane, Text, Button } from 'evergreen-ui';
import CSS from './MarkdownDialog.module.scss';
import { toCss } from '../../util/util';
const { resetForMarkdown: s_resetForMarkdown } = CSS;

interface MarkdownDialogProps {
    title: string;
    show: boolean;
    onClose(): void;
    rawMarkdown: string;
    onRawMarkdownChange?(val: string): void;
    editMode?: boolean;
    editModeDisabled?: boolean;
}
export default (props: MarkdownDialogProps) => {

    const [editMode, setEditMode] = useState(props.editMode);
    const [markdown, setMarkdown] = useState(props.rawMarkdown || '');

    if (!props.show) return null;

    return (
        <Dialog
            isShown={props.show}
            title={props.title}
            onCloseComplete={() => props.onClose()}
            onConfirm={(close) => {
                close();
                if (!props.editModeDisabled) { 
                    props.onRawMarkdownChange?.(markdown);
                }
            }}
            hasCancel={props.editMode || false}
            confirmLabel={props.editMode ? 'Confirm' : 'OK'}
        >
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
                                onChange={(e: any) => setMarkdown(e.target.value)}
                                flex='1'
                            />
                        ) : (
                            <Text flex='1'>
                                <ReactMarkdown
                                    plugins={[gfm]} 
                                    children={markdown || '*The formatted markdown will appear here*'}
                                />
                            </Text>
                        )}
                    {!props.editModeDisabled && (
                        <Text fontSize='.8em'>You can use markdown in this text. <a target=':_blank' rel="noopener noreferrer" href="https://commonmark.org/help/">More info</a> (<a target='_blank' rel="noopener noreferrer" href='https://github.com/remarkjs/remark-gfm'>gfm</a> is also supported).</Text>
                    )}
                </Pane>
            </Pane>
        </Dialog>
    );
}