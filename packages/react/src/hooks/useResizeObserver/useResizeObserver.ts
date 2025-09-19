import { useEffect, useRef } from 'react';

export type ResizeHandler = (entry: ResizeObserverEntry) => void;

let resizeObserver: ResizeObserver | null = null;

const targetElements = new WeakMap<Element, ResizeHandler>();

const resizeHandler = (entries: ResizeObserverEntry[]) => {
    entries.forEach((entry) => {
        const handler = targetElements.get(entry.target);
        if (handler) {
            handler(entry);
        }
    });
};

const getResizeObserver = () => {
    if (!resizeObserver) {
        resizeObserver = new ResizeObserver(resizeHandler);
    }

    return resizeObserver;
};

export function useResizeObserver<
    T extends Element,
>(
    handler: ResizeHandler,
) {
    const ref = useRef<T | null>(null);

    useEffect(() => {
        if (!ref.current) {
            return undefined;
        }

        getResizeObserver().observe(ref.current);
        targetElements.set(ref.current, handler);

        return () => {
            if (ref.current) {
                getResizeObserver().unobserve(ref.current);
                targetElements.delete(ref.current);
            }
        };
    }, [ref, handler]);

    return ref;
}
