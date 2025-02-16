import {
    DragnDropProvider,
    Sortable,
    SortableProps,
    sortableReducer,
} from '@jezvejs/react';

import { usePortalElement } from '../../../../common/hooks/usePortalElement.tsx';
import { useUniqueDragZoneId } from '../../hooks/useUniqueDragZoneId.ts';

export type ExchangeableProps = Partial<SortableProps> & {
    source: Partial<SortableProps>;
    destination: Partial<SortableProps>;
};

export const ProvidedExchangeable = (props: ExchangeableProps) => {
    const {
        source,
        destination,
        ...args
    } = props;

    const sourceProps = {
        ...args,
        ...source,
        id: useUniqueDragZoneId(source.id ?? ''),
    };

    const destProps = {
        ...args,
        ...destination,
        id: useUniqueDragZoneId(destination.id ?? ''),
    };

    const initialState = {
        left: 0,
        top: 0,
        shiftX: 0,
        shiftY: 0,
        dragging: false,
        zones: {
            [sourceProps.id]: {
                items: sourceProps.items,
            },
            [destProps.id]: {
                items: destProps.items,
            },
        },
    };

    const portalElement = usePortalElement();

    return (
        <DragnDropProvider reducer={sortableReducer} initialState={initialState}>
            <div className="exch-lists-container">
                <Sortable {...sourceProps} container={portalElement} />
                <Sortable {...destProps} container={portalElement} />
            </div>
        </DragnDropProvider>
    );
};
