import { computedStyle } from '@jezvejs/dom';
import { PopupPositions, PopupPositionState, ScreenRectangle } from './types.ts';

export const topPositions = ['top', 'top-start', 'top-end'];
export const bottomPositions = ['bottom', 'bottom-start', 'bottom-end'];
export const leftPositions = ['left', 'left-start', 'left-end'];
export const rightPositions = ['right', 'right-start', 'right-end'];
export const defaultPosition = 'bottom';

/** Find parent element without offsetParent and check it has position: fixed */
export const getFixedParent = (elem: HTMLElement) => {
    let parent = elem?.parentNode as HTMLElement;
    while (parent?.offsetParent) {
        parent = parent.offsetParent as HTMLElement;
    }

    const style = computedStyle(parent);
    const isFixed = style?.position === 'fixed';
    return (isFixed) ? parent : null;
};

/** Returns true is offset parent of element has position: absolute */
export const isAbsoluteParent = (elem: HTMLElement) => {
    const parent = elem?.offsetParent;
    if (!parent) {
        return false;
    }

    const style = computedStyle(parent);
    return style?.position === 'absolute';
};

/** Returns scrolling container of element */
export const getScrollParent = (elem?: Element | null): Element => {
    let node = elem?.parentNode as HTMLElement;
    while (node && node.nodeType !== 9) {
        const style = computedStyle(node);
        const overflow = style?.overflowY ?? 'visible';
        const isScrollable = !overflow.startsWith('visible') && !overflow.startsWith('hidden');
        if (isScrollable && node.scrollHeight > node.clientHeight) {
            return node as Element;
        }

        node = node.parentNode as HTMLElement;
    }

    return (document.scrollingElement || document.body) as Element;
};

/**
 * Returns width of visualViewport if possible
 * Otherwise returns clientWidth of document
 */
export const getScreenWidth = (): number => {
    const { clientWidth } = document.documentElement;
    if (!window.visualViewport) {
        return clientWidth;
    }

    return window.visualViewport.width;
};

/**
 * Returns height of visualViewport if possible
 * Otherwise returns clientHeight of document
 */
export const getScreenHeight = (): number => {
    const { clientHeight } = document.documentElement;
    if (!window.visualViewport) {
        return clientHeight;
    }

    return window.visualViewport.height;
};

/**
 * Returns current horizontal scroll of document
 */
export const getWindowScrollLeft = (): number => {
    const { body } = document;
    const { scrollLeft } = document.documentElement;
    return window.pageXOffset || scrollLeft || body.scrollLeft;
};

/**
 * Returns current vertical scroll of document
 */
export const getWindowScrollTop = (): number => {
    const { body } = document;
    const { scrollTop } = document.documentElement;
    return window.pageYOffset || scrollTop || body.scrollTop;
};

/**
 * Returns position and size object for available viewport
 */
export const getScreenRect = (): ScreenRectangle => {
    const left = getWindowScrollLeft();
    const top = getWindowScrollTop();
    const width = getScreenWidth();
    const height = getScreenHeight();

    const res: ScreenRectangle = {
        left,
        top,
        width,
        height,
        bottom: top + height,
        right: left + width,
    };

    return res;
};

/**
 * Returns copy of bounding client rectangle for specified element
 * @param {Element|null} elem
 * @returns {ScreenRectangle|null}
 */
export const getElementRect = (elem?: Element | null): ScreenRectangle | null => {
    if (!elem) {
        return null;
    }

    const rect = elem.getBoundingClientRect();
    const res: ScreenRectangle = {
        left: rect.left,
        top: rect.top,
        width: rect.width,
        height: rect.height,
        bottom: rect.bottom,
        right: rect.right,
    };

    return res;
};

