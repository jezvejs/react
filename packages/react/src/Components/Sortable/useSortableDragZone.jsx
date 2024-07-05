import { getOffset } from '@jezvejs/dom';
import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { useDragZone } from '../../utils/DragnDrop/useDragZone.jsx';
import { DragMaster } from '../../utils/DragnDrop/DragMaster.js';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.jsx';

export function useSortableDragZone(props) {
    const { setState } = useDragnDrop();
    const dragItemRef = useRef(null);

    const dragZone = useDragZone({
        ...props,

        /**
         * Returns closest item element if available for the specified element
         * @param {Element} elem - target list item element
         */
        getClosestItemElement(elem) {
            return elem?.closest(props.selector) ?? null;
        },

        /**
         * Returns item id from specified item element
         * @param {Element} elem - target list item element
         */
        itemIdFromElem(elem) {
            const listItemElem = this.getClosestItemElement(elem);
            return listItemElem?.dataset?.id ?? null;
        },

        /**
         * Return current drag item element
         */
        getDragItemElement() {
            return dragItemRef.current;
        },

        // Find specific drag zone element
        findDragZoneItem(target) {
            if (!props.selector) {
                return null;
            }

            const el = this.getClosestItemElement(target);
            const isPlaceholder = el?.classList?.contains(props.placeholderClass);
            return (isPlaceholder) ? null : el;
        },

        // Returns all drag items inside of container
        findAllDragZoneItems() {
            return Array.from(this.elem?.querySelectorAll(props.selector));
        },

        isValidDragHandle(target) {
            if (!target) {
                return false;
            }

            if (!props.allowSingleItemSort) {
                const allItems = this.findAllDragZoneItems();
                if (allItems.length < 2) {
                    return false;
                }
            }

            const item = this.findDragZoneItem(target);
            if (!item) {
                return false;
            }

            // allow to drag using whole drag zone in case no handles is set
            if (!props?.onlyRootHandle) {
                return DragMaster.getInstance().defaultDragHandleValildation(target);
            }

            return props.onlyRootHandle && target === item;
        },

        /** Returns sortable group */
        getGroup(elem) {
            const group = props?.group ?? null;
            return isFunction(group) ? group(elem ?? this.elem) : group;
        },

        /** Returns CSS class for placeholder element */
        getPlaceholder() {
            return props?.placeholderClass ?? null;
        },

        /** Returns CSS class for animated element */
        getAnimatedClass() {
            return props?.animatedClass ?? null;
        },

        /** Returns selector for sortable item element */
        getItemSelector() {
            return props?.selector ?? null;
        },

        /** Returns selector for container element */
        getContainerSelector() {
            return props?.containerSelector ?? null;
        },

        /** Returns class for drag avatar element */
        getDragClass() {
            if (props?.dragClass) {
                return (props.dragClass === true) ? 'drag' : props.dragClass;
            }

            return null;
        },

        /** Sort done event handler */
        onSortEnd(info) {
            if (isFunction(props.onSort)) {
                props.onSort(info);
            }
        },

        restoreSourceNode() {
            if (this.sourceNode) {
                this.sourceNodeRestored = true;
                this.sourceNode.style.display = 'none';
                document.body.appendChild(this.sourceNode);
            }
        },

        observeNode(node) {
            this.disconnectNodeObserver();
            this.removeSourceNode();

            this.sourceNode = node;
            this.nodeObserver = new MutationObserver(() => {
                if (node && !node.parentElement) {
                    this.restoreSourceNode();
                    this.disconnectNodeObserver();
                }
            });

            this.nodeObserver.observe(node.parentElement, {
                childList: true,
            });
        },

        disconnectNodeObserver() {
            if (this.nodeObserver) {
                this.nodeObserver.disconnect();
            }

            this.nodeObserver = null;
        },

        removeSourceNode() {
            if (this.sourceNodeRestored) {
                this.sourceNode?.remove();
            }
            this.sourceNode = null;
            this.sourceNodeRestored = false;
        },

        finishDrag() {
            this.disconnectNodeObserver();
            this.removeSourceNode();
        },

        /** Drag start event handler */
        onDragStart(params) {
            const { e } = params;
            const itemEl = this.findDragZoneItem(e.target);
            const itemId = this.itemIdFromElem(itemEl);
            if (itemId === null) {
                return false;
            }

            const avatar = this.makeAvatar();
            if (!avatar) {
                return false;
            }

            dragItemRef.current = itemEl;

            this.observeNode(itemEl);

            const parentEl = this.findDragZoneItem(itemEl.parentNode);
            const parentId = this.itemIdFromElem(parentEl) ?? this.id;

            const { downX, downY } = params;
            const offset = getOffset(itemEl);
            const width = (props.copyWidth) ? itemEl.offsetWidth : null;
            setState((prev) => ({
                ...prev,
                origLeft: prev.left,
                origTop: prev.top,
                shiftX: downX - offset.left,
                shiftY: downY - offset.top,
                width,
            }));

            props.onDragStart?.({
                ...params,
                avatar,
                parentId,
                zoneId: this.id,
                itemId,
            });

            return avatar;
        },
    });

    return dragZone;
}

useSortableDragZone.propTypes = {
    id: PropTypes.string,
    selector: PropTypes.string,
    placeholderClass: PropTypes.string,
    allowSingleItemSort: PropTypes.bool,
    onlyRootHandle: PropTypes.bool,
    dragOriginal: PropTypes.bool,
    absolutePos: PropTypes.bool,
    onDragStart: PropTypes.func,
    components: PropTypes.shape({
        Avatar: PropTypes.object,
    }),
};
