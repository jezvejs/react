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
            ...props,
            elem: elem.current,
            refElem: reference.current,
        });
    };

    const updatePosition = () => {
        if (position.current) {
            position.current.updatePosition();
        }
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
    }, [open, elem?.current, reference?.current]);

    return {
        referenceRef,
        elementRef,
        elem,
        reference,
        updatePosition,
        resetPosition,
    };
}
