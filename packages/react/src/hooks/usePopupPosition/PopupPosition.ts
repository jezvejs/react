import { isFunction, isObject } from '@jezvejs/types';
import { removeEvents, setEvents, transform } from '@jezvejs/dom';

import {
    debounce,
    DebounceReturnResult,
    minmax,
    px,
} from '../../utils/common.ts';

import {
    getFixedParent,
    isAbsoluteParent,
    getScrollParent,
    isTop,
    isVerticalFlip,
    getInitialTopPosition,
    getInitialLeftPosition,
    isHorizontalFlip,
    isLeft,
    isBottom,
    isRight,
    getScreenRect,
    getElementVerticalOverflow,
    getElementHorizontalOverflow,
    isHorizontalCrossFlip,
    isVerticalCrossFlip,
    isVertical,
    isHorizontal,
    isVerticalCenterPosition,
    isHorizontalCenterPosition,
    getLeftOverflow,
    getRightOverflow,
    getTopOverflow,
    getBottomOverflow,
    isVerticalToHorizontalAxisChange,
    isHorizontalToVerticalAxisChange,
    changeAxisToVertical,
    changeAxisToHorizontal,
    isVerticalEnd,
    isHorizontalEnd,
    getElementRect,
} from './helpers.ts';
import {
    EventListener,
    EventListenerOptions,
    PopupPositionProps,
    PopupPositionState,
    ScreenRectangle,
} from './types.ts';

const UPDATE_TIMEOUT = 75;

const defaultProps: PopupPositionProps = {
    elem: null,
    refElem: null,
    updateProps: null,
    position: 'bottom-start',
    margin: 0,
    screenPadding: 0,
    bottomSafeArea: 70,
    useRefWidth: false,
    allowFlip: true,
    allowHorizontalFlip: true,
    allowChangeAxis: false,
    scrollOnOverflow: true,
    allowResize: true,
    minRefHeight: 20,
};

export class PopupPosition {
    static positions = [
        'top',
        'top-start',
        'top-end',
        'bottom',
        'bottom-start',
        'bottom-end',
        'left',
        'left-start',
        'left-end',
        'right',
        'right-start',
        'right-end',
    ];

    props: PopupPositionProps;

    viewportEvents: {
        resize: EventListener,
    };

    windowEvents: {
        scroll: {
            listener: EventListener,
            options?: EventListenerOptions,
        },
    };

    updateHandler: DebounceReturnResult;

    state: PopupPositionState;

    static create(props = {}) {
        return new this(props);
    }

    constructor(props = {}) {
        this.props = {
            ...defaultProps,
            ...props,
        };

        if (!this.props.elem) {
            throw new Error('Element not specified');
        }
        if (!this.props.refElem) {
            throw new Error('Reference element not specified');
        }

        this.viewportEvents = {
            resize: (e) => this.onViewportResize(e),
        };
        this.windowEvents = {
            scroll: {
                listener: (e) => this.onWindowScroll(e),
                options: { passive: true, capture: true },
            },
        };

        const handler = () => this.updatePosition();
        this.updateHandler = debounce(handler, UPDATE_TIMEOUT);

        this.state = {
            current: {},
            isInitial: true,
            listeningWindow: false,
            scrollRequested: false,
        };

        this.update(this.props);
    }

    /* Assignes window and viewport event handlers */
    listenWindowEvents() {
        if (this.state.listeningWindow) {
            return;
        }

        this.state.listeningWindow = true;
        setEvents(window.visualViewport, this.viewportEvents);
        setEvents(window, this.windowEvents);
    }

    /* Removes window and viewport event handlers */
    stopWindowEvents() {
        if (!this.state.listeningWindow) {
            return;
        }

        this.state.listeningWindow = false;
        removeEvents(window.visualViewport, this.viewportEvents);
        removeEvents(window, this.windowEvents);
    }

