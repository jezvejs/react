import { useEffect } from 'react';

import { setEmptyClick, removeEmptyClick } from './emptyClick.js';

export function useEmptyClick(callback, elem, enabled = true) {
    useEffect(() => {
        if (!callback || !elem?.current || !enabled) {
            return undefined;
        }

        setEmptyClick(callback, elem.current);

        return () => {
            removeEmptyClick(callback);
        };
    }, [callback, elem, enabled]);
}
