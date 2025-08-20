import type { Meta, StoryObj } from '@storybook/react';

import {
    Button,
    DragZone,
    DragnDropProvider,
    DragnDropState,
    IsDropAllowedParams,
    OnDragEndParams,
    createSlice,
    px,
    useDragnDrop,
} from '@jezvejs/react';
import '@jezvejs/react/style.scss';
import { CSSProperties, forwardRef, useCallback } from 'react';

import MenuIcon from 'common/assets/icons/menu.svg';

// Common components
import { DefaultDragZone } from 'common/Components/DragnDrop/DefaultDragZone.tsx';
import { DragOriginalDemo } from 'common/Components/DragnDrop/DragOriginalDemo.tsx';
import { OriginalDropTarget } from 'common/Components/DragnDrop/OriginalDropTarget.tsx';

// Local components
import { DefaultDropTarget } from './components/DefaultDropTarget.tsx';
import { XAxisDragZone } from './components/XAxisDragZone.tsx';
import { XAxisDropTarget } from './components/XAxisDropTarget.tsx';

import './DragnDrop.stories.scss';

export type DragZoneItemState = DragZone & DragnDropState;

export type DefaultDragnDropState = DragnDropState & {
    [key: string]: DragZoneItemState;
};

export type DragClonedState = DragnDropState & {
    leftItems: DragZoneItemState[];
    rightItems: DragZoneItemState[];
};

export type Story = StoryObj<typeof DragOriginalDemo>;

const meta: Meta<typeof DragOriginalDemo> = {
    title: 'Utils/Drag\'n\'Drop',
    component: DragOriginalDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};
export default meta;

/**
 * Drop target accept only OriginalDragAvatar.
 * 'mouseMoveThreshold' option is used to limit move distance after mouse pressed to start drag.
 * Default value is 5.
 * 'touchMoveTimeout' options is used to limit time after touch start to start drag.
 */
export const DragOriginal: Story = {
    name: 'Drag original object',
    args: {
    },
};

const CLONED_ITEM_TYPE = 'cloned';

const DragClonedDropTargets = () => {
    const { state, setState } = useDragnDrop<DragClonedState>();

    const isDropAllowed = useCallback(({ avatar }: IsDropAllowedParams) => (
        avatar?.type === CLONED_ITEM_TYPE
    ), []);

    const onDragEnd = ({ avatarInfo, dropTarget }: OnDragEndParams) => {
        const dropToLeft = (dropTarget?.id === 'leftContainer');
        setState((prev: DragClonedState) => {
            let sourceItem = prev.leftItems.find((item) => item.id === avatarInfo?.id) ?? null;
            if (!sourceItem) {
                sourceItem = prev.rightItems.find((item) => item.id === avatarInfo?.id) ?? null;
            }

            if (sourceItem === null) {
                return prev;
            }

            sourceItem = {
                ...sourceItem,
                left: 0,
                top: 0,
            };

            const leftItem = (dropToLeft) ? [sourceItem] : [];
            const rightItem = (dropToLeft) ? [] : [sourceItem];

            const res: DragClonedState = {
                ...prev,
                leftItems: [
                    ...prev.leftItems.filter((item) => item.id !== avatarInfo?.id),
                    ...leftItem,
                ],
                rightItems: [
                    ...prev.rightItems.filter((item) => item.id !== avatarInfo?.id),
                    ...rightItem,
                ],
                dragging: false,
            };

            return res;
        });
    };

    return (
        <>
            <DefaultDropTarget
                id="leftContainer"
                items={state.leftItems}
                isDropAllowed={isDropAllowed}
                onDragEnd={onDragEnd}
            />
            <DefaultDropTarget
                id="rightContainer"
                items={state.rightItems}
                isDropAllowed={isDropAllowed}
                onDragEnd={onDragEnd}
            />
        </>
    );
};

/**
 * Drag two objects with semitransparent avatars. Drop targets accept only DefaultDragAvatar
 */
export const DragCloned: Story = {
    name: 'Drag copy object',
    render: function Render() {
        const initialState = {
            leftItems: [{
                id: '1',
                title: '1',
                type: CLONED_ITEM_TYPE,
            }, {
                id: '2',
                title: '2',
                type: CLONED_ITEM_TYPE,
            }],
            rightItems: [],
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <DragClonedDropTargets />
            </DragnDropProvider>
        );
    },
};

/**
 * \'mouseMoveThreshold\' and \'touchMoveTimeout\' options are set to 0
 */
