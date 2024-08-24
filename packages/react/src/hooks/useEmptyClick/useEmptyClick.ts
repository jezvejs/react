import { asArray } from '@jezvejs/types';
import { useEffect, useRef } from 'react';
import { setEmptyClick, removeEmptyClick, EmptyClickCallback } from './emptyClick.ts';

type ElemRef = React.MutableRefObject<HTMLElement | null>;

export function useEmptyClick(
    callback: EmptyClickCallback,
    elem: ElemRef | ElemRef[],
    enabled: boolean = true,
) {
    const timeoutRef = useRef<number>(0);

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
            timeoutRef.current = window.setTimeout(() => {
                setEmptyClick(callback, elems);
            });
        }

        return () => clear();
    }, [callback, elem, enabled]);
}
