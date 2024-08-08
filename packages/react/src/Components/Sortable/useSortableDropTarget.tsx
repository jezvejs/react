import { asArray, isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDragnDrop, useDropTarget } from '../../utils/DragnDrop/index.ts';
import {
    distinctValues,
    findTreeItemIndexById,
    findTreeItemParentById,
    getAnimationBox,
    getDragZone,
    getDragZoneItems,
    getElementPosition,
    getNextZoneItems,
    getPositionCacheById,
    getPossibleZoneIds,
    getSourceDragZone,
    getTargetPositionById,
    getTreeItemById,
    insertAtElementPosition,
    isTreeContains,
    mapTreeItems,
    toFlatList,
    toggleMeasureMode,
} from './helpers.ts';

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
            const ownerDocument = el?.ownerDocument ?? null;

            while (el && el !== ownerDocument) {
                if (
                    el === dragZone?.elem
                    || el.matches?.(selector)
                    || el.matches?.(containerSelector)
                    || el.classList?.contains(placeholderClass)
                ) {
                    return el;
                }

                el = el.parentNode;
            }

            return null;
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
            const dragMaster = DragMaster.getInstance();
            if (!dragMaster) {
                return;
            }

            const newTargetElem = this.getTargetElem(avatar, e);
            if (targetElem.current === newTargetElem) {
                return;
            }

            this.applyNewTarget(avatar, newTargetElem);
            if (!newTargetElem) {
                return;
            }

            const state = getState();

            const sourceId = state.origSortPos?.id ?? null;
            const sourceZoneId = state.sortPosition?.zoneId ?? null;
            const sourceParentId = state.sortPosition?.parentId ?? null;
            if (sourceId === null || sourceZoneId === null || sourceParentId === null) {
                return;
            }

            const dragZone = getSourceDragZone(state);
            const dragZoneElem = this.getItemElementById(sourceId, dragZone.elem);
            if (!dragZoneElem) {
                return;
            }

            // Skip handling target if it is the same as source
            if (dragZoneElem === newTargetElem) {
                return;
            }
            // Check avatar is acceptable
            if (!this.isAceptableAvatar(avatar)) {
                return;
            }

            const targetDragZone = dragMaster.findDragZone(newTargetElem);
            const targetItemElem = targetDragZone?.findDragZoneItem(newTargetElem);

            // Check target item has the same group as source
            const currentGroup = dragZone.getGroup(dragZoneElem);
            const targetGroup = targetDragZone?.getGroup(targetItemElem);
            if (targetGroup !== currentGroup) {
                return;
            }

            const { containerSelector } = dragZone;
            const targetContainer = newTargetElem.querySelector(containerSelector);

            const origSourceZoneItems = getDragZoneItems(sourceZoneId, state);

            const sourceZoneItems = getNextZoneItems(sourceZoneId, state);
            const flatSourceItems = toFlatList(sourceZoneItems);
            const flatSourceIndex = flatSourceItems.findIndex((item) => item?.id === sourceId);
            const sourceIndex = findTreeItemIndexById(sourceZoneItems, sourceId);

            const targetZoneId = targetDragZone?.id ?? null;
            const targetZoneItems = getNextZoneItems(targetZoneId, state);
            const targetId = targetDragZone.itemIdFromElem(newTargetElem);

            const targetParent = findTreeItemParentById(targetZoneItems, targetId);
            const targetParentId = targetParent?.id ?? targetZoneId;

            const flatTargetItems = toFlatList(targetZoneItems);
            const flatTargetIndex = flatTargetItems.findIndex((item) => item?.id === targetId);
            const targetItem = flatTargetItems[flatTargetIndex];

            if (targetId === targetParentId && targetParentId === sourceParentId) {
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
            const dragZoneBeforeTarget = (
                isSameZone
                && (flatTargetIndex !== -1)
                && (flatSourceIndex < flatTargetIndex)
            );
            const dragZoneAfterTarget = (
                isSameZone
                && (flatTargetIndex !== -1)
                && (flatSourceIndex > flatTargetIndex)
            );
            const dragZoneContainsTarget = isTreeContains(sourceId, targetId, sourceZoneItems);
            const targetContainsDragZone = (targetId)
                ? isTreeContains(targetId, sourceId, targetZoneItems)
                : !!getTreeItemById(sourceId, targetZoneItems);

            const origSourceContainsDragZone = (targetId)
                ? isTreeContains(targetId, sourceId, origSourceZoneItems)
                : !!getTreeItemById(sourceId, origSourceZoneItems);

            const allowChildren = !!props.tree;

            const moveInfo = {
                sourceId,
                sourceIndex,
                sourceZoneId,
                sourceParentId,
                targetId,
                targetIndex,
                targetZoneId,
                targetParentId,
                dragZoneBeforeTarget,
                dragZoneAfterTarget,
                dragZoneContainsTarget,
                targetContainsDragZone,
                origSourceContainsDragZone,
            };

            if (dragZoneBeforeTarget && !dragZoneContainsTarget && !isSameParent) {
                targetIndex += 1;
            }

            const placeholderClass = dragZone.getPlaceholder();
            const isPlaceholder = newTargetElem.classList.contains(placeholderClass);

            const dragZoneNodes = getElementPosition(dragZoneElem);

            const isMoveBetweenContainers = (
                (
                    (sourceParentId !== targetParentId)
                    || (dragZoneNodes.parent !== newTargetElem.parentNode)
                )
                && !dragZoneContainsTarget
            );

            const isSameTreeContainer = (
                props.tree
                && allowChildren
                && targetContainer
                && (targetContainer.parentNode === newTargetElem)
                && targetItem
                && ((targetItem.items?.length ?? 0) === 0)
                && !dragZoneContainsTarget
            );

            // Skip placeholder of the source item
            if (isPlaceholder && sourceId === targetId) {
                return;
            }

            const targetIsContainer = newTargetElem.matches(containerSelector);
            const isTargetDragZoneRoot = targetDragZone.elem === newTargetElem;

            const checkParentRect = (
                sourceParentId !== targetParentId
                && !dragZoneContainsTarget
                && props.tree
                && targetContainsDragZone
                && (isTargetDragZoneRoot || targetIsContainer)
            );
            let moveAfterParent = false;
            let moveBeforeParent = false;

            const parentItemRect = (
                checkParentRect
                && getTargetPositionById(sourceParentId, sourceZoneId, state)
            );
            const parentItem = (
                checkParentRect
                && this.getItemElementById(sourceParentId, dragZone.elem)
            );

            let animateElems = [];
            let swapWithPlaceholder = false;

            const zoneIds = distinctValues([
                sourceZoneId,
                targetZoneId,
                ...getPossibleZoneIds(state),
            ]);

            this.checkPositionsCache(zoneIds);

            toggleMeasureMode(dragZone.elem, true);
            toggleMeasureMode(targetDragZone.elem, true);

            // Temporarily append item to the target container to save position of
            // item next after current last item
            const tmpSourceClone = dragZoneElem.cloneNode(true);
            let tmpPlaceholder = null;
            let skipMeasure = false;

            if (!isPlaceholder) {
                dragZoneElem.remove();
            }

            if (isPlaceholder) {
                tmpPlaceholder = newTargetElem.cloneNode(true);
                dragZoneElem.replaceWith(tmpPlaceholder);
                newTargetElem.replaceWith(tmpSourceClone);
            } else if (isMoveBetweenContainers) {
                /* move between different containers */
                if (isTargetDragZoneRoot && !targetContainsDragZone) {
                    newTargetElem.append(tmpSourceClone);
                } else if (
                    props.tree
                    && targetContainsDragZone
                    && (isTargetDragZoneRoot || targetIsContainer)
                ) {
                    const clientCoords = DragMaster.getEventClientCoordinates(e);
                    if (parentItemRect && clientCoords.y >= parentItemRect.bottom) {
                        parentItem.after(tmpSourceClone);
                        moveAfterParent = true;
                    } else if (parentItemRect && clientCoords.y <= parentItemRect.top) {
                        parentItem.before(tmpSourceClone);
                        moveBeforeParent = true;
                    } else {
                        skipMeasure = true;
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
                } else {
                    skipMeasure = true;
                }
            } else if (isSameTreeContainer) {
                targetContainer.append(tmpSourceClone);
            } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
                newTargetElem.after(tmpSourceClone);
            } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
                newTargetElem.before(tmpSourceClone);
            } else {
                skipMeasure = true;
            }

            if (!skipMeasure) {
                this.getTargetPositions(zoneIds);
            }

            // Restore drag zone element
            if (isPlaceholder) {
                tmpPlaceholder.replaceWith(dragZoneElem);
                tmpSourceClone.replaceWith(newTargetElem);
            } else {
                tmpSourceClone.remove();
                insertAtElementPosition(dragZoneElem, dragZoneNodes);
            }

            toggleMeasureMode(dragZone.elem, false);
            toggleMeasureMode(targetDragZone.elem, false);

            // check drop target is already a placeholder
            if (isPlaceholder) {
                // swap drag zone with drop target
                swapWithPlaceholder = true;

                const source = this.getAnimatedItem(
                    moveInfo.sourceId,
                    moveInfo.sourceIndex,
                    zoneIds,
                    moveInfo.sourceParentId,
                );
                if (!source) {
                    return;
                }

                const target = this.getAnimatedItem(
                    moveInfo.targetId,
                    moveInfo.targetIndex,
                    zoneIds,
                    moveInfo.targetParentId,
                );
                if (!target) {
                    return;
                }

                source.targetRect = structuredClone(target.rect);
                target.targetRect = structuredClone(source.rect);

                animateElems = [source, target];
            } else if (isMoveBetweenContainers) {
                /* move between containers */
                const parentIndex = findTreeItemIndexById(sourceZoneItems, sourceParentId);
                if (moveAfterParent) {
                    moveInfo.targetIndex = parentIndex + 1;
                } else if (moveBeforeParent) {
                    moveInfo.targetIndex = parentIndex;
                }

                if (!skipMeasure) {
                    animateElems = this.getMovingItems(moveInfo);
                }
            } else if (isSameTreeContainer) {
                /* new target element has empty container */
                moveInfo.targetParentId = targetId;
                moveInfo.targetId = null;
                moveInfo.targetIndex = 0;

                animateElems = this.getMovingItems(moveInfo);
            } else if (
                (dragZoneBeforeTarget || dragZoneAfterTarget)
                && !dragZoneContainsTarget
            ) {
                /* move inside the same container */
                animateElems = this.getMovingItems(moveInfo);
            } else {
                skipMeasure = true;
            }

            if (!skipMeasure) {
                props.onDragMove?.({
                    avatar,
                    e,
                    targetId: moveInfo.targetId,
                    targetIndex: moveInfo.targetIndex,
                    targetZoneId: moveInfo.targetZoneId,
                    parentId: moveInfo.targetParentId,
                    swapWithPlaceholder,
                    animateElems,
                });

                avatar.saveSortTarget?.(this);
            }
        },

        getItemsPositions(dragZone) {
            if (!dragZone?.elem) {
                return null;
            }
            const { containerSelector } = dragZone;
            const { ListItem } = props.components;

            const elems = Array.from(dragZone.elem.querySelectorAll(ListItem?.selector));
            const res = Object.fromEntries(
                elems.map((el) => {
                    const box = getAnimationBox(el);

                    const container = el?.querySelector(containerSelector);
                    if (container) {
                        box.childContainer = getAnimationBox(container);
                    }

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
                newBoxes[id] = this.getItemsPositions(dragZone);
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

            const isValidTargetRect = (
                targetRect
                && Number.isFinite(targetRect.x)
                && Number.isFinite(targetRect.y)
                && Number.isFinite(targetRect.width)
                && Number.isFinite(targetRect.height)
                && (
                    (targetRect.x !== 0)
                    || (targetRect.y !== 0)
                    || (targetRect.width !== 0)
                    || (targetRect.height !== 0)
                )
            );

            const resTargetRect = (animationDone && isValidTargetRect)
                ? targetRect
                : itemTarget;

            const res = {
                rect,
                targetRect: structuredClone(resTargetRect),
                zoneId,
            };

            return res;
        },

        getMovingItems(options) {
            const {
                sourceIndex,
                sourceZoneId,
                sourceParentId,
                targetIndex,
                targetZoneId,
                targetParentId,
                dragZoneAfterTarget,
                dragZoneBeforeTarget,
                targetContainsDragZone,
                origSourceContainsDragZone,
            } = options;

            if (sourceIndex === -1 || targetIndex === -1) {
                return [];
            }

            const isSameZone = sourceZoneId === targetZoneId;
            const state = getState();
            const res = [];

            const getIndexById = (id, items) => (
                asArray(items).findIndex((item) => (item?.id === id))
            );

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
                    id: parentId,
                    x: (targetRect.left - rect.left) + initialOffset.x,
                    y: (targetRect.top - rect.top) + initialOffset.y,
                };

                return offset;
            };

            const getRecursiveParentOffset = (itemId, zoneId) => {
                let currentItemId = itemId;
                let parentOffset = null;

                while (currentItemId) {
                    const offset = getParentOffset(currentItemId, zoneId);
                    if (!offset) {
                        break;
                    }

                    if (!parentOffset) {
                        parentOffset = {
                            x: 0,
                            y: 0,
                        };
                    }

                    parentOffset.x += offset.x;
                    parentOffset.y += offset.y;
                    currentItemId = offset.id;
                }

                return parentOffset;
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
            const targetItem = targetParentItems[
                Math.min(targetParentItems.length - 1, targetIndex)
            ];
            if (
                !sourceItem
                || (
                    !targetItem
                    && targetParentItems.length > 0
                )
            ) {
                return [];
            }

            const zoneIds = distinctValues([
                sourceZoneId,
                targetZoneId,
                ...getPossibleZoneIds(state),
            ]);

            if (isSameZone) {
                const nextSourceItems = getNextZoneItems(sourceZoneId, state);
                const flatSourceItems = toFlatList(nextSourceItems);

                const globalSourceIndex = getIndexById(sourceItem.id, flatSourceItems);

                const globalTargetItemId = (!targetItem && targetParentItems.length === 0)
                    ? targetParent.id
                    : targetItem.id;
                const globalTargetIndex = getIndexById(globalTargetItemId, flatSourceItems);

                let rootParentId = sourceParentId;
                let parentItem;
                do {
                    parentItem = findTreeItemParentById(nextSourceItems, rootParentId);
                    if (!parentItem?.id) {
                        break;
                    }

                    rootParentId = parentItem?.id;
                } while (parentItem);

                const firstSiblingIndex = getIndexById(rootParentId, flatSourceItems);

                const lastSibling = (sourceParentId === sourceZoneId)
                    ? targetItem
                    : targetParentItems[targetParentItems.length - 1];
                const lastSiblingIndex = (lastSibling)
                    ? getIndexById(lastSibling.id, flatSourceItems)
                    : -1;

                const firstBaseIndex = Math.min(globalSourceIndex, globalTargetIndex);
                const lastBaseIndex = Math.max(globalSourceIndex, globalTargetIndex);

                const indexes = [firstBaseIndex, lastBaseIndex];
                if (firstSiblingIndex !== -1) {
                    indexes.push(firstSiblingIndex);
                }
                if (lastSiblingIndex !== -1) {
                    indexes.push(lastSiblingIndex);
                }
                const firstIndex = Math.min(...indexes);
                const lastIndex = Math.max(...indexes);

                for (let index = 0; index < flatSourceItems.length; index += 1) {
                    const item = flatSourceItems[index];
                    if (!item) {
                        return [];
                    }

                    const parent = getParentOffset(item.id, sourceZoneId);
                    const recursiveParent = getRecursiveParentOffset(item.id, sourceZoneId);
                    const parentIndex = getIndexById(parent?.id, flatSourceItems);
                    if (
                        (parent && (parentIndex < firstIndex || parentIndex > lastIndex))
                        || (!parent && (index < firstIndex || index > lastIndex))
                    ) {
                        continue;
                    }

                    const itemRects = this.getItemRects(item.id, zoneIds, state);
                    if (!itemRects) {
                        return [];
                    }

                    let offsetSide = 0;
                    if (index < firstIndex) {
                        // items before first moving index
                        offsetSide = 1;
                    } else if (index >= firstIndex && index < firstBaseIndex) {
                        offsetSide = 1;
                    } else if (
                        index >= firstBaseIndex
                        && index <= lastBaseIndex
                        && index !== globalSourceIndex
                    ) {
                        offsetSide = 1;
                    } else if (index > lastBaseIndex && index <= lastIndex) {
                        // items after last moving index
                        offsetSide = 1;
                    } else if (index > lastIndex) {
                        // offsetSide = 1;
                    } else if (index === globalSourceIndex && dragZoneBeforeTarget) {
                        offsetSide = 1;
                    } else if (
                        index === globalSourceIndex
                        && dragZoneAfterTarget
                        && !targetContainsDragZone
                    ) {
                        offsetSide = 1;
                    } else if (
                        index === globalSourceIndex
                        && dragZoneAfterTarget
                        && targetContainsDragZone
                        && origSourceContainsDragZone
                    ) {
                        offsetSide = 1;
                    }

                    const { rect, targetRect } = itemRects;
                    if (parent && rect && targetRect) {
                        const { x, y } = recursiveParent;

                        rect.x += x * offsetSide;
                        rect.left = rect.x;
                        rect.y += y * offsetSide;
                        rect.top = rect.y;
                    }

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: props.id,
                        parentId: sourceParentId,
                        rect,
                        targetRect,
                        parent,
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
