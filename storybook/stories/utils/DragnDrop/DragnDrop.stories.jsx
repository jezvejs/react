// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import {
    Button,
    DragnDropProvider,
    createSlice,
    px,
    useDragnDrop,
} from '@jezvejs/react';
import { forwardRef } from 'react';

import MenuIcon from '../../../assets/icons/menu.svg';

// Local components
import { DefaultDragZone } from './components/DefaultDragZone.jsx';
import { DefaultDropTarget } from './components/DefaultDropTarget.jsx';
import { OriginalDropTarget } from './components/OriginalDropTarget.jsx';
import { XAxisDropTarget } from './components/XAxisDropTarget.jsx';
import { XAxisDragZone } from './components/XAxisDragZone.jsx';

import './DragnDrop.stories.scss';

const DefaultDragBox = () => {
    const { state } = useDragnDrop();
    return (
        <DefaultDragZone {...state.box} dragOriginal />
    );
};

const DragOriginalDemo = () => {
    const initialState = {
        box: {
            id: 'box',
            left: 0,
            top: 0,
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

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <OriginalDropTarget>
                <DefaultDragBox />
            </OriginalDropTarget>
        </DragnDropProvider>
    );
};

export default {
    title: 'Utils/Drag\'n\'Drop',
    component: DragOriginalDemo,
    parameters: {
        layout: 'fullscreen',
    },
    tags: ['autodocs'],
};

/**
 * Drop target accept only OriginalDragAvatar.
 * 'mouseMoveThreshold' option is used to limit move distance after mouse pressed to start drag.
 * Default value is 5.
 * 'touchMoveTimeout' options is used to limit time after touch start to start drag.
 */
export const DragOriginal = {
    name: 'Drag original object',
    args: {
    },
};

const DragClonedDropTargets = () => {
    const { state, setState } = useDragnDrop();

    const onDragEnd = ({ avatarInfo, dropTarget }) => {
        const dropToLeft = (dropTarget.id === 'leftContainer');
        setState((prev) => {
            let sourceItem = prev.leftItems.find((item) => item.id === avatarInfo.id);
            if (!sourceItem) {
                sourceItem = prev.rightItems.find((item) => item.id === avatarInfo.id);
            }

            sourceItem = {
                ...sourceItem,
                left: 0,
                top: 0,
            };

            const leftItem = (dropToLeft) ? [sourceItem] : [];
            const rightItem = (dropToLeft) ? [] : [sourceItem];

            return {
                ...prev,
                leftItems: [
                    ...prev.leftItems.filter((item) => item.id !== avatarInfo.id),
                    ...leftItem,
                ],
                rightItems: [
                    ...prev.rightItems.filter((item) => item.id !== avatarInfo.id),
                    ...rightItem,
                ],
                dragging: false,
            };
        });
    };

    return (
        <>
            <DefaultDropTarget
                id="leftContainer"
                items={state.leftItems}
                onDragEnd={onDragEnd}
            />
            <DefaultDropTarget
                id="rightContainer"
                items={state.rightItems}
                onDragEnd={onDragEnd}
            />
        </>
    );
};

/**
 * Drag two objects with semitransparent avatars. Drop targets accept only DefaultDragAvatar
 */
export const DragCloned = {
    name: 'Drag copy object',
    render: function DragClonedDemo() {
        const initialState = {
            leftItems: [{ id: '1', title: '1' }, { id: '2', title: '2' }],
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
export const XAxisAvatar = {
    name: 'Drag only by X axis',
    render: function DragClonedDemo() {
        const initialState = {
            left: 0,
            shiftX: 0,
            dragging: false,
            offset: {},
            rect: {},
        };

        const slice = createSlice({
        });

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <div className="section-h200">
                    <XAxisDropTarget>
                        <XAxisDragZone />
                    </XAxisDropTarget>
                </div>
            </DragnDropProvider >
        );
    },
};

// eslint-disable-next-line react/display-name
const SimpleDragItem = forwardRef((_, ref) => {
    const { state } = useDragnDrop();

    const { handleItem1 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem1.id
    );
    const left = (isDragging) ? state.left : handleItem1.left;
    const top = (isDragging) ? state.top : handleItem1.top;

    return (
        <div
            ref={ref}
            className="drag_item"
            style={{
                left: px(left),
                top: px(top),
            }}
        >
            <input type="text" />
        </div>
    );
});

// eslint-disable-next-line react/display-name
const HandleDragItem = forwardRef((_, ref) => {
    const { state } = useDragnDrop();

    const { handleItem2 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem2.id
    );
    const left = (isDragging) ? state.left : handleItem2.left;
    const top = (isDragging) ? state.top : handleItem2.top;

    return (
        <div
            ref={ref}
            className="drag_item"
            style={{
                left: px(left),
                top: px(top),
            }}
        >
            <input type="text" />
            <div className="drag-handle" />
        </div>
    );
});

// eslint-disable-next-line react/display-name
const DoubleHandleDragItem = forwardRef((_, ref) => {
    const { state } = useDragnDrop();

    const { handleItem3 } = state;
    const isDragging = (
        state.dragging
        && state.draggingId === handleItem3.id
    );
    const left = (isDragging) ? state.left : handleItem3.left;
    const top = (isDragging) ? state.top : handleItem3.top;

    return (
        <div
            ref={ref}
            className="drag_item"
            style={{
                left: px(left),
                top: px(top),
            }}
        >
            <input type="text" />
            <Button type="static" icon={MenuIcon} className="drag-handle-btn black" />
            <Button type="static" icon={MenuIcon} className="drag-handle-btn red" />
        </div>
    );
});

export const Handles = {
    render: function HandlesDemo() {
        const initialState = {
            handleItem1: {
                id: 'handleItem1',
                left: 0,
                top: 0,
                absolutePos: true,
            },
            handleItem2: {
                id: 'handleItem2',
                left: 0,
                top: 50,
                absolutePos: true,
            },
            handleItem3: {
                id: 'handleItem3',
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

        return (
            <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
                <OriginalDropTarget>
                    <DefaultDragZone
                        id="handleItem1"
                        Content={SimpleDragItem}
                        dragOriginal
                    />
                    <DefaultDragZone
                        id="handleItem2"
                        Content={HandleDragItem}
                        dragOriginal
                        handles={{ query: '.drag-handle' }}
                    />
                    <DefaultDragZone
                        id="handleItem3"
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
