import * as actionTypes from './actionTypes';
import { SetScrollContainerRefAC } from './general.d';

export const setScrollContainerRef = (ref: React.RefObject<HTMLElement> | null): SetScrollContainerRefAC => {
    return {
        type: actionTypes.SET_SCROLL_CONTAINER_REF,
        ref
    };
};