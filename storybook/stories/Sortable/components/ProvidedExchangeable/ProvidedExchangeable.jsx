import PropTypes from 'prop-types';
import { createSlice, DragnDropProvider, Sortable } from '@jezvejs/react';
import { useUniqueDragZoneId } from '../../hooks/useUniqueDragZoneId.jsx';
import { usePortalElement } from '../../hooks/usePortalElement.jsx';

export const ProvidedExchangeable = (props) => {
    const {
        source,
        destination,
        ...args
    } = props;

    const sourceProps = {
        ...args,
        ...source,
        id: useUniqueDragZoneId(source.id),
    };

    const destProps = {
        ...args,
        ...destination,
        id: useUniqueDragZoneId(destination.id),
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

    const slice = createSlice({
    });

    const portalElement = usePortalElement();

    return (
        <DragnDropProvider reducer={slice.reducer} initialState={initialState}>
            <div className="exch-lists-container">
                <Sortable {...sourceProps} container={portalElement} />
                <Sortable {...destProps} container={portalElement} />
            </div>
        </DragnDropProvider>
    );
};

const listShape = PropTypes.shape({
    id: PropTypes.string,
    group: PropTypes.string,
    items: PropTypes.array,
});

ProvidedExchangeable.propTypes = {
    source: listShape,
    destination: listShape,
};
