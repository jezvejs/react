import { getOffset } from '@jezvejs/dom';
import { useRef } from 'react';

import { px } from '../../utils/common.ts';
import { DragMaster } from '../../utils/DragnDrop/DragMaster.ts';
import { useDragnDrop } from '../../utils/DragnDrop/DragnDropProvider.tsx';
import {
    DragAvatar,
    DropTarget,
    DragAvatarInitParam,
    OnDragCancelParams,
    OnDragStartParams,
} from '../../utils/DragnDrop/types.ts';
import { useDragZone } from '../../utils/DragnDrop/useDragZone.tsx';
import { StoreUpdater } from '../../utils/Store/Store.ts';
import { StyleDeclaration } from '../../utils/types.ts';

import {
    SortableAvatarState,
    SortableDragAvatar,
    SortableState,
    UseSortableDragZoneProps,
} from './types.ts';

export function useSortableDragZone(props: Partial<UseSortableDragZoneProps>) {
    const dragDrop = useDragnDrop();
    const setState = (update: StoreUpdater) => dragDrop?.setState(update);

    const dragItemRef = useRef<Element | null>(null);

    const dragZoneProps: UseSortableDragZoneProps = {
        id: props.id ?? '',

        ...props,

        sourceNode: null,
        sourceNodeRestored: false,
        nodeObserver: null,

        /**
         * Returns closest item element if available for the specified element
         * @param {Element} elem - target list item element
         */
        getClosestItemElement(elem: Element | null): Element | null {
            if (!props.selector) {
                return null;
            }

            return elem?.closest(props.selector) ?? null;
        },

        /**
         * Returns item id from specified item element
         * @param {Element} elem - target list item element
         */
        itemIdFromElem(elem: Element | null): string | null {
            const listItemElem = this.getClosestItemElement?.(elem) as HTMLElement;
            return listItemElem?.dataset?.id ?? null;
        },

        /**
         * Return current drag item element
         */
        getDragItemElement(): Element | null {
            return dragItemRef.current;
        },

        // Find specific drag zone element
        findDragZoneItem(target: Element | null): Element | null {
            if (!props.selector) {
                return null;
            }

            const el = this.getClosestItemElement?.(target) ?? null;
            const isPlaceholder = (
                !!props.placeholderClass
                && el?.classList?.contains(props.placeholderClass)
            );

            return (isPlaceholder) ? null : el;
        },

        // Returns all drag items inside of container
        findAllDragZoneItems(): Element[] {
            if (!props.selector) {
                return [];
            }

            return Array.from(this.elem?.querySelectorAll?.(props.selector) ?? []);
        },

        isValidDragHandle(target: Element): boolean {
            if (!target) {
                return false;
            }

            if (!props.allowSingleItemSort) {
                const allItems = this.findAllDragZoneItems?.() ?? [];
                if (allItems.length < 2) {
                    return false;
                }
            }

            const item = this.findDragZoneItem?.(target);
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
        getGroup(elem: Element | null): string | null {
            const group = props?.group ?? null;
            return (
                (typeof group === 'function')
                    ? group(elem ?? this.elem ?? null)
                    : group
            );
        },

        /** Returns CSS class for placeholder element */
        getPlaceholder(): string | null {
            return props?.placeholderClass ?? null;
        },

        /** Returns CSS class for animated element */
        getAnimatedClass(): string | null {
            return props?.animatedClass ?? null;
        },

        /** Returns selector for sortable item element */
        getItemSelector(): string | null {
            return props?.selector ?? null;
        },

        /** Returns selector for container element */
        getContainerSelector(): string | null {
            return props?.containerSelector ?? null;
        },

        /** Returns class for drag avatar element */
        getDragClass(): string | null {
            if (props?.dragClass) {
                return (props.dragClass === true) ? 'drag' : props.dragClass;
            }

            return null;
        },

        restoreSourceNode() {
            if (this.sourceNode) {
                this.sourceNodeRestored = true;
                this.sourceNode.style.display = 'none';
                document.body.appendChild(this.sourceNode);
            }
        },

        observeNode(node: Element | null) {
            this.disconnectNodeObserver?.();
            this.removeSourceNode?.();

            this.sourceNode = node as HTMLElement;
            this.nodeObserver = new MutationObserver(() => {
                if (node && !node.parentElement) {
                    this.restoreSourceNode?.();
                    this.disconnectNodeObserver?.();
                }
            });

            if (!node?.parentElement) {
                return;
            }

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
            this.disconnectNodeObserver?.();
            this.removeSourceNode?.();
        },

        makeSortableTableAvatar(): SortableDragAvatar | null {
            const avatar = this.makeAvatar?.();
            if (!avatar) {
                return null;
            }

            return {
                ...avatar,
                dropTarget: null,

                initFromEvent(params: DragAvatarInitParam) {
                    if (!avatar.dragZone) {
                        return false;
                    }

                    const target = params.e.target as HTMLElement;
                    const dragZoneElem = avatar.dragZone.findDragZoneItem?.(target) as HTMLElement;
                    if (!dragZoneElem) {
                        return false;
                    }

                    const tbl = dragZoneElem.closest('table');
                    if (!tbl) {
                        return false;
                    }

                    const avatarState: SortableAvatarState = {
                        className: tbl.className,
                        style: {
                            width: px(dragZoneElem.offsetWidth),
                        },
                        columns: [],
                    };

                    const tableStyles = Array.from(tbl.style) as string[];
                    const tblStyle = tbl.style as StyleDeclaration;
                    tableStyles.forEach((propName: string) => {
                        if (!avatarState.style) {
                            avatarState.style = {};
                        }

                        (avatarState.style as StyleDeclaration)[propName] = tblStyle[propName];
                    });

                    if (avatar.dragZone.copyWidth) {
                        let srcCell: Element | null;

                        srcCell = dragZoneElem.querySelector('td');
                        while (srcCell) {
                            const box = srcCell.getBoundingClientRect();
                            avatarState.columns.push({
                                innerStyle: {
                                    width: `${box.width}px`,
                                },
                            });

                            srcCell = srcCell.nextElementSibling;
                        }
                    }

                    const offset = getOffset(avatar.dragZone.elem);
                    setState((prev: SortableState) => ({
                        ...prev,
                        avatarState,
                        origLeft: prev.left,
                        origTop: prev.top,
                        shiftX: params.downX - offset.left,
                        shiftY: params.downY - offset.top,
                    }));

                    return true;
                },

                onDragCancel(params: OnDragCancelParams) {
                    avatar.onDragCancel?.(params);

                    if (this.dropTarget) {
                        this.dropTarget.onDragCancel?.({ ...params, avatar: this });
                    }
                },

                saveSortTarget(target: DropTarget | null) {
                    this.dropTarget = target;
                },
            };
        },

        makeSortableAvatar(): SortableDragAvatar | null {
            if (props.table) {
                return this.makeSortableTableAvatar?.() ?? null;
            }

            const avatar = this.makeAvatar?.();
            if (!avatar) {
                return null;
            }

            return {
                ...avatar,
                dropTarget: null,

                onDragCancel(params: OnDragCancelParams) {
                    avatar.onDragCancel?.(params);

                    if (this.dropTarget) {
                        this.dropTarget.onDragCancel?.({ ...params, avatar: this });
                    }
                },

                saveSortTarget(target) {
                    this.dropTarget = target;
                },
            };
        },

        /** Drag start event handler */
        onDragStart(params: OnDragStartParams): DragAvatar | null {
            const { e } = params;
            const target = e?.target as HTMLElement;
            const itemEl = this.findDragZoneItem?.(target) as HTMLElement;
            if (!itemEl) {
                return null;
            }

            const itemId = this.itemIdFromElem?.(itemEl) ?? null;
            if (itemId === null) {
                return null;
            }

            const avatar = this.makeSortableAvatar?.();
            if (!avatar) {
                return null;
            }

            avatar?.initFromEvent?.(params);

            dragItemRef.current = itemEl;

            this.observeNode?.(itemEl);

            const parentNode = itemEl.parentNode as Element;
            const parentEl = this.findDragZoneItem?.(parentNode) ?? null;
            const parentId = this.itemIdFromElem?.(parentEl) ?? this.id;

            const { downX, downY } = params;
            const offset = getOffset(itemEl);
            const width = (props.copyWidth) ? itemEl.offsetWidth : null;
            setState((prev: SortableState) => ({
                ...prev,
                origLeft: prev.left,
                origTop: prev.top,
                shiftX: downX - offset.left,
                shiftY: downY - offset.top,
                width,
            }));

            props.onSortStart?.({
                ...params,
                parentId,
                zoneId: this.id,
                itemId,
            });

            return avatar;
        },
    };

    const dragZone = useDragZone(dragZoneProps);

    return dragZone;
}
