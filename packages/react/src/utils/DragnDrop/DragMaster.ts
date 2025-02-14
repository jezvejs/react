import { ge, removeEvents, setEvents } from '@jezvejs/dom';
import { asArray } from '@jezvejs/types';
import { ListenerFunctionsGroup, ListenersGroup, Point } from '../types.ts';
import {
    DragAvatar,
    DragHandle,
    DragZone,
    DropTarget,
} from './types.ts';

/** Main drag and drop class */
export class DragMaster {
    static instance: DragMaster | null = null;

    static getInstance() {
        if (!this.instance) {
            this.instance = new DragMaster();
        }

        return this.instance;
    }

    static getElementUnderClientXY(
        elem: HTMLElement | null,
        clientX: number,
        clientY: number,
    ): Element | null {
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

    static getEventCoordinatesObject(e: TouchEvent | MouseEvent) {
        if ('touches' in e) {
            if (e.type === 'touchend' || e.type === 'touchcancel') {
                return e.changedTouches[0];
            }

            return e.touches[0];
        }

        return e;
    }

    static getEventPageCoordinates(e: TouchEvent | MouseEvent): Point {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.pageX,
            y: coords.pageY,
        };
    }

    static getEventClientCoordinates(e: TouchEvent | MouseEvent): Point {
        const coords = this.getEventCoordinatesObject(e);

        return {
            x: coords.clientX,
            y: coords.clientY,
        };
    }

    static makeDraggable(dragZone: DragZone) {
        const inst = this.getInstance();
        inst.makeDraggable(dragZone);
    }

    static destroyDraggable() {
        const inst = this.getInstance();
        inst.destroyDraggable();
    }

    static registerDropTarget(dropTarget: DropTarget) {
        const inst = this.getInstance();
        inst.registerDropTarget(dropTarget);
    }

    static unregisterDropTarget(dropTarget: DropTarget) {
        const inst = this.getInstance();
        inst.unregisterDropTarget(dropTarget);
    }

    dragZoneRegistry: DragZone[] = [];

    dropTargetRegistry: DropTarget[] = [];

    dragZone: DragZone | null = null;

    avatar: DragAvatar | null = null;

    dropTarget: DropTarget | null = null;

    isTouch: boolean = false;

    dragStarted: boolean = false;

    touchTimeout: number = 0;

    touchMoveReady: boolean = false;

    touchHandlerSet: boolean = false;

    listenScroll: boolean = false;

    handlers: ListenerFunctionsGroup;

    startHandlers: ListenerFunctionsGroup;

    touchMoveHandler: ListenerFunctionsGroup;

    touchScrollHandler: ListenerFunctionsGroup;

    downX: number = 0;

    downY: number = 0;

    touchEvents = {
        move: 'touchmove',
        end: 'touchend',
        cancel: 'touchcancel',
    };

    mouseEvents = {
        move: 'mousemove',
        end: 'mouseup',
    };

    constructor() {
        this.dragZoneRegistry = [];
        this.dropTargetRegistry = [];

        this.dragZone = null;
        this.avatar = null;
        this.dropTarget = null;
        this.isTouch = false;
        this.dragStarted = false;
        this.touchTimeout = 0;
        this.touchMoveReady = false;
        this.touchHandlerSet = false;

        this.handlers = {
            keydown: (e: Event) => this.onKey(e as KeyboardEvent),
            start: (e: Event) => this.mouseDown(e as MouseEvent),
            move: (e: Event) => this.mouseMove(e as MouseEvent),
            end: (e: Event) => this.mouseUp(e as MouseEvent),
            cancel: (e: Event) => this.mouseUp(e as MouseEvent),
            preventDefault: (e: Event) => e.preventDefault(),
        };

        this.startHandlers = {
            mousedown: this.handlers.start,
            touchstart: this.handlers.start,
        };

        this.touchMoveHandler = {
            touchmove: (e: Event) => this.mouseMove(e as TouchEvent),
        };

        this.touchScrollHandler = {
            scroll: (e: Event) => this.onScroll(e),
        };
    }

