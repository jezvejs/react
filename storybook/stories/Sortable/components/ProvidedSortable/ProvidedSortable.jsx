import PropTypes from 'prop-types';
import { createSlice, DragnDropProvider, Sortable } from '@jezvejs/react';
import { usePortalElement } from '../../../../common/hooks/usePortalElement.jsx';
import { useUniqueDragZoneId } from '../../hooks/useUniqueDragZoneId.jsx';

export const ProvidedSortable = (props) => {
    const sortableProps = {
        ...props,
        id: useUniqueDragZoneId(props.id),
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

ProvidedSortable.propTypes = {
    id: PropTypes.string,
};
