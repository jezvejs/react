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
    getPositionsCache,
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

            const dragMaster = DragMaster.getInstance();
            const { dragZone } = dragMaster;
            const dragZoneElem = dragZone.getDragItemElement();
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

            const sourceDragZone = dragMaster.findDragZoneById(sourceZoneId);
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

            this.checkPositionsCache(
                sourceZoneId,
                sourceDragZone.elem,
                targetZoneId,
                targetDragZone.elem,
            );

            const dragZoneNodes = {
                parent: dragZoneElem.parentNode,
                prev: dragZoneElem.previousSibling,
                next: dragZoneElem.nextSibling,
            };

            const measureClass = 'sortable-measure';
            dragZone.elem.classList.add(measureClass);
            targetDragZone.elem.classList.add(measureClass);

            // Temporarily append item to the target container to save position of
            // item next after current last item
            const tmpTargetPlaceholder = dragZoneElem.cloneNode(true);

            dragZoneElem.remove();

            const isTargetDragZoneRoot = targetDragZone.elem === newTargetElem;

            if (
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
                            parentItem.after(tmpTargetPlaceholder);
                        } else if (e.clientY <= rect.top) {
                            parentItem.before(tmpTargetPlaceholder);
                        }
                    }
                } else if (!isTargetDragZoneRoot) {
                    if (props.tree && targetIsContainer) {
                        if (newTargetElem.childElementCount === 0) {
                            newTargetElem.append(tmpTargetPlaceholder);
                        }
                    } else if (dragZoneBeforeTarget) {
                        newTargetElem.after(tmpTargetPlaceholder);
                    } else {
                        newTargetElem.before(tmpTargetPlaceholder);
                    }
                }
            } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
                newTargetElem.after(tmpTargetPlaceholder);
            } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
                newTargetElem.before(tmpTargetPlaceholder);
            }

            this.getTargetPositions(
                sourceZoneId,
                sourceDragZone.elem,
                targetZoneId,
                targetDragZone.elem,
            );

            tmpTargetPlaceholder.remove();
            // Restore drag zone element
            if (dragZoneNodes.prev) {
                dragZoneNodes.prev.after(dragZoneElem);
            } else if (dragZoneNodes.next) {
                dragZoneNodes.next.before(dragZoneElem);
            } else {
                dragZoneNodes.parent?.append(dragZoneElem);
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
                    sourceZoneId,
                    sourceParentId,
                );
                if (!sourceItem) {
                    return;
                }

                const targetItem = this.getAnimatedItem(
                    targetId,
                    targetIndex,
                    targetZoneId,
                    targetParentId,
                );
                if (!targetItem) {
                    return;
                }

                sourceItem.targetRect = targetItem.rect;
                targetItem.targetRect = sourceItem.rect;

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
                sourceZoneId,
                sourceZoneElem,
                targetZoneId,
                targetZoneElem,
            } = options;

            const sourceBoxes = this.getItemsPositions(sourceZoneElem);
            const targetBoxes = (sourceZoneId !== targetZoneId)
                ? this.getItemsPositions(targetZoneElem)
                : sourceBoxes;
            if (!sourceBoxes || !targetBoxes) {
                return;
            }

            const getItemBox = (item) => ({
                ...(sourceBoxes[item.id] ?? targetBoxes[item.id] ?? {}),
                id: item.id,
                ...(
                    (item.items?.length > 0)
                        ? { items: item.items.map(getItemBox) }
                        : {}
                ),
            });

            const mapZoneBoxes = (zoneId, state) => (
                mapTreeItems(
                    state[zoneId]?.next ?? state[zoneId]?.items ?? [],
                    getItemBox,
                )
            );

            setState((prev) => {
                const newState = {
                    ...prev,
                    [name]: {
                        ...(prev[name] ?? {}),
                        [sourceZoneId]: mapZoneBoxes(sourceZoneId, prev),
                    },
                };

                if (sourceZoneId !== targetZoneId) {
                    newState[name][targetZoneId] = mapZoneBoxes(targetZoneId, newState);
                }

                return newState;
            });
        },

        /** Updates cache of positions if needed */
        checkPositionsCache(sourceZoneId, sourceZoneElem, targetZoneId, targetZoneElem) {
            const state = getState();
            if (state?.boxes[sourceZoneId] && state?.boxes[targetZoneId]) {
                return;
            }

            this.updatePositions({
                name: 'boxes',
                sourceZoneId,
                sourceZoneElem,
                targetZoneId,
                targetZoneElem,
            });
        },

        /** Updates target positions */
        getTargetPositions(sourceZoneId, sourceZoneElem, targetZoneId, targetZoneElem) {
            this.updatePositions({
                name: 'targetBoxes',
                sourceZoneId,
                sourceZoneElem,
                targetZoneId,
                targetZoneElem,
            });
        },

        getItemElementById(id) {
            return this.elem?.querySelector?.(`[data-id="${id}"]`) ?? null;
        },

        getAnimatedItem(id, index, zoneId, parentId) {
            if (
                ((id ?? null) === null)
                || index === -1
                || ((zoneId ?? null) === null)
            ) {
                return null;
            }

            const state = getState();
            const positionCache = getPositionsCache(zoneId, state);

            return {
                id,
                index,
                zoneId: props.id,
                parentId,
                rect: positionCache[index],
                targetRect: positionCache[index],
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

        getMovingItems({
            sourceIndex,
            sourceZoneId,
            sourceParentId,
            targetIndex,
            targetZoneId,
            targetParentId,
        }) {
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

                    const zoneIds = [sourceZoneId, state.origSortPos.zoneId];
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
                const zoneIds = [sourceZoneId, targetZoneId, state.origSortPos.zoneId];

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
