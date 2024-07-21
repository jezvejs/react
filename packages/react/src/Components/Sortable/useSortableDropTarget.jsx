import { asArray, isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDragnDrop, useDropTarget } from '../../utils/DragnDrop/index.js';
import {
    findTreeItemIndexById,
    findTreeItemParentById,
    getAnimationBox,
    getDragZone,
    getDragZoneItems,
    getNextZoneItems,
    getPositionCacheById,
    getPossibleZoneIds,
    getSourcePosition,
    getTargetPositionById,
    getTreeItemById,
    isTreeContains,
    mapTreeItems,
    toFlatList,
} from './helpers.js';

export function useSortableDropTarget(props) {
    const targetElem = useRef(null);

    const { getState, setState } = useDragnDrop();

    const dropTarget = useDropTarget({
        ...props,

        getTargetElem(avatar) {
            let el = avatar.getTargetElem();
            const {
                selector,
                placeholderClass,
                containerSelector = null,
            } = props;

            const dragZone = DragMaster.getInstance().findDragZone(el);

            while (el && el !== document && el !== dragZone?.elem) {
                if (
                    el.matches?.(selector)
                    || el.matches?.(containerSelector)
                    || el.classList?.contains(placeholderClass)
                ) {
                    return el;
                }

                el = el.parentNode;
            }

            return (el === dragZone?.elem) ? el : null;
        },

        /** Returns sortable group */
        getGroup() {
            const group = props?.group ?? null;
            return isFunction(group) ? group(targetElem.current) : group;
        },

        isAceptableAvatar(avatar) {
            return !!avatar; // (avatar instanceof SortableDragAvatar)
        },

        applyNewTarget(avatar, elem) {
            this.hideHoverIndication?.(avatar);
            targetElem.current = elem;
            this.showHoverIndication?.(avatar);
        },

        onDragMove(avatar, e) {
            const newTargetElem = this.getTargetElem(avatar, e);
            if (targetElem.current === newTargetElem) {
                return;
            }

            this.applyNewTarget(avatar, newTargetElem);
            if (!newTargetElem) {
                return;
            }

            const state = getState();
            if (!state.origSortPos || !state.sortPosition) {
                return;
            }

            const sourceId = state.origSortPos.id ?? null;
            const sourceZoneId = state.sortPosition.zoneId ?? null;
            const sourceParentId = state.sortPosition.parentId ?? null;
            if (sourceId === null || sourceZoneId === null || sourceParentId === null) {
                return;
            }

            const dragMaster = DragMaster.getInstance();
            if (!dragMaster) {
                return;
            }

            const sourcePosition = getSourcePosition(state);
            if (!sourcePosition) {
                return;
            }

            const sourceDragZone = dragMaster.findDragZoneById(sourcePosition.zoneId);
            const dragZone = sourceDragZone;
            const dragZoneElem = this.getItemElementById(sourceId, dragZone.elem);
            if (!dragZoneElem) {
                return;
            }

            const currentGroup = dragZone.getGroup(dragZoneElem);

            const targetDragZone = dragMaster.findDragZone(newTargetElem);
            const targetItemElem = targetDragZone?.findDragZoneItem(newTargetElem);
            const targetGroup = targetDragZone?.getGroup(targetItemElem);

            if (
                !this.isAceptableAvatar(avatar)
                || (targetGroup !== currentGroup)
            ) {
                return;
            }

            const { containerSelector, selector } = dragZone;
            const targetContainer = newTargetElem.querySelector(containerSelector);

            const targetZoneId = targetDragZone?.id ?? null;
            let targetId = targetDragZone.itemIdFromElem(newTargetElem);
            const parentElem = targetDragZone.findDragZoneItem(newTargetElem.parentNode);
            const targetParentZone = targetDragZone.itemIdFromElem(parentElem);
            let targetParentId = targetParentZone ?? targetZoneId;

            const sourceZoneItems = getNextZoneItems(sourceZoneId, state);

            const flatSourceItems = toFlatList(sourceZoneItems);
            const flatSourceIndex = flatSourceItems.findIndex((item) => item?.id === sourceId);

            const sourceIndex = findTreeItemIndexById(sourceZoneItems, sourceId);

            const targetZoneItems = getNextZoneItems(targetZoneId, state);
            const flatTargetItems = toFlatList(targetZoneItems);
            const flatTargetIndex = flatTargetItems.findIndex((item) => item?.id === targetId);

            if (targetId === null || targetId === targetParentId) {
                return;
            }

            let targetIndex = findTreeItemIndexById(targetZoneItems, targetId);
            if (targetIndex === -1) {
                if (targetId !== null) {
                    return;
                }

                targetIndex = targetZoneItems.length;
            }

            const isSameZone = targetZoneId === state.sortPosition.zoneId;
            const isSameParent = (targetParentId === state.sortPosition.parentId) && isSameZone;
            const dragZoneBeforeTarget = isSameZone && flatSourceIndex < flatTargetIndex;
            const dragZoneAfterTarget = isSameZone && flatSourceIndex > flatTargetIndex;
            const dragZoneContainsTarget = isTreeContains(sourceId, targetId, sourceZoneItems);
            const targetContainsDragZone = isTreeContains(targetId, sourceId, targetZoneItems);

            if (dragZoneBeforeTarget && !dragZoneContainsTarget && !isSameParent) {
                targetIndex += 1;
            }

            const placeholderClass = dragZone.getPlaceholder();
            const isPlaceholder = newTargetElem.classList.contains(placeholderClass);
            const targetIsContainer = newTargetElem.matches(containerSelector);

            // swap drag zone with drop target
            if (isPlaceholder && sourceId === targetId) {
                return;
            }

            let animateElems = [];
            let swapWithPlaceholder = false;

            const zoneIds = [
                sourceZoneId,
                targetZoneId,
                ...getPossibleZoneIds(state),
            ];

            this.checkPositionsCache(zoneIds);

            const getElementPosition = (elem) => ({
                parent: elem?.parentNode,
                prev: elem?.previousSibling,
                next: elem?.nextSibling,
            });

            const insertAtElementPosition = (elem, pos) => {
                if (pos.prev && pos.prev.parentNode) {
                    pos.prev.after(elem);
                } else if (pos.next && pos.next.parentNode) {
                    pos.next.before(elem);
                } else {
                    pos.parent?.append(elem);
                }
            };

            const dragZoneNodes = getElementPosition(dragZoneElem);

            const measureClass = 'sortable-measure';
            dragZone.elem.classList.add(measureClass);
            targetDragZone.elem.classList.add(measureClass);

            // Temporarily append item to the target container to save position of
            // item next after current last item
            const tmpSourceClone = dragZoneElem.cloneNode(true);
            let tmpPlaceholder = null;

            if (!isPlaceholder) {
                dragZoneElem.remove();
            }

            const isTargetDragZoneRoot = targetDragZone.elem === newTargetElem;

            if (isPlaceholder) {
                tmpPlaceholder = newTargetElem.cloneNode(true);
                dragZoneElem.replaceWith(tmpPlaceholder);
                newTargetElem.replaceWith(tmpSourceClone);
            } else if (
                sourceParentId !== targetParentId
                && !dragZoneContainsTarget
            ) {
                if (
                    props.tree
                    && targetContainsDragZone
                    && (isTargetDragZoneRoot || targetIsContainer)
                ) {
                    const parentItem = dragZoneElem.parentNode?.closest(selector);
                    if (parentItem && parentItem !== newTargetElem) {
                        const rect = parentItem.getBoundingClientRect();
                        if (e.clientY >= rect.bottom) {
                            parentItem.after(tmpSourceClone);
                        } else if (e.clientY <= rect.top) {
                            parentItem.before(tmpSourceClone);
                        }
                    }
                } else if (!isTargetDragZoneRoot) {
                    if (props.tree && targetIsContainer) {
                        if (newTargetElem.childElementCount === 0) {
                            newTargetElem.append(tmpSourceClone);
                        }
                    } else if (dragZoneBeforeTarget) {
                        newTargetElem.after(tmpSourceClone);
                    } else {
                        newTargetElem.before(tmpSourceClone);
                    }
                }
            } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
                newTargetElem.after(tmpSourceClone);
            } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
                newTargetElem.before(tmpSourceClone);
            }

            this.getTargetPositions(zoneIds);

            // Restore drag zone element
            if (isPlaceholder) {
                tmpPlaceholder.replaceWith(dragZoneElem);
                tmpSourceClone.replaceWith(newTargetElem);
            } else {
                tmpSourceClone.remove();
                insertAtElementPosition(dragZoneElem, dragZoneNodes);
            }

            dragZone.elem.classList.remove(measureClass);
            targetDragZone.elem.classList.remove(measureClass);

            // check drop target is already a placeholder
            if (isPlaceholder) {
                // swap drag zone with drop target
                swapWithPlaceholder = true;

                const sourceItem = this.getAnimatedItem(
                    sourceId,
                    sourceIndex,
                    zoneIds,
                    sourceParentId,
                );
                if (!sourceItem) {
                    return;
                }

                const targetItem = this.getAnimatedItem(
                    targetId,
                    targetIndex,
                    zoneIds,
                    targetParentId,
                );
                if (!targetItem) {
                    return;
                }

                sourceItem.targetRect = { ...targetItem.rect };
                targetItem.targetRect = { ...sourceItem.rect };

                animateElems = [sourceItem, targetItem];
            } else if (
                sourceParentId !== targetParentId
                && !dragZoneContainsTarget
            ) {
                /* move between containers */
                animateElems = this.getMovingItems({
                    sourceIndex,
                    sourceZoneId,
                    sourceParentId,
                    targetIndex,
                    targetZoneId,
                    targetParentId,
                });
            } else if (
                props.tree
                && targetContainer
                && targetContainer.parentNode === newTargetElem
                && targetContainer.childElementCount === 0
                && !dragZoneContainsTarget
            ) {
                /* new target element has empty container */
                targetParentId = targetId;
                targetId = null;

                animateElems = this.getMovingItems({
                    sourceIndex,
                    sourceZoneId,
                    sourceParentId,
                    targetIndex,
                    targetZoneId,
                    targetParentId,
                });
            } else if (
                (dragZoneBeforeTarget || dragZoneAfterTarget)
                && !dragZoneContainsTarget
                && !targetContainsDragZone
            ) {
                /* move inside the same container */
                animateElems = this.getMovingItems({
                    sourceIndex,
                    sourceZoneId,
                    sourceParentId,
                    targetIndex,
                    targetZoneId,
                    targetParentId,
                });
            }

            props.onDragMove?.({
                avatar,
                e,
                targetId,
                targetIndex,
                targetZoneId,
                parentId: targetParentId,
                swapWithPlaceholder,
                animateElems,
            });

            avatar.saveSortTarget?.(this);
        },

        getItemsPositions(elem) {
            if (!elem) {
                return null;
            }

            const { ListItem } = props.components;
            const elems = Array.from(elem.querySelectorAll(ListItem?.selector));
            const res = Object.fromEntries(
                elems.map((el) => {
                    const box = getAnimationBox(el);
                    return [box.id, box];
                }),
            );

            return res;
        },

        updatePositions(options) {
            const {
                name = 'boxes',
                zoneIds,
            } = options;

            const dragMaster = DragMaster.getInstance();
            const newBoxes = {};

            const zones = asArray(zoneIds);
            for (let index = 0; index < zones.length; index += 1) {
                const id = zones[index];
                if (id in newBoxes) {
                    continue;
                }

                const dragZone = dragMaster.findDragZoneById(id);
                newBoxes[id] = this.getItemsPositions(dragZone.elem);
                if (!newBoxes[id]) {
                    return;
                }
            }

            const findItemBox = (itemId) => {
                const zoneId = zones.find((id) => newBoxes[id][itemId]);
                return newBoxes[zoneId]?.[itemId] ?? {};
            };

            const getItemBox = (item) => ({
                ...findItemBox(item.id),
                id: item.id,
                ...(
                    (item.items?.length > 0)
                        ? { items: item.items.map(getItemBox) }
                        : {}
                ),
            });

            const useNextItems = (name !== 'boxes');
            const mapZoneBoxes = (zoneId, state) => (
                mapTreeItems(
                    (useNextItems)
                        ? getNextZoneItems(zoneId, state)
                        : getDragZoneItems(zoneId, state),
                    getItemBox,
                )
            );

            setState((prev) => {
                const newState = {
                    ...prev,
                    [name]: {
                        ...(prev[name] ?? {}),
                    },
                };

                Object.keys(newBoxes).forEach((id) => {
                    newState[name][id] = mapZoneBoxes(id, newState);
                });

                return newState;
            });
        },

        /** Updates cache of positions if needed */
        checkPositionsCache(zoneIds) {
            const state = getState();
            if (asArray(zoneIds).every((id) => !!state?.boxes[id])) {
                return;
            }

            this.updatePositions({
                name: 'boxes',
                zoneIds,
            });
        },

        /** Updates target positions */
        getTargetPositions(zoneIds) {
            this.updatePositions({
                name: 'targetBoxes',
                zoneIds,
            });
        },

        getItemElementById(id, elem = this.elem) {
            return elem?.querySelector?.(`[data-id="${id}"]`) ?? null;
        },

        getAnimatedItem(id, index, zoneIds, parentId) {
            const state = getState();
            const itemRects = this.getItemRects(id, zoneIds, state);
            if (!itemRects) {
                return null;
            }

            return {
                id,
                index,
                parentId,
                ...itemRects,
                targetRect: { ...itemRects.rect },
            };
        },

        getItemRects(itemId, zoneIds, state) {
            const rect = getPositionCacheById(itemId, zoneIds, state);
            const targetRect = getTargetPositionById(itemId, zoneIds, state);
            if (!rect || !targetRect) {
                return null;
            }

            let zoneId = null;
            let zoneIndex = 0;
            let item = null;
            const zones = asArray(zoneIds);
            while (!item && zoneIndex < zones.length) {
                zoneId = zones[zoneIndex];
                item = getTreeItemById(itemId, getDragZoneItems(zoneId, state));
                if (!item) {
                    zoneIndex += 1;
                }
            }
            if (!item) {
                return null;
            }

            const itemTarget = item.targetRect;
            const xOffset = item.offset?.x ?? 0;
            const yOffset = item.offset?.y ?? 0;
            const deltaMov = {
                x: (itemTarget) ? (itemTarget.x - rect.x - xOffset) : 0,
                y: (itemTarget) ? (itemTarget.y - rect.y - yOffset) : 0,
            };
            const animationDone = (deltaMov.x === 0 && deltaMov.y === 0);

            return {
                rect,
                targetRect: (
                    (animationDone)
                        ? targetRect
                        : { ...item.targetRect }
                ),
                zoneId,
            };
        },

        getMovingItems(options) {
            const {
                sourceIndex,
                sourceZoneId,
                sourceParentId,
                targetIndex,
                targetZoneId,
                targetParentId,
            } = options;

            if (sourceIndex === -1 || targetIndex === -1) {
                return [];
            }

            const isSameZone = sourceZoneId === targetZoneId;
            const state = getState();
            const res = [];

            const getParentOffset = (itemId, zoneId) => {
                const next = getNextZoneItems(zoneId, state);
                const parent = findTreeItemParentById(next, itemId);
                const parentId = parent?.id ?? null;
                if (parentId === null) {
                    return null;
                }

                const prevParentItem = getTreeItemById(parentId, getDragZoneItems(zoneId, state));

                let parentItem = res.find((item) => item?.id === parentId) ?? null;
                // If parent item was not moved on current event then
                // check offset stored at normal list of items
                if (parentItem === null) {
                    parentItem = prevParentItem;
                }
                if (parentItem === null) {
                    return null;
                }

                const { rect, targetRect } = parentItem;
                if (!rect || !targetRect) {
                    return null;
                }

                const initialOffset = (
                    prevParentItem?.offset ?? parentItem?.initialOffset ?? ({ x: 0, y: 0 })
                );
                const offset = {
                    x: (targetRect.left - rect.left) + initialOffset.x,
                    y: (targetRect.top - rect.top) + initialOffset.y,
                };

                return offset;
            };

            const sourceParent = (sourceParentId === sourceZoneId)
                ? getDragZone(sourceZoneId, state)
                : getTreeItemById(sourceParentId, getNextZoneItems(sourceZoneId, state));
            if (!sourceParent) {
                return [];
            }

            const targetParent = (targetParentId === targetZoneId)
                ? getDragZone(targetZoneId, state)
                : getTreeItemById(targetParentId, getNextZoneItems(targetZoneId, state));
            if (!targetParent) {
                return [];
            }

            const sourceParentItems = sourceParent.next ?? sourceParent.items ?? [];
            const targetParentItems = targetParent.next ?? targetParent.items ?? [];

            const sourceItem = sourceParentItems[sourceIndex];
            const targetItem = targetParentItems[targetIndex];
            if (!sourceItem || !targetItem) {
                return [];
            }

            const zoneIds = [
                sourceZoneId,
                targetZoneId,
                ...getPossibleZoneIds(state),
            ];

            if (isSameZone) {
                const flatSourceItems = toFlatList(getNextZoneItems(sourceZoneId, state));
                const globalSourceIndex = flatSourceItems.findIndex((item) => (
                    item?.id === sourceItem.id
                ));
                const globalTargetIndex = flatSourceItems.findIndex((item) => (
                    item?.id === targetItem.id
                ));

                const firstIndex = Math.min(globalSourceIndex, globalTargetIndex);
                const lastIndex = Math.max(globalSourceIndex, globalTargetIndex);

                for (let index = 0; index < flatSourceItems.length; index += 1) {
                    const item = flatSourceItems[index];
                    if (!item) {
                        return [];
                    }

                    const parent = getParentOffset(item.id, sourceZoneId);
                    if (
                        !parent
                        && (index < firstIndex || index > lastIndex)
                    ) {
                        continue;
                    }

                    const itemRects = this.getItemRects(item.id, zoneIds, state);
                    if (!itemRects) {
                        return [];
                    }

                    let offsetSide;
                    let targetOffsetSide;
                    if (index < firstIndex) {
                        // items before first moving index
                        offsetSide = 1;
                        targetOffsetSide = 0;
                    } else if (index > lastIndex) {
                        // items after last moving index
                        offsetSide = 1;
                        targetOffsetSide = 0;
                    } else {
                        // items between first and last moving index
                        offsetSide = 1;
                        targetOffsetSide = 0;
                    }

                    const { rect, targetRect } = itemRects;

                    if (parent && rect && targetRect) {
                        const { x, y } = parent;

                        rect.x += x * offsetSide;
                        rect.left += x * offsetSide;
                        rect.top += y * offsetSide;
                        rect.y += y * offsetSide;

                        targetRect.x += x * targetOffsetSide;
                        targetRect.left += x * targetOffsetSide;
                        targetRect.top += y * targetOffsetSide;
                        targetRect.y += y * targetOffsetSide;
                    }

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: props.id,
                        parentId: sourceParentId,
                        rect,
                        targetRect,
                    });
                }
            } else {
                const flatSourceItems = toFlatList(getNextZoneItems(sourceZoneId, state));
                const flatTargetItems = toFlatList(getNextZoneItems(targetZoneId, state));
                const globalSourceIndex = flatSourceItems.findIndex((item) => (
                    item?.id === sourceItem.id
                ));
                const globalTargetIndex = flatTargetItems.findIndex((item) => (
                    item?.id === targetItem.id
                ));

                const firstSourceIndex = globalSourceIndex + 1;
                const lastSourceIndex = sourceParentItems.length - 1;
                const firstTargetIndex = globalTargetIndex;
                const lastTargetIndex = targetParentItems.length - 1;

                // Move items at source list up by the size of moving item
                for (let index = firstSourceIndex; index <= lastSourceIndex; index += 1) {
                    const item = sourceParentItems[index];
                    if (!item) {
                        return [];
                    }

                    const itemRects = this.getItemRects(item.id, zoneIds, state);
                    if (!itemRects) {
                        return [];
                    }

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: sourceZoneId,
                        parentId: sourceParentId,
                        ...itemRects,
                    });
                }

                // Add moving item
                const movingId = sourceItem?.id;
                const movingItemRects = this.getItemRects(movingId, zoneIds, state);
                if (!movingItemRects) {
                    return [];
                }

                res.push({
                    id: sourceItem?.id,
                    index: sourceIndex,
                    zoneId: sourceZoneId,
                    parentId: sourceParentId,
                    targetId: targetItem?.id,
                    ...movingItemRects,
                });

                // Move items at target list down by the size of moving item
                for (let index = firstTargetIndex; index <= lastTargetIndex; index += 1) {
                    const item = targetParentItems[index];
                    if (!item) {
                        return [];
                    }

                    const { rect, targetRect } = this.getItemRects(item.id, zoneIds, state);

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: targetZoneId,
                        parentId: targetParentId,
                        rect,
                        targetRect,
                    });
                }
            }

            return res;
        },

        finishDrag() {
            const dragMaster = DragMaster.getInstance();
            const { dragZone } = dragMaster;

            dragZone?.finishDrag?.();
        },

        onDragEnd(params) {
            const { avatar, ...rest } = params;
            if (!targetElem.current || !this.isAceptableAvatar(avatar)) {
                avatar.onDragCancel(rest);
                return;
            }

            this.finishDrag();

            this.hideHoverIndication?.();
            this.applySort(params);

            targetElem.current = null;
        },

        onDragCancel(params) {
            this.finishDrag();

            if (params?.e?.type === 'keydown') {
                this.cancelSort(params);
            } else {
                this.applySort(params);
            }
        },

        onDragLeave() {
            this.hideHoverIndication?.();
            targetElem.current = null;
        },

        showHoverIndication(avatar) {
            props.showHoverIndication?.({ avatar });

            if (
                !targetElem.current
                || !props.hoverClass
            ) {
                return;
            }

            targetElem.current.classList.add(props.hoverClass);
        },

        hideHoverIndication(avatar) {
            props.hideHoverIndication?.({ avatar });

            if (
                !targetElem.current
                || !props.hoverClass
            ) {
                return;
            }

            targetElem.current.classList.remove(props.hoverClass);
        },

        applySort({ avatar, e }) {
            props.onSortEnd?.({ avatar, e });
        },

        cancelSort({ avatar, e }) {
            props.onSortCancel?.({ avatar, e });
        },
    });

    return dropTarget;
}

useSortableDropTarget.propTypes = {
    selector: PropTypes.string,
    tree: PropTypes.bool,
};
