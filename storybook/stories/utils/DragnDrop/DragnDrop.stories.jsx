// eslint-disable-next-line import/no-unresolved
import '@jezvejs/react/style';
import { DragnDropProvider, createSlice, useDragnDrop } from '@jezvejs/react';

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
            id: 'orig',
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
                <XAxisDropTarget>
                    <XAxisDragZone />
                </XAxisDropTarget>
            </DragnDropProvider >
        );
    },
};