export const XAxisAvatar: Story = {
    name: 'Drag only by X axis',
    render: function Render() {
        const initialState = {
            left: 0,
            shiftX: 0,
            dragging: false,
            offset: {},
            rect: {},
        };

        const slice = createSlice({
        });

        const isDropAllowed = useCallback(({ avatar }: IsDropAllowedParams) => (
            avatar?.id === 'xAxisDragZone'
        ), []);

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <div className="section-h200">
                    <XAxisDropTarget isDropAllowed={isDropAllowed}>
                        <XAxisDragZone id="xAxisDragZone" />
                    </XAxisDropTarget>
                </div>
            </DragnDropProvider >
        );
    },
};

export type DoubleHandleState = DragnDropState & {
    handleItem1: DragZoneItemState;
    handleItem2: DragZoneItemState;
    handleItem3: DragZoneItemState;
};

const SimpleDragItem = forwardRef<
    HTMLDivElement,
    object
>((_, ref) => {
    const { state } = useDragnDrop<DoubleHandleState>();

    const { handleItem1 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem1.id
    );

    const style: CSSProperties = {
        left: px((isDragging) ? state.left : handleItem1.left),
        top: px((isDragging) ? state.top : handleItem1.top),
    };

    if (isDragging) {
        style.zIndex = 9999;
    }

    return (
        <div
            ref={ref}
            className="drag_item"
            style={style}
        >
            <input type="text" />
        </div>
    );
});

SimpleDragItem.displayName = 'SimpleDragItem';

const HandleDragItem = forwardRef<
    HTMLDivElement,
    object
>((_, ref) => {
    const { state } = useDragnDrop<DoubleHandleState>();

    const { handleItem2 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem2.id
    );

    const style: CSSProperties = {
        left: px((isDragging) ? state.left : handleItem2.left),
        top: px((isDragging) ? state.top : handleItem2.top),
    };

    if (isDragging) {
        style.zIndex = 9999;
    }

    return (
        <div
            ref={ref}
            className="drag_item"
            style={style}
        >
            <input type="text" />
            <div className="drag-handle" />
        </div>
    );
});

HandleDragItem.displayName = 'HandleDragItem';

const DoubleHandleDragItem = forwardRef<
    HTMLDivElement,
    object
>((_, ref) => {
    const { state } = useDragnDrop<DoubleHandleState>();

    const { handleItem3 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem3.id
    );

    const style: CSSProperties = {
        left: px((isDragging) ? state.left : handleItem3.left),
        top: px((isDragging) ? state.top : handleItem3.top),
    };

    if (isDragging) {
        style.zIndex = 9999;
    }

    return (
        <div
            ref={ref}
            className="drag_item"
            style={style}
        >
            <input type="text" />
            <Button type="static" icon={MenuIcon} className="drag-handle-btn black" />
            <Button type="static" icon={MenuIcon} className="drag-handle-btn red" />
        </div>
    );
});

DoubleHandleDragItem.displayName = 'DoubleHandleDragItem';

const HANDLE_TEST_ITEM = 'handleTest';

export const Handles: Story = {
    render: function HandlesDemo() {
        const initialState = {
            handleItem1: {
                id: 'handleItem1',
                type: HANDLE_TEST_ITEM,
                left: 0,
                top: 0,
                absolutePos: true,
            },
            handleItem2: {
                id: 'handleItem2',
                type: HANDLE_TEST_ITEM,
                left: 0,
                top: 50,
                absolutePos: true,
            },
            handleItem3: {
                id: 'handleItem3',
                type: HANDLE_TEST_ITEM,
                left: 0,
                top: 100,
                absolutePos: true,
            },
            left: 0,
            top: 0,
            shiftX: 0,
            shiftY: 0,
            dragging: false,
        };

        const slice = createSlice({
        });

        const isDropAllowed = useCallback(({ avatar }: IsDropAllowedParams) => (
            avatar?.type === HANDLE_TEST_ITEM
        ), []);

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <OriginalDropTarget isDropAllowed={isDropAllowed}>
                    <DefaultDragZone
                        id="handleItem1"
                        type={HANDLE_TEST_ITEM}
                        Content={SimpleDragItem}
                        dragOriginal
                    />
                    <DefaultDragZone
                        id="handleItem2"
                        type={HANDLE_TEST_ITEM}
                        Content={HandleDragItem}
                        dragOriginal
                        handles={{ query: '.drag-handle' }}
                    />
                    <DefaultDragZone
                        id="handleItem3"
                        type={HANDLE_TEST_ITEM}
                        Content={DoubleHandleDragItem}
                        dragOriginal
                        handles={[
                            { query: '.drag-handle-btn.black', includeChilds: true },
                            { query: '.drag-handle-btn.red', includeChilds: false },
                        ]}
                    />
                </OriginalDropTarget>
            </DragnDropProvider>
        );
    },
};