    /** Window 'scroll' event handler */
    onWindowScroll(e: Event) {
        const target = e?.target as HTMLElement;
        if (
            !!this.state.elem
            && (typeof this.state.elem === 'object')
            && !target?.contains?.(this.state.elem)
            && this.state.refElem
            && !target?.contains?.(this.state.refElem)
        ) {
            return;
        }

        const updateRequired = isFunction(this.state.onWindowScroll)
            ? this.state.onWindowScroll?.(e)
            : true;

        if (updateRequired) {
            if (this.state.scrollRequested && typeof this.updateHandler === 'function') {
                this.updateHandler();
            } else {
                this.updatePosition();
            }
        }
    }

    /** viewPort 'resize' event handler */
    onViewportResize(e: Event) {
        const updateRequired = (typeof this.state.onViewportResize === 'function')
            ? this.state.onViewportResize(e)
            : true;

        if (updateRequired) {
            if (this.state.scrollRequested && typeof this.updateHandler === 'function') {
                this.updateHandler();
            } else {
                this.updatePosition();
            }
        }
    }

    updatePosition() {
        const updateProps = (typeof this.state.updateProps === 'function')
            ? this.state.updateProps()
            : this.state.updateProps;
        const props = isObject(updateProps) ? updateProps : {};

        this.state.scrollRequested = false;

        this.update(props);
    }

    /** Calls 'onScrollDone' callback function */
    notifyScrollDone() {
        if (typeof this.props.onScrollDone === 'function') {
            this.props.onScrollDone();
        }
    }

    /** Calculates vertical and horizontal offsets and size of popup element */
    update(options = {}) {
        const { isInitial } = this.state;

        this.state = {
            ...this.state,
            ...options,
        };

        this.calculate();
        this.renderPosition();
        this.calculate();

        this.handleMaxSize();
        this.calculateOverflow();
        this.handleFlip();
        this.handleAxisChange();

        this.handleVerticalPosition();
        this.handleHorizontalPosition();

        if (isInitial) {
            setTimeout(() => {
                this.listenWindowEvents();
                this.notifyScrollDone();
            });
        }
    }

    calculate() {
        if (!this.props.elem || typeof this.props.elem !== 'object') {
            return;
        }

        const elem = this.props.elem as HTMLElement;
        const { isInitial } = this.state;

        this.state = {
            ...this.state,
            screen: getScreenRect(),
            fixedParent: getFixedParent(elem),
            absoluteParent: isAbsoluteParent(elem),
            fixedElement: !!elem && !elem?.offsetParent,
            flip: false,
            crossFlip: false,
            isInitial: false,
        };

        this.state.current.width = elem?.offsetWidth ?? 0;
        this.state.current.height = elem?.offsetHeight ?? 0;

        this.getRefClientRect(isInitial);
        this.getOffsetParentRect();
        this.getScrollParentRect();
        this.getBottomSafe();

        this.renderInitialPosition();

        this.calculateRefScroll();
        this.calculateScroll();

        this.calculateMaxScrollDistance();
        this.calculateMaxWindowScrollDistance();

        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
    }

    recalculate() {
        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
        this.renderPosition();
        this.calculate();
        this.calculateOverflow();
    }

    getRefClientRect(isInitial = false) {
        const { state } = this;
        const refRect = getElementRect(state.refElem);
        const width = refRect?.width ?? 0;
        const height = refRect?.height ?? 0;

        if (isInitial || width > 0 || height > 0) {
            state.reference = refRect;
        }
    }

    getFullScreenRect(): ScreenRectangle {
        const res = {
            ...this.state.screen,
            left: 0,
            top: 0,
        };

        return res as ScreenRectangle;
    }

    getOffsetParentRect() {
        const { state } = this;

        const elem = state.elem as HTMLElement;

        state.offset = (state.fixedElement)
            ? this.getFullScreenRect()
            : getElementRect(elem?.offsetParent);
    }

    getScrollParentRect() {
        const { state } = this;

        state.scrollParent = getScrollParent(this.props.elem) as HTMLElement;

        state.scrollParentBox = (state.scrollParent && !state.fixedElement)
            ? getElementRect(state.scrollParent)
            : this.getFullScreenRect();
    }

