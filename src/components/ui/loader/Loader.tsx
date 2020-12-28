import React from 'react';
import { toCss } from '../../../util/util';

import CSS from './Loader.module.scss';
const {Loader: s_loader, Wrapper: s_wrapper, Logo: s_logo} = CSS;

const spinner = ({global}: {global?: boolean}): JSX.Element => (
    <div className={toCss(s_wrapper)}>
        { global && (
            <img
                className={toCss(s_logo)}
                src={process.env.PUBLIC_URL + '/img/icon-256.png'}
                alt='UniSched Logo'
            />
        )}
        <div className={toCss(s_loader)}></div>
    </div>
);

export default spinner;