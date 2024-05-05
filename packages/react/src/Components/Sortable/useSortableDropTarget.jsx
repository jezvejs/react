import { comparePosition } from '@jezvejs/dom';
import { isFunction } from '@jezvejs/types';
import { useRef } from 'react';
import PropTypes from 'prop-types';

import { DragMaster, useDropTarget } from '../../utils/DragnDrop/index.js';
import { hasFlag } from '../../utils/common.js';

export function useSortableDropTarget(props) {
    const targetElem = useRef(null);

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

        onDragMove(avatar, e) {
            const newTargetElem = this.getTargetElem(avatar, e);
            if (targetElem.current === newTargetElem) {
                return;
            }

            this.hideHoverIndication?.(avatar);
            targetElem.current = newTargetElem;
            this.showHoverIndication?.(avatar);

            const dragMaster = DragMaster.getInstance();
            const { dragZone } = dragMaster;
            const dragZoneElem = dragZone.getDragItemElement();
            const currentGroup = dragZone.getGroup(dragZoneElem);

            const targetDragZone = dragMaster.findDragZone(targetElem.current);
            const targetItemElem = targetDragZone?.findDragZoneItem(targetElem.current);
            const targetGroup = targetDragZone?.getGroup(targetItemElem);

            if (
                !targetElem.current
                || !this.isAceptableAvatar(avatar)
                || (targetGroup !== currentGroup)
            ) {
                return;
            }

            const nodeCmp = comparePosition(targetElem.current, dragZoneElem);
            if (!nodeCmp) {
                return;
            }

            const dragZoneContainsTarget = hasFlag(nodeCmp, 8);
            const { containerSelector } = dragZone;
            const targetContainer = targetElem.current.querySelector(containerSelector);

            let targetId = targetDragZone.itemIdFromElem(targetElem.current);
            const parentElem = targetDragZone.findDragZoneItem(targetElem.current.parentNode);
            const targetParentZone = targetDragZone.itemIdFromElem(parentElem);
            let parentId = targetParentZone ?? targetDragZone.id;

            // check drop target is already a placeholder
            if (targetElem.current.classList.contains(dragZone.getPlaceholder())) {
                // swap drag zone with drop target
            } else if (
                dragZoneElem.parentNode !== targetElem.current.parentNode
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
            }

            props.onDragMove?.({
                avatar,
                e,
                targetId,
                targetZoneId: targetDragZone.id,
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
