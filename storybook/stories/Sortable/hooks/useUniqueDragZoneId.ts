import { DragMaster } from '@jezvejs/react';
import { useMemo } from 'react';

/**
 * Returns requestedId if no drag zone registered for this id
 * Otherwise generates new availble id for drag zone and returns result
 *
 * @param {string} requestedId
 * @returns {string}
 */
export const useUniqueDragZoneId = (requestedId: string) => (
    useMemo(() => {
        const generateRandom = () => (
            (Date.now() + Math.round(Math.random() * 1000000000000)).toString(36)
        );

        const getAvailableZoneId = (initialId: string) => {
            const dragMaster = DragMaster.getInstance();
            let id = initialId;

            while (dragMaster.findDragZoneById(id)) {
                id = `${initialId}_${generateRandom()}`;
            }

            return id;
        };

        return getAvailableZoneId(requestedId);
    }, [requestedId])
);