    getBottomSafe() {
        const { state } = this;
        const html = document.documentElement;

        state.bottomSafe = ((state.screen?.height ?? 0) - html.clientHeight > 50)
            ? state.bottomSafeArea
            : state.screenPadding;
    }

    renderInitialPosition() {
        const { state } = this;
        if (!state?.elem) {
            return;
        }

        const elem = state.elem as HTMLElement;
        const { style } = elem;
        style.left = px(0);
        style.top = px(0);

        transform(elem, '');
    }

    renderPosition() {
        const { state } = this;
        if (!state?.elem) {
            return;
        }

        const elem = state.elem as HTMLElement;
        const { style } = elem;
        const { left, top } = state.current;

        style.left = px(0);
        style.top = px(0);

        transform(elem, `translate(${px(left ?? 0)}, ${px(top ?? 0)})`);
    }

    calculateRefScroll() {
        const { state } = this;
        const {
            screen,
            scrollParentBox,
            reference,
        } = state;

        state.refScrollParent = {
            left: Math.max(0, scrollParentBox?.left ?? 0),
            top: Math.max(0, scrollParentBox?.top ?? 0),
            width: Math.min(screen?.width ?? 0, scrollParentBox?.width ?? 0),
            height: Math.min(screen?.height ?? 0, scrollParentBox?.height ?? 0),
        };

        state.refScroll = {
            left: (reference?.left ?? 0) - (state.refScrollParent?.left ?? 0),
            top: (reference?.top ?? 0) - (state.refScrollParent?.top ?? 0),
        };
    }

    calculateScroll() {
        const { state } = this;
        const {
            scrollParent,
            screen,
            refScrollParent,
        } = state;

        state.scrollLeft = scrollParent?.scrollLeft ?? 0;
        state.scrollTop = scrollParent?.scrollTop ?? 0;
        state.horScrollAvailable = (
            !!scrollParent
            && scrollParent.scrollWidth >= scrollParent.clientWidth
        );
        state.vertScrollAvailable = (
            !!scrollParent
            && scrollParent.scrollHeight >= scrollParent.clientHeight
        );

        state.scrollWidth = (state.horScrollAvailable)
            ? (scrollParent?.scrollWidth ?? 0)
            : (screen?.right ?? 0);
        state.scrollHeight = (state.vertScrollAvailable)
            ? (scrollParent?.scrollHeight ?? 0)
            : (screen?.bottom ?? 0);
        state.scrollRight = state.scrollLeft + (refScrollParent?.width ?? 0);
        state.scrollBottom = state.scrollTop + (refScrollParent?.height ?? 0);
    }

    /**
     * Calculates maximum scroll distance inside scroll parent:
     *    top: scroll from top to bottom (decrease scrollTop)
     *    left: scroll from left to right (decrease scrollLeft)
     *    bottom: scroll from bottom to top (increase scrollTop)
     *    right: scroll from right to left (increase scrollLeft)
     */
    calculateMaxScrollDistance() {
        const {
            refScroll,
            minRefHeight,
            refScrollParent,
            reference,
        } = this.state;

        if (!refScrollParent || !reference || !refScroll) {
            return;
        }

        const screenTopDist = refScrollParent.height - refScroll.top;
        const screenBottomDist = reference.bottom - refScrollParent.top;
        const screenLeftDist = refScrollParent.width - refScroll.left;
        const screenRightDist = reference.right - refScrollParent.left;

        this.state.dist = {
            left: Math.min(screenLeftDist, this.state.scrollLeft ?? 0),
            top: Math.min(screenTopDist - (minRefHeight ?? 0), this.state.scrollTop ?? 0),
            bottom: Math.min(
                screenBottomDist - (minRefHeight ?? 0),
                (this.state.scrollHeight ?? 0) - (this.state.scrollBottom ?? 0),
            ),
            right: Math.min(
                screenRightDist,
                (this.state.scrollWidth ?? 0) - (this.state.scrollRight ?? 0),
            ),
        };
    }

