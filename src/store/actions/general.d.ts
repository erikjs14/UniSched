import React from 'react';

export interface BaseActionCreator {type: string}

export interface SetScrollContainerRefAC extends BaseActionCreator {ref: React.RefObject<HTMLElement> | null}