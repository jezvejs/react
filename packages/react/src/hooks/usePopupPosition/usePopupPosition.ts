import { useEffect, useRef, useCallback } from 'react';
import { PopupPosition } from './PopupPosition.ts';
import { PopupPositionProps } from './types.ts';

export interface UsePopupPositionProps extends PopupPositionProps {
    open?: boolean,
}

export function usePopupPosition<E = HTMLElement, R = HTMLElement>(
    options: UsePopupPositionProps,
) {
    const {
        open = false,
        ...props
    } = options;

    const reference = useRef<R | null>(null);
    const elem = useRef<E | null>(null);
    const position = useRef<PopupPosition | null>(null);

    const referenceRef = useCallback((node: R | null) => {
        if (!node) {
            return;
        }

        reference.current = node;
    }, [open]);

    const elementRef = useCallback((node: E | null) => {
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