    calculateMaxWindowScrollDistance() {
        const {
            screen,
            fixedParent,
        } = this.state;
        const html = document.documentElement;

        if (!screen) {
            return;
        }

        const left = (fixedParent) ? (this.state.scrollLeft ?? 0) : screen.left;
        const top = (fixedParent) ? (this.state.scrollTop ?? 0) : screen.top;
        const width = (fixedParent)
            ? (this.state.scrollWidth ?? 0)
            : html.scrollWidth;
        const height = (fixedParent)
            ? (this.state.scrollHeight ?? 0)
            : html.scrollHeight;
        const right = left + screen.width;
        const bottom = top + screen.height;

        this.state.windowDist = {
            left,
            right: width - right,
            top,
            bottom: height - bottom,
        };
    }

    handleMaxSize() {
        const {
            screen,
            offset,
            current,
            reference,
        } = this.state;
        const { style } = this.state.elem as HTMLElement;

        if (
            !current
            || !offset
            || !screen
            || !reference
        ) {
            return;
        }

        const minRefHeight = this.state.minRefHeight ?? 0;
        const screenPadding = this.state.screenPadding ?? 0;
        const margin = this.state.margin ?? 0;

        // Check element is taller than screen
        const minHeight = minRefHeight + margin + screenPadding + (current.height ?? 0);
        if (minHeight > screen.height && this.state.allowResize) {
            current.height = screen.height - minRefHeight - screenPadding - margin;
            style.maxHeight = px(current.height);
        }

        this.state.maxWidth = screen.width - (screenPadding * 2);
        this.state.minLeft = screenPadding - offset.left;

        // Check element is wider than screen
        const width = this.state.width ?? 0;
        if (width >= this.state.maxWidth) {
            style.width = px(this.state.maxWidth);
            current.left = this.state.minLeft;
            this.renderPosition();
        }

        if (this.state.useRefWidth) {
            style.minWidth = px(reference.width);
            style.width = '';
            current.left = getInitialLeftPosition(this.state);
            this.renderPosition();
        }
    }

    calculateOverflow() {
        this.calculateVerticalOverflow();
        this.calculateHorizontalOverflow();
    }

    calculateVerticalOverflow() {
        const { state } = this;
        const { reference, current } = state;
        const isVertCenter = isVerticalCenterPosition(state);
        const refTop = reference?.top ?? 0;
        const refBottom = reference?.bottom ?? 0;
        const refHeight = reference?.height ?? 0;
        const currHeight = current?.height ?? 0;
        const margin = state.margin ?? 0;

        const vertTop = refTop - currHeight - margin;
        const horTop = (isVertCenter)
            ? (refTop - (currHeight - refHeight) / 2)
            : (refTop - currHeight + refHeight);
        const vertBottom = refBottom + margin + currHeight;
        const horBottom = (isVertCenter)
            ? (refBottom + (currHeight - refHeight) / 2)
            : (refTop + currHeight);

        state.vertOverflowTop = getTopOverflow(vertTop, state);
        state.vertOverflowBottom = getBottomOverflow(vertBottom, state);

        state.horOverflowTop = getTopOverflow(horTop, state);
        state.horOverflowBottom = getBottomOverflow(horBottom, state);
    }

    calculateHorizontalOverflow() {
        const { state } = this;
        const { reference, current } = state;
        const isHorCenter = isHorizontalCenterPosition(state);
        const refLeft = reference?.left ?? 0;
        const refRight = reference?.right ?? 0;
        const refWidth = reference?.width ?? 0;
        const currWidth = current?.width ?? 0;
        const margin = state.margin ?? 0;

        const horLeft = refLeft - currWidth - margin;
        const vertLeft = (isHorCenter)
            ? (refLeft - (currWidth - refWidth) / 2)
            : (refRight - currWidth);
        const horRight = refRight + margin + currWidth;
        const vertRight = (isHorCenter)
            ? (refRight + (currWidth - refWidth) / 2)
            : (refLeft + currWidth);

        state.horOverflowLeft = getLeftOverflow(horLeft, state);
        state.horOverflowRight = getRightOverflow(horRight, state);

        state.vertOverflowLeft = getLeftOverflow(vertLeft, state);
        state.vertOverflowRight = getRightOverflow(vertRight, state);
    }

