import {
    createSlice,
    DragnDropProvider,
    Sortable,
    SortableProps,
} from '@jezvejs/react';

import { usePortalElement } from '../../../../common/hooks/usePortalElement.tsx';
import { useUniqueDragZoneId } from '../../hooks/useUniqueDragZoneId.ts';

export const ProvidedSortable = (props: SortableProps) => {
    const sortableProps = {
        ...props,
        id: useUniqueDragZoneId(props.id ?? ''),
    };

    const initialState = {
        left: 0,
        top: 0,
        shiftX: 0,
        shiftY: 0,
        dragging: false,
        zones: {
            [sortableProps.id]: {
                items: sortableProps.items,
            },
        },
    };

    const slice = createSlice({
    });

    const portalElement = usePortalElement();

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <Sortable {...sortableProps} container={portalElement} />
        </DragnDropProvider>
    );
};
