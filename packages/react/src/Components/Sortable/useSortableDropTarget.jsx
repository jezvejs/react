import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDragnDrop, useDropTarget } from '../../utils/DragnDrop/index.js';
import {
    findTreeItemIndexById,
    getAnimationBox,
    getDragZone,
    getNextZoneItems,
    getPositionsCache,
    getTreeItemById,
    isTreeContains,
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

            const { containerSelector } = dragZone;
            const targetContainer = newTargetElem.querySelector(containerSelector);

            const targetZoneId = targetDragZone.id;
            let targetId = targetDragZone.itemIdFromElem(newTargetElem);
            const parentElem = targetDragZone.findDragZoneItem(newTargetElem.parentNode);
            const targetParentZone = targetDragZone.itemIdFromElem(parentElem);
            let targetParentId = targetParentZone ?? targetZoneId;

            const sourceZoneItems = getNextZoneItems(sourceZoneId, state);
            const sourceIndex = findTreeItemIndexById(sourceZoneItems, sourceId);

            const targetZoneItems = getNextZoneItems(targetZoneId, state);
            const targetIndex = findTreeItemIndexById(targetZoneItems, targetId);
            if (targetIndex === -1) {
                return;
            }

            const isSameParent = (
                targetParentId === state.sortPosition.parentId
                && targetZoneId === state.sortPosition.zoneId
            );

            const dragZoneBeforeTarget = isSameParent && sourceIndex < targetIndex;
            const dragZoneAfterTarget = isSameParent && sourceIndex > targetIndex;
            const dragZoneContainsTarget = isTreeContains(sourceId, targetId, sourceZoneItems);
            const targetContainsDragZone = isTreeContains(targetId, sourceId, targetZoneItems);

            const isPlaceholder = newTargetElem.classList.contains(dragZone.getPlaceholder());

            let animateElems = [];
            let swapWithPlaceholder = false;

            this.checkPositionsCache(sourceZoneId, dragZoneElem.parentNode);
            this.checkPositionsCache(targetZoneId, newTargetElem.parentNode);

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
                sourceZoneId !== targetZoneId
                && !dragZoneContainsTarget
            ) {
                // move between containers
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
                && targetContainer.childElementCount === 0
                && !dragZoneContainsTarget
            ) {
                /* new target element has empty container */
                targetParentId = targetId;
                targetId = null;
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

        checkPositionsCache(zoneId, elem) {
            if (!elem) {
                return;
            }
            const state = getState();
            if (state?.boxes[zoneId]) {
                return;
            }

            const { ListItem } = props.components;
            const elems = Array.from(elem.querySelectorAll(ListItem?.selector));
            const boxes = elems.map((el) => getAnimationBox(el));

            setState((prev) => ({
                ...prev,
                boxes: {
                    ...(prev.boxes ?? {}),
                    [zoneId]: boxes,
                },
            }));
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

            const sourceAfterTarget = sourceIndex > targetIndex;
            const sourceBeforeTarget = sourceIndex < targetIndex;
            const isSameParent = (
                sourceZoneId === targetZoneId
                && sourceParentId === targetParentId
            );

            if (isSameParent && !sourceAfterTarget && !sourceBeforeTarget) {
                return [];
            }

            const state = getState();
            const res = [];

            if (isSameParent) {
                const zone = getDragZone(sourceZoneId, state);
                const parent = (sourceParentId === sourceZoneId)
                    ? zone
                    : getTreeItemById(sourceParentId, getNextZoneItems(sourceZoneId, state));
                if (!parent) {
                    return [];
                }

                const positionCache = getPositionsCache(sourceZoneId, state);

                const parentItems = parent.next ?? parent.items ?? [];
                const firstIndex = Math.min(sourceIndex, targetIndex);
                const lastIndex = Math.max(sourceIndex, targetIndex);

                for (let index = firstIndex; index <= lastIndex; index += 1) {
                    const item = parentItems[index];
                    if (!item) {
                        return [];
                    }

                    let siblingIndex;
                    if (index === sourceIndex) {
                        siblingIndex = targetIndex;
                    } else {
                        siblingIndex = (sourceBeforeTarget)
                            ? (index - 1)
                            : (index + 1);
                    }
                    const sibling = parentItems[siblingIndex];

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: props.id,
                        parentId: sourceParentId,
                        targetId: sibling?.id,
                        rect: positionCache[index],
                        targetRect: positionCache[siblingIndex],
                    });
                }
            } else {
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

                const sourcePositionCache = getPositionsCache(sourceZoneId, state);
                const targetPositionCache = getPositionsCache(targetZoneId, state);
                const sourceParentItems = sourceParent.next ?? sourceParent.items ?? [];
                const targetParentItems = targetParent.next ?? targetParent.items ?? [];

                const firstSourceIndex = sourceIndex + 1;
                const lastSourceIndex = sourceParentItems.length - 1;
                const firstTargetIndex = targetIndex;
                const lastTargetIndex = targetParentItems.length - 1;

                // Move items at source list up by the size of moving item
                for (let index = firstSourceIndex; index <= lastSourceIndex; index += 1) {
                    const item = sourceParentItems[index];
                    if (!item) {
                        return [];
                    }

                    const siblingIndex = index - 1;
                    const sibling = sourceParentItems[siblingIndex];

                    res.push({
                        id: item?.id,
                        index,
                        zoneId: sourceZoneId,
                        parentId: sourceParentId,
                        targetId: sibling?.id,
                        rect: sourcePositionCache[index],
                        targetRect: sourcePositionCache[siblingIndex],
                    });
                }

                // Add moving item
                const sourceItem = sourceParentItems[sourceIndex];
                const targetItem = targetParentItems[targetIndex];
                res.push({
                    id: sourceItem?.id,
                    index: sourceIndex,
                    zoneId: sourceZoneId,
                    parentId: sourceParentId,
                    targetId: targetItem?.id,
                    rect: sourcePositionCache[sourceIndex],
                    targetRect: sourcePositionCache[sourceIndex],
                });

                // Move items at target list down by the size of moving item
                for (let target = firstTargetIndex; target <= lastTargetIndex; target += 1) {
                    const item = targetParentItems[target];
                    if (!item) {
                        return [];
                    }

                    const siblingIndex = target + 1;
                    const sibling = targetParentItems[siblingIndex];

                    res.push({
                        id: item?.id,
                        index: target,
                        zoneId: targetZoneId,
                        parentId: targetParentId,
                        targetId: sibling?.id,
                        rect: targetPositionCache[target],
                        targetRect: targetPositionCache[siblingIndex],
                    });
                }
            }

            return res;
        },

        finishDrag() {
            const dragMaster = DragMaster.getInstance();
            const { dragZone } = dragMaster;

            dragZone.finishDrag();
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
};
