import { useEffect } from 'react';
import { ScrollLock } from '../../utils/ScrollLock/ScrollLock.js';

export function useScrollLock(enabled = true) {
    const clear = () => {
        ScrollLock.unlock();
    };

    useEffect(() => {
        if (enabled) {
            ScrollLock.lock();
        } else {
            clear();
        }

        return () => clear();
    }, [enabled]);
}
