import { ge, removeEvents, setEvents } from '@jezvejs/dom';
import { asArray, isFunction, isObject } from '@jezvejs/types';

interface DragZone {
};

interface DropTarget {
};

interface DragAvatar {
};

/** Main drag and drop class */
export class DragMaster {
    static instance: DragMaster | null = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new DragMaster();
        }

        return this.instance;
    }

    static getElementUnderClientXY(elem: HTMLElement | null, clientX: number, clientY: number): Element | null {
        if (!elem) {
            return null;
        }

        const display = elem.style.getPropertyValue('display');
        const priority = elem.style.getPropertyPriority('display');
        elem.style.setProperty('display', 'none', 'important');

        let target = document.elementFromPoint(clientX, clientY);

        elem.style.setProperty('display', display, priority);

        if (!target || target === document.documentElement) {
            target = document.body;
        }

        return target;
    }

    static getEventCoordinatesObject(e: TouchEvent | MouseEvent | Event) {
        if (e.touches) {
            if (e.type === 'touchend' || e.type === 'touchcancel') {
                return e.changedTouches[0];
            }

            return e.touches[0];
        }

        return e;
    }

    static getEventPageCoordinates(e) {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.pageX,
            y: coords.pageY,
        };
    }

    static getEventClientCoordinates(e) {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.clientX,
            y: coords.clientY,
        };
    }

    static makeDraggable(dragZone) {
        const inst = this.getInstance();
        inst.makeDraggable(dragZone);
    }

    static destroyDraggable() {
        const inst = this.getInstance();
        inst.destroyDraggable();
    }

    static registerDropTarget(dropTarget) {
        const inst = this.getInstance();
        inst.registerDropTarget(dropTarget);
    }

    static unregisterDropTarget(dropTarget) {
        const inst = this.getInstance();
        inst.unregisterDropTarget(dropTarget);
    }

    constructor() {
        this.dragZoneRegistry = [];
        this.dropTargetRegistry = [];

        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
        this.isTouch = false;
        this.touchTimeout = 0;
        this.touchMoveReady = false;
        this.touchHandlerSet = false;

        this.handlers = {
            keydown: (e) => this.onKey(e),
            start: (e) => this.mouseDown(e),
            move: (e) => this.mouseMove(e),
            end: (e) => this.mouseUp(e),
            cancel: (e) => this.mouseUp(e),
            preventDefault: (e) => e.preventDefault(),
        };

        this.startHandlers = {
            mousedown: this.handlers.start,
            touchstart: this.handlers.start,
        };

        this.touchMoveHandler = {
            touchmove: (e: TouchEvent) => this.mouseMove(e),
        };

        this.touchScrollHandler = {
            scroll: (e: Event) => this.onScroll(e),
        };

        this.touchEvents = {
            move: 'touchmove',
            end: 'touchend',
            cancel: 'touchcancel',
        };

        this.mouseEvents = {
            move: 'mousemove',
            end: 'mouseup',
        };
    }

    makeDraggable(dragZone) {
        this.registerDragZone(dragZone);

        const { elem } = dragZone;

        setEvents(elem, this.startHandlers);

        if (!this.touchHandlerSet) {
            this.touchHandlerSet = true;
            setEvents(document, this.touchMoveHandler, { passive: false });
        }
    }

    destroyDraggable() {
        this.touchHandlerSet = false;

        removeEvents(document, this.touchMoveHandler, { passive: false });

        if (this.dragZone) {
            this.unregisterDragZone(this.dragZone);
            this.dragZone = null;
        }
    }

    /** Returns true if event is valid to start drag */
    isValidStartEvent(e) {
        return (
            (e.type === 'touchstart' && e.touches?.length === 1)
            || (e.type === 'mousedown' && e.which === 1)
        );
    }

    disableTextSelect() {
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
    }

    enableTextSelect() {
        document.body.style.userSelect = '';
        document.body.style.webkitUserSelect = '';
    }

    /** Returns event handlers object except 'move' and 'selectstart' */
    getEventHandlers() {
        const { move, end, cancel } = (this.isTouch) ? this.touchEvents : this.mouseEvents;
        const events = {
            keydown: this.handlers.keydown,
            [end]: this.handlers.end,
            dragstart: this.handlers.preventDefault,
        };

        if (!this.isTouch) {
            events[move] = {
                listener: this.handlers.move,
                options: { passive: false },
            };
        }

        if (cancel) {
            events[cancel] = this.handlers.cancel;
        }

        return events;
    }

    /** Sets event handlers */
    setupHandlers() {
        const events = this.getEventHandlers();
        setEvents(document, events);
        setEvents(document.body, { selectstart: this.handlers.preventDefault });

        if (this.isTouch) {
            this.disableTextSelect();
        }
    }

    /** Removes event handlers */
    removeHandlers() {
        const events = this.getEventHandlers();
        removeEvents(document, events);
        removeEvents(document.body, { selectstart: this.handlers.preventDefault });

        if (this.isTouch) {
            this.enableTextSelect();
        }
    }

    setupScrollHandler() {
        if (this.listenScroll) {
            return;
        }

        setEvents(document, this.touchScrollHandler, { passive: true });
        this.listenScroll = true;
    }

    removeScrollHandler() {
        if (!this.listenScroll) {
            return;
        }

        removeEvents(document, this.touchScrollHandler, { passive: true });
        this.listenScroll = false;
    }

    /** Clean up drag objects */
    cleanUp() {
        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
    }

    /** Sets touch move timeout */
    initTouchMove(e) {
        this.resetMoveTimeout();
        this.setupScrollHandler();

        const touchMoveTimeout = this.dragZone.touchMoveTimeout ?? 200;

        this.touchMoveReady = (touchMoveTimeout <= 0);
        if (this.touchMoveReady) {
            this.handleMove(e);
            return;
        }

        this.touchTimeout = setTimeout(() => {
            this.touchMoveReady = true;

            this.handleMove(e);
        }, touchMoveTimeout);
    }

    /** Clears touch move timeout */
    resetMoveTimeout() {
        if (this.touchTimeout) {
            clearTimeout(this.touchTimeout);
            this.touchTimeout = 0;
        }
        this.removeScrollHandler();
    }

    /** Searches for drag zone by specified element */
    findDragZoneByElement(elem) {
        if (!elem) {
            throw new Error('Invalid element');
        }

        return this.dragZoneRegistry.find((item) => item?.elem === elem);
    }

    /** Searches for all drag zones containing specified element */
    findAllDragZonesByElement(elem) {
        if (!elem) {
            throw new Error('Invalid element');
        }

        return this.dragZoneRegistry.filter((item) => item?.elem?.contains?.(elem));
    }

    registerDragZone(dragZone) {
        if (!dragZone) {
            throw new Error('Invalid dragZone');
        }

        if (this.findDragZoneByElement(dragZone.elem)) {
            return;
        }

        this.dragZoneRegistry.push(dragZone);
    }

    unregisterDragZone(dragZone) {
        if (!dragZone) {
            throw new Error('Invalid dragZone');
        }

        const { elem } = dragZone;
        this.dragZoneRegistry = this.dragZoneRegistry.filter((item) => item?.elem !== elem);
    }

    /** Search for drag zone object */
    findDragZone(target) {
        if (!target) {
            return null;
        }

        let elem = target;
        while (elem && elem !== document) {
            const dragZone = this.findDragZoneByElement(elem);
            if (dragZone) {
                return dragZone;
            }

            elem = elem.parentNode;
        }

        return null;
    }

    /** Search for drag zone object */
    findDragZoneById(id) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return null;
        }

        return this.dragZoneRegistry.find((item) => item?.id?.toString() === strId);
    }

    /** Searches for drag zone by specified element */
    findDropTargetByElement(elem) {
        if (!elem) {
            throw new Error('Invalid element');
        }

        return this.dropTargetRegistry.find((item) => item?.elem === elem);
    }

    registerDropTarget(dropTarget) {
        if (!dropTarget) {
            throw new Error('Invalid dropTarget');
        }

        if (this.findDropTargetByElement(dropTarget.elem)) {
            return;
        }

        this.dropTargetRegistry.push(dropTarget);
    }

    unregisterDropTarget(dropTarget) {
        if (!dropTarget) {
            throw new Error('Invalid dropTarget');
        }

        const { elem } = dropTarget;
        this.dropTargetRegistry = this.dropTargetRegistry.filter((item) => item?.elem !== elem);
    }

    /** Try to find drop target under mouse cursor */
    findDropTarget() {
        let elem = this.avatar?.getTargetElem?.() ?? null;
        while (elem && elem !== document) {
            const dropTarget = this.findDropTargetByElement(elem);
            if (dropTarget) {
                return dropTarget;
            }

            elem = elem.parentNode;
        }

        return null;
    }

    initAvatar(e) {
        if (this.avatar || !this.dragZone) {
            return;
        }

        if (!this.isTouch) {
            const coords = DragMaster.getEventPageCoordinates(e);
            const { mouseMoveThreshold } = this.dragZone;
            if (
                Math.abs(this.downX - coords.x) < mouseMoveThreshold
                && Math.abs(this.downY - coords.y) < mouseMoveThreshold
            ) {
                return;
            }
        }

        const dragStartParams = {
            downX: this.downX,
            downY: this.downY,
            e,
        };

        this.avatar = this.dragZone.onDragStart(dragStartParams);
        if (!this.avatar) {
            this.cleanUp();
        }
    }

    handleMove(e) {
        if (!this.dragZone) {
            return;
        }

        if (!this.avatar) {
            this.initAvatar(e);
        }
        if (!this.avatar) {
            return;
        }

        this.avatar.onDragMove(e);

        const newDropTarget = this.findDropTarget(e);
        if (this.dropTarget !== newDropTarget) {
            if (this.dropTarget) {
                this.dropTarget.onDragLeave?.(newDropTarget, this.avatar, e);
            }
            if (newDropTarget) {
                newDropTarget.onDragEnter?.(this.dropTarget, this.avatar, e);
            }
        }

        this.dropTarget = newDropTarget;
        if (this.dropTarget) {
            this.dropTarget.onDragMove?.(this.avatar, e);
        }
    }

    /** Document mouse move event handler */
    mouseMove(e: TouchEvent | MouseEvent | Event) {
        if (!this.dragZone) {
            return;
        }

        if (this.isTouch) {
            if (!this.touchMoveReady) {
                this.resetMoveTimeout();
                return;
            }

            if (e.cancelable) {
                e.preventDefault();
            }
        }

        this.handleMove(e);
    }

    /** Document mouse up event handler */
    mouseUp(e: TouchEvent | MouseEvent | Event) {
        if (!this.isTouch && e.which !== 1) {
            return;
        }

        this.resetMoveTimeout();
        this.finishDrag(e);
    }

    finishDrag(e: TouchEvent | MouseEvent | Event, cancel: boolean = false) {
        if (this.avatar) {
            if (!cancel && this.dropTarget) {
                this.dropTarget.onDragEnd?.({ avatar: this.avatar, e });
            } else {
                this.avatar.onDragCancel?.({ e });
                this.dropTarget?.onDragCancel?.({ avatar: this.avatar, e });
            }
        }

        this.cleanUp();
        this.removeHandlers();
    }

    cancelDrag(e: Event) {
        this.finishDrag(e, true);
    }

    /** Keydown event handler */
    onKey(e) {
        if (e.code === 'Escape') {
            this.cancelDrag(e);
        }
    }

    defaultDragHandleValildation(target) {
        if (!target) {
            return false;
        }

        // allow to drag using whole drag zone in case no handles is set
        if (!this.dragZone.handles) {
            return true;
        }

        const handles = asArray(this.dragZone.handles);

        return handles.some((hnd) => {
            let elem;
            if (isObject(hnd) && (hnd.elem || hnd.query)) {
                if (hnd.query) {
                    const qres = this.dragZone.elem.querySelectorAll(hnd.query);
                    elem = Array.from(qres);
                } else if (typeof hnd === 'string') {
                    elem = ge(hnd.elem);
                } else {
                    elem = hnd.elem;
                }
            } else if (typeof hnd === 'string') {
                elem = ge(hnd);
            } else {
                elem = hnd;
            }

            elem = asArray(elem);

            return elem.some((el) => (
                el
                && (
                    el === target
                    || (
                        isObject(hnd)
                        && hnd.includeChilds
                        && el.contains(target)
                    )
                )
            ));
        });
    }

    /** Mouse down on drag object element event handler */
    mouseDown(e) {
        if (!this.isValidStartEvent(e)) {
            return;
        }

        this.isTouch = e.type === 'touchstart';

        this.dragZone = this.findDragZone(e.target);
        if (!this.dragZone) {
            return;
        }

        const isValidDragHandle = isFunction(this.dragZone.isValidDragHandle)
            ? this.dragZone.isValidDragHandle(e.target)
            : this.defaultDragHandleValildation(e.target);
        if (!isValidDragHandle) {
            this.dragZone = null;
            return;
        }

        const coord = DragMaster.getEventPageCoordinates(e);
        this.downX = coord.x;
        this.downY = coord.y;

        this.setupHandlers();

        if (this.isTouch) {
            this.initTouchMove(e);
        }
    }

    onScroll(e) {
        if (!this.isTouch || this.avatar?.scrollRequested) {
            return;
        }

        if (e.cancelable) {
            e.preventDefault();
            return;
        }

        this.touchMoveReady = false;
        this.resetMoveTimeout();
        this.cancelDrag(e);
    }
}