    makeDraggable(dragZone: DragZone) {
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
    isValidStartEvent(e: TouchEvent | MouseEvent) {
        return (
            (e.type === 'touchstart' && ('touches' in e) && e.touches?.length === 1)
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
        const { move, end } = (this.isTouch) ? this.touchEvents : this.mouseEvents;
        const events: ListenersGroup = {
            keydown: this.handlers.keydown,
            [end]: this.handlers.end,
            dragstart: this.handlers.preventDefault,
        };

        if (!this.isTouch) {
            const moveListener = {
                listener: this.handlers.move,
                options: { passive: false },
            };

            events[move] = moveListener;
        }

        const { cancel } = this.touchEvents;
        if (this.isTouch && cancel) {
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
    initTouchMove(e: TouchEvent) {
        if (!this.dragZone) {
            return;
        }

        this.resetMoveTimeout();
        this.setupScrollHandler();

        const touchMoveTimeout = this.dragZone.touchMoveTimeout ?? 200;

        this.touchMoveReady = (touchMoveTimeout <= 0);
        if (this.touchMoveReady) {
            this.handleMove(e);
            return;
        }

        this.touchTimeout = window.setTimeout(() => {
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
    findDragZoneByElement(elem?: Element | null) {
        if (!elem) {
            return null;
        }

        return this.dragZoneRegistry.find((item: DragZone) => item?.elem === elem);
    }

    /** Searches for all drag zones containing specified element */
    findAllDragZonesByElement(elem?: Element | null) {
        if (!elem) {
            return null;
        }

        return this.dragZoneRegistry.filter((item: DragZone) => item?.elem?.contains?.(elem));
    }

    registerDragZone(dragZone: DragZone) {
        if (!dragZone) {
            throw new Error('Invalid dragZone');
        }

        if (this.findDragZoneByElement(dragZone.elem)) {
            return;
        }

        this.dragZoneRegistry.push(dragZone);
    }

    unregisterDragZone(dragZone: DragZone) {
        if (!dragZone) {
            throw new Error('Invalid dragZone');
        }

        const { elem } = dragZone;
        this.dragZoneRegistry = this.dragZoneRegistry.filter((item) => item?.elem !== elem);
    }

    /** Search for drag zone object */
    findDragZone(target?: Element | null) {
        if (!target) {
            return null;
        }

        let elem: Element | null = target;
        while (elem && elem !== document.documentElement) {
            const dragZone = this.findDragZoneByElement(elem);
            if (dragZone) {
                return dragZone;
            }

            elem = elem.parentNode as Element;
        }

        return null;
    }

    /** Search for drag zone object */
    findDragZoneById(id: string) {
        const strId = id?.toString() ?? null;
        if (strId === null) {
            return null;
        }

        return this.dragZoneRegistry.find((item) => item?.id?.toString() === strId);
    }

    /** Searches for drag zone by specified element */
    findDropTargetByElement(elem?: Element | null) {
        if (!elem) {
            return null;
        }

        return this.dropTargetRegistry.find((item) => item?.elem === elem);
    }

    registerDropTarget(dropTarget: DropTarget) {
        if (!dropTarget) {
            throw new Error('Invalid dropTarget');
        }

        if (this.findDropTargetByElement(dropTarget.elem)) {
            return;
        }

        this.dropTargetRegistry.push(dropTarget);
    }

    unregisterDropTarget(dropTarget: DropTarget) {
        if (!dropTarget) {
            throw new Error('Invalid dropTarget');
        }

        const { elem } = dropTarget;
        this.dropTargetRegistry = this.dropTargetRegistry.filter((item) => item?.elem !== elem);
    }

    /** Try to find drop target under mouse cursor */
    findDropTarget() {
        let elem = this.avatar?.getTargetElem?.() ?? null;
        while (elem && elem !== document.documentElement) {
            const dropTarget = this.findDropTargetByElement(elem);
            if (dropTarget) {
                return dropTarget;
            }

            elem = elem.parentNode as Element;
        }

        return null;
    }

    initAvatar(e: TouchEvent | MouseEvent) {
        if (this.avatar || !this.dragZone) {
            return;
        }

        if (!this.isTouch) {
            const coords = DragMaster.getEventPageCoordinates(e);
            const threshold = this.dragZone.mouseMoveThreshold ?? 0;
            if (
                Math.abs(this.downX - coords.x) < threshold
                && Math.abs(this.downY - coords.y) < threshold
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

    handleMove(e: TouchEvent | MouseEvent) {
        if (!this.dragZone) {
            return;
        }

        if (!this.avatar) {
            this.initAvatar(e);
        }
        if (!this.avatar) {
            return;
        }

        this.dragStarted = true;

        this.avatar.onDragMove({ e });

        const newDropTarget = this.findDropTarget();
        if (this.dropTarget !== newDropTarget) {
            if (this.dropTarget) {
                this.dropTarget.onDragLeave?.({
                    e,
                    avatar: this.avatar,
                    newTarget: newDropTarget,
                });
            }
            if (newDropTarget) {
                newDropTarget.onDragEnter?.({
                    e,
                    avatar: this.avatar,
                    prevTarget: this.dropTarget,
                });
            }
        }

        this.dropTarget = newDropTarget;
        if (this.dropTarget) {
            this.dropTarget.onDragMove?.({
                e,
                avatar: this.avatar,
            });
        }
    }

    /** Document mouse move event handler */
    mouseMove(e: TouchEvent | MouseEvent) {
        if (!this.dragZone) {
            return;
        }

        if (this.isTouch && !this.touchMoveReady) {
            this.resetMoveTimeout();
            return;
        }

        this.handleMove(e);

        const preventTouchScroll = (
            this.isTouch
            && this.dragStarted
            && e.cancelable
        );
        if (preventTouchScroll) {
            e.preventDefault();
        }
    }

    /** Document mouse up event handler */
    mouseUp(e: TouchEvent | MouseEvent) {
        if (!this.isTouch && (e as MouseEvent).button !== 0) {
            return;
        }

        this.resetMoveTimeout();
        this.finishDrag(e);
    }

    finishDrag(e: TouchEvent | MouseEvent | Event, cancel: boolean = false) {
        this.dragStarted = false;

        if (this.avatar) {
            const dropAllowed = (
                this.dropTarget?.isDropAllowed?.({ avatar: this.avatar, e })
            ) ?? false;

            if (!cancel && dropAllowed && this.dropTarget) {
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
    onKey(e: KeyboardEvent) {
        if (e.code === 'Escape') {
            this.cancelDrag(e);
        }
    }

    defaultDragHandleValildation(target: Element) {
        if (!target) {
            return false;
        }

        // allow to drag using whole drag zone in case no handles is set
        if (!this.dragZone?.handles) {
            return true;
        }

        const handles = asArray(this.dragZone.handles);

        return handles.some((hnd: DragHandle) => {
            let elem: Element | Element[] | null = [];

            if (typeof hnd === 'object' && ('query' in hnd || 'elem' in hnd)) {
                if ('query' in hnd) {
                    const qres = this.dragZone?.elem?.querySelectorAll(hnd.query) ?? [];
                    elem = Array.from(qres);
                } else if (typeof hnd.elem === 'string') {
                    elem = ge(hnd.elem);
                } else {
                    elem = hnd.elem;
                }
            } else if (typeof hnd === 'string') {
                elem = ge(hnd);
            } else {
                elem = hnd;
            }

            return asArray(elem).some((el: Element) => (
                el
                && (
                    el === target
                    || (
                        (typeof hnd === 'object')
                        && ('includeChilds' in hnd)
                        && hnd.includeChilds
                        && el.contains(target)
                    )
                )
            ));
        });
    }

    /** Mouse down on drag object element event handler */
    mouseDown(e: TouchEvent | MouseEvent) {
        if (!this.isValidStartEvent(e)) {
            return;
        }

        this.isTouch = e.type === 'touchstart';
        const target = e.target as Element;

        this.dragZone = this.findDragZone(target);
        if (!this.dragZone) {
            return;
        }

        const isValidDragHandle = (typeof this.dragZone.isValidDragHandle === 'function')
            ? this.dragZone.isValidDragHandle(target)
            : this.defaultDragHandleValildation(target);
        if (!isValidDragHandle) {
            this.dragZone = null;
            return;
        }

        const coord = DragMaster.getEventPageCoordinates(e);
        this.downX = coord.x;
        this.downY = coord.y;

        this.setupHandlers();

        if (this.isTouch) {
            this.initTouchMove(e as TouchEvent);
        }
    }

    onScroll(e: Event) {
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
