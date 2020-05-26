import React from 'react';
import { toCss } from '../../../util/util';
import CSS from './CustomDateInputUI.module.scss';

export const CustomDateInputUI = ({ value, onClick}: any) => (
    <div onClick={onClick} className={toCss(CSS.datetimepicker)}>
        {value}
    </div>
);