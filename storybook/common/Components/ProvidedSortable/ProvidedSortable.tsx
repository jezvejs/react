import {
    DragnDropProvider,
    Sortable,
    SortableProps,
    sortableReducer,
} from '@jezvejs/react';

import { usePortalElement } from '../../hooks/usePortalElement.tsx';
import { useUniqueDragZoneId } from '../../../stories/Sortable/hooks/useUniqueDragZoneId.ts';

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

    const portalElement = usePortalElement();

    return (
        <DragnDropProvider reducer={sortableReducer} initialState={initialState}>
            <Sortable {...sortableProps} container={portalElement} />
        </DragnDropProvider>
    );
};