/**
 * Returns true if the element is positioned to the top of reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isTopPosition = (state: PopupPositionState): boolean => (
    !!state?.position && topPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the bottom of reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isBottomPosition = (state: PopupPositionState): boolean => (
    !!state?.position && bottomPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the left of reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isLeftPosition = (state: PopupPositionState): boolean => (
    !!state?.position && leftPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned to the right of reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isRightPosition = (state: PopupPositionState): boolean => (
    !!state?.position && rightPositions.includes(state.position)
);

/**
 * Returns true if the element is positioned vertically
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVertical = (state: PopupPositionState): boolean => (
    isTopPosition(state) || isBottomPosition(state)
);

/**
 * Returns true if the element is positioned horizontally
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontal = (state: PopupPositionState): boolean => (
    isLeftPosition(state) || isRightPosition(state)
);

/**
 * Returns true if the element is positioned above the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isTop = (state: PopupPositionState): boolean => (
    (isTopPosition(state) && !state.flip)
    || (isBottomPosition(state) && !!state.flip)
);

/**
 * Returns true if the element is positioned below the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isBottom = (state: PopupPositionState): boolean => (
    (isBottomPosition(state) && !state.flip)
    || (isTopPosition(state) && !!state.flip)
);

/**
 * Returns true if the element is positioned to the left of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isLeft = (state: PopupPositionState): boolean => (
    (isLeftPosition(state) && !state.flip)
    || (isRightPosition(state) && !!state.flip)
);

/**
 * Returns true if the element is positioned to the right of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isRight = (state: PopupPositionState): boolean => (
    (isRightPosition(state) && !state.flip)
    || (isLeftPosition(state) && !!state.flip)
);

/**
 * Returns true if the element is vertically positioned to the start of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalStartPosition = (state: PopupPositionState): boolean => (
    (state.position === 'left-start' || state.position === 'right-start')
);

/**
 * Returns true if the element is vertically positioned to the center of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalCenterPosition = (state: PopupPositionState): boolean => (
    (state.position === 'left' || state.position === 'right')
);

/**
 * Returns true if the element is vertically positioned to the end of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalEndPosition = (state: PopupPositionState): boolean => (
    (state.position === 'left-end' || state.position === 'right-end')
);

/**
 * Returns true if the element is vertically positioned to the start of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalStart = (state: PopupPositionState): boolean => (
    (isVerticalStartPosition(state) && !state.crossFlip)
    || (isVerticalEndPosition(state) && !!state.crossFlip)
);

/**
 * Returns true if the element is vertically positioned to the end of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalEnd = (state: PopupPositionState): boolean => (
    (isVerticalEndPosition(state) && !state.crossFlip)
    || (isVerticalStartPosition(state) && !!state.crossFlip)
);

/**
 * Returns true if the element is horizontally positioned to the start of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalStartPosition = (state: PopupPositionState): boolean => (
    (state.position === 'top-start' || state.position === 'bottom-start')
);

/**
 * Returns true if the element is horizontally positioned to the center of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalCenterPosition = (state: PopupPositionState): boolean => (
    (state.position === 'top' || state.position === 'bottom')
);

/**
 * Returns true if the element is horizontally positioned to the end of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalEndPosition = (state: PopupPositionState): boolean => (
    (state.position === 'top-end' || state.position === 'bottom-end')
);

/**
 * Returns true if the element is horizontally positioned to the start of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalStart = (state: PopupPositionState): boolean => (
    (isHorizontalStartPosition(state) && !state.crossFlip)
    || (isHorizontalEndPosition(state) && !!state.crossFlip)
);

/**
 * Returns true if the element is horizontally positioned to the end of the reference
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalEnd = (state: PopupPositionState): boolean => (
    (isHorizontalEndPosition(state) && !state.crossFlip)
    || (isHorizontalStartPosition(state) && !!state.crossFlip)
);

/**
 * Returns true if element should be flipped vertically
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalFlip = (state: PopupPositionState): boolean => (
    !!state.allowFlip
    && !!state.vertOverflowTop
    && !!state.vertOverflowBottom
    && !!state.dist && (
        (
            isBottomPosition(state)
            && (state.vertOverflowBottom > 0)
            && (state.vertOverflowBottom > state.vertOverflowTop)
            && (state.dist.top > state.vertOverflowTop)
        ) || (
            isTopPosition(state)
            && (state.vertOverflowTop > 0)
            && (state.vertOverflowTop > state.vertOverflowBottom)
            && (state.dist.bottom > state.vertOverflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalFlip = (state: PopupPositionState): boolean => (
    !!state.allowHorizontalFlip
    && !!state.horOverflowLeft
    && !!state.horOverflowRight
    && !!state.dist && (
        (
            isRightPosition(state)
            && (state.horOverflowRight > 0)
            && (state.horOverflowRight > state.horOverflowLeft)
            && (state.dist.left > state.horOverflowLeft)
        ) || (
            isLeftPosition(state)
            && (state.horOverflowLeft > 0)
            && (state.horOverflowLeft > state.horOverflowRight)
            && (state.dist.right > state.horOverflowRight)
        )
    )
);

/**
 * Returns true if element should be flipped vertically around cross axis
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalCrossFlip = (state: PopupPositionState): boolean => (
    !!state.allowFlip
    && !!state.horOverflowTop
    && !!state.horOverflowBottom
    && !!state.dist && (
        (
            isVerticalStartPosition(state)
            && (state.horOverflowBottom > 0)
            && (state.horOverflowBottom > state.horOverflowTop)
            && (state.dist.top > state.horOverflowTop)
        ) || (
            isVerticalEndPosition(state)
            && (state.horOverflowTop > 0)
            && (state.horOverflowTop > state.horOverflowBottom)
            && (state.dist.bottom > state.horOverflowBottom)
        )
    )
);

/**
 * Returns true if element should be flipped horizontally around cross axis
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalCrossFlip = (state: PopupPositionState): boolean => (
    !!state.allowHorizontalFlip
    && !!state.vertOverflowLeft
    && !!state.vertOverflowRight
    && !!state.dist && (
        (
            isHorizontalStartPosition(state)
            && (state.vertOverflowRight > 0)
            && (state.vertOverflowRight > state.vertOverflowLeft)
            && (state.dist.left > state.vertOverflowLeft)
        ) || (
            isHorizontalEndPosition(state)
            && (state.vertOverflowLeft > 0)
            && (state.vertOverflowLeft > state.vertOverflowRight)
            && (state.dist.right > state.vertOverflowRight)
        )
    )
);

/**
 * Returns minimal horizontal overflow
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const minHorOverflow = (state: PopupPositionState): number => (
    Math.min(state.horOverflowLeft ?? 0, state.horOverflowRight ?? 0)
);

/**
 * Returns minimal vertical overflow
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const minVertOverflow = (state: PopupPositionState): number => (
    Math.min(state.vertOverflowTop ?? 0, state.vertOverflowBottom ?? 0)
);

/**
 * Returns true if main axis should be changed from vertical to horizontal
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isVerticalToHorizontalAxisChange = (state: PopupPositionState): boolean => (
    !!state.allowChangeAxis
    && isVertical(state)
    && !!state.vertOverflowTop
    && !!state.vertOverflowBottom
    && (state.vertOverflowTop > 0)
    && (state.vertOverflowBottom > 0)
    && (minHorOverflow(state) < minVertOverflow(state))
);

/**
 * Returns true if main axis should be changed from horizontal to vertical
 * @param {PopupPositionState} state
 * @returns {boolean}
 */
