import { useMemo } from 'react';

export default () => {

    const id = useMemo(() => {
        const lsid = localStorage.getItem('unisched_id');
        if (!lsid) {
            const val = 'usid_'+(new Date().getTime());
            localStorage.setItem('unisched_id', val);
            return val;
        } else {
            return lsid;
        }
    }, []);

    return id;
}