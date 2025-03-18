import {
    createSlice,
    DragnDropProvider,
    DragnDropState,
    DragZone,
    IsDropAllowedParams,
    useDragnDrop,
} from '@jezvejs/react';
import { useCallback } from 'react';

import { useUniqueDragZoneId } from '../../../stories/Sortable/hooks/useUniqueDragZoneId.ts';

import { DefaultDragZone } from './DefaultDragZone.tsx';
import { OriginalDropTarget } from './OriginalDropTarget.tsx';

type DragZoneItemState = DragZone & DragnDropState;

export type DragDefaultState = DragnDropState & {
    box: DragZoneItemState;
};

const DefaultDragBox = () => {
    const { state } = useDragnDrop<DragDefaultState>();
    return (
        <DefaultDragZone {...state.box} dragOriginal />
    );
};

export const DragOriginalDemo = () => {
    const boxId = useUniqueDragZoneId('box');

    const initialState = {
        box: {
            id: boxId,
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

    const isDropAllowed = useCallback(({ avatar }: IsDropAllowedParams) => (
        avatar?.id === boxId
    ), [boxId]);

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <OriginalDropTarget isDropAllowed={isDropAllowed}>
                <DefaultDragBox />
            </OriginalDropTarget>
        </DragnDropProvider>
    );
};