export const isHorizontalToVerticalAxisChange = (state: PopupPositionState): boolean => (
    !!state.allowChangeAxis
    && isHorizontal(state)
    && !!state.horOverflowLeft
    && !!state.horOverflowRight
    && (state.horOverflowLeft > 0)
    && (state.horOverflowRight > 0)
    && (minVertOverflow(state) < minHorOverflow(state))
);

/**
 * Changes main axis from vertical to horizontal and returns new position
 * @param {PopupPositionState} state
 * @returns {string}
 */
export const changeAxisToHorizontal = (state: PopupPositionState): PopupPositions => {
    const toRight = (
        !!state.horOverflowLeft
        && !!state.horOverflowRight
        && (state.horOverflowLeft > state.horOverflowRight)
    );

    if (isHorizontalCenterPosition(state)) {
        return (toRight) ? 'right' : 'left';
    }
    if (isHorizontalStartPosition(state)) {
        return (toRight) ? 'right-start' : 'left-start';
    }
    if (isHorizontalEndPosition(state)) {
        return (toRight) ? 'right-end' : 'left-end';
    }

    return state.position ?? defaultPosition;
};

/**
 * Changes main axis from horizontal to vertical and returns new position
 * @param {PopupPositionState} state
 * @returns {string}
 */
export const changeAxisToVertical = (state: PopupPositionState): PopupPositions => {
    const toBottom = (
        !!state.vertOverflowTop
        && !!state.vertOverflowBottom
        && (state.vertOverflowTop > state.vertOverflowBottom)
    );

    if (isVerticalCenterPosition(state)) {
        return (toBottom) ? 'bottom' : 'top';
    }
    if (isVerticalStartPosition(state)) {
        return (toBottom) ? 'bottom-start' : 'top-start';
    }
    if (isVerticalEndPosition(state)) {
        return (toBottom) ? 'bottom-end' : 'top-end';
    }

    return state.position ?? defaultPosition;
};

