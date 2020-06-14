import { useSelector } from 'react-redux';
import { RootState } from '../index';
import ReactDOM from 'react-dom';
import { useEffect, useState } from 'react';

export const useBackTop = (visibleFrom: number) => {
    const curScrollContainerRef = useSelector((state: RootState) => state.general.scrollContainerRef);

    const [visible, setVisible] = useState(false);
    useEffect(() => {
        if (curScrollContainerRef) {
            const el = (ReactDOM.findDOMNode(curScrollContainerRef.current) as Element);
            const listener = () => {
                setVisible(el.scrollTop > visibleFrom);
            };
            el.addEventListener('scroll', listener);

            return () => el.removeEventListener('scroll', listener);
        } else {
            const listener = () => {
                setVisible(window.pageYOffset > visibleFrom);
            };
            window.addEventListener('scroll', listener);
            
            return () => window.removeEventListener('scroll', listener);
        }
    }, [curScrollContainerRef, visibleFrom]);

    const scrollTop = curScrollContainerRef 
        ? () => (ReactDOM.findDOMNode(curScrollContainerRef.current) as Element).scrollTo({top: 0, behavior: 'smooth'})
        : () => window.scrollTo({top: 0, behavior: 'smooth'});

    return {
        visible,
        scrollTop,
    };
}