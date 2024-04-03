import { useEffect, useRef, useCallback } from 'react';
import { PopupPosition } from './PopupPosition.js';

export function usePopupPosition(options = {}) {
    const {
        open = false,
        ...props
    } = options;

    const reference = useRef(null);
    const elem = useRef(null);
    const position = useRef(null);

    const referenceRef = useCallback((node) => {
        if (!node) {
            return;
        }

        reference.current = node;
    }, [open]);

    const elementRef = useCallback((node) => {
        if (!node) {
            return;
        }

        elem.current = node;
    }, [open]);

    const calculatePosition = () => {
        if (!elem.current || !reference.current) {
            return;
        }

        position.current = PopupPosition.create({
            elem: elem.current,
            refElem: reference.current,
            ...props,
        });
    };

    const resetPosition = () => {
        position.current?.reset();
        position.current = null;
    };

    useEffect(() => {
        resetPosition();

        if (open) {
            calculatePosition();
        }

        return resetPosition;
    }, [open, elem, reference, props]);

    return {
        referenceRef,
        elementRef,
    };
}