/**
 * Returns initial vertical position of the element
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getInitialTopPosition = (state: PopupPositionState): number => {
    const {
        offset,
        reference,
        current,
    } = state;

    if (!offset || !reference || !current) {
        return 0;
    }

    let res = 0;
    const currHeight = current.height ?? 0;
    const margin = state.margin ?? 0;

    if (isTop(state)) {
        res = reference.top - offset.top - currHeight - margin;
    } else if (isBottom(state)) {
        res = reference.bottom - offset.top + margin;
    } else if (isLeft(state) || isRight(state)) {
        if (isVerticalCenterPosition(state)) {
            res = reference.top - offset.top + (reference.height - currHeight) / 2;
        }
        if (isVerticalStart(state)) {
            res = reference.top - offset.top;
        }
        if (isVerticalEnd(state)) {
            res = reference.top - offset.top - currHeight + reference.height;
        }
    }

    const elem = state.elem as HTMLElement;
    if (
        state.fixedParent
        && state.fixedParent === elem?.offsetParent
        && !state.fixedElement
    ) {
        res += state.fixedParent.scrollTop;
    }

    return res;
};

/**
 * Returns initial horizontal position of the element
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getInitialLeftPosition = (state: PopupPositionState): number => {
    const {
        offset,
        reference,
        current,
    } = state;

    if (!offset || !reference || !current) {
        return 0;
    }

    let res = 0;
    const currWidth = current.width ?? 0;
    const margin = state.margin ?? 0;

    if (isLeft(state)) {
        res = reference.left - offset.left - currWidth - margin;
    } else if (isRight(state)) {
        res = reference.right - offset.left + margin;
    } else if (isTop(state) || isBottom(state)) {
        if (isHorizontalCenterPosition(state)) {
            res = reference.left - offset.left + (reference.width - currWidth) / 2;
        }
        if (isHorizontalStart(state)) {
            res = reference.left - offset.left;
        }
        if (isHorizontalEnd(state)) {
            res = reference.left - offset.left - currWidth + reference.width;
        }
    }

    const elem = state.elem as HTMLElement;
    if (
        state.fixedParent
        && state.fixedParent === elem?.offsetParent
        && !state.fixedElement
    ) {
        res += state.fixedParent.scrollLeft;
    }

    return res;
};

/**
 * Returns vertical overflow of element
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getElementVerticalOverflow = (state: PopupPositionState): number => {
    if (isTop(state)) {
        return state.vertOverflowTop ?? 0;
    }
    if (isBottom(state)) {
        return state.vertOverflowBottom ?? 0;
    }
    if (isVerticalEnd(state)) {
        return state.horOverflowTop ?? 0;
    }
    if (isVerticalStart(state)) {
        return state.horOverflowBottom ?? 0;
    }

    return Math.max(0, state.horOverflowTop ?? 0, state.horOverflowBottom ?? 0);
};

/**
 * Returns horozontal overflow of element
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getElementHorizontalOverflow = (state: PopupPositionState): number => {
    if (isLeft(state)) {
        return state.horOverflowLeft ?? 0;
    }
    if (isRight(state)) {
        return state.horOverflowRight ?? 0;
    }
    if (isHorizontalEnd(state)) {
        return state.vertOverflowLeft ?? 0;
    }
    if (isHorizontalStart(state)) {
        return state.vertOverflowRight ?? 0;
    }

    return Math.max(0, state.vertOverflowLeft ?? 0, state.vertOverflowRight ?? 0);
};

/**
 * Returns left overflow for specified position and state
 * @param {number} left
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getLeftOverflow = (left: number, state: PopupPositionState): number => (
    -(left - (state.screenPadding ?? 0))
);

/**
 * Returns right overflow for specified position and state
 * @param {number} right
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getRightOverflow = (right: number, state: PopupPositionState): number => (
    right - (state.screen?.width ?? 0) + (state.screenPadding ?? 0)
);

/**
 * Returns top overflow for specified position and state
 * @param {number} top
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getTopOverflow = (top: number, state: PopupPositionState): number => (
    -(top - (state.screenPadding ?? 0))
);

/**
 * Returns bottom overflow for specified position and state
 * @param {number} bottom
 * @param {PopupPositionState} state
 * @returns {number}
 */
export const getBottomOverflow = (bottom: number, state: PopupPositionState): number => (
    bottom - (state.screen?.height ?? 0) + (state.bottomSafe ?? 0)
);