    handleFlip() {
        const { state } = this;
        state.flip = isVerticalFlip(state) || isHorizontalFlip(state);
        state.crossFlip = isVerticalCrossFlip(state) || isHorizontalCrossFlip(state);

        this.state.current.left = getInitialLeftPosition(this.state);
        this.state.current.top = getInitialTopPosition(this.state);
        this.renderPosition();
    }

    handleAxisChange() {
        const { state } = this;
        if (state.flip) {
            return;
        }

        const vertToHor = isVerticalToHorizontalAxisChange(state);
        const horToVert = isHorizontalToVerticalAxisChange(state);

        if (vertToHor) {
            state.position = changeAxisToHorizontal(state);
        } else if (horToVert) {
            state.position = changeAxisToVertical(state);
        }

        if (vertToHor || horToVert) {
            this.recalculate();
        }
    }

    handleVerticalPosition() {
        const { state } = this;
        const {
            screen,
            offset,
            scrollParent,
            reference,
            current,
        } = state;
        const { style } = state.elem as HTMLElement;

        if (
            !screen
            || !offset
            || !scrollParent
            || !reference
            || !state.refScroll
            || !state.dist
            || !state.windowDist
        ) {
            return;
        }

        const screenPadding = state.screenPadding ?? 0;
        const isTopPosition = isTop(state);
        const isBottomPosition = isBottom(state);
        const elemVertOverflow = getElementVerticalOverflow(state);
        const refOverflowTop = -state.refScroll.top;
        const refOverflowBottom = reference.bottom - screen.height;

        let refVertOverflow = 0;
        if (isTopPosition) {
            refVertOverflow = refOverflowBottom;
        } else if (isBottomPosition) {
            refVertOverflow = refOverflowTop;
        }

        const isRefOverflow = elemVertOverflow < 0 && refVertOverflow > 1;

        const topToBottom = isVertical(state)
            ? (isTopPosition !== isRefOverflow)
            : (isVerticalEnd(state));

        const direction = (topToBottom) ? -1 : 1;
        let overflow = (isRefOverflow) ? refVertOverflow : elemVertOverflow;
        if (overflow > screenPadding && state.vertScrollAvailable && state.scrollOnOverflow) {
            const maxDistance = (topToBottom) ? state.dist.top : state.dist.bottom;
            const distance = Math.min(overflow, maxDistance) * direction;
            const newScrollTop = scrollParent.scrollTop + distance;

            if ((topToBottom && distance < 0) || (!topToBottom && distance > 0)) {
                overflow -= Math.abs(distance);
            }

            if (overflow <= screenPadding) {
                overflow = 0;
            }

            // Scroll window if overflow is not cleared yet
            let windowScrollDistance = 0;
            if (overflow > screenPadding) {
                const maxWindowDistance = (topToBottom)
                    ? state.windowDist.top
                    : state.windowDist.bottom;

                windowScrollDistance = Math.min(overflow, maxWindowDistance) * direction;
                overflow -= Math.abs(windowScrollDistance);
            }
            const newWindowScrollY = window.scrollY + windowScrollDistance;

            this.state.scrollRequested = true;
            scrollParent.scrollTop = newScrollTop;
            if (Math.abs(windowScrollDistance) > 0) {
                window.scrollTo(window.scrollX, newWindowScrollY);
            }
        } else if (overflow > screenPadding && state.isInitial && !state.scrollOnOverflow) {
            const minPos = screenPadding - offset.top;
            const maxPos = screen.height - offset.top - (current.height ?? 0) - screenPadding;
            current.top = minmax(minPos, maxPos, current.top ?? 0);
            overflow = 0;
            this.renderPosition();
        }

        this.getRefClientRect();
        this.getOffsetParentRect();
        this.getScrollParentRect();
        current.top = getInitialTopPosition(state);

        // Decrease height of element if overflow is not cleared
        if (overflow > screenPadding && state.isInitial && state.allowResize) {
            current.height = (current.height ?? 0) - overflow;
            style.maxHeight = px(current.height);
            if (isTopPosition) {
                current.top += overflow;
            }
        }

        this.renderPosition();
    }

