import { asArray } from '@jezvejs/types';
import { useEffect, useRef } from 'react';

import { setEmptyClick, removeEmptyClick } from './emptyClick.ts';

export function useEmptyClick(callback, elem, enabled = true) {
    const timeoutRef = useRef(null);

    const clear = () => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
            timeoutRef.current = 0;
        }

        removeEmptyClick(callback);
    };

    useEffect(() => {
        if (!callback) {
            return undefined;
        }

        clear();

        if (enabled) {
            const elems = asArray(elem).map((item) => item?.current);
            timeoutRef.current = setTimeout(() => {
                setEmptyClick(callback, elems);
            });
        }

        return () => clear();
    }, [callback, elem, enabled]);
}
