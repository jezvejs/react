import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDragnDrop, useDropTarget } from '../../utils/DragnDrop/index.js';
import {
    findTreeItemIndexById,
    getAnimationBox,
    getDragZone,
    getNextZoneItems,
    getTreeItemById,
    isTreeContains,
} from './helpers.js';

export function useSortableDropTarget(props) {
    const prevTargetElem = useRef(null);
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

            if (!prevTargetElem.current) {
                prevTargetElem.current = dragZoneElem;
            }

            const state = getState();
            if (!state.origSortPos || !state.sortPosition) {
                return;
            }

            const sourceId = state.origSortPos.id ?? null;
            const sourceZoneId = state.sortPosition.zoneId ?? null;
            if (sourceId === null || sourceZoneId === null) {
                return;
            }

            const { containerSelector } = dragZone;
            const targetContainer = newTargetElem.querySelector(containerSelector);

            const targetZoneId = targetDragZone.id;
            let targetId = targetDragZone.itemIdFromElem(newTargetElem);
            const parentElem = targetDragZone.findDragZoneItem(newTargetElem.parentNode);
            const targetParentZone = targetDragZone.itemIdFromElem(parentElem);
            let parentId = targetParentZone ?? targetZoneId;

            const sourceZoneItems = getNextZoneItems(sourceZoneId, state);
            const sourceIndex = findTreeItemIndexById(sourceZoneItems, sourceId);

            const targetZoneItems = getNextZoneItems(targetZoneId, state);
            const targetIndex = findTreeItemIndexById(targetZoneItems, targetId);

            const isSameParent = (
                state.origSortPos.parentId === state.sortPosition.parentId
                && state.origSortPos.zoneId === state.sortPosition.zoneId
            );

            const dragZoneBeforeTarget = isSameParent && sourceIndex < targetIndex;
            const dragZoneAfterTarget = isSameParent && sourceIndex > targetIndex;
            const dragZoneContainsTarget = isTreeContains(sourceId, targetId, sourceZoneItems);
            const targetContainsDragZone = isTreeContains(targetId, sourceId, targetZoneItems);

            const isPlaceholder = newTargetElem.classList.contains(dragZone.getPlaceholder());

            let animateElems = [];
            let swapWithPlaceholder = false;

            // check drop target is already a placeholder
            if (isPlaceholder) {
                // swap drag zone with drop target
                swapWithPlaceholder = true;
            } else if (
                prevTargetElem.current?.parentNode !== newTargetElem.parentNode
                && !dragZoneContainsTarget
            ) {
                // move between containers
            } else if (
                props.tree
                && targetContainer
                && targetContainer.childElementCount === 0
                && !dragZoneContainsTarget
            ) {
                /* new target element has empty container */
                parentId = targetId;
                targetId = null;
            } else if (
                (dragZoneBeforeTarget || dragZoneAfterTarget)
                && !dragZoneContainsTarget
                && !targetContainsDragZone
            ) {
                animateElems = this.getMovingItems(
                    sourceIndex,
                    targetIndex,
                    targetZoneId,
                    parentId,
                );
            }

            if (
                (dragZoneBeforeTarget || dragZoneAfterTarget)
                && !dragZoneContainsTarget
                && !targetContainsDragZone
                && targetId
                && newTargetElem !== prevTargetElem.current
            ) {
                prevTargetElem.current = newTargetElem;
            }

            props.onDragMove?.({
                avatar,
                e,
                targetId,
                targetIndex,
                targetZoneId,
                parentId,
                swapWithPlaceholder,
                animateElems,
            });
        },

        getItemElementById(id) {
            return this.elem?.querySelector?.(`[data-id="${id}"]`) ?? null;
        },

        getMovingItems(sourceIndex, targetIndex, zoneId, parentId) {
            if (sourceIndex === -1 || targetIndex === -1 || !props.animated) {
                return [];
            }

            const sourceAfterTarget = sourceIndex > targetIndex;
            const sourceBeforeTarget = sourceIndex < targetIndex;
            if (!sourceAfterTarget && !sourceBeforeTarget) {
                return [];
            }

            const state = getState();
            const zone = getDragZone(zoneId, state);
            const parent = (parentId === zoneId)
                ? zone
                : getTreeItemById(parentId, zone.next);
            if (!parent) {
                return [];
            }

            const res = [];

            const positionCache = zone.positionCache ?? {};

            const parentItems = parent.next ?? parent.items ?? [];
            const firstIndex = Math.min(sourceIndex, targetIndex);
            const lastIndex = Math.max(sourceIndex, targetIndex);
            for (let index = firstIndex; index <= lastIndex; index += 1) {
                const item = parentItems[index];
                const elem = this.getItemElementById(item?.id);
                if (!elem) {
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
                const siblingElem = this.getItemElementById(sibling?.id);

                if (!positionCache[index]) {
                    positionCache[index] = getAnimationBox(elem);
                }
                if (!positionCache[siblingIndex]) {
                    positionCache[siblingIndex] = getAnimationBox(siblingElem);
                }

                res.push({
                    id: elem.dataset.id,
                    index,
                    zoneId: props.id,
                    targetId: siblingElem.dataset.id,
                    rect: positionCache[index],
                    targetRect: positionCache[siblingIndex],
                });
            }

            setState((prev) => ({
                ...prev,
                [zoneId]: {
                    ...prev[zoneId],
                    positionCache,
                },
            }));

            return res;
        },

        finishDrag() {
            const dragMaster = DragMaster.getInstance();
            const { dragZone } = dragMaster;

            prevTargetElem.current = null;

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