    handleHorizontalPosition() {
        const { state } = this;
        const {
            screen,
            offset,
            scrollParent,
            windowDist,
            reference,
            current,
        } = state;

        if (
            !screen
            || !offset
            || !scrollParent
            || !windowDist
            || !reference
            || !current
            || !state.refScroll
            || !state.dist
        ) {
            return;
        }

        const screenPadding = state.screenPadding ?? 0;
        const isLeftPosition = isLeft(state);
        const isRightPosition = isRight(state);
        const elemHorOverflow = getElementHorizontalOverflow(state);
        const refOverflowLeft = -state.refScroll.left;
        const refOverflowRight = reference.right - screen.width;

        let refHorOverflow = 0;
        if (isLeftPosition) {
            refHorOverflow = refOverflowRight;
        } else if (isRightPosition) {
            refHorOverflow = refOverflowLeft;
        }

        const isRefHorOverflow = elemHorOverflow < 0 && refHorOverflow > 1;
        const leftToRight = isHorizontal(state)
            ? (isLeftPosition !== isRefHorOverflow)
            : (isHorizontalEnd(state));

        const horDirection = (leftToRight) ? -1 : 1;
        let hOverflow = (isRefHorOverflow) ? refHorOverflow : elemHorOverflow;
        if (hOverflow > 1 && state.horScrollAvailable && state.scrollOnOverflow) {
            const maxDistance = (leftToRight) ? state.dist.left : state.dist.right;
            const hDistance = Math.min(hOverflow, maxDistance) * horDirection;
            const newScrollLeft = scrollParent.scrollLeft + hDistance;

            if ((leftToRight && hDistance < 0) || (!leftToRight && hDistance > 0)) {
                hOverflow -= Math.abs(hDistance);
            }

            // Scroll window if overflow is not cleared yet
            let windowHScrollDistance = 0;
            if (hOverflow > screenPadding) {
                const maxWindowDistance = (leftToRight) ? windowDist.left : windowDist.right;
                windowHScrollDistance = (
                    Math.min(hOverflow, maxWindowDistance) * horDirection
                );
                hOverflow -= Math.abs(windowHScrollDistance);
            }
            const newWindowScrollX = window.scrollX + windowHScrollDistance;

            this.state.scrollRequested = true;
            scrollParent.scrollLeft = newScrollLeft;
            if (Math.abs(windowHScrollDistance) > 0) {
                window.scrollTo(newWindowScrollX, window.scrollY);
            }

            this.getRefClientRect();
            this.getOffsetParentRect();
            this.getScrollParentRect();
            current.left = getInitialLeftPosition(state);
            this.renderPosition();
        } else if (hOverflow > screenPadding && state.isInitial && !state.scrollOnOverflow) {
            const minPos = screenPadding - offset.left;
            const maxPos = screen.width - offset.left - (current.width ?? 0) - screenPadding;
            current.left = minmax(minPos, maxPos, current.left ?? 0);
            this.renderPosition();
        }
    }

    /* Reset previously applied style properties of element */
    reset() {
        const { style } = this.props.elem as HTMLElement;

        style.top = '';
        style.bottom = '';
        style.left = '';
        style.minWidth = '';
        style.width = '';
        style.maxHeight = '';

        setTimeout(() => this.stopWindowEvents());
    }
}
