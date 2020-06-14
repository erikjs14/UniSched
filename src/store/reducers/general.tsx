import * as actionTypes from '../actions/actionTypes';
import { updateObject } from '../../util/util';
import { GeneralState } from './general.d';
import { BaseActionCreator } from '../actions/general.d';
import { SetScrollContainerRefAC } from '../actions/general.d';

const initialState: GeneralState = {
    scrollContainerRef: null,
};

export default (state: GeneralState = initialState, action: BaseActionCreator) => {
    switch (action.type) {
        case actionTypes.SET_SCROLL_CONTAINER_REF: return setScrollContainerRef(state, action as SetScrollContainerRefAC);
        default: return state;
    }
}

const setScrollContainerRef = (state: GeneralState, action: SetScrollContainerRefAC): GeneralState => {
    return updateObject(state, {
        scrollContainerRef: action.ref,
    });
};