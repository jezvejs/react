import { asArray } from '@jezvejs/types';
import { useEffect } from 'react';

import { setEmptyClick, removeEmptyClick } from './emptyClick.js';

export function useEmptyClick(callback, elem, enabled = true) {
    useEffect(() => {
        if (!callback || !enabled) {
            return undefined;
        }

        const elems = asArray(elem).map((item) => item?.current);
        setEmptyClick(callback, elems);

        return () => {
            removeEmptyClick(callback);
        };
    }, [callback, elem, enabled]);
}
