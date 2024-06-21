import { comparePosition } from '@jezvejs/dom';
import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDragnDrop, useDropTarget } from '../../utils/DragnDrop/index.js';
import { hasFlag } from '../../utils/common.js';

export function useSortableDropTarget(props) {
    const targetElem = useRef(null);

    const { getState } = useDragnDrop();

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
            if (!newTargetElem || targetElem.current === newTargetElem) {
                return;
            }

            this.applyNewTarget(avatar, newTargetElem);

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

            const nodeCmp = comparePosition(newTargetElem, dragZoneElem);
            if (!nodeCmp) {
                return;
            }

            const dragZoneBeforeTarget = hasFlag(nodeCmp, 2);
            const dragZoneAfterTarget = hasFlag(nodeCmp, 4);
            const dragZoneContainsTarget = hasFlag(nodeCmp, 8);
            const { containerSelector } = dragZone;
            const targetContainer = newTargetElem.querySelector(containerSelector);

            const targetZoneId = targetDragZone.id;
            let targetId = targetDragZone.itemIdFromElem(newTargetElem);
            const parentElem = targetDragZone.findDragZoneItem(newTargetElem.parentNode);
            const targetParentZone = targetDragZone.itemIdFromElem(parentElem);
            let parentId = targetParentZone ?? targetZoneId;

            // check drop target is already a placeholder
            if (newTargetElem.classList.contains(dragZone.getPlaceholder())) {
                // swap drag zone with drop target
            } else if (
                dragZoneElem.parentNode !== newTargetElem.parentNode
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
            } else if (dragZoneBeforeTarget && !dragZoneContainsTarget) {
                /* drag zone element is before new drop target */
            } else if (dragZoneAfterTarget && !dragZoneContainsTarget) {
                /* drag zone element is after new drop target */
            }

            // Skip move item to parent container without target item
            // if current target item is already at this container
            const state = getState();
            if (
                targetId === null
                && state.targetId !== null
                && parentId === state.sortPosition.parentId
                && targetZoneId === state.sortPosition.parentZoneId
            ) {
                return;
            }

            props.onDragMove?.({
                avatar,
                e,
                targetId,
                targetZoneId,
                parentId,
            });
        },

        onDragEnd(params) {
            const { avatar, ...rest } = params;
            if (!targetElem.current || !this.isAceptableAvatar(avatar)) {
                avatar.onDragCancel(rest);
                return;
            }

            this.hideHoverIndication?.();

            this.applySort(params);

            targetElem.current = null;
        },

        onDragCancel(params) {
            if (params?.e?.type === 'keydown') {
                this.cancelSort(params);
            } else {
                this.applySort(params);
            }
        },

        showHoverIndication(avatar) {
            props.showHoverIndication?.({
                avatar,
            });

            if (
                !targetElem.current
                || !props.hoverClass
            ) {
                return;
            }

            targetElem.current.classList.add(props.hoverClass);
        },

        hideHoverIndication(avatar) {
            props.hideHoverIndication?.({
                avatar,
            });

            if (
                !targetElem.current
                || !props.hoverClass
            ) {
                return;
            }

            targetElem.current.classList.remove(props.hoverClass);
        },

        applySort({ avatar, e }) {
            avatar.onDragEnd?.();

            props.onSortEnd?.({
                avatar,
                e,
            });
        },

        cancelSort({ avatar, e }) {
            const avatarInfo = avatar.getDragInfo(e);
            avatar.onDragEnd();

            const { initialPos, dragZoneElem } = avatarInfo;
            if (initialPos.prev) {
                initialPos.prev.after(dragZoneElem);
            } else {
                initialPos.next.before(dragZoneElem);
            }
        },
    });

    return dropTarget;
}

useSortableDropTarget.propTypes = {
    selector: PropTypes.string,
};
