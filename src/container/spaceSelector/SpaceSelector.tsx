import React from 'react';

import CSS from './SpaceSelector.module.scss';
import { SpaceSelectorProps } from './SpaceSelector.d';
import { toCss } from '../../util/util';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../..';
import { SpaceModelWithId } from '../../firebase/model';
import { setSpace } from '../../store/actions'
import { Select } from 'evergreen-ui';
const {
    wrapper: s_wrapper,
} = CSS;

export default function(props: SpaceSelectorProps): JSX.Element | null {

    const spaces: SpaceModelWithId[] | null = useSelector((state: RootState) => state.user.spaces);
    const selectedSpace: string | null = useSelector((state: RootState) => state.user.selectedSpace);
    const dispatch = useDispatch();

    if (!spaces || !selectedSpace)
        return null;
    
    const allOptions = [
        {
            id: 'all',
            name: 'All'
        },
        ...spaces
    ];
    return (
        <div className={toCss(s_wrapper, props.wrapCss ? props.wrapCss : '')} >
            {/* <Select
                options={allOptions}
                labelKey='name'
                value={allOptions.find(s => s.id === selectedSpace)}
                onChange={({option}) => {
                    props.onChanged?.();
                    dispatch(setSpace(option.id));
                }}
            /> */}
            <Select
                value={selectedSpace}
                onChange={e => {
                    props.onChanged?.();
                    dispatch(setSpace(e.target.value));
                }}
            >
                {allOptions.map(o => <option key={o.id} value={o.id}>{o.name}</option>)}
            </Select>
        </div>
    );
}