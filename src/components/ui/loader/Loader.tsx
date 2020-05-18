import React from 'react';

import CSS from './Loader.module.scss';
const {Loader: s_loader} = CSS;

// ToDO: implement own version
const spinner = (): JSX.Element => (
    <div className={s_loader}></div>
);

export default spinner;